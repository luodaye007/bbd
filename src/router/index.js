import Vue from 'vue'
import Router from 'vue-router'
//import HelloWorld from '@/components/HelloWorld'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import vuex from '@/store'

//NProgress.configure({ showSpinner: false });

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

const router = new Router({
    routes: [{
        path: '/',
        name: 'Game',
        component: resolve => require(['@/view/tabbar/game/Game'], resolve),
        meta: {
            requiresAuth: false,
            VanTabbar: true,
            keepAlive: true
        }
    }, {
        path: '/equipment',
        name: 'Equipment',
        component: resolve => require(['@/view/tabbar/equipment/Equipment'], resolve),
        meta: {
            requiresAuth: false,
            VanTabbar: true,
            keepAlive: true
        }
    }, {
        path: '/equipment/show',
        name: 'ShowEquipment',
        component: resolve => require(['@/view/tabbar/equipment/show/ShowEquipment'], resolve),
        meta: {
            requiresAuth: false,
            VanTabbar: false,
            keepAlive: false
        }
    }, {
        path: '/communicate',
        name: 'Communicate',
        component: resolve => require(['@/view/tabbar/communicate/Communicate'], resolve),
        meta: {
            requiresAuth: true,
            VanTabbar: true,
            keepAlive: true
        },
        beforeEnter(to, from, next) {
            //解决聊天列表第一句消息不同步
            vuex.commit("chat_change");
            next();
        }
    }, {
        path: '/mine',
        name: 'Mine',
        component: resolve => require(['@/view/tabbar/mine/Mine'], resolve),
        meta: {
            requiresAuth: true,
            VanTabbar: true,
            keepAlive: true
        }
    }, {
        path: '/mine/login',
        name: 'Login',
        component: resolve => require(['@/view/tabbar/mine/login/Login'], resolve),
        meta: {
            requiresAuth: false,
            VanTabbar: false
        },
        beforeEnter: (to, from, next) => {
            let token = window.localStorage.getItem('token');
            if (token !== null) {
                next('/mine');
            } else {
                next();
            }
        }
    }, {
        path: '/mine/register',
        name: 'Register',
        component: resolve => require(['@/view/tabbar/mine/register/Register'], resolve),
        meta: {
            requiresAuth: false,
            VanTabbar: false
        }
    }, {
        path: '/mine/retrievePassword',
        name: 'RetrievePassword',
        component: resolve => require(['@/view/tabbar/mine/retrievePassword/RetrievePassword'], resolve),
        meta: {
            requiresAuth: false,
            VanTabbar: false
        }
    }, {
        path: '/mine/retrievePassword/changePass',
        name: 'ChangePass',
        component: resolve => require(['@/view/tabbar/mine/retrievePassword/changePass/ChangePass'], resolve),
        meta: {
            requiresAuth: false,
            VanTabbar: false
        }
    }, {
        path: '/mine/userInfo',
        name: 'UserInfo',
        component: resolve => require(['@/view/tabbar/mine/list/UserInfo'], resolve),
        meta: {
            requiresAuth: true,
            VanTabbar: false
        }
    }, {
        path: '/game/add',
        name: 'AddGame',
        component: resolve => require(['@/view/tabbar/game/add/AddGame'], resolve),
        meta: {
            requiresAuth: true,
            VanTabbar: false
        }
    }, {
        path: '/game/show',
        name: 'ShowGame',
        component: resolve => require(['@/view/tabbar/game/show/ShowGame'], resolve),
        meta: {
            requiresAuth: false,
            VanTabbar: false
        }
    }, {
        path: '/game/show/navigation',
        name: 'Navigation',
        component: resolve => require(['@/view/tabbar/game/show/navigation/Navigation'], resolve),
        meta: {
            requiresAuth: true,
            VanTabbar: false
        }
    }, {
        path: '/game/comment/add',
        name: 'GameComment',
        component: resolve => require(['@/view/tabbar/mine/list/Comment/Add'], resolve),
        meta: {
            requiresAuth: true,
            VanTabbar: false
        }
    }, {
        path: '/communicate/solo',
        name: 'SoloChat',
        component: resolve => require(['@/view/tabbar/communicate/solo/SoloChat'], resolve),
        meta: {
            requiresAuth: true,
            VanTabbar: false
        }
    }, {
        path: '/equipment/add',
        name: 'AddEquipment',
        component: resolve => require(['@/view/tabbar/equipment/add/AddEquipment'], resolve),
        meta: {
            requiresAuth: true,
            VanTabbar: false
        }
    }, {
        path: '/mine/game',
        name: 'MineGame',
        component: resolve => require(['@/view/tabbar/mine/list/Game'], resolve),
        meta: {
            requiresAuth: true,
            VanTabbar: false
        }
    }, {
        path: '/mine/comment',
        name: 'CommentShow',
        component: resolve => require(['@/view/tabbar/mine/list/Comment/Show'], resolve),
        meta: {
            requiresAuth: true,
            VanTabbar: false
        }
    }, {
        path: '/mine/message',
        name: 'MineMessage',
        component: resolve => require(['@/view/tabbar/mine/list/Message'], resolve),
        meta: {
            requiresAuth: true,
            VanTabbar: false
        }
    }, {
        path: '/mine/feedback',
        name: 'MineMessage',
        component: resolve => require(['@/view/tabbar/mine/list/Feedback'], resolve),
        meta: {
            requiresAuth: true,
            VanTabbar: false
        }
    }, {
        path: '/mine/equipment',
        name: 'MineEquipment',
        component: resolve => require(['@/view/tabbar/mine/list/Equipment'], resolve),
        meta: {
            requiresAuth: true,
            VanTabbar: false
        }
    }, {
        path: '/mine/concern',
        name: 'MineConcern',
        component: resolve => require(['@/view/tabbar/mine/list/concern/Concern'], resolve),
        meta: {
            requiresAuth: true,
            VanTabbar: false
        }
    }, {
        path: '/mine/concern/userInfo',
        name: 'MineConcernUserInfo',
        component: resolve => require(['@/view/tabbar/mine/list/concern/UserInfo'], resolve),
        meta: {
            requiresAuth: true,
            VanTabbar: false
        }
    }]
})

router.beforeEach((to, from, next) => {
    //判断要去的路由有没有requiresAuth
    NProgress.start();
    const token = window.localStorage.getItem('token');
    if (to.meta.requiresAuth) {
        if (token === null) {
            next({
                path: '/mine/login',
                query: { redirect: to.fullPath }
            })
        } else {
            next();
        }
    } else {
        next();
    }
})

router.afterEach(() => {
    NProgress.done();
})

router.onError((error) => {
    const pattern = /Loading chunk (\d)+ failed/g;
    const isChunkLoadFailed = error.message.match(pattern);
    const targetPath = router.history.pending.fullPath;
    if (isChunkLoadFailed) {
        router.replace(targetPath);
    }
})

export default router