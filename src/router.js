import Vue from 'vue'
import Router from 'vue-router'
const login = () => import('./components/body/login')
const user = () => import('./components/body/user')
const student = () => import('./components/body/student')
const teacher = () => import('./components/body/teacher')
const err = () => import('./components/body/err')

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: login
    },
    {
      path: '/user',
      component: user,
      children: [
        {
          path: '/user/student/:id',
          component: student
        },
        {
          path: '/user/teacher/:id',
          component: teacher
        }
      ]
    },
    {
      path: '/err',
      component: err
    },
    {
      path: '*',
      redirect: '/err'
    }
  ]
})
