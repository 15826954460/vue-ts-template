import axios from "axios";

let customAxios = axios.create({
  baseURL: "/api/",
  timeout: 60000, // 默认请求超时时间
  // 设置请求头格式：用自定义的覆盖 axios 自带的 'Content-Type': 'application/x-www-form-urlencoded'
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
    Authorization: "" // 权限鉴别字段默认为空
  },
  withCredentials: true, // 请求凭证
  // 使用自定义的验签头
  auth: {
    username: "",
    password: ""
  },
  responseType: "json" // 默认的相应数据格式
});

const webApiConfig = {
  startToLoading: 600, // 600ms内网络请求无响应，则展现loading动画
  loadingTimeout: 30000, // loading 动画超时时间
  requestInstanceStack: new Map(), // 请球拦截
  responseInstanceStack: new Map(), // 响应拦截
  instance: customAxios /**  自定义一个 axios 实例 */,
  /**  post 传参序列化  (添加请求拦截器) */
  setRequestInterceptors: (interfaceKey: string) => {
    let _requestInstance = webApiConfig.instance.interceptors.request.use(
      (config: any) => {
        /** 根据实际业务写逻辑,比如参数同意进行过滤 */
        return config;
      },
      (error: any) => {
        return Promise.reject(error);
      }
    );
    /** 将请求拦截放到拦截栈中 */
    webApiConfig.requestInstanceStack.set(interfaceKey, _requestInstance);
  },
  /**  移除请求拦截器 */
  removeRequestInterceptors: (interfaceKey: any) => {
    webApiConfig.instance.interceptors.request.eject(
      webApiConfig.requestInstanceStack.get(interfaceKey)
    );
  },
  // 设置响应拦截
  setResponseInterceptors: (interfaceKey: any) => {
    /** 返回状态判断  (添加响应拦截器) */
    let _responseInstance = webApiConfig.instance.interceptors.response.use(
      /** 请求成功的回掉 */
      (res: any) => {
        // 根据http请的响应状态码做一些相应的处理，业务逻辑自己写，这里只是简单的console
        let { status } = res;
        switch (status) {
          case 404:
            console.log("请求路径有误");
            break;
          case 200:
          case 304:
            // 针对重定向和请求ok就返回数据
            return res;
          case 400:
            console.log("请求参数有误，请检查");
            break;
        }
      },
      /** 请求失败的回掉 */
      (error: any) => {
        return Promise.reject(error);
      }
    );
    /** 将响应拦截放到拦截栈中 */
    webApiConfig.responseInstanceStack.set(interfaceKey, _responseInstance);
  },
  /**  移除响应拦截器 */
  removeResponseInterceptors: (interfaceKey: any) => {
    webApiConfig.instance.interceptors.response.eject(
      webApiConfig.responseInstanceStack.get(interfaceKey)
    );
  }
};

/** 开始请求接口，判断是否展示loading动画 */
function startLoading() {
  // let _loadInstance = null;
  // // 600ms之后展示loading动画
  // let _startTimer = setTimeout(() => {
  //   _loadInstance = bouncedUtils.loading.show; // 封装的loading动画
  //   _loadInstance();
  //   _startTimer = null;
  // }, webApiConfig.startToLoading);
  // let _overTimer = setTimeout(() => {
  //   bouncedUtils.toast.show({ content: "请求超时\n请检查网络" }); // bouncedUtils
  //   _overTimer = null;
  // }, webApiConfig.loadingTimeout);
  // return [_startTimer, _overTimer, _loadInstance];
}

/** 请求接口结束，关闭loading动画 */
function endLoading() {
  // clearTimeout(startLoading()[0]);
  // clearTimeout(startLoading()[1]);
  // startLoading()[2] instanceof Function && bouncedUtils.loading.hide();
}

/** 启用拦截 */
function startInterceptors(interfaceKey: any) {
  webApiConfig.setRequestInterceptors(interfaceKey);
  webApiConfig.setResponseInterceptors(interfaceKey);
}

