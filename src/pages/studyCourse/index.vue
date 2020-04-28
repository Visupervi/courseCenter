<template>
  <div class="studyCourse">
    <!--头部信心-->
    <van-nav-bar
      title="我的学习"
      left-arrow
      @click-left="onClickLeft"
      ref="header"
    />
    <!--视频插件-->
    <!--<zyPlayer></zyPlayer>-->
    <player :videoUrl="videoUrl" @durationTimeChange="getDurationVideoTime" v-show="videoShow" ref="player"></player>
    <!--<chimeePlayer :videoUrl="videoUrl"></chimeePlayer>-->
    <!--图片插件-->
    <carouse ref="carouse" :imgUrl="imgUrls" @imgChange="getImgIndex" v-if="carouseShow&&imgUrls!==''"></carouse>
    <!--简介-->
    <div class="introduction">
      <p class="title" ref="title">没有坑，就先让自己成为萝卜</p>
      <p class="author" ref="author">
        <span class="name"> Allies Harris  </span>
        <span class="time"> 2019-12-20 00:00</span>
      </p>
      <div class="content" ref="contentHei">
        <p>也志元人较间产期族非却都少技长团实线会划也志元人较间产期族非却都少技长团实线会划也志元人较间产期族非却都少技长团实线会划</p>
        <p>也志元人较间产期族非却都少技长团实线会划也志元人较间产期族非却都少技长团实线会划也志元人较间产期族非却都少技长团实线会划也志元人较间产期族非却都少技长团实线会划也志元人较间产期族非却都少技长团实线会划</p>
        <p>也志元人较间产期族非却都少技长团实线会划也志元人较间产期族非却都少技长团实线会划也志元人较间产期族非却都少技长团实线会划也志元人较间产期族非却都少技长团实线会划</p>
      </div>
    </div>
    <!--闯关按钮-->
    <div class="breakThrough" v-show="buttonShow" ref="btnHei">
      <van-button type="primary" size="large" @click="breakThrough">闯关</van-button>
    </div>
  </div>
</template>

<script>
  import {communicationWithNative,getQueryString} from '../../service/superGuide'
  import player from '../../components/videoPlayer'
  import {getCourseData} from '../../api'
  /**
   * @Author Visupervi
   * @Date 2019/12/16 10:52
   * @Name 课程组件
   * @Param
   * @Return
   * @Description 学习课程参加课程闯关
   */
  export default {
    name: "index",
    data() {
      return {
        // videoUrl: require(""),
        videoImgUrl: "www.baidu.com",
        videoShow: false,
        buttonShow: false,
        carouseShow: false,
        imgUrls: ""
      }
    },
    created() {
      this.getCourseInfo();
      this.hideNativeHeder();

    },
    mounted() {

    },
    methods: {

      //获取教程内容
      async getCourseInfo(){
       let res = await getCourseData({courseId:this.$route.params.id});
       // console.log(res.result.materialId)
       if(res.code === 200){
         if(parseInt(res.result.contentType) === 1){
           this.imgUrls = res.result.materialId.toString();
           this.carouseShow = true;
           this.videoShow = false;
         }else{
           this.carouseShow = false;
           this.videoShow = true;
         }
       }
        // console.log("课程详情",res)
      },
      //  1.获取视频播放时间,是否显示闯关，2.获取缓存进度，是否显示闯关按钮
      getDurationVideoTime(flag) {
        // console.log("子组件传值", flag);
        this.buttonShow = flag;
      },
      //1.获取轮播图播放index 2. 缓存轮播图index
      getImgIndex(flag) {
        // console.log("轮播图子组件传值", flag);
        this.buttonShow = flag;
      },
      //  返回事件
      onClickLeft() {
        // console.log("返回")
      },
      //点击闯关进入闯关页面
      breakThrough(){
        this.$router.replace("/question");
      },
      //隐藏原生头部
      hideNativeHeder(){
        communicationWithNative({
          method: 'hideTitle',
          args: null,
        }, {
          method: 'hideTitle',
          args: []
        })
      }
    },
    components: {
      player,
    }
  }
</script>

<style scoped lang="less">
  .studyCourse {
    height: 100%;
    position: relative;
    /*简介样式处理*/

    .introduction {
      .title {
        font-family: PingFangSC-Semibold;
        font-size: 0.9rem;
        color: #2D2D2D;
        text-indent: 0.75rem;
        margin: 0.45rem 0 0 0;
        user-select: none;
      }

      .author {
        margin: 0 0 0 0;
        text-indent: 0.75rem;
        color: #9B9B9B;
        line-height: 1;
        user-select: none;

        .name, .time {
          font-family: PingFangSC-Regular;
          font-size: 0.6rem;
          color: #9B9B9B;
          user-select: none;
        }
      }

      .content {
        height: 14rem;
        overflow: scroll;

        p {
          margin: 0.25rem 0;
          font-family: PingFangSC-Regular;
          font-size: 0.75rem;
          color: #444444;
          padding: 0 0.25rem;
          text-indent: 1.5rem;
          user-select: none;
        }
      }
    }

    /*闯关按钮样式*/

    .breakThrough {
      position: absolute;
      bottom: 0px;
      width: 100%;
      height: 3rem;
      box-shadow: 0 -5px 10px 0 rgba(0, 0, 0, 0.05);
      user-select: none;

      .van-button--primary {
        background-color: #16B473;
        border: 1px solid #16B473;
        border-radius: 8px;
        line-height: 1.95rem;
        height: 2rem;
        width: 90%;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        user-select: none;
      }
    }
  }
</style>
