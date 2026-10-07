## Development
Before doing anything, always check the following documentation's pages:
- ASTRO DOCS: https://docs.astro.build/en/getting-started/
- ALPINE.JS DOCS: https://alpinejs.dev/start-here


---

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

# UI and styling
Always prefere Alping.js over vanilla Javascript for browser interactivity

Create small components that follow the SoC and DRY principle (Separation of Concerns, Do not repeat yourself)

Separate the UI from the logic: when you can, outsource business logic inside the /helpers folder

## Design system
Always check @UI-rebrand/design-system/DESIGN-SYSTEM.md before styling components: it is the source of truth for tone, colors, typography, layout, tokens and components.
The folder is local reference material (git-ignored): the tokens used by the site live in `src/styles/global.css` (`@theme` block), so use the Tailwind utilities they generate (`bg-bg`, `bg-surface`, `text-text-body`, `text-accent`, `rounded-card`, `shadow-card`, ...) instead of hard-coded colors.

Never write custom CSS classes in `src/styles/global.css`. Tailwind v4 is configured in CSS (there is no `tailwind.config.js`): tokens go in `@theme`, plugins in `@plugin`, new variants in `@custom-variant`, element defaults in `@layer base`. Everything else is utilities in the components; long-form Markdown uses the Typography plugin through `src/shared/components/Prose.astro`.

## Typography
- font-sans - Figtree (all text)
- font-mono - DM Mono (dates, index numbers, metric values only)