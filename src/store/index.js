import Vue from 'vue'
import Vuex from '../vuex'

Vue.use(Vuex)

const module = new Vuex.Store({
  state: {
    amount: 1
  },
  getters: {
    getAmount: (state) => {
      return state.amount + 1
    }
  },
  mutations: {
    amountAdd (state, num) {
      state.amount += num
    }
  },
  actions: {
    amountAddAsync ({commit}, num) {
      setTimeout(() => {
        commit('amountAdd', num)
      }, 1000)
    }
  },
  modules: {
    a: {
      namespace: true,
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
        },
        addAge2 (state, num) {
          state.age += num
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
    },
    b: {
      namespace: true,
      state: {
        userInfo: {
          userName: '到附近的反馈',
          age: 18
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
        c: {
          state: {
            userInfo: {
              userName: '到附近的反馈',
              age: 18
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
          }
        }
      }
    }
  }
})

module.registerModule(['dd'], {
  state: {
    school: '大魔王大学'
  },
  getters: {
    getSchool (state) {
      return state.school
    }
  }
})

export default module
