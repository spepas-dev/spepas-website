# SpePas Brand Identity Guidelines

> Source: Figma — "SpePas - App Design" — Visual Style Guide
> File key: `TmeouxnCA1n1ewKnLgBVzG` | Style guide node: `417:7285`
> Last updated: 2026-02-22

> **Platform note:** The Figma file is a mobile app design spec. Most of the brand system (colors, font, logo) is directly portable to web and admin. Where there are meaningful differences — mainly in the type scale and interaction sizing — those are called out explicitly in the relevant sections below.

---

## 1. Brand Overview

SpePas is a one-stop shop for all car parts needs in Ghana. The brand communicates trust, efficiency, and modernity — connecting buyers and sellers in the automotive parts market.

---

## 2. Typography

### 2.1 Primary Font

**Plus Jakarta Sans** — the official brand typeface across all SpePas platforms (mobile app, website, admin portal).

```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&display=swap');
```

> Note: The current website uses **Poppins**. Migrating to Plus Jakarta Sans will align all surfaces with the brand spec.

### 2.2 Type Scale

**These sizes are defined for the mobile app.** The type scale applies directly to web with some important notes (see Platform Notes column and the callouts below).

| Token       | Size  | Weight        | Letter Spacing | Line Height | Platform Notes |
|-------------|-------|---------------|----------------|-------------|----------------|
| Display lg  | 48px  | Medium (500)  | -2% (-0.96px)  | 60px        | Mobile: page hero titles. Web: hero/H1 on desktop; step down to Display md at mobile breakpoints |
| Display md  | 36px  | Medium (500)  | -4% (-1.44px)  | 44px        | Mobile/web: section headings. Web H1 on smaller viewports |
| Display sm  | 30px  | Regular (400) | -3% (-0.90px)  | 38px        | Mobile/web: card headings, sub-section titles (H2/H3) |
| Text lg     | 18px  | Regular (400) | -3% (-0.54px)  | 28px        | Mobile/web: large body, lead paragraphs |
| Text md     | 16px  | Medium (500)  | -4% (-0.64px)  | 24px        | Mobile/web: standard UI labels, button text, form inputs |
| Text sm     | 14px  | Medium (500)  | -3% (-0.42px)  | 20px        | Mobile/web: secondary labels, form field labels, nav items |
| Text xs     | 12px  | Regular (400) | -3% (-0.36px)  | 18px        | Mobile/web: captions, helper text, secondary metadata |
| Text xxs    | 10px  | Medium (500)  | 0              | 16px        | ⚠️ **Mobile only** — dense mobile UI (badges, table chips). Use Text xs (12px) as web minimum |

> **Web difference — Text xxs (10px):** This size exists for dense mobile UIs (e.g., status chips, compact table cells). On web, 10px is below accessible thresholds for most users. **Use 12px (Text xs) as the minimum for all essential web content.**

> **Web difference — Responsive scaling:** The mobile scale is your mobile-first baseline. At `md`/`lg` breakpoints, step up to the next Display size. Example: a page H1 renders as `Display md` (36px) on mobile → `Display lg` (48px) on desktop.

> **Web difference — Body text default:** On mobile, `Text md` (16px) is the body default. On web, consider `Text md` (16px) as the comfortable default, especially for long-form content.

---

## 3. Brand Colors

### 3.1 Core Brand Colors

Used in the SpePas logo. Defined usage percentages maintain visual balance.

| Name          | Hex       | RGB           | Logo Usage |
|---------------|-----------|---------------|------------|
| Pure White    | `#FFFFFF`  | 255/255/255   | 55%        |
| OffBlack      | `#1C1D20`  | 28/29/32      | 30%        |
| SpePas Blue   | `#4A36EC`  | 74/54/236     | 10%        |
| SpePas Yellow | `#F5B127`  | 245/177/39    | 5%         |

**SpePas Blue (`#4A36EC`)** — primary interactive color: buttons, links, active states, highlights.

**SpePas Yellow (`#F5B127`)** — secondary accent: badges, alerts, warmth elements. Use sparingly.

### 3.2 Design Principle on Palettes

> **Color code with value 500 = main color. Above 500 = shades (darker). Below 500 = tints (lighter).**

### 3.3 Primary Palette (Blue / SpePas Blue)

| Token        | Hex       |
|--------------|-----------|
| primary-50   | `#edebfd`  |
| primary-100  | `#c7c1f9`  |
| primary-200  | `#aca3f6`  |
| primary-300  | `#8678f2`  |
| primary-400  | `#6e5ef0`  |
| **primary-500** | **`#4a36ec`** ← Main |
| primary-600  | `#4331d7`  |
| primary-700  | `#3526a8`  |
| primary-800  | `#291e82`  |
| primary-900  | `#1f1763`  |

