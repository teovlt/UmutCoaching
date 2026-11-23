// Behaviour of CollectionEditor.astro: loads every item (hidden ones too)
// from /api/<collection>/admin and handles add, edit, show / hide, reorder and
// delete. Text from the API is only ever set through textContent.
import { type CollectionKey, collectionFields } from "@/lib/admin/schemas";
import { api, errorText, requireLogin } from "./api";
import { fillForm, readForm, setupImages } from "./form";

type Item = Record<string, unknown> & { id: string; visible?: boolean };

const formats: Record<string, string> = { salle: "en salle", "en-ligne": "en ligne", hybride: "salle + en ligne" };

const price = (item: Item) => {
  if (item.priceLabel) return String(item.priceLabel);
  if (item.priceFrom === undefined || item.priceFrom === null) return "prix [À CONFIRMER]";
  const symbol = item.currency === "EUR" ? "€" : String(item.currency);
  return `dès ${item.priceFrom} ${symbol}${item.priceUnit ? ` ${item.priceUnit}` : ""}`;
};

// Title and mono meta line of each list row
const describe: Record<CollectionKey, (item: Item) => { title: string; meta: string[] }> = {
  programmes: (item) => ({
    title: String(item.title),
    meta: [formats[String(item.format)] ?? "", String(item.duration ?? ""), price(item), item.featured ? "recommandé" : ""],
  }),
  faqs: (item) => ({
    title: String(item.question),
    meta: [`pages : ${(item.pages as string[] | undefined)?.join(", ") || "aucune"}`],
  }),
  temoignages: (item) => ({
    title: String(item.name),
    meta: [
      String(item.context ?? ""),
      item.consentDate ? `consentement du ${new Date(String(item.consentDate)).toLocaleDateString("fr-FR")}` : "",
    ],
  }),
};

// Values of a new item before Umut fills the form
const defaults: Record<CollectionKey, Record<string, unknown>> = {
  programmes: { format: "salle", currency: "EUR", status: "", visible: true },
  faqs: { pages: ["accueil"], visible: true },
  temoignages: { consent: false, visible: true },
};

const iconButton = (label: string, path: string) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className =
    "flex size-11 items-center justify-center border border-line bg-white text-graphite hover:border-graphite disabled:cursor-not-allowed disabled:text-disabled disabled:hover:border-line";
  button.setAttribute("aria-label", label);
  button.innerHTML = `<svg class="size-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" aria-hidden="true"><path d="${path}"/></svg>`;
  return button;
};

const textButton = (label: string, accessibleName: string) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className =
    "inline-flex min-h-11 items-center border border-line bg-white px-3 font-mono text-small text-graphite hover:border-graphite";
  button.textContent = label;
  button.setAttribute("aria-label", accessibleName);
  return button;
};

