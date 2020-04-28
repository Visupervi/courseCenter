<template>
  <div class="evalution">
    <Header :title="title"></Header>
    <v-touch @swipeleft="touchLeft" class="touchWrap" @swiperight="touchRight">

      <div class="evalWrap">
        <div class="score">
          <p>您对课程满意吗？</p>
          <div class="ioconText">
            <span>展示形式：</span>
            <van-rate
              v-model="value"
              void-icon="star"
              void-color="#eee"
            />
          </div>
          <div class="ioconText">
            <span>具体内容：</span>
            <van-rate
              v-model="value1"
              void-icon="star"
              void-color="#eee"
            />
          </div>
          <div class="ioconText">
            <span>实用性：</span>
            <van-rate
              v-model="value2"
              void-icon="star"
              void-color="#eee"
            />
          </div>
        </div>
        <div class="advice">
          <p>说说你的意见</p>

          <div class="scrollWrap mui-scroll-wrapper">
            <div class="mui-scroll" ref="carouse">
              <div class="msgValue">
                <van-cell-group>
                  <van-field
                    v-model="message"
                    rows="5"
                    type="textarea"
                    maxlength="250"
                    placeholder="请输入您的建议"
                    show-word-limit
                  />
                </van-cell-group>
              </div>
            </div>
          </div>
        </div>

        <div class="btnGroup submitBtn" ref="btnGroup">
          <van-button v-show="true" :class="{btnSubmit:true}" type="primary" size="large" @click="submitComment">提交
          </van-button>
          <!--<div class="iconWrap">-->
          <!--<van-icon name="like-o" :class="{'my-van-icon-like':likeFlag}" @click="likeHandler"/>-->
          <!--<van-icon name="star-o" :class="{'my-van-icon-like':collectFlag}" @click="collectHandler"/>-->
          <!--</div>-->
        </div>
      </div>
    </v-touch>

  </div>
</template>

