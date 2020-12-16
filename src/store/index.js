import Vue from 'vue'
import Vuex from '../vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {
      userName: '刘氏杜邦',
      age: 14
    }
  },
  getters: {
    getUserName: (state) => {
      return state.userInfo.userName
    }
  },
  mutations: {
    setUserName (state, name) {
      state.userInfo.userName = name
    }
  },
  actions: {
    setUserName ({commit}, name) {
      setTimeout(() => {
        commit('setUserName', name)
      }, 1000);
    }
  },
  modules: {
  }
})
