# utils

前端常用的工具方法集合,灵感来源于 [vue](https://github.com/vuejs/core), [lodash](https://github.com/lodash/lodash) 等优秀的开源作品

## Install

Take the [@vyron/utils](https://www.npmjs.com/package/@vyron/utils) package as an example [All packages](#all-packages)

With npm

```zsh
# npm
npm install @vyron/utils

# yarn
yarn add @vyron/utils

# pnpm
pnpm install @vyron/utils

```

With CDN

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <script src="https://cdn.jsdelivr.net/npm/@vyron/utils@0.0.1/dist/utils.global.js"></script>
    <title>utils</title>
  </head>

  <body>
    <script>
      const { head, isArray } = utils
      const data = [1, 2, 3]
      console.log(head(data))
      console.log(isArray(data))
    </script>
  </body>
</html>
```

## All Packages

| package        | desc                      |
| -------------- | ------------------------- |
| @vyron/utils   | JavaScript utils          |
| @vyron/vhooks  | Vue composition api hooks |
| @vyron/storage | Javascript storage utils  |

## License

[MIT](./LICENSE)

Copyright (c) 2022-present, vyron
