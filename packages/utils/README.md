# @vyron/utils

JavaScript utility functions.

## Install

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

## License

[MIT](./LICENSE)
