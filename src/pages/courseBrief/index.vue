<template>
  <div class="studyCourse">
    <!--头部信心-->
    <Header :title="headTitle" @childFn="parentFn"></Header>
    <!--视频插件-->
    <div class="videoPlay" v-show="videoShow" ref="videoPlay">
    </div>
    <!--图文展示-->
    <div class="firstImg" v-show="carouseShow">
      <!--<img :src="firstImgUrl" alt="">-->
      <div class="scrollWrap mui-scroll-wrapper" ref="scrollWrap">
        <div class="mui-scroll" ref="carouse" v-html="htmlVal">
          <!--这里放置真实显示的DOM内容-->
        </div>
      </div>
    </div>
    <div class="introduction" v-show="isShowIntro">
      <p class="title" ref="title">{{courseName}}</p>
      <p class="author" ref="author">
        <span class="name">  {{createName}} </span>
        <span class="time">{{createTime.split("T")[0]}} {{createTime.split("T")[1]}}</span>
      </p>
      <div class="content" ref="contentHei">
        <p>{{courseDescription}}</p>
      </div>
    </div>
    <!--<coment-prop :objData="{'propOver':propOver,'isComents':isComents}" @getSendData='getSendData'></coment-prop>-->
    <!--闯关按钮-->
    <div class="breakThrough" v-show="buttonShow" ref="btnHei">
      <van-button v-show="buttonShow" :class="{'noActive':btnShow}" type="primary" size="large"
                  @click="gotoStudy()" :disabled="!btnShow" ref="btnName">{{todoThing}}{{count}}
      </van-button>
      <!--<div class="iconWrap">-->
      <!--<van-icon name="like-o" :class="{'my-van-icon-like':likeFlag}" @click="likeHandler"/>-->
      <!--<van-icon name="star-o" :class="{'my-van-icon-like':collectFlag}" @click="collectHandler"/>-->
      <!--</div>-->
      <!--<van-button class="isHiden" disabled type="primary" size="large" v-show="isCount">开始闯关{{count}}</van-button>-->
    </div>
    <div class="depponLoading">
      <div class="lalaImg">
        <img src="../../assets/images/lala.gif" alt="">
      </div>
    </div>
  </div>
</template>

