<template>
  <div class="question">

    <Header :title="title"></Header>
    <!--题干与选项-->
    <div class="questionClass" v-show="listCount" ref="">
      <span class="currentQue"><span v-if="quesNum < 10">0</span>{{quesNum}}</span>/{{listCount}} {{quesName}}
    </div>
    <div class="className" ref="className" v-show="currentQues">
      {{quesNum}}. {{currentQues.title}}
    </div>

    <div class="scrollWrap mui-scroll-wrapper" ref="scrollWrap">
      <div class="mui-scroll" ref="carouse">
        <!--这里放置真实显示的DOM内容-->
        <div class="options">
          <div class="mui-input-row mui-radio mui-left" v-for="(item,index) in currentQues.answers"
               :key="new Date().getTime() + index" v-if="quesName !== '多选题'">
            <label> {{item.content}}</label>
            <input v-if="quesName !== '多选题'" name="answer" type="radio" :value="item.answerId"
                   class="answer" :key="index" ref="answer">
          </div>
          <div class="mui-input-row mui-checkbox mui-left" v-if="quesName === '多选题'"
               v-for="(item,index) in currentQues.answers" :key="new Date().getTime() + index">
            <label>{{item.content}}</label>
            <input name="checkbox1" type="checkbox" :value="item.answerId" class="answer" v-if="quesName === '多选题'"
                   :key="index" ref="answer">
          </div>
        </div>
      </div>
    </div>


    <!--上一题下一题-->
    <div class="btnGroup" v-show="preNextShow">
      <van-button type="primary" size="large" :class="{btnNoActive:isActive}" @click="preQuestion"
                  :disabled="isDisabled">上一题
      </van-button>
      <van-button type="primary" size="large" @click="nextQuestion" ref="btnName">{{nextName}}</van-button>

    </div>
    <!--弹出层-->
    <van-overlay :show="maskShow" @click="maskShow = false" z-index="2">
      <div class="wrapper" @click.stop @dblclick.stop>
        <div :class="`block${breakFlag ? 'Success': 'faile'}`">
          <div class="resultDis">
            <div class="code">
              <div class="score">{{scores}}</div>
              <div class="nums">得分数/分</div>
            </div>
            <div class="rate">
              <div class="score">{{errNums}}</div>
              <div class="nums">错题数/数</div>
            </div>
          </div>
          <div class="van-btn-group">
            <van-button type="primary" size="small" @click="viewParsing">查看解析</van-button>
            <van-button v-show="errShow" type="primary" size="small" @click="gotoAgain">重新闯关</van-button>
            <van-button v-show="rightShow" type="primary" size="small" @click="gotoComment" ref="rightText">
              {{rightText}}
            </van-button>
          </div>
        </div>
        <div class="close" @click="closeMask">
        </div>
      </div>

    </van-overlay>
  </div>
</template>

