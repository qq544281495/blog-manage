import userApi from './userApi'
import articleApi from './articleApi'
import classifyApi from './classifyApi'
import labelApi from './labelApi'
export default {
  ...userApi,
  ...articleApi,
  ...classifyApi,
  ...labelApi
}
