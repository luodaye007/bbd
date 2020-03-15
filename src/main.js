// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vant from 'vant';
import { Toast } from 'vant';
import { Dialog } from 'vant';
import { Popup } from 'vant';
import { Notify } from 'vant';
import store from '@/store/index';
import VueJsonp from 'vue-jsonp';

import 'vant/lib/index.css';
import '@/assets/iconfont/iconfont.css';
import '@/assets/css/comment.css';

import 'lib-flexible/flexible.js'

import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import { getLocation } from './utils';

//import BaiduMap from 'vue-baidu-map'

// Vue.use(BaiduMap, {
//     // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
//     ak: 'UNRqzAEfScUXElfIq8iFOc1XIlvnTUQj'
// })

Vue.use(MuseUI);
Vue.use(VueJsonp);

Vue.config.productionTip = false;

Vue.use(Vant);
Vue.use(Toast);
Vue.use(Dialog);
Vue.use(Popup);
Vue.use(Notify);

getLocation(store, (hasLocation) => {
    if (hasLocation) {//启动应用
        new Vue({
            el: '#app',
            router,
            store,
            components: { App },
            template: '<App/>',
            created: function () {
                console.log('应用启动成功！');
            }
        })
    } else {
        Dialog.alert({
            title: '提示',
            message: '位置获取失败',
            confirmButtonText: '刷新'
        }).then(() => {
            // on close
            router.go(0);
        });
    }
});

/* eslint-disable no-new */
