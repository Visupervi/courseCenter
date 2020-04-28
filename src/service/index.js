import Axios from 'axios'
import qs from 'qs'
import {Indicator, MessageBox} from 'mint-ui';
import {communicationWithNative} from './superGuide';
/**
 * @Author Visupervi
 * @Date 2019/12/19 20:39
 * @Name axios统一封装
 * @Param
 * @Return
 * @Description 请求拦截，响应处理，错误统一处理
 */

console.log(process.env.VUE_APP_MODE,"读取环境");
let url = "";
if(process.env.VUE_APP_MODE === "production"){
  url = ''
}else {
  url = ''
}
Axios.defaults.withCredentials = true;
let timer;
const opts = {
  lock: true,
  text: '请耐心等待',
  spinner: 'el-icon-loading',
  background: 'rgba(0, 0, 0, 0.7)'
};
const axios = Axios.create({
  // baseURL: '',//查一下自己的地址
  // baseURL: '',//查一下自己的地址
  // baseURL: '',//查一下自己的地址
  // baseURL: '',//查一下自己的地址
  baseURL: url,//查一下自己的地址
  timeout: 10000,
  responseType: 'json',
  withCredentials: true,
  headers: {
    'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8'//x-www-form-urlencoded
  }
});
//请求拦截，统一加loading
axios.interceptors.request.use(config => {
  //打印请求参数
  // 清除计时器
  // console.log("config", config);
  clearTimeout(timer);
  if (config.url !== '/app/getCacheData' &&
    config.url !== "/app/checkFavoriteInfo" &&
    config.url !== "/app/checkLikeInfo" &&
    config.url !== "/app/getLessonTypeList" &&
    config.url !== '/app/startStudyStatic' &&
    config.url !== "/app/endStudyStatic" &&
    config.url !== "/app/getCacheData" &&
    config.url !== "/app/saveCacheData" &&
    config.url !== "/app/checkFavoriteInfo" &&
    config.url !== "/app/startStudyStatic" &&
    config.url !== "/app/endStudyStatic" &&
    config.url !== "/app/saveSearchData" &&
    config.url !== "/app/getSearchDataList" &&
    config.url !== "/app/delSearchDataList" &&
    config.url !== "/app/saveMyFavorite" &&
    config.url !== "/app/delMyFavorite" &&
    config.url !== "/app/savelikeNum" &&
    config.url !== "/app/dellikeNum" &&
    config.url !== "/app/saveBrowserNum" &&
    config.url !== "/app/saveHaveLesson" &&
    config.url !== "/app/saveCurrentStudy" &&
    config.url !== "/app/checkLikeInfo" &&
    config.url !== "/app/saveCriticText"
  ) {
    Indicator.open({
      text: '加载中...',
      spinnerType: 'triple-bounce'
    });
  }
  let accessToken = getQueryString("accessToken");
  config.url = config.url + `?accessToken=${accessToken}`;
  config.method === 'post'
    ? config.data = qs.stringify({...config.data})
    : config.params = {...config.params};
  config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
  return config
}, error => {
  mui.alert(`${error.data.error.message}`, "提示", () => {
  });
  return Promise.reject(error.data.error.message)
});
//响应拦截，关闭loading
axios.interceptors.response.use(res => {
  if (res.data && res.data.code === 200) {
    timer = setTimeout(() => {
      Indicator.close();
    }, 0)
  } else if (res.data && parseInt(res.data.code) === 1001) {
    //重新登录
    communicationWithNative({
      method: 'reLogin',
      args: {
        sendData: 1001
      }
    }, {
      method: 'reLogin',
      args: ['1001']
    })
  } else if (res.data && parseInt(res.data.code) === 1003) {
    timer = setTimeout(() => {
      Indicator.close();
    }, 0);
    return res.data
  } else if (res.data && parseInt(res.data.code) === 1023) {
    // console.log("resData", res.data);
    timer = setTimeout(() => {
      Indicator.close();
    }, 0);
    return res.data
  } else if (res.data && parseInt(res.data.code) === 3008) {
    timer = setTimeout(() => {
      Indicator.close();
    }, 0);
    return res.data;
  } else if (res.data && parseInt(res.data.code) === 3006) {
    timer = setTimeout(() => {
      Indicator.close();
    }, 0)
  } else if (res.data && parseInt(res.data.code) === 3005) {
    timer = setTimeout(() => {
      Indicator.close();
    }, 0);
  } else if (res.data && parseInt(res.data.code) === 1052) {
    Indicator.close();
    return res.data;
  } else if (res.data && parseInt(res.data.code) === 3010) {
    timer = setTimeout(() => {
      Indicator.close();
    }, 0)
  } else if (res.data && parseInt(res.data.code) === 3011) {
    timer = setTimeout(() => {
      Indicator.close();
    }, 0);
    this.$notify({
      message: "未查询到该课程",
      type: 'warning',
      showClose: true
    })
  } else if (res.data && parseInt(res.data.code) === 1010) {
    timer = setTimeout(() => {
      Indicator.close();
    }, 0)
  } else if (res.data && parseInt(res.data.code) === 1012) {
    timer = setTimeout(() => {
      Indicator.close();
    }, 0)
  } else if (res.data && parseInt(res.data.code) === 1011) {
    timer = setTimeout(() => {
      Indicator.close();
    }, 0)
  } else {
    // console.log("1221212");
    timer = setTimeout(() => {
      Indicator.close();
    }, 0);
    // MessageBox({
    //   message: res.data.msg,
    //   showClose: true,
    //   type: 'error'
    // })
    mui.alert(`${res.data.msg}`, "提醒", () => {
    })
  }
  return res.data
}, error => {
  timer = setTimeout(() => {
    Indicator.close();
  }, 0);
  let errorInfo = error;
  return Promise.reject(errorInfo)
});
function getQueryString(str) {
  let url = window.location.toString();
  let arrObj = url.split("?");
  if (arrObj.length > 1) {
    let arrPara = arrObj[1].split("&");
    let arr;
    for (let i = 0; i < arrPara.length; i++) {
      arr = arrPara[i].split("=");
      if (arr != null && arr[0] == str) {
        return arr[1];
      }
    }
    return "";
  } else {
    return "";
  }
}
export default axios;
