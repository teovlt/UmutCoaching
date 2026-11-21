---
description: Vérifie que le code respecte le design system umut. (Performance lab · Bleu cobalt)
---

Audite $ARGUMENTS (par défaut : les fichiers modifiés depuis le dernier commit, `git diff --name-only HEAD`)
par rapport à `docs/03-design-system.md` et `CLAUDE.md`. Vérifie et rapporte chaque écart avec fichier:ligne :

1. **Valeurs en dur** : hex (`#[0-9a-fA-F]{3,6}`), `rgb(`, tailles `text-[…px]`, `bg-[#…]`, `shadow-`, `rounded-` (sauf `rounded-none`, `rounded-full` sur pastilles, icône d'app). Exclure `src/styles/tokens.css` et `src/assets/brand/`.
2. **Cobalt** : `cobalt-500` utilisé sur un fond `graphite`/`.on-dark` en texte ou trait → doit être `cobalt-400`. Plus d'un bouton `primary` dans une même section.
3. **Typo** : chiffres, prix, durées, unités, numérotations, labels, tags non en `font-mono`. Titres non en Grotesk 700.
4. **Contraste** : `text-muted` sur fond clair pour du texte lisible.
5. **A11y** : boutons-icônes sans `aria-label`, images sans `alt`, champs sans `<label>`, plusieurs `<h1>`, cibles < 44 px.
6. **Contenu** : témoignages, chiffres ou diplômes codés en dur dans les pages au lieu de venir de l’API, de `src/data/site.ts` ou de `docs/04-contenu.md` (risque d'invention).
7. **Typo française** : `x` au lieu de `×`, espace normale avant `kg`, `:`, `?`, `!`.

Termine par un tableau `Sévérité | Fichier:ligne | Problème | Correction`, puis propose de corriger. Ne corrige rien sans accord.
