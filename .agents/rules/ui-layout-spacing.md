# Critical UI/UX Layout & Spacing Rules

Never generate cramped, unaligned, or overlapping layouts. Always follow these rules across all pages and components:

1. **Containers & Navbar Clearance**:
   - Every page wrapper must have `min-h-screen`.
   - Provide generous top clearance (minimum `pt-32`, `pt-28`, or `mt-28`) so that page content never overlaps or collides with the fixed navbar (`h-16`).

2. **Generous Spacing & Vertical Rhythm**:
   - Always use generous gaps in grid and flex layouts (`gap-8`, `gap-10`, or `gap-12`).
   - Use consistent vertical rhythm (`space-y-6` to `space-y-8`) between form elements and content blocks.
   - Maintain generous section paddings (`py-20`, `py-24`, or `py-28`).

3. **Viewport Centering for Standalone Views**:
   - Standalone components (such as Login boxes, modal dialogs, empty states, or standalone intake forms) must use `flex flex-col items-center justify-center min-h-screen` to stay centered in the viewport with zero margin collisions.

4. **Autonomous Self-Correction**:
   - Inspect and verify all interactive screens, checking for zero-margin elements, text overlapping, or horizontal overflow on both mobile and desktop viewports.