<script>
  import {communicationWithNative, getQueryString, getDeviceInfo} from '../../service/superGuide';
  import Header from '../../components/header';
  import {
    submitComent,
    checkLikeInfo,
    submitLike,
    saveMyFavorite,
    cancelLike,
    cancelMyFavorite,
    checkFavoriteInfo
  } from '../../api';
  import {routerSwitch} from '../../service/routerSwitch';
  import {inputUp} from '../../service/inputUp';
  /**
   * @Author Visupervi
   * @Date 2020/1/2 10:48
   * @Name
   * @Param
   * @Return
   * @Description 课程评价组件
   */
  export default {
    name: "index",
    //lessonId（课程Id），text(评论内容)，showScore（展现形式评分），specificScore（具体内容评分），practicalScore（实用性评分）
    data() {
      return {
        value: 0,
        value1: 0,
        value2: 0,
        message: "",
        title: "课程评价",
        token: "",
        collectFlag: false,
        likeFlag: false,
        isDeviceBack: true
      }
    },
    //路由离开
    beforeRouteLeave(to, from, next) {
      if (to.name !== "collageCourse") {
        if (this.isDeviceBack) {
          // routerSwitch(this.$route.params.fromName, this.$router, "beforeRouteLeave", next);
        }
      }
      next();
    },
    created() {
      this.token = getQueryString('accessToken');
      this.checkCollect();
      this.checkIsClickGood();
      // console.log("accessToken", this.token)
      this.hideNativeHeder();
    },
    mounted() {
      inputUp();
      if (getDeviceInfo()) {
        let screenHeight = document.body.offsetHeight;
        // 为window绑定resize事件
        window.onresize = function () {
          let nowHeight = document.body.offsetHeight;
          let btnGroup = document.querySelector(".btnGroup");
          if (nowHeight < screenHeight) {
            // 将底部弹起的按钮隐藏（可使用给按钮添加相应消失类）
            btnGroup.style.display = "none"
          } else {
            // 将按钮正常显示（可使用给按钮移除相应消失类）
            btnGroup.style.display = "block"
          }
        }
      }
      // window.goBackTo = this.goBackTo;
      // this.setBack();
    },
    destroyed() {
    },
    methods: {
      //手势操作
      touchLeft() {
      },
      touchRight() {
        routerSwitch(this.$route.params.fromName, this.$router);
      },
      //  提交评论
      async submitComment() {
        if (this.value > 0 && this.value1 > 0 && this.value2 > 0) {
          let obj = {
            lessonId: this.$route.params.lessonId,
            showScore: this.value,
            specificScore: this.value2,
            practicalScore: this.value2,
            text: this.message,
          };
          let res = await submitComent(obj);
          if (parseInt(res.code) === 200) {
            mui.alert(`您已完成本次学习`, '提示', () => {
              this.isDeviceBack = false;
              //记录完成时间
              // routerSwitch(this.$route.params.fromName, this.$router, "", () => {
              // });
              communicationWithNative({
                method: 'finish',
                args: null
              }, {
                method: 'finish',
                args: []
              });
            })
          } else if (parseInt(res.code) === 1023) {
            let that = this;
            mui.alert(`${res.msg}`, '提示', () => {
              //记录完成时间
              // e.preventDefault();
              // console.log("121212122");
              this.isDeviceBack = true;
              console.log(window.location);
              communicationWithNative({
                method: 'finish',
                args: null
              }, {
                method: 'finish',
                args: []
              });
              console.log("that.$route.params.fromName", that.$route.params.fromName);
              // that.$router.push(`${that.$route.params.fromName}?accessToken=${getQueryString("accessToken")}`);
              // routerSwitch(that.$route.params.fromName, that.$router, "", () => {
              // });
            })
          }
        } else {
          this.$notify({
            message: "您的评分是我们前进的动力",
            type: 'warning',
            showClose: true
          })
        }
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
      //  返回指定页面
      setBack() {
        // let handlerFn = this.goBackTo;
        window.android.setBackPressCallBack("goBackTo")
      },
      goBackTo() {
        this.$router.replace(`/courseBrief/${this.$route.params.caurseId}/${this.$route.params.eTypeId}/${"1"}?accessToken=${getQueryString('accessToken')}`).catch(err => {
          err
        })
      }
    },
    components: {
      Header
    }
  }
</script>

<style scoped lang="less">
  .evalution {
    height: 100%;
    overflow: hidden;
    position: relative;

    .evalWrap {
      background-color: #fff;
      box-shadow: 0 6px 20px 0 rgba(217, 217, 217, 0.30);
      height: 89%;
      width: 95%;
      margin: 0 auto;
      margin-top: 10px;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 8px;

      .score, .advice {
        margin-top: 0.775rem;
        height: 9.025rem;
        background: #FFFFFF;
        /*box-shadow: 0 6px 20px 0 rgba(217, 217, 217, 0.30);*/
        border-radius: 4px;
        width: 17.25rem;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);

        p {
          font-family: PingFangSC-Semibold;
          font-size: 0.9rem;
          font-weight: 600;
          margin: 1rem 0 1.025rem 0;
          color: #333333;
          text-align: center;
          position: relative;
        }

        .ioconText {
          display: flex;
          display: -webkit-flex;
          line-height: 1.05rem;
          padding: 7px 0;

          span {
            width: 30%;
            text-align: right;
            font-family: PingFangSC-Semibold;
            font-size: 0.75rem;
            font-weight: 600;
            color: #333333;
          }

          .van-rate {
            padding-left: 1.5rem;
          }
        }
      }

      .advice {
        top: 9.8rem;
        margin-bottom: 0.5rem;

        .scrollWrap {
          top: 2.5rem;
          height: 7.5rem;
          overflow-y: scroll;
        }
      }

      .btnGroup {
        display: flex;
        display: -webkit-flex;
        position: fixed;
        align-items: center;
        -webkit-align-items: center;
        /*justify-content: space-between;*/
        padding: 0 0.5rem;
        justify-content: center;
        bottom: 0;
        width: 100%;
        height: 3rem;
        /*align-items: center;*/
        user-select: none;
        box-shadow: 0 -5px 10px 0 rgba(0, 0, 0, 0.05);


        button {
          position: absolute;
          background-color: #00CAB6;
          border: 1px solid #00CAB6;
          height: 2rem;
          line-height: 1.95rem;
          width: 80%;
          /*left: 50%;*/
          top: 50%;
          transform: translateY(-50%);
          border-radius: 1.371rem;
        }

        /*.iconWrap {*/
        /*width: 20%;*/
        /*position: absolute;*/
        /*top: 50%;*/
        /*display: flex;*/
        /*display: -webkit-flex;*/
        /*justify-content: center;*/
        /*-webkit-justify-content: center;*/
        /*transform: translateY(-50%);*/
        /*right: 0;*/

        /*.van-icon:nth-child(2) {*/
        /*margin-left: 0.571rem;*/
        /*}*/

        /*.my-van-icon-like {*/
        /*&::before {*/
        /*color: red;*/
        /*}*/
        /*}*/
        /*}*/

      }
    }


  }
</style>
