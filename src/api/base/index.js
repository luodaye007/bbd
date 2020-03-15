import instance from '../index';
import Qs from 'qs';

export default {
    login: data => { //登录
        return instance({
            method: 'post',
            url: 'base/login',
            data: Qs.stringify(data)
        });
    },
    register: data => { //注册
        return instance({
            method: 'post',
            url: 'base/register',
            data: Qs.stringify(data)
        });
    },
    getUserInfo: username => { //登录获取用户信息
        return instance({
            method: 'get',
            url: '/user/' + username,
        })
    },
    updateUserInfo: userInfo => { //更新用户信息
        return instance({
            method: 'put',
            url: '/user/' + userInfo.username,
            data: Qs.stringify(userInfo),
        })
    },
    uploadAvatar: formData => { //上传头像
        return instance({
            method: 'post',
            url: '/user/avatar',
            data: formData
        })
    },
    checkReset: data => { //检查重置密码
        return instance({
            method: 'put',
            url: '/user/checkReset',
            data: Qs.stringify(data),
        })
    },
    reset: data => { //重置密码
        return instance({
            method: 'put',
            url: '/user/reset',
            data: Qs.stringify(data),
        })
    }
};




