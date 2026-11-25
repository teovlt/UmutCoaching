# Design system — umut. · Performance lab · Bleu cobalt

> Référence visuelle : `design-reference/06-bleu-cobalt.html` (+ `.png`).
> Tokens : `src/styles/tokens.css`. Ce document dit **quand** et **comment** les utiliser.

## 1. Principes
1. **Le labo.** Fond clair et neutre, filets fins, grilles visibles. On montre de la rigueur.
2. **Un seul signal.** Le cobalt indique *où agir* et *ce qui compte*. S'il est partout, il ne dit plus rien.
3. **Tout ce qui se mesure est en mono.** 120 kg × 5 reps, 12 semaines, 89 CHF, 01 / 02.
4. **Angles droits, pas d'ombre, pas de dégradé.** La hiérarchie vient de la taille, du poids et des fonds.
5. **Factuel.** Un ton de coach-ingénieur : précis, direct, **vouvoiement partout** (D14).

## 2. Couleurs

| Token | Hex | Rôle | Contraste |
|---|---|---|---|
| `cobalt-500` | #1F4FD8 | Action principale, point du logo, tracé du symbole, lien actif, donnée en avant | blanc sur cobalt **6,6:1** ✅ · cobalt sur labo **6,0:1** ✅ |
| `cobalt-600` | #1A42B8 | Hover du bouton primaire | 8,4:1 |
| `cobalt-700` | #17379A | Pressed | 10,3:1 |
| `cobalt-400` | #7A9BFF | **Cobalt sur fond graphite** (texte, point, pastille, actif) | sur graphite **6,6:1** ✅ |
| `cobalt-300` | #A9BEFF | Hover de lien sur graphite | 9,5:1 |
| `cobalt-50/100` | #EEF2FD / #DCE5FB | Fond de mise en avant léger, sélection de texte | cobalt-500 sur 50 : 5,7:1 |
| `graphite` | #1A1A1A | Texte, fonds sombres, bouton secondaire plein | sur blanc 17,4:1 |
| `ink` | #000000 | Hover du bouton `dark` uniquement | — |
| `mesure` | #5E5E5E | Texte secondaire, légendes, labels de section | sur labo 5,9:1 ✅ |
| `disabled` | #6E6E6E | Texte désactivé | sur labo 4,6:1 ✅ |
| `muted` | #9A9A9A | **Décoratif sur clair** (2,8:1 ❌ texte) ; texte secondaire OK sur graphite (6,2:1) |
| `line` | #D9D9D6 | Filets 1 px, bordures de carte, champs secondaires | — |
| `subtle` | #ECECE9 | Séparateurs internes, fond « complet » | — |
| `labo` | #F4F4F2 | Fond de page | — |
| `white` | #FFFFFF | Cartes, champs, header | — |
| `line-dark` / `edge-dark` | #333 / #444 | Filets et bordures de contrôles sur graphite | — |
| `success` | #1F7A4D | « Places dispo » | 5,3:1 |
| `warning` | #8A5A00 | « Dernières places » | 5,9:1 |
| `danger` | #B3261E | Erreurs de formulaire | 6,5:1 |

⚠️ **Interdit : `cobalt-500` sur `graphite`** (2,6:1). Sur fond sombre, toujours `cobalt-400`.
Exception : un **bouton** cobalt-500 plein avec texte blanc reste valide sur fond graphite (le contraste mesuré est texte/bouton).

**Proportions** sur un écran type : ~70 % labo/blanc · ~25 % graphite (texte + blocs sombres) · **≤ 5 % cobalt**.

## 3. Typographie

