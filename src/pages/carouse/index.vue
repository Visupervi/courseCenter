<template>
  <div class="carouse ">
    <!--头部信息-->
    <Header :title="headTitle" @childFn="parentFn"></Header>


    <div class="carouse" ref="carouse" @click="gotoCourseDetail">
      <!--这里放置真实显示的DOM内容-->
      <img v-if="firstImgUrl" :src="firstImgUrl" alt="">
    </div>
    <!--tab切换-->
    <div class="desAndConment" v-if="firstImgUrl">
      <van-tabs @click="onClick">
        <!--简介-->
        <van-tab title="简介">
          <div class="lessonName">
            <p>{{courseName}}</p>
          </div>
          <div class="des">
            <p><span>{{parseInt(glance)}}</span> 浏览</p>
            <p v-show="lessonDescription.length > 0">{{lessonDescription}}</p>
            <p v-show="lessonDescription.length === 0">暂无简介</p>
          </div>
        </van-tab>
        <!--评论内容-->
        <van-tab title="评论">
          <div class="errorScroll">
            <div class="scrollWrap mui-scroll-wrapper" ref="scrollWrap">
              <div class="mui-scroll">
                <mt-loadmore :bottom-method="onLoad" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore"
                             @bottom-status-change="handleBottomChange" v-show="comentList.length !== 0">
                  <ul class="conmentWrap">
                    <li v-for="(item,index) in comentList" :key="index">
                      <div class="imgWrap">
                        <div class="imgParent">
                          <img v-if="item.userInfo.head_pic !== ''" :src="item.userInfo.head_pic" alt="">
                          <img v-if="item.userInfo.head_pic === ''" src="../../assets/images/avatar.png" alt="">
                        </div>

                      </div>
                      <div class="textWrap">
                        <div class="name">{{item.userInfo.name}}</div>
                        <div class="time">{{item.create_time.split("T")[1].split(".")[0]}}
                          {{item.create_time.split("T")[0]}}
                        </div>
                        <div class="text">{{item.content}}</div>

                      </div>
                    </li>
                  </ul>
                  <div slot="bottom" class="mint-loadmore-bottom" ref="loadeMore">
                    <span v-show="bottomStatus !== 'loading'" :class="{ 'rotate': bottomStatus === 'drop' }">↓</span>
                    <span v-if="bottomStatus === 'loading'">Loading...</span>
                  </div>
                </mt-loadmore>
              </div>
            </div>
            <div class="comentWrap" v-show="comentList.length === 0">
              <p class="noComent">暂无评论</p>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <!--<coment-prop v-if="propOver" :objData="{'propOver':propOver,'isComents':isComents}"-->
    <!--@getSendData='getSendData' @optionComent="optionComent"></coment-prop>-->
    <div class="breakThrough" v-show="true" ref="btnHei" v-if="switchTab === 0">
      <van-button class="isActive" type="primary" size="large" v-show="true" @click="gotoCourseDetail" ref="btnText">
        {{btnName}}
      </van-button>
    </div>
    <div class="breakThrough coment" v-show="true" ref="btnHei" v-if="switchTab === 1">
      <van-cell-group>
        <van-field v-model="comentValue" placeholder="说点什么吧..." ref="addEventEnter" @click.once="addEventEnter"/>
      </van-cell-group>
      <div class="iconWrap">
        <van-icon name="like-o" :class="{'my-van-icon-like':likeFlag}" @click="likeHandler"/>
        <van-icon name="star-o" :class="{'my-van-icon-like':collectFlag}" @click="collectHandler"/>
      </div>
      <!--<van-button v-show="isActive" type="primary" size="large" @click="breakThrough()">去闯关</van-button>-->
    </div>
  </div>
</template>

