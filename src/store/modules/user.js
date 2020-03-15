// 导入 types.js 文件
import types from "@/store/types";
import VueSocketIO from 'vue-socket.io'
import Vue from 'vue'
import { ip } from '@/config';
import store from '@/store/index';
import { instance, baseRequest, concernRequest, gameRequest } from '@/api/index.js';

const state = {
    token: '',
    loginStatus: false,
    userInfo: {},
    concern: [],
    location: null
}

// 定义 getters
var getters = {

}

const mutations = {
    [types.LOGINSTATUS](state, status) {
        state.loginStatus = status;
    },
    [types.TOKEN](state, token) {
        state.token = token;
    },
    [types.USERINFO](state, userInfo) {
        state.userInfo = Object.assign(state.userInfo, userInfo);
    },
    [types.CONCERN](state, concern) {
        state.concern = concern;
    },
    [types.CHANGE_CONCERN_NUMBER](state, change_number) {
        state.userInfo.concern_number += change_number;
    },
    [types.CHANGE_GAME_NUMBER](state, change_number) {
        state.userInfo.game_number += change_number;
    },
    [types.LOCATION](state, location) {
        state.location = location;
    }
    // socket_res(state, data) {
    //     console.log(data)
    // }
}

const actions = {
    register({ commit }, info) {
        return new Promise((resolve, reject) => {
            baseRequest.register(info).then(res => {
                if (res.data.code) {
                    commit(types.TOKEN, res.data.token);
                    commit(types.LOGINSTATUS, true);
                    window.localStorage.setItem('token', res.data.token);
                    window.localStorage.setItem('username', info.username);
                    instance.defaults.headers.common['Authorization'] = res.data.token;
                    instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
                }
                resolve(res)
            })
        })
    },
    doLogin({ commit }, info) {
        return new Promise((resolve, reject) => {
            baseRequest.login(info).then(res => {
                if (res.status === 200) {
                    if (res.data.code) {
                        commit(types.TOKEN, res.data.token);
                        commit(types.LOGINSTATUS, true);
                        window.localStorage.setItem('token', res.data.token);
                        window.localStorage.setItem('username', info.username);
                        instance.defaults.headers.common['Authorization'] = res.data.token;
                        instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
                    }
                }
                resolve(res)
            }).catch((error) => {
                reject(error)
            })
        })
    },
    logOut({ commit }) {
        return new Promise((resolve, reject) => {
            commit(types.USERINFO, null)
            commit(types.CONCERN, [])
            commit(types.LOGINSTATUS, false)
            commit(types.TOKEN, '')
            window.localStorage.removeItem('token');
            resolve()
        })
    },
    getUserInfo({ commit }, username) { //获取用户信息 连接socket
        return new Promise((resolve, reject) => {
            baseRequest.getUserInfo(username).then(res => {
                if (res.status === 200) {
                    commit(types.LOGINSTATUS, true);
                    commit('USERINFO', res.data.userInfo);
                    commit('CONCERN', res.data.userInfo.concerns);
                    //拉取信息完成之后再去连接socket
                    if (!store.state.socket.socketState) {
                        Vue.use(new VueSocketIO({
                            debug: true,
                            connection: ip + '?token=' + window.localStorage.getItem('token'),
                            vuex: {
                                store,
                                actionPrefix: 'socket_',
                                mutationPrefix: 'socket_'
                            }
                        }))
                    }
                    //new Vue().$socket.emit("chat", window.localStorage.getItem('token'));
                }
                resolve(res)
            }).catch((error) => {
                reject(error);
            })
        })
    },
    updateUserInfo({ commit }, userInfo) { //更新用户信息
        return new Promise((resolve, reject) => {
            baseRequest.updateUserInfo(userInfo).then(res => {
                if (res.status === 201) {
                    commit('USERINFO', res.data.userInfo);
                }
                resolve(res)
            }).catch((error) => {
                reject(error);
            })
        })
    },
    addConcern({ commit }, data) { //新增关注
        return new Promise((resolve, reject) => {
            concernRequest.addConcern(data).then(res => {
                if (res.status === 201) {
                    state.concern.push(data);
                    commit('CONCERN', state.concern);
                    commit('CHANGE_CONCERN_NUMBER', 1);
                }
                resolve(res)
            }).catch((error) => {
                reject(error);
            })
        })
    },
    delConcern({ commit }, data) { //取消关注
        return new Promise((resolve, reject) => {
            concernRequest.delConcern(data).then(res => {
                if (res.status === 204) {
                    //commit('USERINFO', res.data.userInfo);
                    commit('CONCERN', state.concern.filter(item => item.concern_id !== data.concern_id));
                    commit('CHANGE_CONCERN_NUMBER', -1);
                }
                resolve(res)
            }).catch((error) => {
                reject(error);
            })
        })
    },
    joinGame({ commit }, data) {
        return new Promise((resolve, reject) => {
            gameRequest.joinGame(data).then(res => {
                if (res.status === 201) {
                    //commit('USERINFO', res.data.userInfo);
                    //commit('CONCERN', state.concern.filter(item => item.concern_id == data.concern_id));
                }
                resolve(res)
            }).catch((error) => {
                reject(error);
            })
        })
    },
}

// 最后统一导出
export default {
    state,
    getters,
    actions,
    mutations
}