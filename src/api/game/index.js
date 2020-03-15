import instance from '../index';
import Qs from 'qs';

export default {
    joinGame: data => {
        return instance({
            method: 'post',
            url: '/game/join',
            data: Qs.stringify(data)
        })
    },
    addGame: data => {
        return instance({
            method: 'post',
            url: '/game',
            data: Qs.stringify(data),
        })
    },
    getGame: (page, district, game_type, duration, game_part, orientation, rate, chargeable, keyword) => {
        return instance({
            method: 'get',
            url: `/game?page=${page}&district=${district}&game_type=${game_type}&duration=${duration}&game_part=${game_part}&orientation=${orientation}&rate=${rate}&chargeable=${chargeable}&keyword=${keyword}`
        })
    },
    showGame: game_id => {
        return instance({
            method: 'get',
            url: '/game/' + game_id
        })
    },
    getUserGame: username => {
        return instance({
            method: 'get',
            url: '/user/game/show?username=' + username
        })
    },
    deleteGame: game_id => {
        return instance({
            method: 'delete',
            url: '/game/' + game_id
        })
    },
    exitGame: (game_id, username) => {
        return instance({
            method: 'put',
            url: '/game/' + game_id + '?username=' + username
        })
    },
    getGames: username => { //聊天页面获取未开始比赛
        return instance({
            method: 'get',
            url: '/user/games/show?username=' + username
        })
    }
};