<script>
  import inobounce from 'inobounce';
  import {
    communicationWithNative,
    getQueryString,
    getDeviceInfo,
    overscroll,
    backToTarget,
    throttle
  } from '../../service/superGuide';
  import comentProp from '../../components/comentPropover/comentPropover'
  import {
    getLessonDetail,
    getCriticList,
    submitLike,
    cancelLike,
    saveMyFavorite,
    cancelMyFavorite,
    saveBrowserNum,
    startStudyTime,
    saveCurrentStudy,
    checkFavoriteInfo,
    checkLikeInfo,
    postComent
  } from '../../api';
  import Header from '../../components/header';
  import {inputUp} from '../../service/inputUp';
  /**
   * @Author Visupervi
   * @Date 2019/12/17 9:52
   * @Name 轮播图组件
   * @Param
   * @Return
   * @Description
   */
  let fromRoute = "";
  export default {
    name: "index",
    data() {
      return {
        title: "",
        timer: "",
        isCount: false,
        isClick: false,
        count: "",
        isActive: false,
        courseDescription: "",
        comentValue: "",
        courseName: "",
        // collectFlag: false,
        createTime: "",
        createName: "",
        headTitle: "我的学习",
        firstImgUrl: "",
        glance: null,
        lessonDescription: "",
        allLoaded: false,
        bottomStatus: '',
        page: 1,
        rows: 10,
        tId: "",
        comentList: [],
        propOver: false,
        // likeFlag: false,
        collectFlag: false,
        isComents: false,
        contentType: "",
        fromName: fromRoute,
        btnName: "去学习",
        likeFlag: false,
        switchTab: 0,
        enterCount: 0
      }
    },
    created() {
      this.getImgUrl();
      // saveBrowserNum({lessonId: this.$route.params.lessonId});
      // this.getGlanceNum();
      this.$forceUpdate();
      // this.getCacheSpeed();
      this.hideNativeHeder();
      if (!getDeviceInfo()) {
        inobounce.enable()
      }
    },
    mounted() {
      // overscroll(this.$refs.scrollWrap);
      backToTarget();
      inputUp();
      if (getDeviceInfo()) {
        //获取原窗口的高度
        var originalHeight = document.documentElement.clientHeight || document.body.clientHeight;
        window.onresize = function () {
          //键盘弹起与隐藏都会引起窗口的高度发生变化
          var resizeHeight = document.documentElement.clientHeight || document.body.clientHeight;
          if (resizeHeight - 0 < originalHeight - 0) {
            //当软键盘弹起，在此处操作
            // mui.alert("123","提示",()=>{})
            this.$refs.btnHei.style.bottom = "45%";
          } else {
            //当软键盘收起，在此处操作
            this.$refs.btnHei.style.bottom = "0%";
          }
        };
      }
    },
    beforeDestroy() {
      // inobounce.disable()
    },
    methods: {
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
      //获取子组件的传值
      parentFn(flag) {
        if (!flag) {
          clearInterval(this.timer);
        }
      },
      //  获取图片地址
      async getImgUrl() {
        let res = await getLessonDetail({lessonId: this.$route.params.lessonId});
        // console.log(res)
        if (res.code === 200) {
          this.lessonDescription = res.result[0].lessonDescription;
          this.courseName = res.result[0].lessonName;
          this.createTime = res.result[0].lessonCreateTime;
          this.firstImgUrl = res.result[0].lessonImg;
          this.headTitle = res.result[0].lessonName;
          // this.$refs.carouse.innerHTML = res.result[0].materialText;
          // this.$forceUpdate();
          this.contentType = res.result[0].contentType;
          this.title = res.result.title;
          this.glance = res.result[0].browseNum;
          console.log("this.glance", this.glance)
        }
      },
      //获取评论列表
      async getConmentList() {
        let res = await getCriticList({
          lessonId: this.$route.params.lessonId,
          page: this.page,
          rows: this.rows
        });
        if (parseInt(res.code) === 200) {
          if (res.result.length > 0) {
            this.comentList = this.comentList.concat(res.result);
          } else {
          }
        }
        // console.log("评论列表", res);
      },
      //提交评论
      async submitComent() {
        if (this.comentValue.length > 0) {
          let res = await postComent({
            lessonId: this.$route.params.lessonId,
            text: this.comentValue
          });
          if (parseInt(res.code) === 200) {
            // this.isShow = false;
            // this.isComent = true;
            this.comentList = [];
            this.$toast("😀评论成功!");
            this.getConmentList();
            this.comentValue = "";
            // this.$emit("optionComent","已评论");
            // this.closeProp(true)
          }
        } else {
          this.$notify({
            message: "🙂😭评论不能为空吆！！！",
            type: 'warning',
            showClose: true
          })
        }
      },
      optionComent(data) {
        console.log("是否评论", data);
        this.btnName = "去学习";
      },
      //计时器记录学习时长
      countTimeFn(time) {
        this.timer = setInterval(() => {
          this.count = time;
          --time;
          if (time >= -1) {
            // console.log("")
          } else {
            // this.setCacheSpeed();
            this.isCount = false;
            this.isActive = true;
            clearInterval(this.timer)
          }
        }, 1000)
      },
      //喜欢/点赞
      likeHandler() {
        // console.log("喜欢");
        !this.likeFlag ? submitLike({lessonId: this.$route.params.lessonId})
          : cancelLike({lessonId: this.$route.params.lessonId});
        this.likeFlag = !this.likeFlag;
      },
      //收藏
      collectHandler() {
        // console.log("收藏")
        !this.collectFlag ? saveMyFavorite({lessonId: this.$route.params.lessonId})
          : cancelMyFavorite({lessonId: this.$route.params.lessonId});
        this.collectFlag = !this.collectFlag;
      },
      //检查是否收藏
      async checkCollect() {
        let res = await checkFavoriteInfo({lessonId: this.$route.params.lessonId});
        if (parseInt(res.code) === 200) {
          this.collectFlag = (parseInt(res.status) === 0) ? false : true;
        }
        // console.log("是否收藏", res)
      },
      //检查是否点赞
      async checkIsClickGood() {
        let res = await checkLikeInfo({lessonId: this.$route.params.lessonId});
        if (parseInt(res.code) === 200) {
          this.likeFlag = (parseInt(res.status) === 0) ? false : true;
        }
        // console.log("是否点赞",res,this.likeFlag)
      },
      //评价课程
      comentCourse() {
        // this.propOver = true;
        // this.isComents = !this.isComents;
      },
      //获取子组件的值
      getSendData(data) {
        console.log('评论data', data);
        this.propOver = data.isShow;
        this.isComents = data.isComent;
        this.getConmentList();
      },
      //onClick
      onClick(val) {
        console.log("val", val);
        this.switchTab = val;
        if (val === 1) {
          this.comentList = [];
          this.getConmentList();
          this.allLoaded = false;
          this.checkIsClickGood();
          this.checkCollect();
          this.btnName = "去评论";
        } else {
          this.btnName = "去学习";
        }
      },
      // 监听手机端回车
      addEventEnter(event) {
        let that = this;
        // console.log(this.enterCount++);
        this.$refs.addEventEnter.$refs.input.addEventListener("keyup", throttle(function (event) {
          console.log("event", event);
          if (event.keyCode === 13) {
            that.submitComent();
          }
        }, 300, 500))
      },
      //记录学习开始时间
      async startStudyDate() {
        let res = await startStudyTime({lessonId: this.$route.params.lessonId})
      },
      //去详情页
      gotoCourseDetail() {
        //记录浏览量
        console.log("this.$refs.btnText", this.$refs.btnText);
          if (this.contentType === '1') {
            // this.startStudyDate();
            saveBrowserNum({lessonId: this.$route.params.lessonId})
            // this.setCurrentStudy();
          }
          console.log("执行函数");
          this.$router.replace(`/courseBrief/${this.$route.params.lessonId}/${this.$route.params.fromName}?accessToken=${getQueryString('accessToken')}`);
      },
        // if()
      //正在学习
      async setCurrentStudy() {
        let res = await saveCurrentStudy({lessonId: this.$route.params.lessonId});
      },
      //隐藏原生头部
      hideNativeHeder() {
        communicationWithNative({
          method: 'hideTitle',
          args: null,
        }, {
          method: 'hideTitle',
          args: []
        })
      },
      //返回指定页面
    },
    components: {
      Header,
      comentProp
    },
    watch: {
      $route: {
        handler: function (val, oldVal) {
          // console.log("val", val);
        },
        // 深度观察监听
        deep: true
      }
    },
  }
