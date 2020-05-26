<template>
  <div class="hasStudy">
    <Header :title="headTitle" @childFn="parentFn"></Header>
    <search @getSearchVal="searchVal" :urlFlag="selecData.flag" :title="hasTitle"></search>
    <courseList v-if="selecData" :selecData="selecData"></courseList>
  </div>
</template>

<script>
  import {communicationWithNative, getQueryString, getDeviceInfo} from '../../service/superGuide';
  import Header from '../../components/header';
  import search from '../../components/search/search';
  import courseList from '../../components/courseList/courseList';
  let routeName =  "hasStudy";
  export default {
    name: "hasStudy",
    data() {
      return {
        /**
         * 1：课程中心搜索，2：正在学习，3：已学课程，4：我的收藏，5：为你推荐
         */
        sosoVal: "",
        headTitle: "已学课程",
        hasTitle:"课程已学",
        isShowList: false,
        selecData: {
          typeId: "",
          text: "",
          updateTime: "",
          contentType: "",
          studyFlag: "",
          browserNum: "",
          flag: "3",
          routeName:routeName,
        }
      }
    },
    created() {
      this.hideNativeHeder()
    },
    mounted() {
    },
    methods: {
      //获取子组件的传值
      parentFn(flag) {
        if (!flag) {
          clearInterval(this.timer);
        }
      },
      //获取课程内容
      searchVal(val) {
        // this.sosoVal = data;
        if (true) {
          this.isShowList = true;
          this.selecData.text = val;
          this.$store.commit('addToKeyWords', this.selecData.text);
        } else {
          this.isShowList = false;
        }
      },
      getSearchVal(val) {
        console.log("搜索组件", val);
        this.selecData.text = val;
      },
      //  隐藏原生头部
      hideNativeHeder() {
        communicationWithNative({
          method: 'hideTitle',
          args: null,
        }, {
          method: '',
          args: []
        })
      },
    },
    components: {
      search,
      Header,
      courseList
    }
  }
</script>

<style scoped lang="less">
  .hasStudy {
    height: 100%;
  }
</style>
