---
name: halal-foodistan-brand-refresh
description: Black-and-yellow Halal Foodistan landing page updates for this project. Use when editing the site theme, brand copy, service sections, contact links, logo treatment, form text, or lead submission flow, and when testing interactive buttons and links.
---

# Halal Foodistan Brand Refresh

## Overview

Use this skill to keep the Halal Foodistan site aligned with the current brand direction: premium, black-and-yellow, simple to read, and focused on business growth.

## Workflow

1. Keep the visual system consistent.
   - Use black, charcoal, and warm yellow accents.
   - Keep spacing generous and copy short, clear, and professional.
   - Use the transparent logo asset for headers and footer branding.

2. Write plain-language marketing copy.
   - Explain services in direct terms a business owner can understand quickly.
   - Replace old restaurant-only wording with broader local business language.
   - Keep contact details visible and easy to act on.

3. Preserve working contact paths.
   - `mailto:sale@halalfoodistan.com`
   - Instagram DM link to `https://www.instagram.com/halal_foodistan/`
   - Lead form submission endpoint and backend email routing

4. Test every interactive control.
   - Verify all buttons, form steps, social links, and modal actions.
   - Check primary CTAs, back/next controls, submit behavior, resume draft action, and header/footer links.
   - Confirm buttons work with mouse and keyboard.
   - Run `scripts/button-audit.js` after changing page controls.
   - Run `scripts/validation-audit.js` after changing phone or email rules.

5. Update supporting files together.
   - Sync `index.html`, `styles.css`, `script.js`, `config.js`, `submit.php`, and `apps-script/Code.gs` when changing the lead flow.
   - Keep the skill description aligned with the current brand and workflow.

## Notes

- Prefer small, polished changes over broad redesigns.
- Do not reintroduce the old green-heavy palette unless the user asks for it.
- When adding a new button, make sure it has a clear label, visible hover state, and a real action or destination.
