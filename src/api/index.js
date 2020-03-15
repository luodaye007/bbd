import Axios from 'axios';
import router from '../router';
import { ip } from '../config/index';
import { Toast } from 'vant';
import vuex from '../store';

//导入网络请求模块
import baseRequest from './base';
import concernRequest from './concern';
import gameRequest from './game';
import equipmentRequest from './equipment';
import commentRequest from './comment';

//Axios.defaults.withCredentials = true; //让ajax携带cookie

export let instance = Axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? ip : ip,
    timeout: 2500
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

export default instance;

export { baseRequest, concernRequest, gameRequest, equipmentRequest, commentRequest };