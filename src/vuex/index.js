let Vue = {}
let forEach = (obj, callBack) => {
  Object.keys(obj).forEach(key => {
    callBack(key, obj[key])
  })
}

class ModuleCollection {
  constructor (options) {
    // 深度遍历将所有的子模块都遍历一遍
    this.register([], options)
  }

  register (path, rootModule) {
    console.log('register =>>> ', path, rootModule)
    let rawModule = {
      _row: rootModule,
      _children: {},
      state: rootModule.state
    }

    if (!this.root) {
      this.root = rawModule
    } else {
      let parentModule = path.slice(0, -1).reduce((root, current) => {
        return root._children[current]
      }, this.root)

      parentModule._children[path[path.length - 1]] = rawModule
    }

    if (rootModule.modules) {
      forEach(rootModule.modules, (moduleName, module) => {
        this.register(path.concat(moduleName), module)
      })
    }
  }
}

function installModule (store, rootState, path, rawModule) {
  if (path.length > 0) {
    // 给根状态定义模块的state
    // debugger;
    // 若是子模块， ['moduleA'], 则会在根山添加moduleA,
    /*
    state: {
      userName: '小老虎',
      moduleA: {}
    }
    */
    let parentState = path.slice(0, -1).reduce((root, current) => {
      return rootState[current]
    }, rootState)
    console.log(parentState, path[path.length - 1], rawModule)
    Vue.set(parentState, path[path.length - 1], rawModule.state)
  }

  // 定义getters
  // console.log(rawModule)
  let getters = rawModule._row.getters
  console.log(rawModule)
  if (getters) {
    forEach(getters, (getterName, value) => {
      Object.defineProperty(store.getters, getterName, {
        get: () => {
          return value(rawModule.state) // 模块中的状态
        }
      })
    })
  }

  // 定义mutations
  let mutations = rawModule._row.mutations
  /*
  mutaions的结构
    {
      fn1() {},
      fn2() {}
    }
  */
  if (mutations) {
    forEach(mutations, (mutationName, value) => { // [fn,fn]订阅
      let arr = store.mutations[mutationName] || (store.mutations[mutationName] = [])
      arr.push((payload) => {
        value(rawModule.state, payload)
      })
    })
    console.log(store.mutations)
  }

  // 定义actions
  let actions = rawModule._row.actions
  if (actions) {
    forEach(actions, (actionName, value) => {
      let arr = store.actions[actionName] || (store.actions[actionName] = [])
      arr.push((payload) => {
        value(store, payload)
      })
    })
  }

  if(rawModule._children) {
    forEach(rawModule._children, (moduleName, rawModule) => {
      installModule(store, rootState, path.concat(moduleName), rawModule)
    })
  }
}

class Store {
  constructor(options) {
    this.vm = new Vue({
      data: { // 默认这个状态会被使用Object.defineProperty重新定义,由此达到响应
        state: options.state
      }
    })

    this.getters = {}
    this.mutations = {}
    this.actions = {}

    this.modules = new ModuleCollection(options)
    // console.log('modules => ', this.modules)
    installModule(this, this.state, [], this.modules.root)
  }

  commit = (mutationName, payload) => {
    console.log(mutationName, payload, this.mutations)
    this.mutations[mutationName].forEach((fn) => {
      console.log(fn)
      fn(payload)
    }) // commit发布
  }

  dispatch = (dispatchName, payload) => { // 最后需要做一个监控，看异步方法是不是都在actions中执行，不是在mutaions中执行
    this.actions[dispatchName].forEach(fn => {
      fn((payload))
    }) // 
  }

  // 获取实例上的state，会执行state
  get state() {
    return this.vm.state // 这个state是被监控，重新定义后的state
  }

  // 动态注册模块
  registerModule  = (moduleName, module) => {
    if (!Array.isArray(moduleName)) {
      this.modules.register([moduleName], module)
    } else {
      this.modules.register(moduleName, module)
    }
    
    console.log([moduleName], this.modules.root._children[moduleName])
    installModule(this, this.state, [moduleName], this.modules.root._children[moduleName])
  }

}

const install = (_Vue) => {
  Vue = _Vue // _Vue是vue的构造函数，在使用Vue.use的时候会传过来

  Vue.mixin({  // 抽离公共逻辑
    beforeCreate () {
      // 把父组件的store属性放到每个组件实例上
      // console.log(this.$options.store)
      if (this.$options.store) {
        this.$store = this.$options.store
      } else {
        this.$store = this.$parent && this.$parent.$store
      }
    }
  })
}

export default {
  Store,
  install
}