import userApi from './userApi'
import articleApi from './articleApi'
import classifyApi from './classifyApi'
export default {
  ...userApi,
  ...articleApi,
  ...classifyApi
}
