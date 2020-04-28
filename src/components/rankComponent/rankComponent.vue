<!--排行榜组件-->
<template>
  <div class="rankComponent errorScroll">

    <div class="mui-scroll-wrapper scrollWrap" ref="scrollWrap">
      <div class="mui-scroll">
        <mt-loadmore :bottom-method="onLoad" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore"
                     @bottom-status-change="handleBottomChange">
          <ul class="mui-table-view">
            <li class="mui-table-view-cell" v-for="(item,index) in rankData" :key="index" v-if="index >= 3"
                :class="{'deepColor':index === isActive}">
              <div class="errorListWrap">
                <div class="noList">
                  <span><span v-if="index+1 < 10">0</span>{{index+1}}</span>
                </div>
                <div class="errorName">
                  <div v-if="item.userInfo.head_pic !== ''" class="imgWrap"><img :src="item.userInfo.head_pic" alt="">
                  </div>
                  <div v-if="item.userInfo.head_pic === ''" class="imgWrap"><img src="../../assets/images/avatar.png"
                                                                                 alt="">
                  </div>
                  <div class="textWrap">
                    <p>{{item.userInfo.name}}<span class="idNo">{{item.userInfo.login_name.split("@")[0]}}</span></p>
                    <p v-if="item.userInfo.shop_name.length <= 14">{{item.userInfo.shop_name}}</p>
                    <p v-if="item.userInfo.shop_name.length > 14">{{item.userInfo.shop_name.substring(0,13)+'...'}}</p>
                  </div>
                </div>
                <div class="studyHours">
                  <span v-if="flag ==='1'">{{item.totalTime}}h</span>
                  <span v-if="flag==='2'">{{(item.totalTime)}}h</span>
                  <span v-if="flag === '1'"
                        :class="{'mui-icon':true,'mui-icon-arrowthinup':item.status === 0,'mui-icon-arrowthindown':item.status === 1,'iconDown': parseInt(item.status) === 1}">
                <span>{{item.rate.toFixed(2) +"%"}}</span>
              </span>
                  <!--<span v-if="flag === '2'"-->
                  <!--:class="{'mui-icon':true,'mui-icon-arrowthinup':item.rateYearStatus === 0,'mui-icon-arrowthindown':item.rateYearStatus === 1,'iconDown':item.userInfo.rateYearStatus === 0}">-->
                  <!--<span>{{item.totalTime +"%"}}</span>-->
                  <!--</span>-->
                </div>
              </div>
            </li>
          </ul>
          <div slot="bottom" class="mint-loadmore-bottom">
            <span v-show="bottomStatus !== 'loading'" :class="{ 'rotate': bottomStatus === 'drop' }">↓</span>
            <span v-show="bottomStatus === 'loading'">Loading...</span>
          </div>
        </mt-loadmore>
      </div>
    </div>
  </div>
</template>

