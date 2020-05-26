<!--排行榜总组件-->
<template>
  <div class="rankList">
    <div class="bgcImg">
      <!--header-->
      <Header :title="rankTitle" @childFn="parentFn"></Header>
      <!--tab栏切换-->
      <div class="tabsSwitch">
        <van-tabs @click="onClick" v-model="active">
          <van-tab v-for="(item,index) in titleObj.headTitle" :title="item" :key="index">
            <!--内容 {{ index }}-->
          </van-tab>
        </van-tabs>
      </div>
      <div class="cardRank" v-if="topThree.length > 0">
        <div class="No">
          <div>
            <div class="NoIcon">
              <img src="../../assets/images/3.png" alt="">
            </div>
            <div class="Avatar">
              <img v-if="topThree[2].userInfo.head_pic !== ''" :src="topThree[2].userInfo.head_pic" alt="">
              <img v-if="topThree[2].userInfo.head_pic === ''" src="../../assets/images/avatar.png" alt="">
            </div>
          </div>
          <div>
            <p class="nameId">{{topThree[2].userInfo.login_name.split("@")[0]}}</p>
            <p class="name">{{topThree[2].userInfo.name}}</p>
          </div>

          <div>
            <p>
              <span v-if="topThree[2].flag ==='1'" class="hour">{{topThree[2].totalTime}}h</span>
              <span v-if="topThree[2].flag ==='2'" class="hour">{{topThree[2].totalTime}}h</span>
              <span v-if="topThree[2].flag ==='1'"
                    :class="{'mui-icon':true,'mui-icon-arrowthinup':topThree[2].status === 0,'mui-icon-arrowthindown':topThree[2].status === 1,'iconDown':topThree[2].status === 1}">
                <span>{{topThree[2].rate.toFixed(2) +"%"}}</span>
              </span>
            </p>
          </div>
        </div>
        <div class="No">
          <!--创建立体图形-->
          <div class="trigon"></div>
          <div class="trigon2"></div>
          <div class="trigonTop"></div>
          <!--创建头像与其他-->
          <div>
            <div class="NoIcon">
              <img src="../../assets/images/1.png" alt="">
            </div>
            <div class="Avatar">
              <img v-if="topThree[0].userInfo.head_pic!== ''" :src="topThree[0].userInfo.head_pic" alt="">
              <img v-if="topThree[0].userInfo.head_pic === ''" src="../../assets/images/avatar.png" alt="">

            </div>
          </div>
          <div>
            <p class="nameId">{{topThree[0].userInfo.login_name.split("@")[0]}}</p>
            <p class="name">{{topThree[0].userInfo.name}}</p>
          </div>

          <div>
            <p>
              <span v-if="topThree[0].flag ==='1'" class="hour">{{topThree[0].totalTime}}h</span>
              <span v-if="topThree[0].flag ==='2'" class="hour">{{topThree[0].totalTime}}h</span>
              <span v-if="topThree[0].flag ==='1'"
                    :class="{'mui-icon':true,'mui-icon-arrowthinup':topThree[0].status === 0,'mui-icon-arrowthindown':topThree[0].status === 1,'iconDown':topThree[0].status === 1}">
                <span>{{topThree[0].rate.toFixed(2) +"%"}}</span>
              </span>
            </p>
          </div>
        </div>
        <div class="No">
          <div>
            <div class="NoIcon">
              <img src="../../assets/images/2.png" alt="">
            </div>
            <div class="Avatar">
              <img v-if="topThree[1].userInfo.head_pic !== ''" :src="topThree[1].userInfo.head_pic" alt="">
              <img v-if="topThree[1].userInfo.head_pic === ''" src="../../assets/images/avatar.png" alt="">

            </div>
          </div>
          <div>
            <p class="nameId">{{topThree[1].userInfo.login_name.split("@")[0]}}</p>
            <p class="name">{{topThree[1].userInfo.name}}</p>
          </div>

          <div>
            <p>
              <span v-if="topThree[1].flag ==='1'" class="hour">{{topThree[1].totalTime}}h</span>
              <span v-if="topThree[1].flag ==='2'" class="hour">{{topThree[1].totalTime}}h</span>
              <span v-if="topThree[1].flag ==='1'"
                    :class="{'mui-icon':true,'mui-icon-arrowthinup':topThree[1].status === 0,'mui-icon-arrowthindown':topThree[1].status === 1,'iconDown':topThree[1].status === 1}">
                <span>{{topThree[1].rate.toFixed(2) +"%"}}</span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="rankListParent">
      <!--tab切换-->
      <div class="btnWrap">
        <van-tabs @click="clickHandler">
          <van-tab title="月榜"></van-tab>
          <van-tab title="总榜"></van-tab>
        </van-tabs>
      </div>
      <!--排行榜列表-->
      <div class="rankListWrap">
        <rank-component :titleObj="titleObj" @getTopThreeData="getChildData"></rank-component>
      </div>
    </div>
    <div class="deepDisplay" v-if="deepDisplay.length > 0">
      <ul class="mui-table-view">
        <li class="mui-table-view-cell" v-for="(item,index) in deepDisplay" :key="index">
          <div class="errorListWrap">
            <div class="noList">
              <span><span v-if="item.rankIndex < 10">0</span>{{item.rankIndex}}</span>
            </div>
            <div class="errorName">
              <div v-if="item.userInfo.head_pic !== ''" class="imgWrap"><img :src="item.userInfo.head_pic" alt=""></div>
              <div v-if="item.userInfo.head_pic === ''" class="imgWrap"><img src="../../assets/images/avatar.png" alt="">
              </div>
              <!--<p>雨雪天气，安全驾驶规范</p>-->
              <!--<p>雨雪天气，安全驾驶规范</p>-->
              <div class="textWrap">
                <p>{{item.userInfo.name}}<span class="idNo">{{item.userInfo.login_name.split("@")[0]}}</span></p>
                <p>{{item.userInfo.shop_name}}</p>
              </div>
            </div>
            <div class="studyHours">
              <span v-if="flag ==='1'">{{item.totalTime}}h</span>
              <span v-if="flag==='2'">{{item.totalTime}}h</span>
              <span v-if="flag === '1'"
                    :class="{'mui-icon':true,'mui-icon-arrowthinup':item.status.toString() === '0','mui-icon-arrowthindown':item.status.toString() === '1','iconDown':item.status.toString() === '1'}">
                <span>{{item.rate.toFixed(2) +"%"}}</span>
              </span>
            </div>
          </div>
        </li>

      </ul>
    </div>
  </div>
