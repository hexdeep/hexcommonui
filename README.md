# HexUI

Shared, feature-agnostic React components for HexDeep applications.

This repository intentionally contains no application API calls, router
integration, Tauri APIs, account state, translations, or product-specific
icons. Consumers provide their own text, icons, and actions through props.

## Local development

The applications use a local package link while HexUI is not published:

```json
"@hexdeep/ui": "link:../hexui"
```

Install dependencies from each consumer after cloning the sibling repositories.
Import the package stylesheet and register its source with Tailwind 4:

```css
@import '@hexdeep/ui/styles.css';
@source '../../hexui/src';
```

`styles.css` provides semantic accent variables with indigo defaults. A product
can override `--hexui-accent-*` in its own stylesheet to retain its brand.

