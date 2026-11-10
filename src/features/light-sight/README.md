# Light Sight

Frontend only, so this feature needs `ui/` and no `server/` folder.

- App page: `src/app/(apps)/light-sight/page.tsx` (URL: `/light-sight`). The `(apps)` route group has no site header or footer, so the page is full screen.
- Documentation: `src/content/docs/light-sight.md` (URL: `/projects/light-sight`)
- `ui/LightSightApp.tsx` holds the state (selected color, modal open). Nothing outside the component is changed when a color is picked.
- `ui/colors.ts` the preset colors (red, orange, yellow, green, blue, purple, white); `ui/CustomColorButton.tsx` opens the native color picker for any other color; `ui/ColorPicker.tsx` and `ui/ColorButton.tsx` the controls.
- The information modal is the shared `src/components/Modal.tsx` (native `<dialog>`).
