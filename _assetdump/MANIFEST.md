# Asset Dump Manifest

This file tracks raw assets as they land in `_assetdump/` and move through the processing pipeline into `public/`.

The `_assetdump/` directory itself is **gitignored** — only this manifest and `.gitkeep` are tracked. Drop raw files directly in here; do not commit them.

---

## Processing Flow

1. **Receive** — Joey drops a file into `_assetdump/` (or a subfolder of it).
2. **Catalog** — Add a row to the table below with status `received`.
3. **Process** — Sort, rename, compress, convert as needed.
   - Photos → `public/images/{weddings|acappella|shared}/` (kebab-case names)
   - Videos → `public/videos/{weddings|acappella}/` (H.264 MP4, optional WebM)
   - Logos/icons → `public/images/shared/` or `public/` (favicons)
4. **Preserve originals** — Move the unmodified original into `_assetdump/originals/` (gitignored, local backup only).
5. **Update row** — Mark status `processed`, note the final path.
6. **Deploy** — Once the asset is referenced in code and visible in a preview build, mark status `deployed`.

---

## Asset Table

| # | Original filename | Received | Status | Final path | Notes |
|---|-------------------|----------|--------|------------|-------|
| 1 | Radiant-Sound-Logo-White.svg | 2026-04-17 | deployed | `public/images/shared/logo-white.svg` | Restored from legacy Jekyll site |
| 2 | cropped-Radiant-Sound-Favicon-Feb-2022.png | 2026-04-17 | deployed | `public/favicon-master.png` | Master favicon source |
| 3 | cropped-Radiant-Sound-Favicon-Feb-2022-32x32.png | 2026-04-17 | deployed | `public/favicon-32x32.png` | Browser tab icon |
| 4 | cropped-Radiant-Sound-Favicon-Feb-2022-180x180.png | 2026-04-17 | deployed | `public/apple-touch-icon.png` | iOS home screen icon |
| 5 | cropped-Radiant-Sound-Favicon-Feb-2022-192x192.png | 2026-04-17 | deployed | `public/icon-192.png` | PWA/Android icon |
| 6 | Frank and Summer638.jpg | 2026-04-22 | deployed | `public/images/weddings/first-dance-01.jpg` | Resized 2400px long edge, JPEG q82. Used in HomeChooser. |
| 7 | Frank and Summer573.jpg | 2026-04-22 | deployed | `public/images/weddings/reception-dancefloor-01.jpg` | Resized 2400px, q82. WeddingsHero backdrop. |
| 8 | Frank and Summer431.jpg | 2026-04-22 | deployed | `public/images/weddings/ceremony-01.jpg` | Resized 2400px, q82. Reserved for future use. |
| 9 | DSC00741.JPG | 2026-04-22 | deployed | `public/images/acappella/performance-01.jpg` | Resized 2400px, q82. Reserved for future use. |
| 10 | DSC00724.JPG | 2026-04-22 | deployed | `public/images/acappella/performance-02.jpg` | Resized 2400px, q82. Reserved. |
| 11 | 3U3A0917.jpg | 2026-04-22 | deployed | `public/images/acappella/stage-01.jpg` | Resized 2400px, q82. AcappellaHero backdrop. |
| 12 | Radiant Sound - Background Gradient.png | 2026-04-22 | deployed | `public/images/shared/brand-gradient.png` | Resized 2400px. Available for future section backdrops. |

## Pending (Phase 1H remainder)

- **Hero video** — `_assetdump/originals/Last Call - Careless Whisper 12-6-2025.mp4` (1.9GB) and `Last Call - Do I Wanna Know 12-6-2025.mp4` (2.5GB) need Joey's curation + ffmpeg compression (recipe below) before integration. Recommended: one 15–20s silent loop at ~6Mbps → `public/videos/acappella/hero-reel.mp4`.
- **Additional photo curation** — dozens of raw JPGs remain. Joey to flag which belong to weddings vs a cappella vs roster group portraits so they can be resized and placed.

---

## Naming Conventions

- **Photos:** `{descriptive-subject}-{location-or-event}-{NN}.jpg` — e.g. `first-dance-barn-wedding-01.jpg`
- **Videos:** `{descriptive-subject}-{audience}-{NN}.mp4` — e.g. `hero-reel-weddings.mp4`, `acappella-show-cornell-01.mp4`
- **Logos:** `logo-{variant}.{ext}` — e.g. `logo-white.svg`, `logo-dark.svg`
- All filenames lowercase, kebab-case, ASCII only.

---

## Video Processing Notes

- Target web delivery: MP4 (H.264) main profile, yuv420p, ~5–8 Mbps for 1080p hero footage.
- Add WebM fallback only if we observe real Safari playback issues — Safari has supported H.264 MP4 for over a decade.
- Strip audio if video is purely decorative/background (`-an` flag in ffmpeg).
- Max hero video length: 20s; loop cleanly.

Example ffmpeg recipe for a background hero clip:
```
ffmpeg -i input.mov -c:v libx264 -profile:v main -pix_fmt yuv420p \
  -movflags +faststart -an -vf "scale=-2:1080" -b:v 6M output.mp4
```
