// import { PlopGenerator } from '.'
import { getPkg } from './utils.mjs'

export const packageGenerator = {
  name: 'package',
  config: {
    description: 'Create a new package?',
    prompts: [
      {
        type: 'input',
        name: 'packageName',
        message: 'Please enter the package name (camelCase)!'
      }
    ],
    actions: ({ packageName }) => {
      const version = getPkg('package.json', 'version')
      return [
        {
          type: 'addMany',
          data: { version },
          base: 'templates/package',
          destination: `../packages/{{kebabCase packageName}}`,
          templateFiles: [`templates/package/**`]
        }
      ]
    }
  }
}
