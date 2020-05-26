<template>
  <div class="studyApp">
    <Header :title="title"></Header>
    <van-tabs v-model="active" sticky @change="tabOnchange">
      <van-tab v-for="index in titleName" :title="index" :key="index">

      </van-tab>
    </van-tabs>
    <div class="calenderIcon" @click="showCalender">
      <img src="../../assets/images/calIcon.png" alt="">
    </div>

    <div class="errorScroll" v-show="!isNull">
      <div class="mui-scroll-wrapper scrollWrap" ref="scrollWrap">
        <div class="mui-scroll">
          <ul class="mui-table-view">
            <li class="mui-table-view-cell" v-for="(item,index) in errorList" :key="index">
              <div class="errorListWrap">
                <div>
                  <div class="imgWrap"><img src="../../assets/images/icon.png" alt=""></div>
                </div>
                <div class="errorName">
                  <p>{{item.typeName}}</p>
                  <p @click="showErrorNum(item.eTypeId,item.taskCode)">{{item.nums}}条差错</p>
                </div>
              </div>
              <button type="button" class="mui-btn" @click="goTostudy(item.courseId,item.eTypeId,item.taskCode)">再学习
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <propover :show.sync="isShow" @getSendData='getMsgFormSon' ref="child" v-show="!isNull"></propover>
    <calender-prop v-show="show" ref="calender" @getCalenderData="getsonCalender"></calender-prop>
    <div class="errorListNull" v-show="isNull">
      <div class="nullWrap">
        <div class="bgImg"></div>
        <p>暂无差错信息哦</p>
      </div>

    </div>
  </div>

</template>

