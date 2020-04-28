<template>
  <div class="question">
    <Header :title="title"></Header>
    <!--题干与选项-->
    <v-touch @swipeleft="touchLeft" class="touchWrap" @swiperight="touchRight">
      <div class="questionClass" v-show="listCount">
        <span class="currentQue"><span v-if="quesNum < 10">0</span>{{quesNum}}</span>/{{listCount}} {{quesName}}
      </div>
      <div class="className" v-show="currentQues">
        {{quesNum}}. {{currentQues.title}}
      </div>

      <div class="scrollWrap mui-scroll-wrapper" ref="scrollWrap">
        <div class="mui-scroll" ref="carouse">
          <!--这里放置真实显示的DOM内容-->
          <div class="options" @change="optionChange">
            <div class="mui-input-row mui-radio mui-left" v-for="(item,index) in currentQues.answers"
                 :key="new Date().getTime() + index" v-if="quesName !== '多选题'">
              <label> {{item.content}}</label>
              <input v-if="quesName !== '多选题'" name="answer" type="radio" :value="item.answerId"
                     class="answer" :key="index" ref="answer" disabled :checked="item.checked">
              <div class="answerErr" v-show="item.isRight === '1'">
                <p>错误选项</p>
                <van-icon name="cross"/>
              </div>
              <div class="answerOk" v-show="item.isRight === '0'">
                <p>正确选项</p>
                <van-icon name="success"/>
              </div>
            </div>
            <div class="mui-input-row mui-checkbox mui-left" v-if="quesName === '多选题'"
                 v-for="(item,index) in currentQues.answers" :key="new Date().getTime() + index">
              <label>{{item.content}}</label>
              <input name="checkbox1" type="checkbox" :value="item.answerId" class="answer" v-if="quesName === '多选题'"
                     :key="index" ref="answer" disabled :checked="item.checked">
              <div class="answerErr" v-show="item.isRight === '1'">
                <p>错误选项</p>
                <van-icon name="cross"/>
              </div>
              <div class="answerOk" v-show="item.isRight === '0'">
                <p>正确选项</p>
                <van-icon name="success"/>
              </div>
            </div>


            <!--答案解析-->
            <div class="analyze">
              <div class="analyzeContent">
                <span>答案解析：</span>{{currentQues.right ? '回答正确': '回答错误'}}
                <p class="content">
                  {{currentQues.questionDescription}}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--上一题下一题-->
      <div class="btnGroup" v-show="preNextShow">
        <van-button type="primary" size="large" :class="{btnNoActive:isActive}" @click="preQuestion">{{preName}}
        </van-button>
        <van-button type="primary" size="large" @click="nextQuestion" ref="btnName">{{nextName}}</van-button>
      </div>
    </v-touch>

  </div>
</template>

