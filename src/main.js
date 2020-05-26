import './rem/rem';
import Vue from 'vue';
import 'vue-awesome-mui/mui/dist/css/mui.css';
import App from './App.vue';
// import inputUp from './service/inputUp';
import router from './router';
import store from './store';
import './router/beforeRouteLeave';
import Calendar from 'vue-mobile-calendar';
import FastClick from 'fastclick';


// 兼容毒瘤ios的300ms延迟问题
// if ('addEventListener' in document) {
//   document.addEventListener('DOMContentLoaded', () => {
//     FastClick.attach(document.body);
//   }, false);
// }

import {
  Button, Collapse,
  Grid, GridItem,
  CollapseItem, Icon,
  NavBar, Tabbar, Row, Col,
  TabbarItem, List, Cell,
  Swipe, SwipeItem,Lazyload,
  Overlay,Rate,Field,CellGroup,
  Notify,Tab,Tabs,Popup,DatetimePicker,
  Search,TreeSelect,DropdownMenu, DropdownItem,
  PullRefresh
} from 'vant';
import Mui from 'vue-awesome-mui';
import Mint from 'mint-ui'
import "./assets/css/init.less";
import 'mint-ui/lib/style.css'

// import vConsole from 'vconsole';
// const vconsole = new vConsole();
// Vue.use(vconsole);


import VueTouch from 'vue-touch';
VueTouch.config.swip = {
  threshold:50
};
import vueMiniPlayer from 'vue-mini-player'
import 'vue-mini-player/lib/vue-mini-player.css'
Vue.use(vueMiniPlayer)
Vue.use(VueTouch, {name: 'v-touch'});
// import touch from 'vue-directive-touch';
// Vue.use(touch);
Vue.use(Mint);
Vue.use(Calendar);
Vue.use(Button)
  .use(Mui)
  .use(Swipe)
  .use(Rate)
  .use(SwipeItem)
  .use(Lazyload)
  .use(Field)
  .use(Collapse)
  .use(CollapseItem)
  .use(Icon)
  .use(Tabbar)
  .use(Notify)
  .use(CellGroup)
  .use(TabbarItem)
  .use(Row)
  .use(Col)
  .use(Overlay)
  .use(List)
  .use(Cell)
  .use(Grid)
  .use(GridItem)
  .use(NavBar)
  .use(Tab)
  .use(Popup)
  .use(DatetimePicker)
  .use(Search)
  .use(TreeSelect)
  .use(DropdownItem)
  .use(DropdownMenu)
  .use(PullRefresh)
  .use(Tabs);
Vue.config.productionTip = false;
// Vue.prototype.$inputUp = inputUp;
window.eventBus = new Vue();
new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App),
});