<script>
  import '../../assets/iconfont/iconfont.css';
  import {communicationWithNative, getQueryString, overscroll, getDeviceInfo} from '../../service/superGuide';
  import Header from '../../components/header';
  import Propover from '../../components/propover/propover';
  import calenderProp from '../../components/calenderProp/calenderProp'
  import {historydataList, recordStudy, setErrorStatus, getStudyDataList} from '../../api';

  /**
   * @Author Visupervi
   * @Date 2019/12/16 10:53
   * @Name  学习列表
   * @Param
   * @Return
   * @Description 学习类型列表
   */
  export default {
    name: "index",
    data() {
      return {
        active: 1,
        errorList: [],
        loading: false,
        finished: false,
        refreshing: false,
        activeNames: [],
        title: "差错学习",
        flag: "2",//待学习标志
        timer: null,
        titleName: ['待学', '已学'],
        isShow: false,
        isNull: false,
        ids: "",
        endTime: "",
        startTime: "",
        show: false,
      }
    },
    created() {
      this.getFailStudy();
      // this.hideNativeHeder();
    },
    mounted() {
      overscroll(this.$refs.scrollWrap);

    },
    methods: {
      //获取差错类型数据
      async getFailStudy() {
        let res = await historydataList({
          flag: this.flag,
          startTime: this.startTime,
          endTime: this.endTime
        });
        if (res.code === 200) {
          if (res.result.length > 0) {
            this.isNull = false;
            this.errorList = res.result;
          } else {
            this.isNull = true
          }

        }
      },
      //展示日历
      showCalender() {
        this.show = true;
        this.isShow = false;
        this.$refs.calender.getParentData({
          show: this.show
        })

      },

      //返回按钮
      onClickLeft() {
        // console.log("aaaaaa")
      },
      //获取差错详情子组件传值
      getMsgFormSon(data) {
        // console.log("子组件", data);
        this.isShow = data;
      },
      //获取日历子组件传值
      getsonCalender(data) {
        this.startTime = this.formatTime(data.startTime);
        this.endTime = `${this.formatTime(data.endTime).split(" ")[0]} 23:59:59`;
        this.show = data.show;
        this.getFailStudy();

      },
      //日期格式化
      formatTime(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();

        return [year, month, day].map(this.formatNumber).join('-') + ' ' + [hour, minute, second].map(this.formatNumber).join(':')
      },
      // 初始化数字
      formatNumber(n) {
        n = n.toString()
        return n[1] ? n : '0' + n
      },

      //显示差错条数
      showErrorNum(id, taskCode) {
        this.isShow = true;
        this.$refs.child.getParentData({
          show: this.isShow,
          eTypeId: id,
          flag: this.flag,
          taskCode: taskCode
        })
      },
      //获取dom元素
      getDoms(el) {
        return document.querySelectorAll(el);
      },
      //获取版本号
      get_android_version() {
        let ua = navigator.userAgent.toLowerCase();
        let version = null;
        if (ua.indexOf("android") > 0) {
          let reg = /android [\d._]+/gi;
          let v_info = ua.match(reg);
          version = (v_info + "").replace(/[^0-9|_.]/ig, "").replace(/_/ig, "."); //得到版本号4.2.2
          version = parseInt(version.split('.')[0]);// 得到版本号第一位
        }

        return version;
      },
      //加载更多
      onLoad() {
        if (this.list.length < 20) {
          for (let i = 0; i < 5; i++) {
            this.list.push({
              errName: "K开单地址不详",
              errNum: i + 100
            },)
          }
          this.loading = false;
        } else {
          this.finished = true;
        }

      },


      //tab栏切换
      tabOnchange(index) {
        // console.log("index", index);
        if (index === 0) {
          this.$router.replace(`/myStudy?accessToken=${getQueryString('accessToken')}`).catch(err => {
            err
          })
        } else {
          this.$router.replace(`/historyStudy?accessToken=${getQueryString('accessToken')}`).catch(err => {
            err
          })
        }
      },
      //去学习
      async goTostudy(id, eId, tCode) {

        // console.log(eId);
        // let res = await setErrorStatus({eTypeId: eId,taskCode:tCode});
        // if (parseInt(res.code) === 200) {
        let result = recordStudy({flag: "1", taskCode: tCode});
        if (id !== "") {
          this.$router.replace(`/courseBrief/${tCode}/${this.flag}?accessToken=${getQueryString("accessToken")}`).catch(err => {
            err
          })
        } else {
          this.$messagebox({
            message: "暂无绑定课程，请联系管理员绑定课程",
            type: "warning",
            showClose: true
          })
        }

      },
      collapseChange(name) {
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
      //  获取toekn
    },
    components: {
      Header,
      Propover,
      calenderProp
    },
    beforeDestroy() {
      clearInterval(this.timer);
    }
  }
</script>

<style scoped lang="less">
  .studyApp {
    height: 100%;

    .scrollWrap {
      height: 100%;
      overflow-y: scroll;
    }

    .title {
      display: flex;
      display: -webkit-flex;
      /*//-webkit-justify-content: space-between;*/
      -webkit-align-items: center;
      align-items: center;

      .van-button--primary {
        background-color: #16B473;
        width: 3.85rem;
        vertical-align: middle;
      }

      .titleLeft {
        /*float: left;*/
        flex: 1;
        display: flex;
        display: -webkit-flex;
        /*//-webkit-justify-content: space-between;*/
        /*//-webkit-align-items: center;*/

        p {
          margin: 0;
          padding: 0;
        }

        .typeImg {
          width: 2.1rem;
          height: 2.1rem;
          border-radius: 50%;
          border: 1px solid #F3F3F3;
          box-sizing: border-box;
          overflow: hidden;
          background-color: #F3F3F3;

          img {
            width: 100%;
            height: 100%;
            user-select: none;
            -webkit-user-select: none;
            -webkit-touch-callout: none;
          }
        }

        .typeTile {
          margin-left: 0.5rem;
          color: #2D2D2D;
          font-size: 0.7rem;
          font-weight: 600;

          p {
            font-size: 0.6rem;
            color: #2E2E2E;
            font-weight: 500;
          }
        }
      }

      .titleRight {
        flex: 1;
        text-align: right;

        .van-button {
          i {
            position: absolute;
            top: 50%;
            right: 0.25rem;
            transform: translateY(-50%);
          }
        }

        /*float: right;*/
      }
    }


    .onepxLine {
      width: 1px;
      height: 0.925rem;
      background-color: #E3E3E3;
      transform: scaleX(.5)
    }

    .mui-table-view-cell:after, .mui-table-view:after, .mui-table-view:before {
      height: 0;
    }

    .van-tabs {
      margin-bottom: 0.914rem;
    }

    .dateRange {
      height: 20px;
    }

    .errorScroll {
      position: relative;
      height: calc(100% - 120px);
      overflow-y: scroll;

      .scrollWrap {
        .mui-table-view {
          background-color: #fafafa;

          .mui-table-view-cell {
            background-color: #fff;
            margin-bottom: 0.457rem;

            .errorListWrap {
              display: flex;
              display: -webkit-flex;
              /*//-webkit-justify-content: space-between;*/
              /*//-webkit-align-items: center;*/
              .imgWrap {
                height: 2.571rem;
                width: 2.571rem;

                img {
                  width: 100%;
                }
              }

              .errorName {
                margin-left: 0.457rem;

                p:nth-child(1) {
                  font-family: PingFangSC-Medium;
                  font-size: 0.914rem;
                  color: #333333;
                  line-height: 1.257rem;
                }

                p:nth-child(2) {
                  margin-top: 0.486rem;
                  font-family: PingFangSC-Regular;
                  font-size: 0.629rem;
                  color: #0181FF;
                }
              }

            }

            .mui-btn {
              width: 4.571rem;
              height: 1.714rem;
              background: #00CAB6;
              border-radius: 0.886rem;
              color: #fff;
              border: none;
            }
          }

        }

      }

    }

    .errorListNull {
      height: calc(100% - 97px);
      position: relative;

      .nullWrap {
        position: absolute;
        width: 7.543rem;
        height: 6.143rem;
        top: 40%;
        left: 50%;

        transform: translate(-50%, -40%);

        .bgImg {
          width: 100%;
          height: inherit;
          background-image: url("../../assets/images/null.png");
          background-size: cover;
        }

        p {
          text-align: center;
          margin-top: 1.229rem;
          font-family: PingFangSC-Regular;
          font-size: 0.8rem;
          color: #999999;
        }
      }
    }

    .calenderIcon {
      position: absolute;
      top: 0.571rem;
      right: 0.571rem;
      width: 20px;
      height: 20px;
      z-index: 10;

      img {
        width: 100%;
      }
    }

  }
</style>
