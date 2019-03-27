import { getFetch, postFetch } from "./apiConfig";
// import api from './interception'
/**
 *  针对每个页面的接口进行 请求 api 的配置
 *  cancel 参数用来配置改接口是否支持 取消请求操作(其实不是真的取消了接口的请求，而是将then转为了cache操作)
 * */
export default {
  // 任务中心模块
  taskCenter: {
    // 获取任务列表  /android-task/list
    taskList: (params: any) => {
      return getFetch({
        url: "/list",
        params,
        interfaceKey: "taskList"
      });
    },
    // 领取奖励 /android-task/receivePrize
    getReword: (params: any, wps_sid: any) => {
      return postFetch({
        url: `/android-task/receivePrize?wps_sid=${wps_sid}`,
        params: params,
        interfaceKey: "getReword"
      });
    }
  }
};
