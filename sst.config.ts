import { SSTConfig } from 'sst'
import { MainStack } from './stacks/MainStack'

export default {
  config(__input) {
    return {
      name: 'cocktails',
      region: 'us-west-2',
    }
  },
  stacks(app) {
    app.stack(MainStack)
  },
} satisfies SSTConfig
