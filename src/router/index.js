import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import ShowDetail from '../views/ShowDetail.vue'
import Order from '../views/Order.vue'
import UserCenter from '../views/UserCenter.vue'
import Category from '../views/Category.vue'
import {Message} from "element-ui";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    {
        path: '/show/:id',
        name: 'ShowDetail',
        component: ShowDetail,
        meta: {requiresAuth: true}
    },
    {
        path: '/order',
        name: 'Order',
        component: Order,
        meta: {requiresAuth: true}
    },
    {
        path: '/user',
        name: 'UserCenter',
        component: UserCenter,
        meta: {requiresAuth: true}
    },
    {
        path: '/category',
        name: 'Category',
        component: Category
    }
]

const router = new VueRouter({
    routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
    const token = sessionStorage.getItem('token')
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!token) {
            Message.warning('请先登录！')
            next('/login')
        } else {
            next()
        }
    } else {
        next()
    }
})

export default router