<script>
  import {communicationWithNative, getQueryString, getDeviceInfo} from '../../service/superGuide'
  import inobounce from 'inobounce'
  // import player from '../../components/videoPlayer'
  import 'dplayer/dist/DPlayer.min.css';
  import DPlayer from 'dplayer';
  import Header from '../../components/header';
  import comentProp from '../../components/comentPropover/comentPropover';
  import {Indicator} from 'mint-ui';
  import {
    getLessonDetail,
    saveBrowserNum,
    getCacheData,
    setCacheData,
    saveHaveLesson,
    getCriticList,
    startStudyTime,
    endtStudyTime,
    saveCurrentStudy
  } from '../../api'
  /**
   * @Author Visupervi
   * @Date 2019/12/16 10:52
   * @Name 课程组件
   * @Param
   * @Return
   * @Description 学习课程参加课程闯关
   */
  export default {
    name: "couresBrief",
    data() {
      return {
        videoUrl: "", //
        videoImgUrl: "",
        videoShow: false,
        buttonShow: true,
        carouseShow: false,
        imgUrls: "",
        courseDescription: "",
        courseName: "",
        createTime: "",
        createName: "",
        firstImgUrl: "",
        todoThing: "去闯关", //图文显示去学习，视频显示闯关
        times: 0,
        btnShow: false,
        comFlage: false,
        isCache: false,
        headTitle: "我的学习",
        courseType: "",//区分图文还是视频
        isShowIntro: false,
        timer: null,
        count: "",
        isCount: false,
        fullFlag: false,
        comentList: [],
        examName: "",
        examCode: "",
        examId: "",
        glance: Number,
        allLoaded: false,
        bottomStatus: '',
        page: 1,
        rows: 10,
        active: 0,
        propOver: false,
        likeFlag: false,
        collectFlag: false,
        isComents: false,
        contentType: "",
        htmlVal: "",
        setTimer: null,
        scrollOrLeave: false,
        imgTimer: null,
        dpPlayer: null
      }
    },
    beforeCreate() {
    },
    created() {
      // this.checkHaveCaurse();
      // this.addEventHandler(this.$refs.scrollWrap);
      this.getCourseInfo();
      this.$forceUpdate();
      this.hideNativeHeder();
      if (!getDeviceInfo()) {
        inobounce.enable()
      }
    },
    mounted() {
      this.screenWidth = document.body.clientWidth;
      this.screenHeight = document.body.clientHeight;
      this.addEventHandler(this.$refs.scrollWrap);
      this.overscroll(this.$refs.scrollWrap);
      // document.body.addEventListener('touchmove', function (evt) {
      //   if (!evt._isScroller) {
      //     evt.preventDefault();
      //   }
      // });
      // console.log(document.body.clientHeight - 46);
      this.$refs.carouse.style.minHeight = `${document.body.clientHeight - 46}px`;
      window.onresize = () => {
        this.screenWidth = document.body.clientWidth;
        this.screenHeight = document.body.clientHeight;
        if (this.screenHeight < this.screenWidth) {
          // console.log("这是横屏");
          this.$refs.btnHei.style.display = "none";
        } else {
          // console.log("这是竖屏");
          this.$refs.btnHei.style.display = "block"
        }
        return (() => {
          this.screenWidth = document.body.clientWidth;
          this.screenHeight = document.body.clientHeight;
        })();
      };
      window.goBackTo = this.goBackTo;
      // this.setBack();
      this.imgTimer = setInterval(() => {
        let imgArr = this.getImags();
        // console.log(imgArr);
        if (imgArr.length > 0) {
          document.querySelector('.depponLoading').style.display = "none";
          clearInterval(this.imgTimer);
        }
      }, 1000)
    },
    beforeDestroy() {
      inobounce.disable()
    },
    methods: {
      //获取评论列表
      async getConmentList() {
        let res = await getCriticList({
          lessonId: this.$route.params.lessonId,
          page: this.page,
          rows: this.rows
        });
        if (parseInt(res.code) === 200) {
          if (res.result.length > 0) {
            this.comentList = res.result;
          } else {
          }
        }
        // console.log("评论列表", res);
      },
      //上拉加载
      onLoad() {
        this.page++;
        this.getConmentList();
        this.$refs.loadmore.onBottomLoaded();
      },
      //切换下拉底部文字
      handleBottomChange(status) {
        // console.log("status", status);
        this.bottomStatus = status;
      },
      //变为已学课程
      async studyedLesson() {
        let res = await saveHaveLesson({lessonId: this.$route.params.lessonId});
        communicationWithNative({
            method: "depponCourseTaskFinish",
            args: ["LEARN_COURSE"]
          },
          {
            method: "depponCourseTaskFinish",
            args: ["LEARN_COURSE"]
          })
      },
      //获取教程内容
      async getCourseInfo() {
        // console.log("获取课程")
        let res = await getLessonDetail({lessonId: this.$route.params.lessonId});
        if (res.code === 200) {
          this.examCode = res.result[0].bindExamCode;
          this.examId = res.result[0].bindExamId;
          this.examName = res.result[0].bindExamName;
          this.courseDescription = res.result[0].lessonDescription;
          this.courseName = res.result[0].lessonName;
          this.createTime = res.result[0].lessonCreateTime;
          this.firstImgUrl = res.result[0].lessonImg;
          this.headTitle = res.result[0].lessonName;
          this.contentType = res.result[0].contentType;
          if (res.result[0].bindExamCode === null || res.result[0].bindExamCode === "") {
            this.todoThing = "课程评价";
          } else {
            this.todoThing = "去闯关"
          }
          if (parseInt(res.result[0].contentType) === 1) {
            this.courseType = "1";
            this.times = res.result[0].lessonTime;
            //获取图文详情
            this.htmlVal = res.result[0].materialText;
            this.carouseShow = true;
            this.startStudyDate();
            this.setCurrentStudy();
            this.getCatchData();
          } else {
            // saveBrowserNum({lessonId: this.$route.params.lessonId});
            this.isShowIntro = true;
            this.courseType = "0";
            this.videoShow = true;
            this.videoUrl = res.result[0].videoUrl;
            this.glance = res.result[0].browseNum;
            this.videoImgUrl = res.result[0].courseImg;
            this.createVideo();
            // this.$refs.desAndConment.style.display = 'block';
          }
          // Indicator.close()
        }
      },
      //tab切换函数
      onClick(val) {
        // console.log("val", val);
        if (val === 1) {
          this.getConmentList();
        }
      },
      //获取缓存数据,
      async getCatchData() {
        let res = await getCacheData({
          lessonId: this.$route.params.lessonId
        });
        if (parseInt(res.code) === 1012) {
          this.isCache = true;
          this.isCount = true;
          this.btnShow = false;
          this.countTimeFn(parseInt(this.times));
        } else {
          this.isCache = false;
          this.btnShow = true;
          this.isCount = false;
        }
      },
      //视频进入闯关，图文进入详情
      gotoStudy() {
        if (this.$refs.btnName.innerText.trim() === "课程评价") {
          this.$router.replace(`/evaluation/${this.$route.params.lessonId}/${this.$route.params.fromName}?accessToken=${getQueryString("accessToken")}`).catch(err => {
            err
          })
        } else {
          this.$router.replace(`/question/${this.examId}/${this.examCode}/${this.examName}/${this.$route.params.lessonId}/${this.$route.params.fromName}?accessToken=${getQueryString("accessToken")}`).catch(err => {
            err
          })
        }
      }
      ,
      //隐藏原生头部
      hideNativeHeder() {
        communicationWithNative({
          method: 'hideTitle',
          args: null,
        }, {
          method: '',
          args: []
        })
      }
      ,
      handleResize(el) {
        var sWidth = 9
        var sHeight = 16
        var width = window.innerWidth;
        var height = window.innerHeight;
        var marginTop = height - (width * sHeight) / sWidth;
        marginTop = Math.round(marginTop);
        if (marginTop < -2) {
          el.style.marginTop = `${marginTop / 2}px`;
        } else {
          el.style.marginTop = `0`;
          video.$wrapper.css('marginTop', '0')
        }
      }
      ,
      //获取页面所有img
      getImags() {
        let imgs = document.querySelectorAll("img");
        return imgs;
      },
      // 创建视频
      createVideo() {
        let that = this;
        this.getCatchData();
        const dp = new DPlayer({
          container: this.$refs.videoPlay,
          screenshot: true,
          video: {
            url: `http://video.microc.cn/${that.videoUrl}`,
            pic: this.firstImgUrl,
            thumbnails: '',
            preload: 'metadata'
          },
          subtitle: {
            // url: 'webvtt.vtt',
          },
        });
        that.dpPlayer = dp;
        //根据设备不同，控制显示不同
        let video = document.querySelector(".videoPlay video");
        let videoWrap = document.querySelector('.videoPlay .dplayer-video-wrap');
        let dplayerFull = document.querySelector(".videoPlay .dplayer-full-in-icon");
        if (getDeviceInfo()) {
          video.setAttribute('x5-playsinline', 'true');
          video.setAttribute('x5-video-player-type', 'h5');
          video.setAttribute('x5-video-player-fullscreen', 'true');
          video.setAttribute('x5-video-orientation', 'portrait|landscape');
          video.setAttribute('x-webkit-airplay', 'true');
          /**
           * contain被替换的内容将被缩放，以在填充元素的内容框时保持其宽高比。 整个对象在填充盒子的同时保留其长宽比，因此如果宽高比与框的宽高比不匹配，该对象将被添加“黑边”。
           * cover被替换的内容在保持其宽高比的同时填充元素的整个内容框。如果对象的宽高比与内容框不相匹配，该对象将被剪裁以适应内容框。
           * fill被替换的内容正好填充元素的内容框。整个对象将完全填充此框。如果对象的宽高比与内容框不相匹配，那么该对象将被拉伸以适应内容框。
           * none被替换的内容将保持其原有的尺寸。
           * scale-down内容的尺寸与 none 或 contain 中的一个相同，取决于它们两个之间谁得到的对象尺寸会更小一些。
           * @type {string}
           */
          video.style.objectFit = "contain";//
        }
        let controller = document.querySelector(".videoPlay .dplayer-controller .dplayer-bar-wrap");
        document.querySelector(".videoPlay .dplayer-controller").style.bottom = "20px";
        //监听视频播放进度，做视频进度的操作
        dp.on("timeupdate", (player) => {
          //TODO 缓存视频进度
          if (dp.video.currentTime / dp.video.duration > 0) {
            if (this.isCache) {
              this.setCacheSpeed().then(res => {
                if (parseInt(res.code) === 200) {
                  this.btnShow = true;
                  this.isCache = false;
                }
              });
            }
            controller.style.display = "block"
          } else {
            this.isCache ? controller.style.display = "none" : controller.style.display = "block";
          }
        });
        //监听视频播放动作
        dp.on('play', (player) => {
          that.startStudyDate();
          that.setBreakThroughPoints();
          that.setCurrentStudy();
          if (!getDeviceInfo()) {
            dp.fullScreen.request('web');
          }
          // dp.fullScreen.request('web');
        });
        //监听暂停播放，视频播放完成也会掉用
        dp.on('pause', (player) => {
          // endtStudyTime({lessonId: this.$route.params.lessonId});
          if (dp.video.duration === dp.video.currentTime) {
            that.studyedLesson()
          } else {
            that.completeStuDate()
          }
        })
      }
      ,
      //正在学习
      async setCurrentStudy() {
        let res = await saveCurrentStudy({lessonId: this.$route.params.lessonId});
      }
      ,
      //记录学习开始时间
      async startStudyDate() {
        let res = await startStudyTime({lessonId: this.$route.params.lessonId})
      }
      ,
      //记录学习结束时间
      async completeStuDate() {
        let res = await endtStudyTime({lessonId: this.$route.params.lessonId});
      }
      ,
      //清除定时器
      clearTimer() {//清除定时器
        clearInterval(this.timer);
        this.timer = null;
      }
      ,
      //  记录闯关次数
      async setBreakThroughPoints() {
        let res = await saveBrowserNum({
          lessonId: this.$route.params.lessonId
        });
      }
      ,
      setBack() {
        // let handlerFn = this.goBackTo;
        window.android.setBackPressCallBack("goBackTo")
      }
      ,
      goBackTo() {
        clearInterval(this.timer);
        if (this.$route.params.flag === "1") {
          this.$router.replace(`/myStudy?accessToken=${getQueryString('accessToken')}`).catch(err => {
            err
          })
        } else {
          this.$router.replace(`/historyStudy?accessToken=${getQueryString('accessToken')}`).catch(err => {
            err
          })
        }
      }
      ,
      //获取子组件的传值
      parentFn(data) {
        // if (!flag) {
        //   clearInterval(this.timer);
        // }
        // console.log("Headerdata", data);
        this.isComplite = data.isComplite
      }
      ,
      overscroll(el) {
        let top, totalScroll;
        el.addEventListener('touchstart', () => {
          top = el.scrollTop;
          totalScroll = el.scrollHeight;
          let currentScroll = top + el.offsetHeight;
          if (top === 0) {
            el.scrollTop = 1;
          } else if (currentScroll === totalScroll) {
            //设置为已学
            this.studyedLesson();
            el.scrollTop = top - 1;
          }
        });
        el.addEventListener('touchmove', (evt) => {
          // console.log("totalScroll", totalScroll);
          if (el.offsetHeight < el.scrollHeight) {
            evt._isScroller = true;
            this.setCurrentStudy();
          }
        });
      }
      ,
      //计时器记录图文课程学习时长
      countTimeFn(time) {
        if (this.courseType === "1") {
          let that = this;
          this.timer = setInterval(() => {
            this.count = time;
            // console.log(this.count);
            time--;
            if (time >= 0) {
              // console.log("c测试数据")
            } else {
              this.clearTimer();
              this.setCacheSpeed();
              this.isCount = false;
              this.isActive = true;
              this.btnShow = true;
              this.count = "";
              return false;
            }
          }, 1000)
        } else {
          clearInterval(this.timer);
        }
      }
      ,
      //设置缓存
      async setCacheSpeed() {
        return await setCacheData({lessonId: this.$route.params.lessonId});
      }
      ,
      //监听滚动
      addEventHandler(elem) {
        let scroll = mui('.mui-scroll-wrapper').scroll();
        // console.log("122222");
        elem.addEventListener('scroll', (e) => {
          // console.log("121212122121");
          // console.log(elem.offsetHeight)
          // console.log(elem.scrollTop)
          // console.log(elem.scrollHeight)
          if ((elem.offsetHeight + elem.scrollTop)/elem.scrollHeight > 0.9) {
            if (!this.scrollOrLeave) {
              this.completeStuDate();
              this.studyedLesson();
              this.scrollOrLeave = true;
            } else {
              // this.setCurrentStudy();
            }
          }
        })
      }
    },
    components: {
      // player,
      Header,
      comentProp
    },
    beforeRouteLeave(to, from, next) {
      //离开页面未发生滚动
      // this.dpPlayer.destroy()
      let video = document.querySelector(".videoPlay video");
      console.log("video", video);
      if (video !== null) {
        video.pause();
      }
      this.isComplite = true;
      if (parseInt(this.contentType) === 1 && !this.scrollOrLeave) {
        this.completeStuDate();
        this.studyedLesson();
        // endtStudyTime({lessonId: this.$route.params.lessonId});
      } else {
        // this.studyedLesson()
      }
      next();
    },
    beforeDestroy() {
      clearInterval(this.timer);
    }
  }
