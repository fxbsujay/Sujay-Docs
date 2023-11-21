
::: details Getting missing peer deps warnings?
If using PNPM, you will notice a missing peer warning for `@docsearch/js`. This does not prevent VitePress from working. If you wish to suppress this warning, add the following to your `package.json`:

```json
"pnpm": {
  "peerDependencyRules": {
    "ignoreMissing": [
      "@algolia/client-search"
    ]
  }
}
```
::: 

:::tip
Before proceeding, make sure to first read [Using a Custom Theme](./custom-theme) to understand how custom themes work.
:::

::: warning Server Support Required
Enabling this may require additional configuration on your hosting platform. For it to work, your server must be able to serve `/foo.html` when visiting `/foo` **without a redirect**.
:::


## `<ClientOnly>`

If you are using or demoing components that are not SSR-friendly (for example, contain custom directives), you can wrap them inside the built-in `<ClientOnly>` component:

```md
<ClientOnly>
  <NonSSRFriendlyComponent />
</ClientOnly>
```


<div class="tip custom-block line">
Just want to try it out? Skip to the 
<a href="./mymap">Using a Custom Theme</a>
</div>