| Token | Police | Taille (375 → 1280) | Usage |
|---|---|---|---|
| `text-display` | Grotesk 700, −6 % | 56 → 100 | Wordmark géant, chiffre héros éventuel |
| `text-h1` | Grotesk 700, −4 % | 40 → 60 | 1 par page |
| `text-h2` | Grotesk 700, −4 % | 32 → 46 | Titres de section |
| `text-h3` | Grotesk 700, −3 % | 22 → 26 | Titres de carte |
| `text-lead` | Grotesk 400 | 19 / 1.55 | Chapeaux |
| `text-body` | Grotesk 400 | 17 / 1.6 | Texte courant (max 68 caractères/ligne → `max-w-[62ch]` ou `max-w-prose`) |
| `text-small` | Grotesk 400 | 15 / 1.55 | Notes, légendes longues |
| `text-label` + `font-mono uppercase` | Mono 400/700 | 12 | Labels de section, de champ, tags |
| `text-micro` + `font-mono` | Mono 400 | 11 | Aide de champ, badges d'état, graduations de graphique |
| `font-mono` 14 | Mono 400 | 14 | Navigation, liens tertiaires |
| `text-data` + `font-mono font-bold` | Mono 700 | 24 → 30 | Valeurs : `120 kg × 5 reps` |
| `text-data-xl` + `font-mono font-bold` | Mono 700 | 48 → 80 | Gros chiffres du bandeau |

Règles : chiffres toujours `tabular-nums` · unités séparées par une espace insécable (`120&nbsp;kg`) ·
signe de multiplication `×` (pas `x`) · flèche `→` pour les progressions · `//` pour les commentaires de label.

## 4. Espace, grille, filets
- Base 4 px. Échelle Tailwind standard (`gap-4` = 16, `gap-6` = 24, `gap-11` = 44, `p-16` = 64).
- Conteneur : `.container-site` (1200 px de contenu, marge `--gutter` 20 → 64 px).
- Rythme vertical : `.section` (64 → 128 px).
- Grille : 12 colonnes desktop, 4 mobile. Les cartes de la planche : 3 colonnes, gap 16.
- **Filets** : `border border-line` (cartes), `border-graphite` (mise en avant, champs), `border-dashed border-muted` (désactivé).
- Signature graphique : le **trait de section** `01 / logo ————` (`.section-label`) et les **crochets** `[ ]` du symbole,
  réutilisables pour encadrer un chiffre clé ou un lien tertiaire.

### Variante `on-dark:`
Variante Tailwind (définie dans `global.css`) active dans toute zone `.on-dark` : un composant gère les deux fonds
sans prop, ex. `text-cobalt-500 on-dark:text-cobalt-400`.

## 5. Logo
Fichiers dans `src/assets/brand/` :

| Fichier | Usage |
|---|---|
| `umut-lockup.svg` / `-dark` | Symbole + wordmark — hero, footer, documents |
| `umut-wordmark.svg` / `-dark` / `-mono` | Wordmark seul — header mobile, réseaux, signatures |
| `umut-symbol.svg` / `-dark` | Symbole seul (crochets + courbe + point) ≥ 48 px |
| `umut-symbol-small.svg` | Symbole < 48 px (trait 8, sans point) — header desktop 32 px |
| `umut-app-icon.svg` | Avatar Instagram/WhatsApp, apple-touch-icon (fond graphite, rayon 22 %) |
| `umut-favicon.svg` (= `public/favicon.svg`) | Favicon 16/32 (carré cobalt, courbe blanche) |

- Zone de protection = hauteur du « u ». Taille mini wordmark : 72 px de large.
- Le point est **toujours** cobalt (500 sur clair, 400 sur sombre). Version mono graphite pour impression N&B.
- Ne pas : déformer, changer la couleur des lettres, ajouter ombre/contour, poser le symbole cobalt sur graphite.

## 6. Composants (props → rendu)

### Button `ui/Button.astro`
Props : `variant: 'primary' | 'dark' | 'secondary' | 'ghost'`, `size: 'md' | 'sm' | 'icon'`, `href?`, `icon?: 'arrow'`, `disabled?`.
| Variante | Repos | Hover | Pressed | Désactivé |
|---|---|---|---|---|
| primary | `bg-cobalt-500 text-white` | `bg-cobalt-600` | `bg-cobalt-700` | `border-dashed border-muted text-disabled bg-transparent` |
| dark | `bg-graphite text-white` | `bg-ink` | `bg-ink` + `translate-y-px` | idem |
| secondary | `bg-white border border-graphite text-graphite` | `bg-graphite text-white` | | idem |
| ghost (lien tertiaire) | `font-mono font-bold text-cobalt-500` rendu `[ en savoir plus ]` | soulignement 1 px | | — |
- Hauteurs : md **52 px** (`h-13`, padding x 24), sm **44 px** (mono 13), icon **52×52**.
- Texte : Grotesk 700 16 px. Flèche `→` SVG 18 px, translate-x 2 px au hover (200 ms).
- Variante `dark` + pastille : CTA du header desktop (`<span>` 8 px rond `cobalt-400` avant le texte).
- Sur fond graphite : primary inchangé ; secondary devient `border-white text-white`.

