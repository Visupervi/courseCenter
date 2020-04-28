import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
let currentSelect = JSON.parse(localStorage.getItem('currentSelect') || '[]');
// console.log("currentSelect",currentSelect);
export default new Vuex.Store({
  state: {
    currentSelect: currentSelect //历史记录
  },
  mutations: {
    //添加搜索记录到本地
    addToKeyWords(state, obj) {
      // let flag = false;
      // state.currentSelect.some(item => {
      //   if (item.typeId === obj.typeId) {
      //     flag = true;
      //     return true;
      //   }
      // });
      if(state.currentSelect.length > 0){
        state.currentSelect = [];
        state.currentSelect.push(obj)
      }else{
        state.currentSelect.push(obj)
      }
      // if (!flag) {
      //   state.currentSelect.push(obj);
      // }
      localStorage.setItem('currentSelect', JSON.stringify(state.currentSelect))
    },
    //删除本地搜索记录
    delKeyWords(state) {
      state.hisKeyWords = [];
      localStorage.setItem('currentSelect', JSON.stringify(state.hisKeyWords))
    }
  },
  getters:{
    getStoreKeyWords() {
      return this.state.currentSelect;
    },
  },
  actions: {},
  modules: {}
})
