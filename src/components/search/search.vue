<!--搜索组件-->
<template>
  <div class="search" ref="search">
<!--    <div class="searchIcon" v-if="show">-->
<!--      <span class="mui-icon  mui-icon-arrowleft" @click="setLeftHandler"></span>-->
<!--    </div>-->
<!--    <div class="searchIcon" v-if="this.$route.name === 'collageCourse' && this.value !==''">-->
<!--      <span class="mui-icon  mui-icon-arrowleft" @click="setLeftHandler"></span>-->
<!--    </div>-->
<!--    <div class="moudleName" v-if="!show && this.$route.name !== 'collageCourse'">-->
<!--      {{this.title.substring(2)}}-->
<!--    </div>-->
<!--    <div class="moudleName" v-if="!show&&this.$route.name === 'collageCourse'&&  this.value ==''">-->
<!--      {{this.title.substring(2)}}-->
<!--    </div>-->
    <div class="" style="height: 15px; width: 100%"></div>
    <van-search
      v-model="value"
      shape="round"
      background="#ffffff"
      placeholder="搜索关键字"
      @input="getInputVal"
      @search='searchHandle'
      @focus="focusHandler"
      @blur="focusCancelHandler($event)"
      ref="searchs"
    >
    </van-search>
    <van-popup v-model="show" :get-container="getContainer">
      <div class="hisKey">
        <div class="hisTitle">
          <div>搜索历史</div>
          <div class="delWrap" @click="delHistory">
            <img style="user-select: none;-webkit-user-select: none;" src="../../assets/images/del.svg" alt="">
          </div>
        </div>
        <div class="hisWord">
          <button type="button" class="mui-btn" v-for="(item,index) in hisKeyWords" :key="index"
                  @click="getHisVal(item)">
            {{item.content}}
          </button>
        </div>
      </div>
    </van-popup>
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
  import {getSearchData, saveSearchData, delSearchData} from '../../api';
  import {inputUp} from '../../service/inputUp';
  import {getDeviceInfo} from '../../service/superGuide';
  import {communicationWithNative} from '../../service/superGuide'
  export default {
    props: {
      urlFlag: {
        type: String
      },
      title:{
        type: String
      }
    },
    data() {
      return {
        value: "",
        show: false,
        hisKeyWords: [],
        flag: "",
        isShowModuleName:false,
        searchArrow:""
      }
    },
    created() {
      // androidHandler();
    },
    mounted() {
      // console.log(this.hisWords);
      // this.$inputUp();
    },
    methods: {
      //输入函数
      getInputVal(val) {
        this.value = val;
        this.$refs.search.blur();
        this.value === "" ? this.show = false : this.show = true;
        // this.$emit('getSearchVal', val);
        if(this.value === "" ){
          this.$refs.searchs.querySelector("input").blur();
          this.$emit('getSearchVal', val);
        }else{

        }
        if (this.show) {
          // this.getHisData();
        }
      },
      getHisVal(item) {
        this.value = item.content;
        this.show = false;
        this.$emit('getSearchVal', this.value);
      },
      focusHandler() {
        this.show = true;
        if (getDeviceInfo()) {
          inputUp();
        }
        // androidHandler();
        this.getHisData();
      },
      focusCancelHandler(e) {
        // console.log(e)
        // this.show = false;
      },
      // 弹出层函数
      getContainer() {
        // console.log("挂在函数",document.querySelector(".errorScroll"));
        return this.$refs.search;
      },
      //  删除历史数据
      delHistory() {
        // this.$store.commit('delKeyWords');
        // this.hisKeyWords = [];
        this.delHisData();
        this.hisKeyWords = [];
      },
      //手机点击输入
      searchHandle() {
        //向父组件传值
        // console.log("sdsssdsdsdsdsd");
        this.$emit('getSearchVal', this.value);
        this.show = false;
        this.isShowModuleName = true;
        if (this.value !== ""){
          this.saveHisData();
        } else{

        }
      },
      //保存搜索记录
      saveHisData() {
        saveSearchData({
          flag: this.urlFlag,
          content: this.value
        })
      },
      // 获取搜索记录
      async getHisData() {
        let res = await getSearchData({
          flag: this.urlFlag
        });
        if (parseInt(res.code) === 200) {
          this.hisKeyWords = res.result;
        }
        // console.log("获取搜索记录", res);
      },
      //点击向左箭头
      setLeftHandler(){
        // console.log("点击向左箭头");
        this.value = "";
        this.$emit('getSearchVal', this.value);
        this.show = false;
      },
      // 删除搜索记录
      delHisData() {
        delSearchData({
          flag: this.urlFlag
        })
      },
      setLeftSBHandler(){
        communicationWithNative({
          method: 'finish',
          args: null
        }, {
          method: 'finish',
          args: []
        });
      }
    },
    computed: {
      // hisWords() {
      //   return this.$store.getters.getStoreKeyWords;
      // }
    },
    watch: {
      urlFlag: {
        immediate: true,
        handler(val) {
          // console.log("获取历史记录", val);
          // this.$forceUpdate();
        },
        deep: true
      }
    }
  };
</script>
<style scoped lang="less">
  .search {
    position: relative;
    width: 100%;
    .searchIcon {
      display: flex;
      .mui-icon{
        position: absolute;
        top: 1rem;
        left: -0.3rem;
        font-size: 1.3rem;
        font-weight: 600;
        color: #1989fa;
        z-index: 999;
      }
    }
    .moudleName{
      position: absolute;
      top: 0.7rem;
      left: 1rem;
      font-family: PingFangSC-Medium;
      font-size: .85rem;
      color: #333333;
      min-height: 1rem;
      /*font-weight: 600;*/
    }

  }

</style>
<!--<style src='./search.less' scoped lang="less"></style>-->