### Tag `ui/Tag.astro`
`#musculation` : mono 12, `px-3 py-1.5`, `bg-white border border-graphite`. Variante `solid` : `bg-graphite text-white`.

### StatusBadge `ui/StatusBadge.astro`
`status: 'new' | 'available' | 'few' | 'full'` → mono 11 MAJ, `bg-white border-line px-2.5 py-1` + repère 7 px :
new = carré `cobalt-500` · available = rond `success` · few = rond `warning` · full = carré `muted` sur `bg-subtle text-mesure`.

### Field `ui/Field.astro`
Label mono 12 MAJ au-dessus · input 48 px `bg-white border border-graphite rounded-none px-3.5` Grotesk 15 ·
aide mono 11 `text-mesure` (`→ réponse sous 24 h`) · erreur : bordure + texte `danger`, `aria-invalid`, `aria-describedby`.
Focus : anneau cobalt 2 px offset 2.

### SectionLabel `ui/SectionLabel.astro`
Props `index?: string` (« 02 », omis sur les pages légales), `label: string` → `02 / programmes ———`. Utilise `.section-label`.

### Metric `ui/Metric.astro`
Le composant signature « labo ». Props `value`, `unit?`, `label`, `trend?: 'up'|'flat'`, `highlight?`.
Valeur `text-data-xl font-mono font-bold` (+ unité en `text-data` `text-mesure`), label mono 12 MAJ dessous,
filet haut 1 px. `highlight` → valeur en cobalt-500.

### ProgressChart `ui/ProgressChart.astro`
SVG reprenant la courbe du logo (polyline + point final cobalt), axes en filets `line`, graduations mono 11 (`S01 … S12`).
Animation `animate-draw` (stroke-dashoffset) déclenchée une fois à l'entrée dans le viewport (IntersectionObserver), désactivée en reduced-motion.
Usage : hero, page méthode. Données **illustratives** → légende « exemple de suivi ».

### ProgramCard
`.card` · numéro mono `01` en haut à gauche · StatusBadge en haut à droite · H3 · résumé `text-small text-mesure` ·
méta mono (`12 semaines · en ligne`) · prix « dès 89 CHF » en `font-mono font-bold` · lien ghost. Hover : bordure `graphite`.

### PricingCard
Comme ProgramCard, prix en `text-data-xl`. `featured` : bordure graphite + tag `Recommandé` (carré cobalt) — **une seule** par grille.

### RecommendedTag `ui/RecommendedTag.astro`
Tag `Recommandé` (bordure graphite, mono 11 MAJ, carré 7 px `cobalt-500`) : PricingCard et tableau de /tarifs. Une seule offre recommandée par page.

### SquareList `ui/SquareList.astro`
Liste à puces carrées 7 px : `tone="cobalt"` pour « Ce qui est inclus » d'une offre, `graphite` ailleurs.

### PageHeader `sections/PageHeader.astro`
En-tête des pages internes, fond blanc + filet bas : SectionLabel (numéro de la navigation, absent sur les pages légales), H1 `text-h1`, chapeau `text-lead text-mesure`, slot (méta, CTA).

### Testimonial (sur `.on-dark`)
Citation Grotesk 400 22 px blanc, nom mono 12 MAJ `muted`, métrique éventuelle `cobalt-400` mono (`−8 kg · 16 sem.`).

### Faq
`<details>` natif, filets entre items, question Grotesk 700 19, icône `+` qui pivote à 45°, réponse `text-body text-mesure`.

### CtaBand
Section `.on-dark` : section-label, H2 blanc, CTA primary cobalt + ghost blanc.

### Header / MobileMenu / Footer
Voir `02-architecture.md` § Header. Footer `.on-dark`, 4 colonnes desktop, filets `line-dark`.