export const mountCollection = (root: HTMLElement) => {
  requireLogin();

  const key = root.dataset.collection as CollectionKey;
  const itemName = root.dataset.itemName ?? "un élément";
  const fields = collectionFields[key];
  const list = root.querySelector<HTMLOListElement>("[data-list]") as HTMLOListElement;
  const status = root.querySelector<HTMLElement>("[data-status]") as HTMLElement;
  const dialog = root.querySelector<HTMLDialogElement>("[data-editor]") as HTMLDialogElement;
  const form = root.querySelector<HTMLFormElement>("[data-form]") as HTMLFormElement;
  const formError = root.querySelector<HTMLElement>("[data-form-error]") as HTMLElement;
  const editorTitle = root.querySelector<HTMLElement>("[data-editor-title]") as HTMLElement;

  let items: Item[] = [];
  let editing: Item | null = null;
  // Where focus goes back when the dialog closes
  let opener: HTMLElement | null = null;

  const say = (text: string) => {
    status.textContent = text;
  };

  const render = () => {
    list.replaceChildren();
    if (items.length === 0) say(`Aucun élément pour l'instant. Utilisez « Ajouter ${itemName} ».`);

    items.forEach((item, index) => {
      const { title, meta } = describe[key](item);
      const li = document.createElement("li");
      li.className = "flex flex-col gap-4 border-b border-line py-5 lg:flex-row lg:items-center lg:justify-between";

      const text = document.createElement("div");
      text.className = "flex min-w-0 flex-col gap-1.5";
      const heading = document.createElement("p");
      heading.className = "font-bold";
      heading.textContent = title;
      const metaLine = document.createElement("p");
      metaLine.className = "flex flex-wrap gap-x-3 gap-y-1 font-mono text-label text-mesure uppercase";
      for (const part of meta.filter(Boolean)) {
        const span = document.createElement("span");
        span.textContent = part;
        metaLine.append(span);
      }
      if (item.visible === false) {
        const hidden = document.createElement("span");
        hidden.className = "border border-graphite px-1.5 text-graphite";
        hidden.textContent = "masqué";
        metaLine.prepend(hidden);
      }
      text.append(heading, metaLine);

      const actions = document.createElement("div");
      actions.className = "flex flex-wrap gap-2";
      const up = iconButton(`Monter « ${title} »`, "M12 19V5M6 11l6-6 6 6");
      const down = iconButton(`Descendre « ${title} »`, "M12 5v14M6 13l6 6 6-6");
      up.disabled = index === 0;
      down.disabled = index === items.length - 1;
      up.addEventListener("click", () => move(index, -1, up));
      down.addEventListener("click", () => move(index, 1, down));

      const toggle = textButton(
        item.visible === false ? "Afficher" : "Masquer",
        `${item.visible === false ? "Afficher" : "Masquer"} « ${title} »`,
      );
      toggle.addEventListener("click", () => toggleVisible(item));
      const edit = textButton("Modifier", `Modifier « ${title} »`);
      edit.addEventListener("click", () => openEditor(item, edit));
      const remove = textButton("Supprimer", `Supprimer « ${title} »`);
      remove.addEventListener("click", () => removeItem(item, title));

      actions.append(up, down, toggle, edit, remove);
      li.append(text, actions);
      list.append(li);
    });
  };

  const load = async () => {
    try {
      items = await api<Item[]>(`/${key}/admin`);
      say(`${items.length} élément${items.length > 1 ? "s" : ""}.`);
      render();
    } catch (err) {
      say(errorText(err));
    }
  };

  const move = async (index: number, delta: number, button: HTMLButtonElement) => {
    const next = [...items];
    const [moved] = next.splice(index, 1);
    next.splice(index + delta, 0, moved as Item);
    try {
      items = await api<Item[]>(`/${key}/reorder`, { method: "PUT", json: { ids: next.map((item) => item.id) } });
      render();
      say("Ordre enregistré.");
      // Keep the keyboard on the moved row's same button
      const label = button.getAttribute("aria-label");
      list.querySelector<HTMLButtonElement>(`button[aria-label="${CSS.escape(label ?? "")}"]:not(:disabled)`)?.focus();
    } catch (err) {
      say(errorText(err));
    }
  };

  const toggleVisible = async (item: Item) => {
    try {
      const updated = await api<Item>(`/${key}/${item.id}`, { method: "PUT", json: { visible: item.visible === false } });
      items = items.map((i) => (i.id === item.id ? updated : i));
      render();
      say(updated.visible === false ? "Masqué sur le site." : "Affiché sur le site.");
    } catch (err) {
      say(errorText(err));
    }
  };

  const removeItem = async (item: Item, title: string) => {
    if (!confirm(`Supprimer « ${title} » ? C'est définitif. Pour le retirer du site sans le perdre, utilisez « Masquer ».`)) return;
    try {
      await api(`/${key}/${item.id}`, { method: "DELETE" });
      items = items.filter((i) => i.id !== item.id);
      render();
      say("Supprimé.");
    } catch (err) {
      say(errorText(err));
    }
  };

  const openEditor = (item: Item | null, from: HTMLElement) => {
    editing = item;
    opener = from;
    form.reset();
    formError.textContent = "";
    fillForm(form, fields, item ?? defaults[key]);
    editorTitle.textContent = item ? `Modifier ${describe[key](item).title}` : `Ajouter ${itemName}`;
    dialog.showModal();
  };

  const closeEditor = () => dialog.close();

  dialog.addEventListener("close", () => opener?.focus());
  for (const button of root.querySelectorAll("[data-close]")) button.addEventListener("click", closeEditor);
  root.querySelector<HTMLElement>("[data-add]")?.addEventListener("click", (event) => openEditor(null, event.currentTarget as HTMLElement));
  setupImages(form);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    formError.textContent = "";
    // Native checks (required fields, e-mail…), shown by the browser
    if (!form.reportValidity()) return;
    const data = readForm(form, fields);
    const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (submit) submit.disabled = true;
    try {
      if (editing) {
        const updated = await api<Item>(`/${key}/${editing.id}`, { method: "PUT", json: data });
        items = items.map((i) => (i.id === updated.id ? updated : i));
      } else {
        items = [...items, await api<Item>(`/${key}`, { method: "POST", json: data })];
      }
      closeEditor();
      render();
      say("Enregistré. Le site est à jour.");
    } catch (err) {
      formError.textContent = errorText(err);
    } finally {
      if (submit) submit.disabled = false;
    }
  });

  load();
};
