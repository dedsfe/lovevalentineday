# LoveValentine Design System

## Direction

Premium romantic digital gift. The interface should feel expensive, cinematic,
minimal, and polished. Avoid playful SaaS templates, neobrutalism, heavy emoji
usage, loud borders, and generic startup cards.

## Color Tokens

| Token | Value | Use |
| --- | --- | --- |
| `--lp-night` | `#030305` | Main dark background |
| `--lp-night-2` | `#0C0C0F` | Glass panels and nav |
| `--lp-night-3` | `#15151B` | Elevated dark surfaces |
| `--lp-white` | `#FFFFFF` | Primary text on dark |
| `--lp-milk` | `#F7F2EA` | Warm premium light surface |
| `--lp-rose` | `#E11D48` | Primary emotional accent |
| `--lp-rose-soft` | `#FB7185` | Soft rose highlights |
| `--lp-red-deep` | `#7F1027` | Deep red glow and shadows |

## Text

- Primary text on dark: `rgba(255,255,255,0.92)`
- Secondary text: `rgba(255,255,255,0.52)`
- Tertiary text: `rgba(255,255,255,0.34)`
- Hero headlines should be large, centered, and white.
- Do not change product copy while working on visual design.

## Glass

- Use dark translucent glass: `rgba(12,12,15,0.62)` to `rgba(12,12,15,0.78)`.
- Use `backdrop-filter: blur(26px) saturate(160%)`.
- Borders should be thin and subtle: `rgba(255,255,255,0.12)`.
- Shadows should be soft and deep, never hard black offsets.

## Buttons

- Primary CTA: light metallic surface over dark backgrounds.
- Add rose/deep red blurred glow behind important CTAs.
- Keep hover movement minimal: `translateY(-1px)` or `-2px` max.
- Avoid thick black borders, uppercase shouting, and heavy drop shadows.

## Logo

- Use `/lovepanda-logo.png` for the bear-heart mark.
- On dark backgrounds, keep the mark white.
- Use it inside a small glass tile in the navbar.
- Preserve legibility at 24-36px.

## Motion

- Motion should feel quiet and premium.
- Use opacity, blur, tiny translate, and glow changes.
- Avoid bouncing, bobbing, exaggerated rotation, and decorative movement.