### 3.4 Secondary Palette (Yellow / SpePas Yellow)

| Token          | Hex       |
|----------------|-----------|
| secondary-50   | `#fef7e9`  |
| secondary-100  | `#fce7bc`  |
| secondary-200  | `#fadb9c`  |
| secondary-300  | `#f8cb6e`  |
| secondary-400  | `#f7c152`  |
| **secondary-500** | **`#f5b127`** ← Main |
| secondary-600  | `#dfa123`  |
| secondary-700  | `#ae7e1c`  |
| secondary-800  | `#876115`  |
| secondary-900  | `#674a10`  |

### 3.5 Semantic / Error Palette (Red)

| Token              | Hex       |
|--------------------|-----------|
| error-50           | `#feeceb`  |
| error-100          | `#fac5c1`  |
| error-200          | `#f8a9a3`  |
| error-300          | `#f5827a`  |
| error-400          | `#f36960`  |
| **error-500**      | **`#f04438`** ← Main |
| error-600          | `#da3e33`  |
| error-700          | `#aa3028`  |
| error-800          | `#84251f`  |
| error-900          | `#651d18`  |

### 3.6 Semantic / Success Palette (Teal)

| Token              | Hex       |
|--------------------|-----------|
| success-50         | `#e6f6f4`  |
| success-100        | `#b0e4dd`  |
| success-200        | `#8ad7cc`  |
| success-300        | `#54c5b5`  |
| success-400        | `#33baa7`  |
| **success-500**    | **`#00a991`** ← Main |
| success-600        | `#009a84`  |
| success-700        | `#007867`  |
| success-800        | `#005d50`  |
| success-900        | `#00473d`  |

### 3.7 Neutral Palette

| Token         | Hex       |
|---------------|-----------|
| neutral-50    | `#fafafb`  |
| neutral-100   | `#efeef4`  |
| neutral-200   | `#e7e6ee`  |
| neutral-300   | `#dcdbe7`  |
| neutral-400   | `#d5d4e2`  |
| **neutral-500** | **`#cbc9db`** ← Main |
| neutral-600   | `#b9b7c7`  |
| neutral-700   | `#908f9b`  |
| neutral-800   | `#706f78`  |
| neutral-900   | `#55545c`  |

### 3.8 Brand Neutral Colors

Independent named neutrals from the logo color section:

| Name         | Hex       | RGB           |
|--------------|-----------|---------------|
| Pure White   | `#FFFFFF`  | 255/255/255   |
| OffWhite     | `#F9F9F9`  | 249/249/249   |
| Light Gray   | `#F0F0F0`  | 240/240/240   |
| Cloudy Gray  | `#D2D2D2`  | 210/210/210   |
| Medium Gray  | `#999D9E`  | 153/157/158   |
| Dark Gray    | `#545557`  | 84/85/87      |
| OffBlack     | `#1C1D20`  | 28/29/32      |

---

## 4. Logo

### 4.1 Primary Logo
- Wordmark: "SpePas" with car/gear emblem
- For light (white / offwhite) backgrounds

### 4.2 Logo Variants
- **On dark/black background** — white reversed version
- **Monochrome** — single-color adaptation
- **Emblem only** — standalone icon mark (secondary logo)

### 4.3 Logo Usage Rules
- Maintain the 55/30/10/5% color ratio at all times
- Never distort, recolor, or apply unapproved effects to the logo
- Minimum clear space: equal to the height of the "S" in SpePas

---

## 5. Design Principles

### Visual Strategy
These principles apply across mobile, web, and admin.

- **White-dominant** (55%) — breathing room, clarity, premium feel
- **Blue as action** — every interactive element uses `#4A36EC`
- **Yellow as delight** — used sparingly to create energy and warmth
- **OffBlack for text** — `#1C1D20` avoids harshness of pure black

### Color Usage Rules
Same across all platforms:
- Never use SpePas Yellow as a large background
- SpePas Blue drives all primary CTAs and interactive states
- Use semantic palettes for error/success — never improvise with custom reds/greens
- Use neutral palette for structure: borders, backgrounds, dividers
- All platforms (app, website, admin) must use the same color tokens

### Platform-Specific Interaction Sizing

