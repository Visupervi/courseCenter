<template>
  <div class="comentPropover">
    <van-popup
      v-model="isShow"
      @close='closeProp'
      closeable
      round='round'
      position="bottom"
      :style="{ height: '40%' }"
    >
      <div class="score">
        <p>添加评论</p>
        <!--<div class="ioconText">-->
          <!--<span>展示形式：</span>-->
          <!--<van-rate-->
            <!--v-model="value"-->
            <!--void-icon="star"-->
            <!--void-color="#eee"-->
          <!--/>-->
        <!--</div>-->
        <!--<div class="ioconText">-->
          <!--<span>具体内容：</span>-->
          <!--<van-rate-->
            <!--v-model="value1"-->
            <!--void-icon="star"-->
            <!--void-color="#eee"-->
          <!--/>-->
        <!--</div>-->
        <!--<div class="ioconText">-->
          <!--<span>实用性：</span>-->
          <!--<van-rate-->
            <!--v-model="value2"-->
            <!--void-icon="star"-->
            <!--void-color="#eee"-->
          <!--/>-->
        <!--</div>-->

        <div class="advice">
          <div class="scrollWrap mui-scroll-wrapper">
            <div class="mui-scroll" ref="carouse">
              <div class="msgValue">
                <van-cell-group>
                  <van-field
                    v-model="message"
                    rows="5"
                    type="textarea"
                    maxlength="140"
                    placeholder=""
                    show-word-limit
                  />
                </van-cell-group>
              </div>
            </div>
          </div>
        </div>
      </div>


      <!--<div class="breakThrough" v-show="true" ref="btnHei">-->
        <!--<van-button class="isActive" type="primary" size="large" v-show="true" @click="submitComent($event)">提交评论-->
        <!--</van-button>-->
        <!--&lt;!&ndash;<van-button v-show="isActive" type="primary" size="large" @click="breakThrough()">去闯关</van-button>&ndash;&gt;-->
      <!--</div>    -->
      <div class="breakThrough" v-show="true" ref="btnHei">
        <van-cell-group>
          <van-field v-model="value" placeholder="请输入用户名" />
        </van-cell-group>
        <!--<van-button v-show="isActive" type="primary" size="large" @click="breakThrough()">去闯关</van-button>-->
      </div>
    </van-popup>

  </div>
</template>

<script>
  import {communicationWithNative, getQueryString, getDeviceInfo} from '../../service/superGuide'
  import {submitComent,postComent} from '../../api';
  import {inputUp} from '../../service/inputUp';
  export default {
    props: {
      objData: {
        type: Object
      }
    },
    data() {
      return {
        isShow: this.objData.propOver,
        value: 0,
        value1: 0,
        value2: 0,
        message: "",
        isComent: this.objData.isComents
      }
    },
    created() {
    },
    mounted() {
      // this.$inputUp();
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
    },
    methods: {
      //关闭评论弹窗
      closeProp() {
        // console.log("this.isShow", this.isShow)
        if (this.value > 0 && this.value1 > 0 && this.value2 > 0 && this.message.length > 0) {
          this.$emit('getSendData', {isShow: this.isShow, isComent: this.isComent})
        } else {
          this.$emit('getSendData', {isShow: this.isShow, isComent: false})
        }
        this.value = 0;
        this.value1 = 0;
        this.value2 = 0;
        this.message = "";
      },
      //提交评论
      async submitComent(e) {
        if (this.message.length > 0) {
          let res = await postComent({
            lessonId: this.$route.params.lessonId,
            text: this.message
          });
          if (parseInt(res.code) === 200) {
            this.isShow = false;
            this.isComent = true;
            this.$toast("😀评论成功!")
            // this.$emit("optionComent","已评论");
            // this.closeProp(true)
          }
        } else {
          this.$notify({
            message: "🙂😭必须评论吆！！！",
            type: 'warning',
            showClose: true
          })
        }
      },
    },
    watch: {
      objData: {
        immediate: true,
        handler(val) {
          // console.log("val", val);
          this.isShow = val.propOver
        }
      },
    }
  }
  ;
</script>
<style lang="less" scoped>
  .comentPropover {
    height: 100%;

    .score, .advice {
      /*margin-top: 0.775rem;*/
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
      /*top: 9.8rem;*/
      /*margin-bottom: 0.5rem;*/

      .scrollWrap {
        /*top: 2.5rem;*/
        height: 7.5rem;
        overflow-y: scroll;
      }
    }

    .breakThrough {
      position: fixed;
      bottom: 0px;
      width: 100%;
      height: 3rem;
      box-shadow: 0 -5px 10px 0 rgba(0, 0, 0, 0.05);
      user-select: none;
      z-index: 3;

      .van-button--primary {
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

      .isHiden {
        background-color: #ccc;
        border: 1px solid #ccc;
      }
    }
  }

</style>
<style scoped lang="less">
  @import "_comentPropover.less";
</style>