/** 删除拦截和改拦截实例 */
function deleteInterceptors(interfaceKey: any) {
  webApiConfig.requestInstanceStack.delete(interfaceKey);
  webApiConfig.responseInstanceStack.delete(interfaceKey);
  webApiConfig.removeRequestInterceptors(interfaceKey);
  webApiConfig.removeResponseInterceptors(interfaceKey);
}

/** 关于取消请求的相关方法 */
function cancelFetch(cancel: any, interfaceKey: any) {
  /** 保存取消请求的实例对象 */
  let _cancelObj: any = {};
  if (!_cancelObj.cancel) {
    _cancelObj = {
      key: interfaceKey,
      cancel: null
    };
  } else if (_cancelObj.cancel) {
    /** 取消请求,并重置数据 */
    _cancelObj.cancel();
    _cancelObj = {};
  }
  return _cancelObj;
}

// 对 get 请求简易封装
export function getFetch({
  url = "",
  params = {},
  interfaceKey = "",
  cancel = false
} = {}) {
  !cancel && startInterceptors(interfaceKey); // 开启请求拦截
  if (cancelFetch(cancel, interfaceKey).cancel) return;
  /** 这里使用 promise 进行就建议包装是为了更友好的将数据的处理暴露在业务层 */
  return new Promise((resolve, reject) => {
    // startLoading();
    webApiConfig
      .instance({
        method: "get",
        url: url,
        params: params,
        cancelToken:
          (cancel &&
            webApiConfig.instance.CancelToken(function executor(c: any) {
              // executor 函数接收一个 cancel 函数作为参数
              cancelFetch(cancel, interfaceKey).cancel = c;
            })) ||
          ""
      })
      .then((response: any) => {
        // endLoading();
        deleteInterceptors(interfaceKey); // 删除拦截器以及其实例
        let _code = response.code;
        /** 根据后台返回的状态码进行相应的处理 */
        switch (_code) {
          case 0:
          case 1:
          case 200:
            break;
          default:
            console.log("示例代码都进行返回数据");
        }
        resolve(response.data);
      })
      .catch((error: any) => {
        console.log(`请求当前的接口为 ${url} 错误信息为 ${error}`);
        /**
         *  这里可以配置一些关于操作失败的提示信息：比如获取数据失败等等
         *  或者失败的毁掉函数
         */
        reject(error);
      });
  });
}

// 对 post 请求简易封装
export function postFetch({
  url = "",
  params = {},
  interfaceKey = "",
  cancel = false
} = {}) {
  !cancel && startInterceptors(interfaceKey); // 开启请求拦截
  /** 针对可以取消请求的操作做一些响应的处理 */
  if (cancelFetch(cancel, interfaceKey).cancel) return;
  /** 这里使用 promise 进行就建议包装是为了更友好的将数据的处理暴露在业务层 */
  return new Promise((resolve, reject) => {
    /** 配置请求是否加载动画 */
    webApiConfig
      .instance({
        method: "post",
        url: url,
        data: params,
        cancelToken:
          (cancel &&
            webApiConfig.instance.CancelToken(function executor(c: any) {
              // executor 函数接收一个 cancel 函数作为参数
              cancelFetch(cancel, interfaceKey).cancel = c;
            })) ||
          ""
      })
      .then((response: any) => {
        // endLoading();
        deleteInterceptors(interfaceKey); // 删除拦截器以及其实例
        let _code = response.code;
        /** 根据后台返回的状态码进行相应的处理 */
        switch (_code) {
          case 0:
          case 1:
          case 200:
            break;
          default:
            console.log("示例代码都进行返回数据");
        }
      })
      .catch((error: any) => {
        /**
         * 这里可以配置一些关于操作失败的提示信息：比如获取数据失败等等
         * reject 方法的参数会传到外部的catch方法，建议关于提示信息统一封装在这里处理，不要放到业务层
         */
        console.log(`请求当前的接口为 ${url} 错误信息为 ${error}`);
        reject(error);
      });
  });
}