<script>
  /**
   * @Author Visupervi
   * @date 2020/3/30 15:52
   * @param
   * @return
   *
   */
  import {getRankList} from '../../api'
  export default {
    props: {
      titleObj: {
        type: Object
      }
    },
    data() {
      return {
        allLoaded: this.titleObj.isLoad,
        bottomStatus: '',
        flag: "",
        org_type: "",
        selectTitleObj: {},
        rankData: [],
        topThree: [],
        page: 1,
        rows: 20,
        userId: "",
        isActive: false,
        deepArr: []
      }
    },
    created() {
    },
    mounted() {
    },
    methods: {
      /**
       *org_type(1：全国排名，2：事业群排名，3：事业部排名，4：大区排名，5：小区排名，6：店铺排名)
       */
      //获取排行榜数据
      async getRankListData() {
        this.flag = this.selectTitleObj.monthOrAll === "总榜" ? "2" : "1";
        switch (this.selectTitleObj.currentTitle) {
          case "全国排名":
            this.org_type = "1";
            break;
          case "事业群排名":
            this.org_type = "2";
            break;
          case "事业部排名":
            this.org_type = "3";
            break;
          case "大区排名":
            this.org_type = "4";
            break;
          case "小区排名":
            this.org_type = "5";
            break;
          case "部门排名":
            this.org_type = "6";
            break;
        }
        let res = await getRankList({
          flag: this.flag,
          org_type: this.org_type,
          page: this.page,
          rows: this.rows
        });
        if (parseInt(res.code) === 200) {
          // this.userId = res.self_data[0].sys_user_id;
          this.$refs.loadmore.onBottomLoaded();
          // if (res.result.length === this.rows) {
          this.rankData = res.result;
          this.allLoaded = true;
          if (parseInt(res.flag) === 1) {
            for (let i = 0; i < this.rankData.length; i++) {
              this.rankData[i]['flag'] = this.flag;
              if (parseInt(res.sys_user_id) === parseInt(this.rankData[i].userInfo.sys_user_id)) {
                this.rankData[i]['rankIndex'] = i + 1;
                this.deepArr.push(this.rankData[i]);
                // console.log(this.deepArr);
              } else {
                // this.deepArr.push(res.self_data)
              }
            }
          } else {
            /**
             * /
             * flag:"1"
             rankIndex:1
             rate:0
             status:0
             totalTime:0
             userInfo:Object
             * */
            let obj = {};
            obj['rankIndex'] = "未上榜";
            obj['flag'] = this.flag;
            obj['rate'] = res.rate;
            obj['status'] = res.status;
            obj['totalTime'] = res.self_time;
            obj["userInfo"] = res.self_data;
            // console.log("this.deepArr", )
            this.deepArr.push(obj)
          }
          /***
           * 由**返回数据，但是数据不足以去实现排名页面所以自己构造数据
           */
          if (this.rankData.length >= 3) {
            this.topThree = this.rankData.slice(0, 3);
          } else if (this.rankData.length === 2) {
            this.topThree = this.rankData;
            this.topThree.push({
              "userInfo": {
                "id": "",
                "sys_user_id": "",
                "user_code": "",
                "login_name": "",
                "password": "",
                "name": "",
                "gender": "",
                "tel": "",
                "work_flag": "",
                "create_time": "",
                "update_time": "",
                "create_user": "",
                "user_cate": "",
                "email": "",
                "belong_org": "",
                "org_type": "",
                "app_id": "",
                "head_pic": "",
                "nick_name": "",
                "user_post": "",
                "shop_name": "",
                "entry_time": "",
                "user_status": "",
                "is_student": "",
                "grade_rank": "",
                "is_delete": "",
                "dpcreateTime": "",
                "dpediteTime": ""
              },
              "totalTime": 0.0,
              "status": 0,
              "rate": 0.00
            })
          } else if (this.rankData.length === 1) {
            this.topThree = this.rankData;
            this.topThree = this.topThree.concat([
              {
                "userInfo": {
                  "id": "",
                  "sys_user_id": "",
                  "user_code": "",
                  "login_name": "",
                  "password": "",
                  "name": "",
                  "gender": "",
                  "tel": "",
                  "work_flag": "",
                  "create_time": "",
                  "update_time": "",
                  "create_user": "",
                  "user_cate": "",
                  "email": "",
                  "belong_org": "",
                  "org_type": "",
                  "app_id": "",
                  "head_pic": "",
                  "nick_name": "",
                  "user_post": "",
                  "shop_name": "",
                  "entry_time": "",
                  "user_status": "",
                  "is_student": "",
                  "grade_rank": "",
                  "is_delete": "",
                  "dpcreateTime": "",
                  "dpediteTime": ""
                },
                "totalTime": 0.0,
                "status": 0,
                "rate": 0.00
              },
              {
                "userInfo": {
                  "id": "",
                  "sys_user_id": "",
                  "user_code": "",
                  "login_name": "",
                  "password": "",
                  "name": "",
                  "gender": "",
                  "tel": "",
                  "work_flag": "",
                  "create_time": "",
                  "update_time": "",
                  "create_user": "",
                  "user_cate": "",
                  "email": "",
                  "belong_org": "",
                  "org_type": "",
                  "app_id": "",
                  "head_pic": "",
                  "nick_name": "",
                  "user_post": "",
                  "shop_name": "",
                  "entry_time": "",
                  "user_status": "",
                  "is_student": "",
                  "grade_rank": "",
                  "is_delete": "",
                  "dpcreateTime": "",
                  "dpediteTime": ""
                },
                "totalTime": 0.0,
                "status": 0,
                "rate": 0.00
              }
            ])
          }
          // this.topThree = this.rankData.slice(0, 3);
          for (let i = 0; i < this.topThree.length; i++) {
            this.topThree[i]['flag'] = this.flag;
          }
          this.$emit("getTopThreeData", {topThree: this.topThree, deepArr: this.deepArr, isAllOrMonth: this.flag});
        }
      },
      //上拉加载更多
      onLoad() {
        //TODO 数据加载完不允许加载，设置为true
        this.getRankListData();
        this.deepArr = [];
        if (this.rankData.length === 100) {
          // this.$refs.loadmore.onBottomLoaded();
          this.allLoaded = true;
        } else {
          this.page++;
          this.allLoaded = false;
        }
      },
      //切换下拉底部文字
      handleBottomChange(status) {
        // console.log("status",status);
        this.bottomStatus = status;
      },
    },
    components: {},
    watch: {
      titleObj: {
        immediate: true,
        handler(val) {
          this.rankData = [];
          this.page = 1;
          this.selectTitleObj = val;
          this.deepArr = [];
          // console.log("val", val);
          this.onLoad();
        },
        deep: true
      }
    }
  };
