import {
  $Toast
} from '../../static/base/index'
// 发起 HTTPS 网络请求
export const request = obj =>{ 
  return new Promise((resolve, reject) => {
  let url = 'http://dev01.fcadx-inc.cn:8082'
  // 显示加载图标
  wx.showLoading({
    title: '加载中',
  });
  return wx.request({
    url: url + obj.url,
    data: obj.data,
    header: { ...obj.header
    },
    method: obj.method,
    success(res) {
      wx.hideLoading(); //隐藏加载图标
      resolve(res.data)
    },
    fail(e) {
      wx.hideLoading(); //隐藏加载图标
      console.log(e)
      reject(e)
    }
  })
})
}
// 获取存储数据
export const getStorage = theKey => new Promise((resolve, reject) => {
  wx.getStorage({
    key: theKey,
    success(res) {
      resolve(res.data)
    },
    fail(e) {
      reject(e)
    }
  })
})
// 设置存储数据
export const setStorage = (theKey, theValue) => new Promise((resolve, reject) => {
  wx.setStorage({
    key: theKey,
    data: theValue,
    success() {
      resolve()
    },
    fail(e) {
      reject(e)
    }
  })
})
// 获取位置信息
export const getLocation = () => new Promise((resolve) => {
  wx.getLocation({
    success({
      latitude,
      longitude,
      speed,
      accuracy
    }) {
      resolve({
        latitude,
        longitude,
        speed,
        accuracy
      })
    },
    fail() {
      resolve({
        latitude: -999,
        longitude: -999
      })
    }
  })
})
// 文件上传
export const uploadFile = (obj) => new Promise((resolve, reject) => {
  wx.uploadFile({
    ...obj,
    success(res) {
      resolve(res)
    },
    fail(e) {
      reject(e)
    }
  })
})
/**
 * 格式化日期时间
 * @params
 * 1.  timeStamp => 时间戳 *
 */
export const formatDate = (timeStamp) => {
  let d = new Date(timeStamp * 1000)
  let data = d.getFullYear() + '/' + cover(d.getMonth() + 1) + '/' + cover(d.getDate());
  let time = +cover(d.getHours()) + ':' + cover(d.getMinutes())
  return {
    data: data,
    time: time
  }
}
/**
 * 补足两位数
 * @return String
 */
export const cover = (number) => {
  number = number + ''
  return number.length < 2 ? '0' + number : number
}
/**
 * Toast提示信息 
 * success error warning loading icon 内置图标
 */
export const Toast = (content, type) => {
  $Toast({
    content: content,
    type: type
  });
}
/**
 * 判断用户是否登录
 * @params url登录后跳转的地址
 */
export const userPermissions = (url) => {
  // 获取用户信息
  getStorage('user')
    .then(data => {
      // 成功跳转
      wx.navigateTo({
        url: url,
      });
    }).catch(e => {
      // 跳转欢迎页
      wx.navigateTo({
        url: '../welcome/main',
      });
    });
}
