import instance from '../index';
import Qs from 'qs';

export default {
    addConcern: data => {
        return instance({
            method: 'post',
            url: '/concern',
            data: Qs.stringify(data)
        })
    },
    delConcern: data => {
        return instance({
            method: 'delete',
            url: '/concern/' + data.username + '?concern_id=' + data.concern_id,
        })
    },
    showConcern: username => {
        return instance({
            method: 'get',
            url: '/concern/' + username
        })
    }
};