<script>
  import {communicationWithNative, getQueryString} from '../../service/superGuide';
  import {getExamError,startStudyTime} from '../../api';
  import Header from '../../components/header'

  /**
   * @Author Visupervi
   * @Date 2019/12/17 9:54
   * @Name 查看试题解析组件
   * @Param
   * @Return
   * @Description
   */
  export default {
    name: "index",
    data() {
      return {
        isActive: true,  //上一题是否高亮
        isBtnGruop: true, // 按钮组是否显示
        isSubmitBtn: false, //是否显示提交按钮
        maskShow: false, //遮罩层
        breakFlag: false,//闯关标志
        quesNum: 1,//题号
        examList: [],// 试题列表
        didExamList: [], //已完成试题列表
        currentQues: "", //当前试题
        listCount: "", //题目总数
        quesName: "", // 题目
        questionId: "", // 题目ID
        rightId: "", // 正确答案ID
        submitShow: false,
        preNextShow: true,
        nextName: "下一题",
        preName: "上一题",
        scores: "",//得分数
        errNums: "",//错题数
        examId: "",
        examCode: "",
        // eTypeId: this.$route.params.eTypeId.toString(),
        // flag: this.$route.params.flag,//区别再学习还是去学习
        errShow: false,
        rightShow: false,
        sId: "",
        title: "答案解析",
        caurseId: ""
      }
    },
    beforeRouteLeave(to,from,next){
      // console.log("to",to);
      // console.log("from",from);
      if(to.name !== "evaluation" && to.name !== "courseBrief"){
        startStudyTime({lessonId: this.$route.params.lessonId});
        this.$router.replace(`/courseBrief/${this.$route.params.lessonId}/{${this.$route.params.fromName}}?accessToken=${getQueryString('accessToken')}`)
        }else{
        next();
      }
    },
    created() {
      this.getExamData();
      this.hideNativeHeder();

    },
    mounted() {
      // window.goBackTo = this.goBackTo;
      // this.setBack();
    },
    destroyed() {
      // window.removeEventListener('popstate',this.goBackTo,false);
    },
    methods: {

      //手势操作
      touchLeft(){
        // console.log("触发函数")
      },
      touchRight(){
        // console.log("向右滑动")
        startStudyTime({lessonId: this.$route.params.lessonId});
        this.$router.replace(`/courseBrief/${this.$route.params.lessonId}/${this.$route.params.fromName}?accessToken=${getQueryString('accessToken')}`).catch(err => {
          // console.log(err)
        })

      },
      //获取试题
      async getExamData() {
        let res = await getExamError({examId: this.$route.params.examId, lessonId: this.$route.params.lessonId,answerId:this.$route.params.answerId});
        if (parseInt(res.code) === 200) {
          this.examList = res.result.questions;
          this.currentQues = this.examList[0];
          this.setHei(this.currentQues);
          this.checkQuesType(this.currentQues.questionType);
          this.listCount = this.examList.length;
          this.examId = res.result.examId.toString();
          this.examCode = res.result.examCode.toString()
        }
      },
      //判断试题类型
      checkQuesType(type) {
        switch (type) {
          case 0:
            this.quesName = "单选题";
            break;

          case 1:
            this.quesName = "多选题";
            break;
          case 2:
            this.quesName = "判断题";
            break;
        }
      },
      //监听单选按钮的状态
      optionChange(value) {
      },
      //判断单选按钮选中状态
      getRadioRes(className) {
        let arr = [];
        let rdsObj = document.getElementsByClassName(className);
        for (let i = 0; i < rdsObj.length; i++) {
          if (rdsObj[i].checked) {
            let obj = {
              answerId: rdsObj[i].value
            };
            arr.push(obj)
          }
        }

        return arr;

      },

      // 点击下一题
      nextQuestion() {

        if (this.$route.params.flag === "1") {
          // console.log("this.$refs.btnName.children[0].innerHTML",this.$refs.btnName.children[0].innerHTML);
          if (this.$refs.btnName.children[0].innerHTML.trim() === "重新闯关") {
            startStudyTime({lessonId: this.$route.params.lessonId});
            this.$router.replace(`/courseBrief/${this.$route.params.lessonId}/${this.$route.params.fromName}?accessToken=${getQueryString('accessToken')}`).catch(err => {
              err
            })
          }
          if (this.$refs.btnName.children[0].innerHTML.trim() === "课程评价") {
            // this.$router.push(`/evaluation/${this.$route.params.taskCode}?accessToken=${getQueryString("accessToken")}`).catch(err => {
            //   err
            // })
          }
        } else {
          if (this.$refs.btnName.children[0].innerHTML.trim() === "返回") {
            startStudyTime({lessonId: this.$route.params.lessonId});
            this.$router.replace(`/courseBrief/${this.$route.params.lessonId}/${this.$route.params.fromName}?accessToken=${getQueryString('accessToken')}`).catch(err => {
              err
            })
          }
        }

        //点击下一题题目增加
        if (this.quesNum < this.examList.length) {
          this.quesNum += 1;
          this.currentQues = this.examList[this.quesNum - 1];
          this.setHei(this.currentQues);
          this.checkQuesType(this.currentQues.questionType);
          if (this.quesNum >= 1) {
            this.isActive = false;
            if (this.quesNum === this.examList.length) {
              this.submitShow = true;
              // this.preNextShow = false;
              // if (this.$route.params.flag === "1") {
              //   // this.$route.params.isPass === "8" ? this.nextName = "重新闯关" : this.nextName = "课程评价";
              // } else {
              //   this.nextName = "返回"
              // }
              this.nextName = "返回"
            } else {
              this.nextName = "下一题"
            }
          } else {
            return;
          }

        }
        //  点击上一题后再次点击下一题记录状态
        //使用异步处理，防止dom没更新完就获取数据
        this.$nextTick(() => {
          let rdsObj = this.$refs.answer;
          for (let i = 0; i < this.didExamList.length; i++) {
            if (this.didExamList[i].questionId === this.currentQues.questionId.toString()) {
              for (let j = 0; j < this.didExamList[i].answerids.length; j++) {
                for (let k = 0; k < rdsObj.length; k++) {
                  if (this.didExamList[i].answerids[j].answerId === rdsObj[k].value) {
                    rdsObj[k].checked = true;
                  }
                }
              }
            }
          }
        })
      },
      //点击上一题
      preQuestion() {
        this.quesNum -= 1;
        if (this.quesNum > 0) {
          this.nextName = "下一题";
          if (this.quesNum === 1) {
            this.isActive = true;
          }
          this.currentQues = this.examList[this.quesNum - 1];
          this.setHei(this.currentQues);
          this.checkQuesType(this.currentQues.questionType);
          //使用异步处理，防止dom没更新完就获取数据
          this.$nextTick(() => {
            let rdsObj = this.$refs.answer;
            for (let i = 0; i < this.didExamList.length; i++) {
              if (this.didExamList[i].questionId === this.currentQues.questionId.toString()) {
                for (let j = 0; j < this.didExamList[i].answerids.length; j++) {
                  for (let k = 0; k < rdsObj.length; k++) {
                    if (this.didExamList[i].answerids[j].answerId === rdsObj[k].value) {
                      rdsObj[k].checked = true;
                    }
                  }
                }
              }
            }
          })
        } else {
          this.quesNum = 1;
        }
      },
      //动态设置距离
      setHei(obj) {
        if (obj.title.length >= 20) {
          this.hei = Math.ceil(obj.title.length / 20) * 21;
        } else {
          this.hei = 21;
        }
        this.$refs.scrollWrap.style.marginTop = this.hei + 100 + 'px';
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
      //  去评价
      setBack() {
        // let handlerFn = this.goBackTo;
        window.android.setBackPressCallBack("goBackTo")
      },
      goBackTo() {

        this.$router.replace(`/courseBrief/${this.$route.params.lessonId}/${this.$route.params.fromName}?accessToken=${getQueryString('accessToken')}`).catch(err => {
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
  .question {
    height: 100%;
    overflow: hidden;
    /*题目类型样式*/

    .questionClass {
      font-family: PingFangSC-Semibold;
      font-size: 0.75rem;
      color: #9B9B9B;
      padding-left: 1rem;
      margin-bottom: .3rem;

      .currentQue {
        color: #16B473;
      }
    }

    /*题目样式*/

    .scrollWrap {
      margin-top: 9rem;
      /*height: 100%;*/
      overflow-y: scroll;
      margin-bottom: 3rem;

      .mui-radio, .mui-checkbox {
        display: flex;
        display: -webkit-flex;
        /*-webkit-justify-content: space-between;*/
        -webkit-align-items: center;
        align-items: center;
        margin-bottom: 1rem;

        label {
          font-family: PingFangSC-Regular;
          font-size: 0.7rem;
          color: #444444;
          word-break: break-all;
          /*position: absolute;*/
          z-index: 1;
          width: 70%;
          /*top: 50%;*/
        }

        input[type='radio']:checked:before, .mui-checkbox input[type='checkbox']:checked:before {
          color: #16B473;
        }

        input[type='radio']:checked:before, .mui-checkbox input[type='checkbox']:checked:before {
          content: "\e441";
        }


        input[type='radio'] {
          top: 50%;
          transform: translateY(-50%);
        }

        /*错误答案样式*/

        .answerErr {
          position: absolute;
          z-index: 1;
          right: 2rem;
          display: flex;
          align-items: center;
          display: -webkit-flex;
          /*-webkit-justify-content: space-between;*/
          -webkit-align-items: center;

          p {
            margin: 0;
            padding: 0;
            color: red;
          }
        ;

          i {
            font-weight: 600;
            color: red;
            margin-left: 0.475rem;
          }
        }

        /*正确答案样式*/

        .answerOk {
          position: absolute;
          z-index: 1;
          right: 2rem;
          display: flex;
          align-items: center;
          display: -webkit-flex;
          /*-webkit-justify-content: space-between;*/
          -webkit-align-items: center;

          p {
            margin: 0;
            padding: 0;
            font-family: PingFangSC-Regular;
            font-size: 0.625rem;
            color: #16B473;
            text-align: center;
          }
        ;

          i {
            font-weight: 600;
            color: #16B473;
            margin-left: 0.475rem;
          }
        }


      }

      .mui-checkbox input[type='checkbox']:checked:before {
        content: '\e441';
        color: #16B473;
      }

      /*答案解析样式*/

      .analyze {
        padding: 0 20px;

        .analyzeContent {
          font-size: 14px;

          span {
            color: #16B473;

          }
        }
      }
    }

    .className {
      font-family: PingFangSC-Semibold;
      font-size: 14px;
      color: #333333;
      padding-left: 1rem;
      margin-bottom: 1rem;
      padding-right: 0.25rem;
      box-sizing: border-box;
      font-weight: 600;
    }


    /*单选按钮样式*/


    /*正确答案样式*/

    .selectActive {
      &:before {
        content: " ";
        position: absolute;
        top: 0;
        left: 0;
        width: 17rem;
        height: 100%;
        background-image: linear-gradient(90deg, #FFFFFF 0%, #E5FEF6 100%);
      }

      &:after {
        content: " ";
        position: absolute;
        top: 0;
        right: 0.65rem;
        height: 100%;
        width: 37.2px;
        border-radius: 50%;
        background-color: #E5FEF6;
      }
    }

    /*底部按钮样式*/

    .btnGroup {
      display: flex;
      position: absolute;
      justify-content: space-between;
      align-items: center;
      display: -webkit-flex;
      -webkit-justify-content: space-between;
      -webkit-align-items: center;
      padding: 0 0.5rem;
      bottom: 0;
      width: 100%;
      height: 3rem;
      box-shadow: 0 -5px 10px 0 rgba(0, 0, 0, 0.05);
      user-select: none;

      button {
        width: 49%;
        /*flex: 1;*/
        background: #00CAB6;
        border-radius: 8px;
        border: 1px solid #00CAB6;
        height: 2rem;
        line-height: 1.95rem;
      }

      .btnNoActive {
        background-color: #ccc;
        border: 1px solid #ccc;
      }

      .btnSubmit {
        width: 98%;
        left: 50%;
        transform: translateX(-50%);
      }

    }

    /*mask样式*/

    .wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      display: -webkit-flex;
      -webkit-justify-content: center;
      -webkit-align-items: center;
      overflow: hidden;
      flex-direction: column;
      height: 100%;
      position: relative;

      .blockSuccess {
        width: 15.75rem;
        height: 18.05rem;
        background: url("../../assets/images/success.png");
        background-size: cover;
        position: relative;
      }

      .blockfaile {
        width: 15.75rem;
        height: 18.05rem;
        background: url("../../assets/images/fail.png");
        background-size: cover;
        position: relative;
      }

      .resultDis {
        display: flex;
        display: -webkit-flex;
        /*-webkit-justify-content: space-between;*/
        /*-webkit-align-items: center;*/
        position: absolute;
        width: 100%;
        height: 3.5rem;
        bottom: 5.25rem;

        .code, .rate {
          flex: 1;
          text-align: center;
          line-height: 2;

          .score {
            font-weight: 600;
            font-size: 20px;
          }

          .nums {
            font-size: 13px;
            color: #2E2E2E;;
          }
        }
      }

      .van-btn-group {
        display: flex;
        display: -webkit-flex;
        position: absolute;
        padding: 0 1rem;
        width: 100%;
        /*height: 3.5rem;*/
        justify-content: space-between;
        -webkit-justify-content: space-between;
        bottom: 2rem;

        .van-button--primary {
          width: 40%;
          border-radius: 10px;
          background-color: #00CAB6;
          border-color: #00CAB6;
        }
      }

      .close {
        height: 1.8rem;
        width: 1.8rem;
        /*background-color: red;*/
        margin-top: 1.5rem;
        border-radius: 50%;
        background: url("../../assets/images/Group 25.png");
        background-size: contain;
      }
    }
  }
</style>
