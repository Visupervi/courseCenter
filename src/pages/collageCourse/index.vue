<template>

  <div class="collageCourse">
    <!--头部信息-->
    <!--<Header :title="headTitle" @childFn="parentFn"></Header>-->
    <div class="touchWrap">
<!--    <v-touch @swipeleft="touchLeft" class="touchWrap" @swiperight="touchRight" tag="div"  @swipedown="touchDown" :swipe-options="{direction: 'horizontal'}">-->
      <search v-if="" @getSearchVal="searchVal" :urlFlag="selecData.flag" :title="headTitle"></search>
<!--      <treeSelect v-if="!isShowList" @getTreeSelect="getSelectVal" :sosoVal="sosoVal"-->
<!--                  :selectData="selecData"></treeSelect>-->
      <condition-component v-if="!isShowList" @getTreeSelect="getSelectVal" :sosoVal="sosoVal"
                  :selectData="selecData"></condition-component>
      <courseList v-if="isShowList && selecData.typeId !== ''" :selecData="selecData"></courseList>
<!--    </v-touch>-->
    </div>
    <!--@getSendData='getMsgFormSon'-->
  </div>

</template>

<script>
  /**
   * @Author Visupervi
   * @date 2020/3/30 15:52
   * @param
   * @return
   *
   */
  import {communicationWithNative,addEventBack} from '../../service/superGuide';
  import search from '../../components/search/search';
  import treeSelect from '../../components/treeSelect/treeSelect';
  import Header from '../../components/header';
  import courseList from '../../components/courseList/courseList';
  import tabSelect from "../../components/tabSelect/tabSelect";
  import conditionComponent from "../../components/conditionComponent/conditionComponent";
  import {androidHandler} from '../../service/inputUp';
  import {routerSwitch} from '../../service/routerSwitch'
  let routerName = "collageCourse";
  export default {
    inject: ['reload'],
    name: "collageCourse",
    data() {
      return {
        sosoVal: "",
        headTitle: "中心课程",
        isShowList: false,
        selecData: {
          typeId: 0,
          text: "",
          updateTime: "",
          contentType: "",
          studyFlag: "",
          browserNum: "",
          flag: "1",
          routeName: routerName,
        }
      }
    },
    created() {
      // androidHandler();
      this.hideNativeHeder();
    },
    beforeRouteEnter(to, from, next) {
      // console.log("Collagefrom",from.name);
      next();
    },
    beforeRouteLeave(to, from, next) {
      // location.reload();
      if (to.name === "carouse") {
        next();
        // routerSwitch("collageCourse", this.$router,"beforeRouteLeave");
      } else {
        next();
      }
    },
    mounted() {
      if (this.$route.name === "collageCourse") {
        console.log("this back");
        window.addEventListener('popstate',this.addEventBack,false)
      }
    },
    methods: {
      touchLeft() {
        routerSwitch("collageCourse", this.$router, "touchRight");
      },
      touchRight() {
        routerSwitch("collageCourse", this.$router, "touchRight");
      },
      touchDown(){

      },
      //监听返回键函数
      addEventBack(){
        history.pushState(null, null, document.URL);
      },
      //获取子组件的传值
      parentFn(flag) {
        if (!flag) {
          clearInterval(this.timer);
        }
      },
      //获取竖向菜单值
      getSelectVal(data) {
        if(data.typeId !== ""){
          this.selecData = data;
          this.isShowList = false;
        }else if(data.text !== ""){
          this.isShowList = true;
        }else {
          this.isShowList = false;
        }
        // this.reload();
      },
      //获取serch组件输入的值传给treeSelect组件，可以使用bus与Vuex改进
      searchVal(val) {
        console.log("data", val);
        this.sosoVal = val;
        if (val !== "") {
          this.isShowList = true;
          this.selecData.text = val;
        } else {
          this.isShowList = false;
        }
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
      treeSelect,
      Header,
      courseList,
      tabSelect,
      conditionComponent
    },
    // beforeDestroy() {
    //   window.removeEventListener("popstate",this.addEventBack,false)
    // }
  }
</script>

<style scoped lang="less">
  .collageCourse {
    height: 100%;
    overflow: hidden;
    /*padding-top: 0.275rem;*/
    .touchWrap {
      touch-action: pan-y !important;
    }
  }
</style>