| Principle            | Mobile App                          | Web / Admin                         |
|----------------------|-------------------------------------|-------------------------------------|
| Touch / click target | Min 44×44px (iOS HIG standard)      | Min 32px height acceptable for mouse|
| Button padding       | Larger vertical padding for thumbs  | Standard padding (0.5rem–0.75rem)   |
| Hover states         | Not applicable (touch)              | Required — use primary-400 on hover |
| Focus states         | Platform-native                     | Custom focus ring using primary-300 with 2px offset |
| Spacing density      | More compact vertical rhythm        | Can use more horizontal whitespace and multi-column layouts |
| Navigation           | Bottom tab bar / drawer             | Top nav bar / sidebar               |

### Accessibility Notes
- primary-500 (`#4A36EC`) on white: **6.93:1** — passes AA
- primary-300 (`#8678f2`) on black: **5.98:1** — passes AA
- error-500 (`#f04438`) on white: **3.76:1** — passes AA (large text AAA)
- success-500 (`#00a991`) on black: **7.08:1** — passes AA

> **Web note:** All interactive elements must meet WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large text/UI components). `primary-500` on white (6.93:1) comfortably passes for all text. Avoid using `primary-400` (`#6e5ef0`) for text on white — it sits at the AA threshold.

---

## 6. CSS Implementation (Tailwind v4)

Add to `src/index.css` in the `@theme` block:

```css
/* Font */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&display=swap');

@theme {
  /* Brand Font */
  --font-family-brand: "Plus Jakarta Sans", sans-serif;

  /* Primary (SpePas Blue) */
  --color-primary-50:  #edebfd;
  --color-primary-100: #c7c1f9;
  --color-primary-200: #aca3f6;
  --color-primary-300: #8678f2;
  --color-primary-400: #6e5ef0;
  --color-primary-500: #4a36ec;
  --color-primary-600: #4331d7;
  --color-primary-700: #3526a8;
  --color-primary-800: #291e82;
  --color-primary-900: #1f1763;

  /* Secondary (SpePas Yellow) */
  --color-secondary-50:  #fef7e9;
  --color-secondary-100: #fce7bc;
  --color-secondary-200: #fadb9c;
  --color-secondary-300: #f8cb6e;
  --color-secondary-400: #f7c152;
  --color-secondary-500: #f5b127;
  --color-secondary-600: #dfa123;
  --color-secondary-700: #ae7e1c;
  --color-secondary-800: #876115;
  --color-secondary-900: #674a10;

  /* Semantic Error (Red) */
  --color-error-50:  #feeceb;
  --color-error-100: #fac5c1;
  --color-error-200: #f8a9a3;
  --color-error-300: #f5827a;
  --color-error-400: #f36960;
  --color-error-500: #f04438;
  --color-error-600: #da3e33;
  --color-error-700: #aa3028;
  --color-error-800: #84251f;
  --color-error-900: #651d18;

  /* Semantic Success (Teal) */
  --color-success-50:  #e6f6f4;
  --color-success-100: #b0e4dd;
  --color-success-200: #8ad7cc;
  --color-success-300: #54c5b5;
  --color-success-400: #33baa7;
  --color-success-500: #00a991;
  --color-success-600: #009a84;
  --color-success-700: #007867;
  --color-success-800: #005d50;
  --color-success-900: #00473d;

  /* Neutral */
  --color-neutral-50:  #fafafb;
  --color-neutral-100: #efeef4;
  --color-neutral-200: #e7e6ee;
  --color-neutral-300: #dcdbe7;
  --color-neutral-400: #d5d4e2;
  --color-neutral-500: #cbc9db;
  --color-neutral-600: #b9b7c7;
  --color-neutral-700: #908f9b;
  --color-neutral-800: #706f78;
  --color-neutral-900: #55545c;

  /* Brand Neutrals (logo color system) */
  --color-brand-white:    #FFFFFF;
  --color-brand-offwhite: #F9F9F9;
  --color-brand-gray-100: #F0F0F0;
  --color-brand-gray-300: #D2D2D2;
  --color-brand-gray-500: #999D9E;
  --color-brand-gray-700: #545557;
  --color-brand-offblack: #1C1D20;
}
```

---

## 7. Figma Reference

| Resource           | Value                                      |
|--------------------|--------------------------------------------|
| File               | SpePas - App Design (Imported from Asaad)  |
| File Key           | `TmeouxnCA1n1ewKnLgBVzG`                   |
| Style Guide Node   | `417:7285`                                  |
| Primary Palette    | `417:7292`                                  |
| Secondary Palette  | `417:8283`                                  |
| Error Palette      | `417:7785`                                  |
| Success Palette    | `417:7908`                                  |
| Neutral Palette    | `417:8036`                                  |
| Font Hierarchy     | `1233:9740`                                 |
| Brand Identity     | `3980:9919`                                 |
