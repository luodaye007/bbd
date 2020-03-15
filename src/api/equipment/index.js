import instance from '../index';

export default {
    addEquipment: data => {
        return instance({
            method: 'post',
            url: '/equipment',
            data: data,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },
    getEquipment: (page, district) => {
        return instance({
            method: 'get',
            url: `/equipment?page=${page}&district=${district}`
        })
    },
    showEquipment: equipment_id => {
        return instance({
            method: 'get',
            url: '/equipment/' + equipment_id
        })
    },
    showEquipmentByUsers: username => { //展示该用户的所有商品
        return instance({
            method: 'get',
            url: '/equipment/all?username=' + username
        })
    }
};




