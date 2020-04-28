import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // },
  // {
  //   path:"/myStudy",
  //   name:"myStudy",
  //   component:()=> import(/* webpackChunkName: "myStudy" */ '../pages/myStudy')
  // },
  // {
  //   path:"/studyCourse/:id",
  //   name:"studyCourse",
  //   component:()=> import('../pages/studyCourse')
  // },
  {
    path: "/question/:examId/:examCode/:examName/:lessonId/:fromName",
    name: "question",
    component: () => import(/* webpackChunkName: "question" */ '../pages/question')
  },
  {
    path:"/evaluation/:lessonId/:fromName",
    name:"evaluation",
    component:()=> import(/* webpackChunkName: "evaluation" */ '../pages/evaluation')
  },
  {
    path: '/courseBrief/:lessonId/:fromName',
    name: 'courseBrief',
    component: () => import(/* webpackChunkName: "courseBrief" */ '../pages/courseBrief')
  },
  {
    path: '/carouse/:lessonId/:fromName',
    name: 'carouse',
    component: () => import(/* webpackChunkName: "carouse" */ '../pages/carouse')
  },
  {
    path: '/viewParsing/:answerId/:examId/:lessonId/:fromName',
    name: 'viewParsing',
    component: () => import(/* webpackChunkName: "viewParsing" */ '../pages/viewParsing')
  },
  {
    path: '/collageCourse',
    name: 'collageCourse',
    component: () => import(/* webpackChunkName: "collageCourse" */ '../pages/collageCourse')
  },
  {
    path: '/rankList',
    name: 'rankList',
    component: () => import(/* webpackChunkName: "rankList" */ '../pages/rankList')
  },
//  已学课程，我的收藏，学霸排行榜，正在学习更多，为你推荐更多
  {
    path: '/myCollect',
    name: 'myCollect',
    component: () => import(/* webpackChunkName: "myCollect" */ '../pages/myCollect/myCollect')
  },
  {
    path: '/hasStudy',
    name: 'hasStudy',
    component: () => import(/* webpackChunkName: "hasStudy" */ '../pages/hasStudy/hasStudy')
  },
  {
    path: '/moreLearning',
    name: 'moreLearning',
    component: () => import(/* webpackChunkName: "moreLearning" */ '../pages/moreLearning/moreLearning')
  },
  {
    path: '/moreRecommend',
    name: 'moreRecommend',
    component: () => import(/* webpackChunkName: "moreRecommend" */ '../pages/moreRecommend/moreRecommend')
  },
]
const router = new VueRouter({
  // mode: 'history',
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
});
export default router