</script>
<style lang="less" scoped>
  .rankComponent {
    position: relative;
    height: calc(100% - 318px);
    /*overflow-y: scroll;*/

    .scrollWrap {
      height: calc(100% - 0);
      overflow-y: scroll;

      .mui-scroll {
        padding-bottom: 7.5rem;
        /*1.629rem*/
      }

      .mui-table-view {
        background-color: #fafafa;

        .mui-table-view-cell {
          background-color: #fff;
          padding: 0.286rem 0 0.286rem 0.429rem;
          /*margin-bottom: 0.457rem;*/

          .errorListWrap {
            display: flex;
            display: -webkit-flex;

            .noList {
              font-size: 0.614rem;
              color: #9B9B9B;
              display: flex;
              display: -webkit-flex;
              align-items: center;
              -webkit-align-items: center;
              justify-content: center;
              -webkit-justify-content: center;
              span{
                font-size: 0.614rem;
              }
            }

            .errorName {
              flex: 2;
              display: flex;
              display: -webkit-flex;
              margin-left: 0.457rem;
              align-items: center;
              -webkit-align-items: center;

              .imgWrap {
                height: 2.286rem;
                width: 2.286rem;
                border-radius: 50%;

                img {
                  width: 100%;
                  height: 100%;
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
              display: -webkit-flex;
              /*flex: 1;*/
              width: 20%;
              font-family: PingFangSC-Medium;
              font-size: 0.857rem;
              align-items: center;
              -webkit-align-items: center;
              color: #F7B500;
              text-align: center;
              flex-direction: column;
              -webkit-flex-direction: column;
              /*padding-right: 0.857rem;*/
              /*box-sizing: border-box;*/

              span {
                /*padding-right: 0.857rem;*/
                /*box-sizing: border-box;*/
              }

              span:nth-child(2) {
                width: 3.29rem;
                margin-top: 0.271rem;
                background: #F1F1F1;
                height: 0.971rem;
                border-radius: 0.514rem;
                font-size: 0.686rem;
                display: flex;
                align-items: center;
                justify-content: center;
                display: -webkit-flex;
                -webkit-align-items: center;
                -webkit-justify-content: center;

              }

              .mui-icon {
                background: #F1F1F1;
                border-radius: 0.514rem;
                width: 2.429rem;
                height: 0.971rem;
                text-align: center;
                font-size: 0.686rem;
                color: #FF5651;
                margin-left: 0.286rem;
                display: flex;
                align-items: center; /* 垂直居中 */
                justify-content: center; /* 水平居中 */
                display: -webkit-flex;
                -webkit-align-items: center;
                -webkit-justify-content: center;

                span {
                  font-size: 0.656rem;
                  color: #707070;
                  display: flex;
                  align-items: center; /* 垂直居中 */
                  justify-content: center;
                  display: -webkit-flex;
                  -webkit-align-items: center;
                  -webkit-justify-content: center;
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

        .deepColor {
          background: #F7F7F7;
        }


      }

    }
  }

</style>
