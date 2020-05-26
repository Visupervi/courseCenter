<template>
  <div class="studyApp">
    <Header :title="title"></Header>
    <van-tabs v-model="active" sticky @change="tabOnchange">
      <van-tab v-for="index in titleName" :title="index" :key="index" >

      </van-tab>
    </van-tabs>

    <!--差错列表，可以提出来组成一个组件-->
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
              <button type="button" class="mui-btn" @click="goTostudy(item.courseId,item.eTypeId,item.taskCode)">去学习</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <propover :show.sync="isShow" @getSendData='getMsgFormSon' ref="child" v-show="!isNull"></propover>
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
  import Propover from '../../components/propover/propover'
  import {getFailErrorStudy, setErrorStatus,getStudyDataList,recordStudy} from '../../api';

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
        active: 0,
        errorList: [],
        loading: false,
        finished: false,
        refreshing: false,
        activeNames: [],
        title: "差错学习",
        flag: "1",//待学习标志
        timer: null,
        titleName: ['待学', '已学'],
        isShow: false,
        isNull: false
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
        let res = await getStudyDataList({flag: this.flag});
        if (res.code === 200) {
          if (res.result.length > 0) {
            this.errorList = res.result;
          } else {
            this.isNull = true
          }

        }
      },
      //返回按钮
      onClickLeft() {
        // console.log("aaaaaa")
      },
      getMsgFormSon(data) {
        this.isShow = data;
      },

      //现实差错条数
      showErrorNum(id,taskCode) {
        this.isShow = true;
        this.$refs.child.getParentData({
          show: this.isShow,
          eTypeId: id,
          taskCode:taskCode,
          flag:this.flag
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
      async goTostudy(id, eId,tCode) {
        // console.log(id,eId);
        let res = await setErrorStatus({eTypeId: eId,taskCode: tCode});
        if (parseInt(res.code) === 200) {
          if (id !== "") {
            let result = await recordStudy({flag:"1",taskCode:tCode});
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
      Propover
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
      align-items: center;
      display: -webkit-flex;
      -webkit-align-items: center;

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
            pointer-events:none;
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

              .imgWrap {
                height: 2.571rem;
                width: 2.571rem;

                img {
                  width: 100%;
                  -webkit-touch-callout: none;
                  pointer-events:none;
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

  }
</style>
