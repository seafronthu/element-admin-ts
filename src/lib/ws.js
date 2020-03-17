/**
 * websocket
 * @param {*} url 连接地址
 * @param {JSON} {reconnect: 重连次数, delay: 重连延迟时间}
 */
function Ws (url, options = {}) {
  if (!(this instanceof Ws)) {
    return new Ws(url, options)
  }
  if (!url) {
    throw new TypeError('The url is required ')
  }
  if (!/^(ws:\/\/)/.test(url)) {
    url = `ws://${url}`
  }
  const { reconnectTimes = 0, reconnectDelay = 5000 } = options
  this.timer = null // 重连计时器
  this.reconnectTimes = reconnectTimes // 重连的次数
  this.currentReconnectTimes = reconnectTimes // 当前重连的次数（连上重置）
  this.reconnectStatus = false // 是否是自动重连
  this.reconnectDelay = reconnectDelay // 重连间隔
  this.connectTimes = 1
  this.activeCloseureStatus = false // 是否为主动关闭 默认不是
  this.url = url
  this.init({ connectTimes: this.connectTimes })
}
// const listensArr = ['open', 'message', 'error']
// 初始化
Ws.prototype.init = function (options = {}) {
  const {
    connectTimes
  } = options
  this.webSocket = new WebSocket(this.url)
  // listensArr.forEach(v => {
  //   this.webSocket.addEventListener(v, this[v].bind(this))
  // })
  this.webSocket.addEventListener('open', (event) => {
    this.activeCloseureStatus = false // 每次开启的时候设置未非主动关闭（防止重连导致问题）
    if (this.readyState === 'OPEN' || this.readyState === 'CONNECTING') {
      clearTimeout(this.timer)
      this.timer = null
      this.currentReconnectTimes = this.reconnectTimes
      this.onopen && this.onopen({ ...event, connectTimes })
    }
  })
  this.webSocket.addEventListener('message', (event) => {
    // data 根据不同的数据类型进行处理
    let data
    if (typeof event.data === 'string') {
      data = JSON.parse(event.data)
      // console.log('Received data string')
    }
    if (event.data instanceof ArrayBuffer) {
      // var buffer = event.data
      // console.log('Received arraybuffer', buffer)
    }
    // if (typeof event.data === 'object') {
    //   data = event.data
    //   console.log('Received data object')
    // }
    this.onmessage && this.onmessage({
      data
    })
  })
  this.webSocket.addEventListener('error', (event) => {
    this.onerror && this.onerror(event)
  })
  this.webSocket.addEventListener('close', (event) => {
    let {
      // currentReconnectTimes,
      // reconnectTimes,
      activeCloseureStatus,
      reconnect,
      reconnectDelay
    } = this
    // if (!activeCloseureStatus) { // 非手动关闭，意外关闭
    //   if (this.currentReconnectTimes-- === reconnectTimes) {
    //     reconnect.apply(this)
    //   } else {

    //   }
    // }
    if (!activeCloseureStatus) { // 非手动关闭，意外关闭 当前从0开始
      if (this.currentReconnectTimes-- > 0) {
        // this.timer = null
        this.reconnectStatus = true
        this.timer = setTimeout(reconnect.bind(this), reconnectDelay)
      }
    }
    this.onclose && this.onclose(event)
  })
  return this
}
Ws.prototype.cbk = function (key) {
  // console.log(this, key, 'cbk')
  return this[key] || function () {}
}
// listensArr.forEach(key => {
//   Ws.prototype[key] = function () { }
// })
// 监听函数
// listensArr.forEach(key => {
//   Ws.prototype[key] = function () {
//     this.cbk(`on${key}`).apply(this, arguments)
//     return this
//   }
// })
// 报错关闭一定会触发
// Ws.prototype.closed = function () {
//   const {
//     reconnectTimes,
//     activeCloseureStatus,
//     reconnect,
//     reconnectDelay,
//     cbk
//   } = this
//   cbk('onclose').apply(this, arguments)
//   if (!activeCloseureStatus && reconnectTimes > 0) {
//     clearTimeout(this.timer)
//     this.timer = null
//     this.timer = setTimeout(reconnect.bind(this), reconnectDelay)
//   }
// }
const eventsArr = ['send', 'close']
// 操作
let operation = {
  close (code, reason) {
    this.activeCloseureStatus = true
    this.webSocket.close(code, reason)
  },
  send (data) {
    if (typeof data === 'object') {
      data = JSON.stringify(data)
    }
    try {
      this.webSocket.send(data)
    } catch (err) {
      this.onerror && this.onerror({
        data: err
      })
    }
  }
}
eventsArr.forEach(key => {
  Ws.prototype[key] = function () {
    let args = arguments
    operation[key].apply(this, args)
    return this
  }
})
Object.defineProperty(Ws.prototype, 'readyState', {
  get () {
    const type = this.webSocket.readyState
    switch (type) {
      case 0:
        return 'CONNECTING'
      case 1:
        return 'OPEN'
      case 2:
        return 'CLOSING'
      case 3:
        return 'CLOSED'
      default:
        return 'NOTCONNECT'
    }
  }
})
Ws.prototype.reconnect = function () {
  if (this.readyState === 'CONNECTING' || this.readyState === 'OPEN') {
    return
  }
  this.init({ connectTimes: this.connectTimes = this.connectTimes + 1 })
}
export default Ws