## 7. Iconographie & images
- Icônes : trait 2 px, `stroke="currentColor"`, extrémités carrées, 20/24 px (style de la planche). Source suggérée : **Lucide** (`@lucide/astro` ou SVG copiés) en `stroke-width=2`, `stroke-linecap="square"`.
- Photos : lumière franche, fond salle sobre, **pas de filtre coloré**. Option traitement « labo » : N&B léger + contraste, la couleur n'existe alors que dans l'UI cobalt.
- Formats : portrait 4:5 (hero, à propos), paysage 3:2 (programmes). Toujours `alt` descriptif.
- Photos d'illustration (Unsplash, `src/data/stock.ts`) : toujours en traitement labo `grayscale contrast-110`, via `<Image>` d'`astro:assets`.
  Les photos d'Umut (envoyées dans `/admin`) restent telles quelles.
- Photos d'Umut : `ui/UmutPicture.astro` affiche celle envoyée dans `/admin` (telle quelle), sinon sa photo par défaut
  livrée avec le site (`src/data/umut.ts`, `src/assets/images/umut/`), **en couleur** comme celles de l'admin
  (le N&B est réservé aux illustrations Unsplash, ce qui distingue le vrai coach des illustrations).
  Jamais de photo d'illustration à sa place.
- `ui/ProgrammePhoto.astro` : photo 3:2 d'une offre (celle de l'admin, sinon la photo d'Umut propre à l'offre, différente pour chaque offre), en tête de `ProgramCard` et sur la fiche programme.

## 8. Mouvement
Un mouvement **mécanique et précis**, comme un instrument de mesure : tout part de la profondeur (3D en CSS), rien ne rebondit.
Code : `src/styles/global.css` (fin du fichier), `src/lib/motion.ts`, tokens « Mouvement 3D » de `tokens.css`.

- Durées : 120 ms (hover couleur, suivi du pointeur), 200 ms (transform), 450 ms (retour d'inclinaison, zoom photo),
  800 ms (apparition), 380 ms (changement de page), 1,2 s (tracé de courbe). Décalage de cascade `--stagger` 90 ms.
- Courbe unique : `--ease-labo`. Pas de parallax au scroll, pas de scroll-jacking, pas de lib d'animation.
- **Apparition au scroll** : chaque bloc enfant direct d'un `.container-site` de section monte et se redresse
  (`translateY --reveal-y` + `rotateX --reveal-tilt`, perspective `--perspective`), une seule fois. Les listes marquées
  `data-stagger` (cartes, étapes, galerie) arrivent ensuite en cascade. Le filet des `SectionLabel` se trace.
- **Hero** : les trois mots du H1 basculent depuis l'arrière l'un après l'autre (animation signature de l'accueil).
- **Inclinaison 3D** `data-tilt` : cartes d'offre / de tarif et photos suivent le pointeur (7° max) et avancent en Z
  au survol (`--tilt-lift`) ; la photo d'une carte zoome légèrement (`.tilt-zoom`). Souris uniquement, rien au tactile.
- **Spécimen** `ui/Specimen.astro` : photo posée dans une scène 3D, cadre graphite 1 px flottant derrière elle en
  profondeur (`--specimen-offset`, `--specimen-depth`), légende mono « fig. 01 — … ». Hero, à propos, galerie, étapes de /methode.
- **Cube filaire** `ui/WireCube.astro` : six faces en filets `muted` qui tournent lentement dans le `CtaBand`
  (≥ 1024 px), le point cobalt-400 de « umut. » suspendu au centre. Décoratif (`aria-hidden`).
- **Changement de page** : View Transitions natives entre documents (`@view-transition`), sans JavaScript ;
  l'en-tête reste en place, le contenu glisse.
- FAQ : la réponse se déplie en douceur (`::details-content`, navigateurs récents ; ailleurs, ouverture instantanée).
- Propriétés animées : opacité, transform (dont `scale`), stroke ; seule exception, la hauteur du déplié de FAQ.
- **Sûreté** : tout est armé par la classe `motion` sur `<html>`, posée avant le premier rendu et seulement sans
  `prefers-reduced-motion`. Sans JavaScript ou en mouvement réduit, tout est visible et immobile ; si le script
  ne démarre pas, la page se réaffiche d'elle-même après 2,5 s.

## 9. Accessibilité (rappel)
Contrastes ci-dessus · focus visible partout · cibles ≥ 44 px · labels explicites (pas de placeholder seul) ·
ordre de lecture = ordre visuel · menus/accordéons natifs ou ARIA corrects · `lang="fr"`.