</template>

<script>
  /**
   * @Author Visupervi
   * @date 2020/3/30 15:47
   * @param
   * @return
   *
   */
  import Header from '../../components/header';
  import rankComponent from '../../components/rankComponent/rankComponent';
  import {communicationWithNative, getQueryString, getDeviceInfo, overscroll} from '../../service/superGuide';
  import {Toast} from 'vant';
  export default {
    name: "index",
    data() {
      return {
        timer: "",
        rankTitle: "学霸排行榜",
        btnActiveShow: false,
        active: 1,
        flag: "",
        titleObj: {
          headTitle: ["小区排名","部门排名","大区排名"],//"大区排名","小区排名","店铺排名"
          monthOrAll: "月榜",
          currentTitle: "部门排名",
          isLoad: false
        },
        topThree: [],
        deepDisplay: [],
        deepFlag: true
      }
    },
    created() {
      this.hideNativeHeder()
    },
    mounted() {
    },
    methods: {
      //获取子组件(header组件)的传值
      parentFn(flag) {
        if (!flag) {
          clearInterval(this.timer);
        }
      },
      //部门，全国，事业部tab切换
      onClick(name, title) {
        // console.log("title",title);
        this.titleObj.currentTitle = title;
        this.titleObj.isLoad = false;
        this.topThree = [];
        this.deepDisplay = [];
      },
      //月榜总榜tab切换
      clickHandler(name, title) {
        this.titleObj.monthOrAll = title;
        this.titleObj.isLoad = false;
        this.topThree = [];
        this.deepDisplay = [];
      },
      getChildData(data) {
        this.topThree = data.topThree;
        // console.log("this.topThree", this.topThree);
        this.deepDisplay = data.deepArr;
        this.flag = data.isAllOrMonth;
      },
      //隐藏原生头部
      hideNativeHeder() {
        communicationWithNative({
          method: 'hideTitle',
          args: null,
        }, {
          method: '',
          args: []
        })
      },
    },
    components: {
      Header,
      rankComponent
    }
  }
</script>

