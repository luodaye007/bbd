import instance from '../index';

export default {
    createComment: data => {
        return instance({
            method: 'post',
            url: '/comment',
            data: data
        })
    },
    showComment: username => {
        return instance({
            method: 'get',
            url: '/comment/' + username
        })
    }
};