</script>

<style scoped lang="less">
  .studyCourse {
    height: 100%;
    position: relative;
    /*简介样式处理*/

    .scrollWrap {
      /*margin-top: 10px;*/
      /*height: 100%;*/
      height: calc(100% - 48px - 3rem);
      min-height: 0;
      position: relative;
      overflow-y: scroll;
      margin-bottom: 3rem;
      -webkit-overflow-scrolling: touch;

      .mui-scroll {
        min-height: 900px;
        padding: 0 10px;
      }
    }

    .van-swipe {
      height: inherit;

      .van-swipe-item {
        img {
          height: 100%;
          width: 100%;
          user-select: none;
          -webkit-user-select: none;
        }
      }
    }

    .firstImg {
      height: 100%;
      width: 100%;

      img {
        height: 100%;
        width: 100%;
        user-select: none;
        -webkit-user-select: none;
      }
    }

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
      z-index: 3;

      .van-button--primary {
        background-color: #CCC;
        border: 1px solid #CCC;
        /*border-radius: 8px;*/
        border-radius: 48px;
        line-height: 1.95rem;
        height: 2rem;
        width: 90%;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        user-select: none;
      }

      .noActive {
        background-color: #00CAB6;
        border: 1px solid #00CAB6;
        border-radius: 48px;
        line-height: 1.95rem;
        height: 2rem;
        width: 80%;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        user-select: none;
      }

      .iconWrap {
        width: 20%;
        position: absolute;
        top: 50%;
        display: flex;
        display: -webkit-flex;
        justify-content: center;
        -webkit-justify-content: center;
        transform: translateY(-50%);
        right: 0;

        .van-icon:nth-child(2) {
          margin-left: 0.571rem;
        }

        .my-van-icon-like {
          &::before {
            color: red;
          }
        }
      }

      .comentActive {
        background-color: #00CAB6;
        border: 1px solid #00CAB6;
        border-radius: 48px;
        line-height: 1.95rem;
        height: 2rem;
        width: 80%;
        /*left: 50%;*/
        top: 50%;
        transform: translateY(-50%);
        user-select: none;
      }

      .isHiden {
        background-color: #FF524D;
        border: 1px solid #FF524D;
      }
    }

    .depponLoading {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background-color: rgba(255, 255, 255, 1);
      z-index: 99999;

      .lalaImg {
        width: 3.857rem;
        height: 8.571rem;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        img {
          width: 100%;
          user-select: none;
          -webkit-user-select: none;
        }
      }
    }
  }
</style>