<style scoped lang="less">
  .rankList {
    height: 100%;
    position: relative;

    .cardRank {
      position: relative;
      width: 90%;
      background-color: #fff;
      height: 7.971rem;
      border-radius: 0.457rem;
      left: 50%;
      margin-top: 2.371rem;
      display: flex;
      transform: translateX(-50%);
      flex-direction: row;

      div {
        flex: 1;
      }

      & div:nth-child(3) {
        border-radius: 0 0.457rem 0.457rem 0;
      }

      /*第一名的样式*/

      & div:nth-child(2) {
        /*background-color: fuchsia;*/
        position: relative;
        /*transform: perspective(3D);*/

        .trigon {
          position: absolute;
          width: 0;
          height: 0;
          top: 0.086rem;
          left: -0.314rem;
          border-color: transparent #E9F2FF;
          border-width: 0px 0.314rem 6.571rem 0px;
          border-style: solid;
          z-index: 99;
        }

        .trigon2 {
          position: absolute;
          width: 0;
          height: 0;
          top: 0.086rem;
          right: -0.314rem;
          z-index: 99;
          border-color: transparent #E9F2FF;
          border-width: 0px 0px 6.571rem 0.314rem;
          border-style: solid;
        }

        .trigonTop {
          width: 100%;
          height: 0.843rem;
          border-radius: 0.457rem 0.457rem 0 0;
          position: absolute;
          top: -0.829rem;
          background-color: #fff;
        }

        /*头像样式*/

        & div:nth-child(4) {
          .NoIcon {
            position: relative;
            top: -0.286rem;
            left: 50%;
            transform: translateX(-50%);
            width: 1.457rem;
            height: 1.257rem;

            img {
              width: 100%;
              user-select: none;
              -webkit-user-select: none;
            }
          }

          .Avatar {
            width: 3.429rem;
            height: 3.429rem;
            border-radius: 50%;
            position: relative;
            left: 50%;
            top: -0.471rem;
            border: 2px solid #FFAE00;
            transform: translateX(-50%);

            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              user-select: none;
              -webkit-user-select: none;
            }
          }
        }

        /*姓名编号样式*/

        & div:nth-child(5) {
          background-color: #fff;

          .nameId {
            width: 3.343rem;
            height: 0.971rem;
            color: #C79B41;
            font-size: 0.629rem;
            background: #FFF6E2;
            border-radius: 0.486rem;
            position: relative;
            left: 50%;
            top: -0.8rem;
            transform: translateX(-50%);
            text-align: center;
            margin-bottom: 0px;
          }

          .name {
            font-family: PingFangSC-Medium;
            font-size: 0.686rem;
            color: #000000;
            text-align: center;
            margin-bottom: 0px;
            margin-top: -0.843rem;
          }
        }

        & div:nth-child(6) {
          display: flex;
          align-items: center;
          margin-top: 0.286rem;

          p {
            background-color: #fff;
            margin-bottom: 0px;
            flex: 1;
            display: flex;
            justify-content: center; /* 水平居中 */
            align-items: center; /* 垂直居中 */

            .hour {
              font-family: PingFangSC-Medium;
              font-size: 0.857rem;
              color: #F7B500;
              line-height: 1;
            }

            .mui-icon {
              background: #F1F1F1;
              border-radius: 0.514rem;
              width: 3.029rem;
              height: 0.971rem;
              text-align: center;
              font-size: 0.686rem;
              color: #FF5651;
              margin-left: 0.286rem;
              display: flex;
              align-items: center; /* 垂直居中 */
              justify-content: center; /* 水平居中 */

              span {
                font-size: 0.656rem;
                color: #707070;
                display: flex;
                align-items: center; /* 垂直居中 */
                justify-content: center;
              }
            }

            .iconDown {
              color: #2FCF49;
            }

          }

        }
      }

      /*第三名样式*/

      .No {
        border-radius: 0.457rem 0 0 0.457rem;
        /*头像样式*/

        & div:nth-child(1) {
          .NoIcon {
            position: relative;
            top: 0.286rem;
            left: 50%;
            transform: translateX(-50%);
            width: 1.457rem;
            height: 1.314rem;

            img {
              width: 100%;
              user-select: none;
              -webkit-user-select: none;
            }
          }

          .Avatar {
            width: 2.857rem;
            height: 2.857rem;
            border-radius: 50%;
            position: relative;
            left: 50%;
            transform: translateX(-50%);

            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              user-select: none;
              -webkit-user-select: none;
            }
          }
        }

        /*姓名编号样式*/

        & div:nth-child(2) {
          background-color: #fff;

          .nameId {
            width: 3.343rem;
            height: 0.971rem;
            color: #C79B41;
            font-size: 0.629rem;
            background: #FFF6E2;
            border-radius: 0.486rem;
            position: relative;
            left: 50%;
            top: -0.286rem;
            transform: translateX(-50%);
            text-align: center;
            margin-bottom: 0px;
          }

          .name {
            font-family: PingFangSC-Medium;
            font-size: 0.686rem;
            color: #000000;
            text-align: center;
            margin-bottom: 0px;
          }
        }

        & div:nth-child(3) {
          display: flex;
          align-items: center;
          margin-top: 0.286rem;

          p {
            background-color: #fff;
            margin-bottom: 0px;
            flex: 1;
            display: flex;
            justify-content: center; /* 水平居中 */
            align-items: center; /* 垂直居中 */

            .hour {
              font-family: PingFangSC-Medium;
              font-size: 0.857rem;
              color: #F7B500;
              line-height: 1;
            }

            .mui-icon {
              background: #F1F1F1;
              border-radius: 0.514rem;
              width: 3.029rem;
              height: 0.971rem;
              text-align: center;
              font-size: 0.686rem;
              color: #FF5651;
              margin-left: 0.286rem;
              display: flex;
              align-items: center; /* 垂直居中 */
              justify-content: center; /* 水平居中 */

              span {
                font-size: 0.656rem;
                color: #707070;
                display: flex;
                align-items: center; /* 垂直居中 */
                justify-content: center;
              }
            }

            .iconDown {
              color: #2FCF49;
            }

          }

        }
      }
    }

    /*背景图片样式*/

    .bgcImg {
      background: url("../../assets/images/bj.png") no-repeat;
      /*background-repeat:no-repeat;*/
      background-size: cover;
      padding-bottom: 1.029rem;
      user-select: none;
      -webkit-user-select: none;

      .tabsSwitch {
        background-color: transparent;
      }

      .van-nav-bar {
        background-color: transparent;
      }

    }

    /*排行榜样式*/

    .rankListParent {
      border-radius: 0.486rem;
      background-color: #fff;
      margin-top: -0.286rem;
      height: 100%;

      .btnWrap {
        height: 2rem;
        position: relative;
        background: #F4F4F4;
      }

      .rankListWrap {
        height: 100%;
        margin-top: 0.486rem;
        position: relative;
      }
    }

    .deepDisplay {
      position: fixed;
      background: #E2F1FF;
      bottom: 0;
      z-index: 9;
      width: 100%;
      border-radius: 1.143rem 1.143rem 0 0;
      .mui-table-view{
        border-radius: 1.143rem 1.143rem 0 0;
        &::before{
          background-color: transparent;
        }
        &::after{
          background-color: transparent;
        }
      }
      .mui-table-view-cell {
        background: #E2F1FF;
        border-radius: 1.143rem 1.143rem 0 0;
        padding: 0.286rem 0 0.286rem 0.429rem;
        /*margin-bottom: 0.457rem;*/

        .errorListWrap {
          display: flex;

          .noList {
            font-size: 0.614rem;
            color: #9B9B9B;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .errorName {
            flex: 2;
            display: flex;
            margin-left: 0.457rem;
            align-items: center;

            .imgWrap {
              height: 2.286rem;
              width: 2.286rem;
              border-radius: 50%;

              img {
                width: 100%;
                height: 100%;
                user-select: none;
                -webkit-user-select: none;
                border-radius: 50%;
              }
            }

            .textWrap {
              margin-left: 0.286rem;

              p:nth-child(1) {
                font-family: PingFangSC-Medium;
                font-size: 0.857rem;
                color: #333333;

                .idNo {
                  width: 3.5rem;
                  height: 0.971rem;
                  border-radius: 0.486rem;
                  background: #FFF6E2;
                  font-size: 0.629rem;
                  color: #C79B41;
                  margin-left: 0.629rem;
                  padding: 0.057rem 0.343rem 0.057rem 0.343rem;
                }
              }

              p:nth-child(2) {
                margin-top: 0.286rem;
                font-family: PingFangSC-Regular;
                align-items: center; /*垂直居中*/
                ont-size: 0.686rem;
                color: #9B9B9B;
              }
            }


          }

          .studyHours {
            display: flex;
            /*flex: 1;*/
            width: 20%;
            font-family: PingFangSC-Medium;
            font-size: 0.857rem;
            align-items: center;
            color: #F7B500;
            text-align: center;
            flex-direction: column;
            /*padding-right: 0.857rem;*/
            /*box-sizing: border-box;*/

            span {
              /*padding-right: 0.857rem;*/
              /*box-sizing: border-box;*/
            }

            span:nth-child(2) {
              width: 3.429rem;
              margin-top: 0.171rem;
              background: #F1F1F1;
              height: 0.971rem;
              border-radius: 0.514rem;
              font-size: 0.686rem;
              display: flex;
              align-items: center;
              justify-content: center;

            }

            .mui-icon {
              background: #F1F1F1;
              border-radius: 0.514rem;
              width: 3.029rem;
              height: 0.971rem;
              text-align: center;
              font-size: 0.686rem;
              color: #FF5651;
              margin-left: 0.286rem;
              display: flex;
              align-items: center; /* 垂直居中 */
              justify-content: center; /* 水平居中 */

              span {
                font-size: 0.656rem;
                color: #707070;
                display: flex;
                align-items: center; /* 垂直居中 */
                justify-content: center;
              }
            }

            .iconDown {
              color: #2FCF49;
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

</style>
