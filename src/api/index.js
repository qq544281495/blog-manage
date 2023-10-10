import userApi from './userApi'
import articleApi from './articleApi'
import classifyApi from './classifyApi'
import labelApi from './labelApi'
import imageApi from './imageApi'
import projectApi from './projectApi'
export default {
  ...userApi,
  ...articleApi,
  ...classifyApi,
  ...labelApi,
  ...imageApi,
  ...projectApi
}
