let Vue = {}
let forEach = (obj, callBack) => {
  Object.keys(obj).forEach(key => {
    callBack(key, obj[key])
  })
}

class Store {
  constructor(options) {
    this.vm = new Vue({
      data: { // 默认这个状态会被使用Object.defineProperty重新定义,由此达到响应
        state: options.state
      }
    })

    let getters = options.getters
    this.getters = {}
    forEach(getters, (getterName, value) => {
      Object.defineProperty(this.getters, getterName, {
        get: () => {
          return value(this.state)
        }
      })
    })

    // 发布订阅  先订阅（将函数订阅到一个数组上） 后发布（让数组中的函数一次执行）
    let mutations = options.mutations
    this.mutations = {}
    forEach(mutations, (mutationName, value) => {
      // commit订阅
      this.mutations[mutationName] = (payload) => {
        value(this.state, payload)
      }
    })

    let actions = options.actions
    this.actions = {}
    forEach(actions, (actionName, value) => {
      this.actions[actionName] = (payload) => {
        console.log(value, payload)
        value(this, payload)
      }
    })
  }

  commit = (mutationName, payload) => {
    this.mutations[mutationName](payload) // commit发布
  }

  dispatch = (dispatchName, payload) => { // 最后需要做一个监控，看异步方法是不是都在actions中执行，不是在mutaions中执行
    this.actions[dispatchName](payload) // 
  }

  // 获取实例上的state，会执行state
  get state() {
    return this.vm.state // 这个state是被监控，重新定义后的state
  }
}

const install = (_Vue) => {
  Vue = _Vue // _Vue是vue的构造函数，在使用Vue.use的时候会传过来

  Vue.mixin({  // 抽离公共逻辑
    beforeCreate () {
      // 把父组件的store属性放到每个组件实例上
      console.log(this.$options.store)
      if (this.$options.store) {
        this.$store = this.$options.store
      } else {
        this.$store = this.$parent && this.$parent.$store
      }
    },
    mounted () {
      console.log(this.$store)
    }
  })
}

export default {
  Store,
  install
}