---
title: Light Sight
description: "Light Sight is a small interactive web application that turns the user’s screen into a simple colored light."
updated: "2026-11-09"
---

Light Sight is a small interactive web application that turns the user’s screen into a simple colored light. Users can select different color buttons to change the page background, reset the display, or open an information modal explaining the project. Its purpose is intentionally simple: provide a quick screen-based light source with a selectable color.

The project is built with React and Create React App. React state controls the modal visibility, while event handlers directly update the document background color when a color is selected. The modal is implemented with a React portal so it can render into a separate DOM container, and standard CSS provides the layout, buttons, colors, and modal styling. The project also uses `gh-pages` for static deployment.