<script>
  import {communicationWithNative, getQueryString} from '../../service/superGuide';
  import {getCourseCheckPoint, submitCheckPointQue, startStudyTime} from '../../api'
  import Header from '../../components/header'
  import {Notify} from 'vant'
  /**
   * @Author Visupervi
   * @Date 2019/12/17 9:54
   * @Name 闯关试题组件
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
        scores: "",//得分数
        errNums: "",//错题数
        examId: "",
        examCode: "",
        // eTypeId: this.$route.params.eTypeId.toString(),
        flag: this.$route.params.flag,//区别再学习还是去学习
        errShow: false,
        rightShow: false,
        rightText: "课程评价",
        title: "闯关",
        sId: "",
        isPass: "",
        isDisabled: true,
        hei: "",
        historyId: "",
        examName: "",
        answerId: ""
      }
    },
    created() {
      this.getExamData();
      this.hideNativeHeder();
    },
    mounted() {
      // window.addEventListener("popstate", (event) => {
      //   // this.$router.go(-1);
      // });
    },
    methods: {
      //获取试题
      async getExamData() {
        let res = await getCourseCheckPoint({
          examCode: this.$route.params.examCode,
          examId: this.$route.params.examId,
          examName: this.$route.params.examName,
          lessonId: this.$route.params.lessonId
        });
        if (parseInt(res.code) === 200) {
          this.examList = res.result.questionList;
          this.currentQues = this.examList[0]; // 默认显示第一题
          this.setHei(this.currentQues);
          this.checkQuesType(this.currentQues.questionType);
          this.listCount = this.examList.length;
          this.examId = res.result.examId.toString();
          this.examCode = res.result.examCode.toString();
          this.examName = res.result.examTitle;
        } else {
          this.quesNum = "";
          Notify({type: 'warning', message: `${res.msg}`});
        }
      },
      //动态设置距离
      setHei(obj) {
        // console.log(obj.title.length);
        if (obj.title.length >= 20) {
          this.hei = Math.ceil(obj.title.length / 20) * 21;
        } else {
          this.hei = 21;
        }
        this.$refs.scrollWrap.style.marginTop = this.hei + 100 + 'px';
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
      //判断多选按钮选中状态
      // 点击下一题
      /**
       * 点击下一题查看选中选项并添加到已做题数组中
       */
      nextQuestion() {
        let obj = {};
        // console.log('选择状态',this.getRadioRes("answer"));
        if (this.getRadioRes("answer").length > 0) {
          obj = {
            questionId: this.examList[this.quesNum - 1].questionId.toString(),
            answerids: this.getRadioRes("answer")
          };
          //判断已做题目中是否包含某一个的对象
          this.addDidQuestionList(this.didExamList, obj);
          if (this.didExamList.length === this.examList.length && this.$refs.btnName.children[0].innerHTML.trim() === "提交") {
            this.addDidQuestionList(this.didExamList, obj);
            // console.log('已做题目',this.didExamList);
            //提交考试
            submitCheckPointQue({
              examId: this.examId,
              examCode: this.examCode,
              eTypeId: this.eTypeId,
              lessonId: this.$route.params.lessonId,
              examName: this.examName,
              queList: JSON.stringify(this.didExamList)
            }).then(res => {
              if (parseInt(res.code) === 200) {
                this.maskShow = true;
                this.historyId = res.historyId;
                this.answerId = res.result[6];
                this.isPass = res.result[5];
                if (this.$route.params.flag === "1") {
                  res.result[5] === "8" ? this.breakFlag = false : this.breakFlag = true;
                  res.result[5] === "8" ? this.errShow = true : this.rightShow = true;
                } else {
                  res.result[5] === "8" ? this.breakFlag = false : this.breakFlag = true;
                  res.result[5] === "8" ? this.errShow = true : this.rightShow = true;
                  this.rightText = "课程评价"
                }
                this.scores = res.result[0];
                let num = res.result[5] === "8" ? "2" : "1";
                this.errNums = res.result[2];
                this.sId = res.result[res.result.length - 1];
              } else if (parseInt(res.code) === 3008) {
                mui.alert(`${res.msg}`, "提醒", () => {
                  if (that.$route.params.fromName === "collageCourse") {
                    communicationWithNative({
                      method: 'finish',
                      args: null
                    }, {
                      method: 'finish',
                      args: []
                    });
                  } else {
                    this.$router.replace(`/${this.$route.params.fromName}?accessToken=${getQueryString('accessToken')}`).catch(err => {
                      err
                    })
                  }
                })
              }
            })
          } else if (this.$refs.btnName.children[0].innerHTML.trim() === "提交") {
            // this.$messagebox.alert("请先做完全部题目").then(res => {
            //   // this.$router.go(0);
            // })
            mui.alert(`请先做完全部题目`, "提醒", () => {
            })
          }
        } else {
          for (let i = 0; i < this.didExamList.length; i++) {
            if (this.examList[this.quesNum - 1].questionId.toString() === this.didExamList[i].questionId) {
              // console.log('当前题目',this.didExamList[i].questionId);
              this.didExamList.splice(i, 1)
            }
          }
          if (this.didExamList.length !== this.examList.length && this.$refs.btnName.children[0].innerHTML.trim() === "提交") {
            mui.alert(`请先做完全部题目`, "提醒", () => {
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
            this.isDisabled = false;
            this.isActive = false;
            if (this.quesNum === this.examList.length) {
              this.submitShow = true;
              // this.preNextShow = false;
              this.nextName = "提交"
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
        if (this.getRadioRes("answer").length > 0) {
          let obj = {
            questionId: this.examList[this.quesNum - 1].questionId.toString(),
            answerids: this.getRadioRes("answer")
          };
          //判断数中是否包含某一个的对象
          this.addDidQuestionList(this.didExamList, obj)
        } else {
          for (let i = 0; i < this.didExamList.length; i++) {
            if (this.examList[this.quesNum - 1].questionId.toString() === this.didExamList[i].questionId) {
              // console.log('当前题目',this.didExamList[i].questionId);
              this.didExamList.splice(i, 1)
            }
          }
        }
        this.quesNum -= 1;
        if (this.quesNum > 0) {
          this.nextName = "下一题";
          if (this.quesNum === 1) {
            this.isActive = true;
            this.isDisabled = true
          } else {
            this.isDisabled = false
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
      //是否添加到已做题目中
      addDidQuestionList(arr, obj) {
        //判断数中是否包含某一个的对象
        let findResult = arr.find((v) => {
          if (v.answerids.length > 1) {
            return v.questionId === obj.questionId && v.answerids.length === obj.answerids.length
          } else if (v.answerids.length === 1) {
            return v.questionId === obj.questionId && v.answerids[0] === obj.answerids[0]
          } else {
            return v.questionId === obj.questionId
          }
        });
        if (findResult === undefined) {
          if (arr.length === 0) {
            arr.push(obj)
          } else {
            for (let i = 0; i < arr.length; i++) {
              if (arr[i].questionId === obj.questionId) {
                arr[i].answerids = obj.answerids;
                break;
              } else if (i === arr.length - 1) {
                arr.push(obj)
              }
            }
          }
        }
      },
      //关闭mask
      closeMask() {
        this.maskShow = false;
        // this.startStudyDate();
        this.$router.replace(`/courseBrief/${this.$route.params.lessonId}/${this.$route.params.fromName}?accessToken=${getQueryString('accessToken')}`).catch(err => {
          err
        })
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
      //  查看解析
      viewParsing() {
        this.$router.replace(`/viewParsing/${this.answerId}/${this.examId}/${this.$route.params.lessonId}/${this.$route.params.fromName}?accessToken=${getQueryString('accessToken')}`).catch(err => {
          err
        })
      },
      //  重新闯关
      gotoAgain() {
        // this.startStudyDate();
        this.$router.replace(`/courseBrief/${this.$route.params.lessonId}/${this.$route.params.fromName}?accessToken=${getQueryString('accessToken')}`).catch(err => {
          err
        })
      },
      //  去评价
      gotoComment() {
        let str = this.$refs.rightText.children[0].innerHTML.toString().trim();
        if (str === "课程评价") {
          this.$router.replace(`/evaluation/${this.$route.params.lessonId}/${this.$route.params.fromName}?accessToken=${getQueryString('accessToken')}`).catch(err => {
            err
          })
        } else {
          // this.$router.push(`/evaluation/${this.$route.params.taskCode}?accessToken=${getQueryString('accessToken')}`).catch(err => {
          //   err
          // })
        }
      },
      async startStudyDate() {
        let res = await startStudyTime({lessonId: this.$route.params.lessonId})
      },
    },
    components: {
      Header
    }
  }
</script>

<style scoped lang="less">
  .question {
    height: calc(100% - 60px);
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
      margin-top: 10rem;
      /*height: 100%;*/

      overflow-y: scroll;
      margin-bottom: 3rem;

      .mui-radio, .mui-checkbox {
        display: flex;
        display: -webkit-flex;
        align-items: center;
        -webkit-align-items: center;
        margin-bottom: 1rem;

        label {
          font-family: PingFangSC-Regular;
          font-size: 0.7rem;
          color: #444444;
          word-break: break-all;
          /*position: absolute;*/
          z-index: 1;
          width: 100%;
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
          display: -webkit-flex;
          align-items: center;
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
          display: -webkit-flex;
          align-items: center;
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
    }

    .className {
      font-family: PingFangSC-Semibold;
      font-size: 14px;
      color: #333333;
      padding-left: 1rem;
      margin-bottom: 1rem;
      padding-right: 0.25rem;
      font-weight: 600;
      box-sizing: border-box;
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
      display: -webkit-flex;
      position: absolute;
      justify-content: space-between;
      -webkit-justify-content: space-between;
      align-items: center;
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
        background-color: #00CAB6;
        border: 1px solid #00CAB6;
        border-radius: 8px;
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
      display: -webkit-flex;
      align-items: center;
      -webkit-align-items: center;
      justify-content: center;
      -webkit-justify-content: center;
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
          border: 1px solid #00CAB6;
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