</script>

<style scoped lang="less">
  .carouse {
    height: 100%;
    position: relative;
    /*margin-top: 10px;*/
    /*height: 100%;*/
    /*height: calc(100% - 46px - 3rem);*/
    /*min-height: 0;*/
    /*position: relative;*/
    /*overflow-y: hidden;*/
    /*margin-bottom: 3rem;*/
    /*-webkit-overflow-scrolling: touch;*/

    .carouse {
      height: 10rem;

      img {
        height: 100%;
        width: 100%;
        user-select: none;
        -webkit-user-select: none;
      }
    }

    .desAndConment {
      height: calc(100% - 200px - 106px);
      padding-bottom: 1rem;
      box-sizing: border-box;

      .lessonName {
        p {
          text-align: center;
          color: #333333;
          font-size: 0.857rem;
          font-weight: 600;
          margin: 0.286rem 0;
        }

      }

      .des {
        p:nth-child(1) {
          font-size: 0.6rem;

          span {
            color: #0099FF;
          }
        }

        p {
          /*text-indent: 0.01rem;*/
          padding: 0 0.286rem;
          word-break: break-all;
        }
      }

    }

    .tabScroll {
      overflow-y: scroll;
      height: 100%;
    }


    .van-swipe {
      height: inherit;

      .van-swipe-item {
        img {
          height: 100%;
          width: 100%;
        }
      }

      .sc {

      }

    }

    .breakThrough {
      position: absolute;
      bottom: 0px;
      padding: 0 0.286rem;
      box-sizing: border-box;
      width: 100%;
      height: 3rem;
      background-color: #fff;
      box-shadow: 0 -5px 10px 0 rgba(0, 0, 0, 0.05);
      user-select: none;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;

      .van-button--primary {
        background-color: #00CAB6;
        border: 1px solid #00CAB6;
        border-radius: 48px;
        line-height: 1.95rem;
        height: 2rem;
        width: 80%;
        /*left: 50%;*/
        /*top: 50%;*/
        /*transform: translate(-50%, -50%);*/
        user-select: none;
      }

      .iconWrap {
        width: 20%;
        position: absolute;
        top: 50%;
        display: flex;
        justify-content: center;
        display: -webkit-flex;
        -webkit-justify-content: center;
        transform: translateY(-50%);
        -webkit-transform: translateY(-50%);
        right: 1rem;
        font-size: 1rem;

        .van-icon:nth-child(2) {
          margin-left: 1rem;
        }

        .my-van-icon-like {
          &::before {
            color: red;
          }
        }
      }

      .isHiden {
        background-color: #ccc;
        border: 1px solid #ccc;
      }

      .van-cell-group {
        width: 75%;
        border-radius: 50%;

        input[type='text'] {
          border-radius: 0.45rem;
        }
      }
    }

    .coment {
      justify-content: space-between;
      z-index: 99999;
      position: fixed;
    }

  }
</style>
