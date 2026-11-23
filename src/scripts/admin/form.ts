// Fills an /admin form from an API document and reads it back as JSON,
// following the field list of src/lib/admin/schemas.ts.
import type { FieldDef } from "@/lib/admin/schemas";
import { api, errorText } from "./api";

type Doc = Record<string, unknown>;

const getPath = (doc: Doc, path: string): unknown =>
  path.split(".").reduce<unknown>((value, key) => (value && typeof value === "object" ? (value as Doc)[key] : undefined), doc);

const setPath = (doc: Doc, path: string, value: unknown) => {
  const keys = path.split(".");
  const last = keys.pop() as string;
  let target = doc;
  for (const key of keys) {
    if (!target[key] || typeof target[key] !== "object") target[key] = {};
    target = target[key] as Doc;
  }
  target[last] = value;
};

type Control = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

const control = (form: HTMLFormElement, name: string) => form.elements.namedItem(name) as Control | null;

const SEPARATOR = " | ";

export const fillForm = (form: HTMLFormElement, fields: FieldDef[], doc: Doc) => {
  for (const field of fields) {
    const value = getPath(doc, field.name);
    if (field.kind === "image") {
      const image = (value ?? {}) as { url?: string; alt?: string };
      const url = control(form, `${field.name}.url`);
      const alt = control(form, `${field.name}.alt`);
      if (url) url.value = image.url ?? "";
      if (alt) alt.value = image.alt ?? "";
      showImage(form, field.name, image.url ?? "");
      continue;
    }
    const el = control(form, field.name);
    if (!el) continue;
    if (field.kind === "checkbox") (el as HTMLInputElement).checked = Boolean(value);
    else if (field.kind === "date") el.value = typeof value === "string" ? value.slice(0, 10) : "";
    else if (field.kind === "lines") el.value = Array.isArray(value) ? value.join("\n") : "";
    else if (field.kind === "rows")
      el.value = Array.isArray(value)
        ? value.map((row: Doc) => field.keys.map((key) => String(row?.[key] ?? "")).join(SEPARATOR)).join("\n")
        : "";
    else el.value = value === undefined || value === null ? "" : String(value);
  }
};

export const readForm = (form: HTMLFormElement, fields: FieldDef[]): Doc => {
  const doc: Doc = {};
  for (const field of fields) {
    if (field.kind === "image") {
      setPath(doc, field.name, {
        url: control(form, `${field.name}.url`)?.value ?? "",
        alt: control(form, `${field.name}.alt`)?.value.trim() ?? "",
      });
      continue;
    }
    const el = control(form, field.name);
    if (!el) continue;
    const raw = el.value;
    let value: unknown;
    switch (field.kind) {
      case "checkbox":
        value = (el as HTMLInputElement).checked;
        break;
      case "number":
        // null clears the price in MongoDB: the site shows [À CONFIRMER]
        value = raw.trim() === "" ? null : Number(raw.replace(",", "."));
        break;
      case "date":
        value = raw || null;
        break;
      case "lines":
        value = raw
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
        break;
      case "rows":
        value = raw
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => {
            const parts = line.split("|").map((part) => part.trim());
            return Object.fromEntries(field.keys.map((key, i) => [key, parts[i] ?? ""]));
          });
        break;
      default:
        value = raw.trim();
    }
    setPath(doc, field.name, value);
  }
  return doc;
};

const showImage = (form: HTMLFormElement, name: string, url: string) => {
  const box = form.querySelector<HTMLElement>(`[data-image="${CSS.escape(name)}"]`);
  if (!box) return;
  const preview = box.querySelector<HTMLImageElement>("[data-image-preview]");
  const empty = box.querySelector<HTMLElement>("[data-image-empty]");
  if (preview) {
    preview.classList.toggle("hidden", !url);
    if (url) preview.src = url;
    else preview.removeAttribute("src");
  }
  empty?.classList.toggle("hidden", Boolean(url));
};

/** Wires the upload and remove buttons of every image field of the form */
export const setupImages = (form: HTMLFormElement) => {
  for (const box of form.querySelectorAll<HTMLElement>("[data-image]")) {
    const name = box.dataset.image as string;
    const urlInput = control(form, `${name}.url`) as HTMLInputElement;
    const file = box.querySelector<HTMLInputElement>("[data-image-file]");
    const status = box.querySelector<HTMLElement>("[data-image-status]");
    const say = (text: string) => {
      if (status) status.textContent = text;
    };

    file?.addEventListener("change", async () => {
      const chosen = file.files?.[0];
      if (!chosen) return;
      say("Envoi en cours…");
      const data = new FormData();
      data.append("file", chosen);
      try {
        const { url } = await api<{ url: string }>("/uploads", { method: "POST", body: data });
        urlInput.value = url;
        showImage(form, name, url);
        say("Photo prête. Pensez à enregistrer.");
      } catch (err) {
        say(errorText(err));
      } finally {
        file.value = "";
      }
    });

    box.querySelector("[data-image-remove]")?.addEventListener("click", () => {
      urlInput.value = "";
      showImage(form, name, "");
      say("Photo retirée. Pensez à enregistrer.");
    });
  }
};
