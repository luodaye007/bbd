import instance from '../index';

export default {
    changeLocation: (lat, lng) => {
        return instance({
            method: 'get',
            url: `/base/getLocation?lat=${lat}&lng=${lng}`
        })
    }
};