# Pako-ESM

This is a fork of [Pako](https://github.com/nodeca/pako/) v1.0.11 with bundler-friendly packaging.

It is used by the Excel and PDF Export modules of [Progress Kendo UI](https://www.telerik.com/kendo-ui).

* Includes ES2015, UMD and CommonJS bundles.
* Built-in TypeScript definitions.
* Targets modern browsers and IE11.
* Subject to [tree-shaking](https://webpack.js.org/guides/tree-shaking/).
* [Side-effect free](https://webpack.js.org/guides/tree-shaking/#mark-the-file-as-side-effect-free).

## Notes

* Should not be used in NodeJS environment. Use the original Pako library instead.
* Not compatible with legacy browsers.
