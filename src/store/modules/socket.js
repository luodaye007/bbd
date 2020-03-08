// 导入 types.js 文件
import types from "@/store/types";
import router from '@/router';
import { Toast } from 'vant';

const state = {
    socketState: false,
    chat_list: JSON.parse(window.localStorage.getItem('chat_list')) || [],
    comment_list: JSON.parse(window.localStorage.getItem('comment_list')) || []
}

// 定义 getters
var getters = {
    //主页上未读数量
    unread_num(state) {
        let count = 0;
        for (var i = 0; i < state.chat_list.length; i++) {
            count += state.chat_list[i].unread_num || 0;
        }
        return count;
    },
    unread_comment_num(state) {
        let count = 0;
        for (var i = 0; i < state.comment_list.length; i++) {
            if (state.comment_list[i].unread) {
                count++;
            }
        }
        return count;
    }
}

const mutations = {
    socket_connect(state) {
        console.log("连接成功");
        state.socketState = true;
    },
    socket_reconnect(state, data) {
        console.log("重新连接" + data);
    },
    socket_disconnect(state) {
        console.log("断开连接");
        state.socketState = false;
    },
    socket_res(state, data) {
        //监听message事件，方法是后台定义和提供的
        console.log("res啊", data);
    },
    socket_connect_deny() {
        console.log('token失效');
        this.dispatch('logOut').then(() => {
            router.push({ name: 'Login' });
            Toast.fail('验证失败');
        })
    },
    socket_accept_offline_msg(state, data) {
        //转化为map避免双重循环
        //type为comment的是新的评论 要区分
        let chatMessage = {};
        data.forEach(item => {
            let itemData = JSON.parse(item);
            //取出所有的新消息
            if (itemData.type === 'comment') {
                itemData.unread = true;
                state.comment_list.unshift(itemData);
            } else {
                //取出所有的聊天消息 以key-value形式保存 避免双重数组循环 判断key相同的就把这些消息插入到数组末端
                if (chatMessage['msg_' + itemData.send_info.username]) {
                    chatMessage['msg_' + itemData.send_info.username].push(itemData);
                } else {
                    chatMessage['msg_' + itemData.send_info.username] = [];
                    chatMessage['msg_' + itemData.send_info.username].push(itemData);
                }
            }
        })

        state.chat_list.forEach(item => {
            //聊天列表存在此聊天者的窗口
            if (chatMessage['msg_' + item.username]) {
                //找到key相同的就插入数组末端，并且设置未读信息条目
                item.chat_list = item.chat_list.concat(chatMessage['msg_' + item.username]);
                item.unread_num += chatMessage['msg_' + item.username].length;
                delete chatMessage['msg_' + item.username];
            }
        })

        //剩下的都是没有聊天窗口的 需要另开窗口
        for (let key in chatMessage) {
            let obj = {};
            let message = chatMessage[key];
            obj.avatar = message[0].send_info.avatar;
            obj.username = message[0].send_info.username;
            obj.nickname = message[0].send_info.nickname;
            obj.tag = message[0].send_info.tag;
            obj.unread_num = message.length;
            obj.chat_list = message;
            state.chat_list.unshift(obj);
        }
    },
    socket_client_receive_msg(state, data) {
        //判断当前用户所在的页面是否是当前聊天用户的页面 如果是则未读信息不加1
        //console.log(router.currentRoute.query)
        let flag = false;
        if (router.currentRoute.name == "SoloChat" && router.currentRoute.query.username == data.send_info.username) { //接受过来的信息时刻 用户正在此接收人的聊天窗内
            flag = true;
        }

        for (var i = 0; i < state.chat_list.length; i++) {
            if (state.chat_list[i].username == data.send_info.username) { //如果已经存在聊天对话框
                if (!flag) {
                    state.chat_list[i].unread_num++;
                }
                state.chat_list[i].chat_list.push(data);
                return;
            }
        }

        //如果没有找到则是不存在此窗口 则另开一个窗口
        let obj = {};
        obj.avatar = data.send_info.avatar;
        obj.username = data.send_info.username;
        obj.nickname = data.send_info.nickname;
        obj.tag = data.send_info.tag;
        obj.unread_num = 1;
        obj.chat_list = [data];
        state.chat_list.unshift(obj);

    },
    socket_client_receive_comment(state, data) {
        data.unread = true;
        state.comment_list.unshift(data);
    },
    socketStateChange(state, bol) {
        state.socketState = bol;
    },
    [types.CHANGE_CHAT_LIST_TYPE](state, data) {
        //删除聊天窗口 再置顶
        let chatRecord = [];
        for (var i = 0; i < state.chat_list.length; i++) {
            if (state.chat_list[i].username == data.userInfo.username) {
                //保存聊天记录
                chatRecord = state.chat_list[i].chat_list;
                state.chat_list.splice(i, 1);
                break;
            }
        }
        if (data.type == 'add') {
            // if (chatRecord.length == 0) {
            //     chatRecord.push({ send_id: window.localStorage.getItem('username'), receive_id: data.userInfo.username, msg: '你好呀~', time: new Date() });
            // }

            data.userInfo.chat_list = chatRecord;
            data.unread_num = 0;
            state.chat_list.unshift(data.userInfo);
        }
    },
    chat_change(state) {
        //有时候记录不会同步 需要commit
        state.chat_list = JSON.parse(JSON.stringify(state.chat_list));
    },
    clear_unread_num(state, index) { //根据数据下标，用户点进去聊天页面 清空与该用户所有的未读信息
        state.chat_list[index].unread_num = 0;
    },
    clear_message_unread(state, index) {
        state.comment_list[index].unread = false;
    }
}

const actions = {

}

// 最后统一导出
export default {
    state,
    getters,
    actions,
    mutations
}