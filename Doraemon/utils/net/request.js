import config from '../config';
const util = require('../util.js')
import md5 from '../md5';

class Request {
  constructor() {
    this.productId = config.productId;
    this.productVersion = config.productVersion;
    this.time = Date.now();
    this.uuid = util.genUUid();
    this.secret = "cccccccccccccccccccccccccccccccc";
    this.token = wx.getStorageSync('token')
  }
  request(params) {
    //基础参数，每次调用都会传入
    let data = {
      productId: params.productId || this.productId,
      productVersion: params.productVersion || this.productVersion,
      time: this.time,
      uuid: this.uuid,
      sign: md5.hex_md5(this.secret + this.sign()),
      token: this.token || null
    }

    params.url = config.whost + params.url;

    let header = null;

    if (params.method == 'GET') {
      header = { "Content-Type": "application/json" }
    } else {
      header = { "Content-Type": "application/x-www-form-urlencoded" }
    }

    //支持自定义传header
    if (params.header) {
      header = params.header
    }
    header = Object.assign(data, header);
    
    return new Promise((resolve, reject) => {
      wx.request({
        url: params.url,
        method: params.method || 'GET',
        ...params,
        header,
        success: function (res) {
          if (res.statusCode == 502 || res.statusCode == 404 || res.statusCode == 400) {
            wx.showToast({
              title: '请求失败',
              icon: 'none'
            })
          }
          return resolve(res);
        },
        fail: function (rej) {
          if (rej.errMsg.indexOf('timeout') >= 0) {
            wx.showToast({
              title: '请求超时',
            })
          }
          if (rej.errMsg.indexOf('fail') >= 0) {
            wx.getNetworkType({
              success: function (res) {
                // 返回网络类型, 有效值：
                // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
                let networkType = res.networkType
                if (networkType === "none") {
                  wx.showToast({
                    title: '网络无法链接',
                    icon: 'none'
                  })
                } else {
                  wx.showToast({
                    title: '请求失败',
                    icon: 'none'
                  })
                }
              }
            })
          }
          return reject(rej)
        },
        complete: function () {
          wx.hideLoading();
        }
      })
    })
  }
  sign() {
    return `productId_${this.productId}*productVersion_${this.productVersion}*time_${this.time}*uuid_${this.uuid}`;
  }
}

//统一处理成请求类型的方式请求
['GET', 'POST', 'HEAD', 'DELETE', 'PUT'].forEach((item) => {
  let method = item.toLowerCase();
  Request.prototype[method] = function (params = {}) {
    return new Request().request({ method: item, ...params });
  }
})

let request = new Request();
export default request;
