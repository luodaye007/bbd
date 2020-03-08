import Axios from 'axios';
import router from '../router';
import Qs from 'qs';
import { ip } from '../config/index';
import { Toast } from 'vant';
import vuex from '../store';

//Axios.defaults.withCredentials = true; //让ajax携带cookie

export let instance = Axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? ip : ip
})

let token = window.localStorage.getItem('token');
if (token !== null) {
    instance.defaults.headers.common['Authorization'] = token;
    instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
}

// respone拦截器 后端返回401代表token无效或者过期
instance.interceptors.response.use(
    response => {
        return response
    },
    error => {
        if (error.response.status == 401) {
            Toast.fail(error.response.data.msg);
            vuex.dispatch("logOut").then(() => {
                router.push({ name: 'Login' })
            })
        }
        if (error.response.status == 422) {
            Toast.fail('参数错误');
        }
        return Promise.reject(error.response)
    }
)

export const login = data => { //登录
    return instance({
        method: 'post',
        url: 'base/login',
        data: Qs.stringify(data)
    });
}

export const register = data => { //注册
    return instance({
        method: 'post',
        url: 'base/register',
        data: Qs.stringify(data)
    });
}



export const getUserInfo = username => { //登录获取用户信息
    return instance({
        method: 'get',
        url: '/user/' + username,
    })
}

export const uploadAvatar = formData => { //上传头像
    return instance({
        method: 'post',
        url: '/user/avatar',
        data: formData
    })
}

export const updateUserInfo = userInfo => { //更新用户信息
    return instance({
        method: 'put',
        url: '/user/' + userInfo.username,
        data: Qs.stringify(userInfo),
    })
}

export const checkReset = data => { //重置密码
    return instance({
        method: 'put',
        url: '/user/checkReset',
        data: Qs.stringify(data),
    })
}

export const reset = data => { //重置密码
    return instance({
        method: 'put',
        url: '/user/reset',
        data: Qs.stringify(data),
    })
}

export const addGame = data => {
    return instance({
        method: 'post',
        url: '/game',
        data: Qs.stringify(data),
    })
}

export const getGame = (page, district, game_type, duration, game_part, orientation, rate, chargeable, keyword) => {
    return instance({
        method: 'get',
        url: `/game?page=${page}&district=${district}&game_type=${game_type}&duration=${duration}&game_part=${game_part}&orientation=${orientation}&rate=${rate}&chargeable=${chargeable}&keyword=${keyword}`
    })
}

export const showGame = game_id => {
    return instance({
        method: 'get',
        url: '/game/' + game_id
    })
}

export const addConcern = data => {
    return instance({
        method: 'post',
        url: '/concern',
        data: Qs.stringify(data)
    })
}

export const delConcern = data => {
    return instance({
        method: 'delete',
        url: '/concern/' + data.username + '?concern_id=' + data.concern_id,
    })
}

export const joinGame = data => {
    return instance({
        method: 'post',
        url: '/game/join',
        data: Qs.stringify(data)
    })
}

export const getUserGame = username => {
    return instance({
        method: 'get',
        url: '/user/game/show?username=' + username
    })
}

export const addEquipment = data => {
    return instance({
        method: 'post',
        url: '/equipment',
        data: data,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const getEquipment = (page, district) => {
    return instance({
        method: 'get',
        url: `/equipment?page=${page}&district=${district}`
    })
}

export const createComment = data => {
    return instance({
        method: 'post',
        url: '/comment',
        data: data
    })
}

export const showComment = username => {
    return instance({
        method: 'get',
        url: '/comment/' + username
    })
}

export const showEquipment = equipment_id => {
    return instance({
        method: 'get',
        url: '/equipment/' + equipment_id
    })
}

export const deleteGame = game_id => {
    return instance({
        method: 'delete',
        url: '/game/' + game_id
    })
}

export const exitGame = (game_id, username) => {
    return instance({
        method: 'put',
        url: '/game/' + game_id + '?username=' + username
    })
}

export const showEquipmentByUsers = username => { //展示该用户的所有商品
    return instance({
        method: 'get',
        url: '/equipment/all?username=' + username
    })
}

export const showConcern = username => {
    return instance({
        method: 'get',
        url: '/concern/' + username
    })
}

export const getGames = username => { //聊天页面获取未开始比赛
    return instance({
        method: 'get',
        url: '/user/games/show?username=' + username
    })
}

export default instance;