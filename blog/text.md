
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

::: danger STOP
危险区域，请勿继续
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

> [!NOTE]
> 强调用户在快速浏览文档时也不应忽略的重要信息。

> [!TIP]
> 有助于用户更顺利达成目标的建议性信息。

> [!IMPORTANT]
> 对用户达成目标至关重要的信息。

> [!WARNING]
> 因为可能存在风险，所以需要用户立即关注的关键内容。

> [!CAUTION]
> 行为可能带来的负面影响。
