<!--课程列表组件-->
<template>
  <div class="courseList errorScroll" v-show="true">
    <div class="mui-scroll-wrapper scrollWrap" ref="scrollWrap">
      <div class="mui-scroll">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <mt-loadmore :bottom-method="onLoad" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore"
                       @bottom-status-change="handleBottomChange">
            <ul class="mui-table-view" v-if="courseList.length > 0" ref="scrollHei">
              <li class="mui-table-view-cell" v-for="(item,index) in courseList" :key="index"
                  @click="studyHandler(item)">
                <div class="errorListWrap">
                  <div class="imgParent">
                    <div class="imgWrap">
                      <!--<div class="studyStatus"-->
                      <!--:class="{'noStudy':item.isStudy === 3,'hasStudyStatus':item.isStudy === 1,'studing':item.isStudy === 2}">-->
                      <!--<span v-if="item.isStudy === 3">-->
                      <!--未学-->
                      <!--</span>-->
                      <!--<span v-if="item.isStudy === 1">-->
                      <!--已学-->
                      <!--</span>-->
                      <!--<span v-if="item.isStudy === 2">-->
                      <!--进行-->
                      <!--</span>-->
                      <img src="../../assets/images/noStudy.svg" alt="" v-if="item.isStudy === 3"/>
                      <img src="../../assets/images/studyed.svg" alt="" v-if="item.isStudy === 1"/>
                      <img src="../../assets/images/instudy.svg" alt="" v-if="item.isStudy === 2"/>
                      <!--</div>-->
                      <!--<img :src="item.lessonImg" alt="">-->
                    </div>
                  </div>
                  <div class="errorName">
                    <p class="lessonName" v-if="item.lessonName" v-html="item.lessonName"></p>
                  </div>
                </div>
                <div class="errorListWrap iconWraps">
                  <div class="rate-hold">
                    <p>
                      <span class="score">评分:</span>
                      <van-icon name="star" :class="{'active':item.totalScore.toString() !== '0'}"/>
                      <span class="scoreNum" :class="{'active':item.totalScore.toString() !== '0'}"
                            style="margin-left: 5px">{{item.totalScore.toFixed(1)}}<span> 分</span></span>
                      <!--<van-rate allow-half-->
                      <!--v-model="/^[+-]?[1-9]?[0-9]*\.[0-9]*$/.test(item.totalScore) ? parseFloat(item.totalScore.toString().split('.')[0]+'.5') : item.totalScore"-->
                      <!--disabled/>-->

                    </p>
                  </div>
                  <div class="iconsWrap">
                      <span class="iconImg">
                        <img src="../../assets/images/eyes.svg" alt="">
                      </span>
                    <span class="seeNums">{{parseInt(item.browseNum) > 10000 ? '99999+' : item.browseNum}}</span>
                    <span class="iconImg img1">
                          <img src="../../assets/images/goods.svg" alt="">
                        </span>
                    <span class="thumbersUp">{{parseInt(item.likeNum) > 10000 ?  '99999+': item.likeNum}}</span>
                  </div>
                </div>

              </li>
            </ul>
            <div class="freshImg" v-if="courseList.length === 0">
              <div class="blankImg">
                <img src="../../assets/images/blank.png" alt="">
                <p>暂无课程</p>
              </div>
            </div>

            <div slot="bottom" class="mint-loadmore-bottom" ref="loadeMore">
              <span v-show="bottomStatus !== 'loading'" :class="{ 'rotate': bottomStatus === 'drop' }">↓</span>
              <span v-if="bottomStatus === 'loading'">Loading...</span>
            </div>

          </mt-loadmore>
        </van-pull-refresh>
      </div>
    </div>
    <!--<div class="blankImg" v-if="courseList.length === 0">-->
    <!--<img src="../../assets/images/blank.png" alt="">-->
    <!--<p>暂无课程</p>-->
    <!--</div>-->
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
  import {
    getCourseList,
    getRecomList,
    getStudyLessonList,
    getFavoriteLessonList,
    getHaveLessonList
  } from '../../api';
  import {getQueryString, overscroll,communicationWithNative} from '../../service/superGuide';
  import {Indicator} from 'mint-ui';
  export default {
    inject: ['reload'],
    props: {
      selecData: {
        type: Object
      }
    },
    data() {
      return {
        rateVal: 0,
        courseList: [],
        allLoaded: false,
        bottomStatus: '',
        page: 1,
        rows: 10,
        tId: "",
        searchVal: "",
        updateTime: "",
        contentType: "",
        studyFlag: "",
        browserNum: Number,
        isLoading: false,
        tempArr: [],
        paramObj: ""
      }
    },
    beforeCreate() {
      Indicator.open({
        text: '加载中...',
        spinnerType: 'triple-bounce'
      });
    },
    created() {
    },
    mounted() {
      // setTimeout(()=>{
      //   console.log(this.$refs.scrollHei.offsetHeight);
      //   console.log(this.$refs.scrollWrap.offsetHeight);
      //   this.$refs.scrollHei.style.minHeight = `${this.$refs.scrollWrap.offsetHeight - 46}px`
      // },1500)
      window.getCourseListData = this.getCourseListData;
    },
    methods: {
      //动态设置上拉框高度
      setAutoHeight() {
        setTimeout(() => {
          this.$refs.scrollHei.style.minHeight = `${this.$refs.scrollWrap.offsetHeight}px`
        }, 1000)
      },
      // 滚动事件
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
            el.scrollTop = top - 1;
          }
        });
        el.addEventListener('touchmove', (evt) => {
          console.log("totalScroll", totalScroll);
          if (el.offsetHeight < el.scrollHeight) {
            evt._isScroller = true;
          }
        });
      },
      //上拉加载更多
      onLoad() {
        // console.log("加载更多")
        // this.getPersonFile();
        //TODO 数据加载完不允许加载，设置为true
        //
        this.page++;
        this.getCourseListData();
        // this.setAutoHeight();
        this.$refs.loadmore.onBottomLoaded();
        // console.log("上拉距离")
      },
      //下拉刷新
      refresh() {
        // console.log("wewewewewew");
        // this.courseList = [];
        // this.page = 1;
        // this.getCourseListData();
        // this.$refs.loadmore.onTopLoaded();
      },
      onRefresh() {
        this.courseList = [];
        this.page = 1;
        this.getCourseListData();
      },
      //切换下拉底部文字
      handleBottomChange(status) {
        // console.log("status", status);
        this.bottomStatus = status;
      },
      //去学习课程
      /**
       * 1是图文，需要跳转到中间页
       * 2是视频，直接跳转到详情页
       * @param item
       */
      studyHandler(item) {
        console.log("this.$route.params.lessonId",this.$route.params.lessonId);
        console.log("this.paramObj.routeName",this.paramObj.routeName);
        if(this.paramObj.routeName ==="collageCourse"){
          communicationWithNative({
              method: "turnNewPage",
              args: [`${location.origin}/#/carouse/${item.lessonId}/${this.paramObj.routeName}?accessToken=${getQueryString('accessToken')}&hide_title=1`, `${this.paramObj.routeName}`,"getCourseListData"]
            },
            {
              method: "turnNewPage",
              args: [`${location.origin}/#/carouse/${item.lessonId}/${this.paramObj.routeName}?accessToken=${getQueryString('accessToken')}&hide_title=1`, `${this.paramObj.routeName}`]
            }
          )
        }else {
          this.$router.replace(`/carouse/${item.lessonId}/${this.paramObj.routeName}?accessToken=${getQueryString('accessToken')}`)
        }

        // this.$router.replace(`/carouse/${item.lessonId}/${this.paramObj.routeName}?accessToken=${getQueryString('accessToken')}`)
        // this.$router.push(`/courseBrief/${item.lessonId}?accessToken=${getQueryString('accessToken')}`);
      },
      //  获取课程列表
      /**
       * 1：课程中心搜索，2：正在学习，3：已学课程，4：我的收藏，5：为你推荐
       */
      async getCourseListData() {
        this.paramObj["page"] = this.page;
        this.paramObj["rows"] = this.rows;
        // let tempArr;
        // console.log("12121212121212");
        switch (this.paramObj.flag) {
          //课程中中心
          case "1":
            // console.log("获取数据",this.paramObj);
            if (this.paramObj.text !== "") {
              this.paramObj.typeId = 0;
            } else {
              // this.paramObj.typeId = this.paramObj.typeId;
              // console.log('sb')
            }
            // this.paramObj.text === ""? console.log('sb') : delete this.paramObj.typeId;
            // console.log("this.paramObj",this.paramObj);
            //  ? delete this.paramObj.typeId : this.paramObj.typeId;
            let res = await getCourseList(this.paramObj);
            if (parseInt(res.code) === 200) {
              this.isLoading = false;
              res.result.length === 0 ? this.allLoaded = true : this.allLoaded = false;
              this.tempArr = this.replaceKeys(this.paramObj.text, res.result);
              // console.log("this.courseList",this.courseList);
              if (this.page === 1) {
                this.courseList = this.filterRepeat(this.courseList.concat(this.tempArr));
              } else {
                this.courseList = this.courseList.concat(this.tempArr);
              }
            }
            break;
          //  正在学习
          case "2":
            let resStudy = await getStudyLessonList({
              text: this.paramObj.text,
              page: this.page,
              rows: this.paramObj.rows
            });
            if (parseInt(resStudy.code) === 200) {
              this.isLoading = false;
              resStudy.result.length === 0 ? this.allLoaded = true : this.allLoaded = false;
              // this.courseList = this.courseList.concat(resStudy.result);
              this.tempArr = this.replaceKeys(this.paramObj.text, resStudy.result);
              if (this.page === 1) {
                this.courseList = this.filterRepeat(this.courseList.concat(this.tempArr));
              } else {
                this.courseList = this.courseList.concat(this.tempArr);
              }
            }
            break;
          //  已学课程
          case "3":
            // console.log("12121212");
            let resHasLearn = await getHaveLessonList({
              text: this.paramObj.text,
              page: this.page,
              rows: this.paramObj.rows
            });
            if (parseInt(resHasLearn.code) === 200) {
              this.isLoading = false;
              resHasLearn.result.length === 0 ? this.allLoaded = true : this.allLoaded = false;
              this.tempArr = this.replaceKeys(this.paramObj.text, resHasLearn.result);
              if (this.page === 1) {
                this.courseList = this.filterRepeat(this.courseList.concat(this.tempArr));
              } else {
                this.courseList = this.courseList.concat(this.tempArr);
              }
            }
            break;
          //  我的收藏
          case "4":
            let resCollect = await getFavoriteLessonList({
              text: this.paramObj.text,
              page: this.page,
              rows: this.paramObj.rows
            });
            if (parseInt(resCollect.code) === 200) {
              this.isLoading = false;
              resCollect.result.length === 0 ? this.allLoaded = true : this.allLoaded = false;
              this.tempArr = this.replaceKeys(this.paramObj.text, resCollect.result);
              if (this.page === 1) {
                this.courseList = this.filterRepeat(this.courseList.concat(this.tempArr));
              } else {
                this.courseList = this.courseList.concat(this.tempArr);
              }
            }
            break;
          //  为你推荐
          case "5":
            let result = await getRecomList(
              {
                text: this.paramObj.text,
                page: this.page,
                rows: this.paramObj.rows
              }
            );
            if (parseInt(result.code) === 200) {
              this.isLoading = false;
              result.result.length === 0 ? this.allLoaded = true : this.allLoaded = false;
              this.tempArr = this.replaceKeys(this.paramObj.text, result.result);
              if (this.page === 1) {
                this.courseList = this.filterRepeat(this.courseList.concat(this.tempArr));
              } else {
                this.courseList = this.courseList.concat(this.tempArr);
              }
              Indicator.close()
            }
            break;
        }
      },
      // 对象数组去重
      filterRepeat(arr = []) {
        let tempArr = [];
        tempArr = arr.reduce((prev, elem) => {
          if (!prev.find(el => el.lessonId === elem.lessonId)) {
            prev.push(elem)
          }
          return prev
        }, []);
        return tempArr;
      },
      //  替换关键词
      replaceKeys(subSrting = "", strArr = []) {
        if (subSrting.length > 0) {
          let reg = new RegExp("(" + subSrting + ")", 'g');
          for (let i = 0; i < strArr.length; i++) {
            if (strArr[i].lessonName.length > 22) {
              strArr[i].lessonName = strArr[i].lessonName.toString().substring(0, 22) + '...';
            }
            strArr[i].lessonName = `<p>${strArr[i].lessonName.replace(reg, "<span style='color:red;'>" + subSrting + "</span>")}</p>`
          }
          // console.log("str替换", strArr);
        } else {
          // console.log("1212122");
          for (let i = 0; i < strArr.length; i++) {
            if (strArr[i].lessonName.length >= 22) {
              strArr[i].lessonName = strArr[i].lessonName.toString().substring(0, 22) + '...';
            }
            // strArr = strArr;
          }
        }
        return strArr;
      }
    },
    watch: {
      courseList: {
        immediate: true,
        handler(val) {
          // console.log("子组件打印值", val);
          this.data = val;
        }
      },
      selecData: {
        immediate: true,
        handler(val) {
          this.paramObj = val;
          this.allLoaded = val.isAlload;
          this.courseList = [];
          this.tempArr = [];
          // this.setAutoHeight();
          this.page = 1;
          // this.setAutoHeight();
          // if(this.page === 1){
          //   this.courseList = [];
          //   this.tempArr = [];
          // }
          // if (val.typeId !== '' && val.routeName === "collageCourse") {
          //   console.log("子组件打印值params", "22323232323232");
          this.getCourseListData();
          // console.log("子组件打印值params", this.paramObj);
          // }else {
          //   this.getCourseListData();
          // }
        },
        deep: true
      }
    },
  };
</script>

<style lang="less" scoped>
  .errorScroll {
    position: relative;
    height: calc(100%);
    /*overflow-y: scroll;*/

    .scrollWrap {
      height: calc(100% - 0.857rem);
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      /*overflow-y:auto!important;*/

      .mui-scroll {
        padding-bottom: 4.5rem;
        min-height: calc(100% + 2px);

        .mint-loadmore {
          /*position: absolute;*/
          /*top: 0;*/
          /*bottom: 0;*/
          /*right: 0;*/
          /*left: 0;*/
          height: 100%;

          .mint-loadmore-content {
            /*height: 100% !important;*/
          }
        }
      }

      .mui-table-view {
        /*background-color: #fafafa;*/
        background-color: #fff;
        /*列表样式*/

        .mui-table-view-cell {
          background-color: #fff;
          /*padding: 0.286rem 0 0.286rem 0.429rem;*/
          padding: 0.286rem 0.143rem 0.286rem 0rem;
          box-sizing: border-box;
          /*margin-bottom: 0.457rem;*/

          &::after {
            left: 0.48rem;
          }

          .errorListWrap {
            display: flex;
            /*图片样式*/

            .iconsWrap {
              display: flex;
              align-items: center;

              .iconImg {
                width: 0.857rem;
                height: 0.914rem;
                position: relative;
                display: flex;
                align-items: center;
                vertical-align: middle;
                margin-right: 0.286rem;

                img {
                  width: 100%;
                  height: 100%;
                  user-select: none;
                }
              }

              .img1 {
                margin-left: 0.286rem;
              }

              .seeNums, .thumbersUp {
                font-size: 0.686rem;
                color: #999999;
              }
            }

            .imgParent {
              /*flex: 1;*/
              /*display: flex;*/
              /*align-items: center;*/
              /*justify-content: center;*/
              height: 0.48rem;
              position: absolute;
              left: 0.44rem;

              .imgWrap {
                height: 0.66rem;
                width: 2.0rem;
                /*border-radius: 0.229rem;*/
                /*position: relative;*/

                img {
                  width: 100%;
                  /*height: 100%;*/
                  /*border-radius: 0.229rem;*/
                  /*object-fit:cover;*/
                }

                /*.studyStatus {*/
                /*position: absolute;*/
                /*!*width: 1.771rem;*!*/
                /*!*height: 1rem;*!*/
                /*!*border-radius: 0.229rem 0 0.229rem 0;*!*/
                /*height: 0;*/
                /*width: 2rem;*/
                /*border-top:1rem solid red;*/
                /*border-right: 0.37rem solid transparent;*/

                /*top: 0.286rem;*/
                /*left: 0;*/
                /*text-align: center;*/

                /*span {*/
                /*font-family: PingFangSC-Regular;*/
                /*font-size: 0.686rem;*/
                /*color: #FFFFFF;*/
                /*}*/
                /*}*/

                .noStudy {
                  /*background-color: #FF524D;*/
                }

                .hasStudyStatus {
                  /*background-color: #999999;*/
                }

                .studing {
                  /*background-color: #0099FF;*/
                }
              }
            }

            /*文字样式*/

            .errorName {
              margin-left: 0.457rem;
              flex: 3;

              .lessonName {
                line-height: 25px;
              }

              p:nth-child(1) {
                font-family: PingFangSC-Medium;
                font-size: 0.8rem;
                color: #333333;
                margin-left: 0;
                box-sizing: border-box;
                text-indent: 2.38rem;
                /*line-height: 0.24px;*/

              }

              p:nth-child(2) {
                display: flex;
                margin-top: 0.286rem;
                font-family: PingFangSC-Regular;
                font-size: 0.629rem;
                align-items: center; /*垂直居中*/
                justify-content: center;
                font-size: 0.686rem;
                color: #999999;

                span:nth-child(1) {
                  font-size: 0.914rem;
                  color: #999999;
                  margin-left: 0.429rem;
                  font-family: PingFangSC-Regular;

                  span:nth-child(1) {
                    color: #999999;
                    font-size: 0.4rem;
                    margin-left: 0rem;

                  }
                }


                span {
                  flex: 1;
                }
              }


            }

          }

          .iconWraps {
            justify-content: space-between;
            margin-top: 1rem;
            padding: 0.64rem ;
            /*padding-left: 0.3rem;*/
            box-sizing: border-box;
            flex: 1;

            .rate-hold {
              display: flex;
              justify-content: space-between;
              padding: 0 0.32rem;
              margin-top: 0rem;
              flex: 2;

              .scoreNum {
                margin-left: 5rem;
              }

              p:nth-child(0) {
                /*background-color: red;*/
                font-size: 0.24rem;
                color: #999999;
                margin-left: 0px;
                display: flex;
                align-items: center;


              }


            }

            .van-rate {
              flex: 2;
              .van-rate__item:not(:last-child) {
                padding-right: 0.143rem;
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

        .mui-table-view-cell:last-child {
          &::after {
            height: 1px;
          }
        }

        .mui-table-view-cell:first-child {
          &::before {
            position: absolute;
            right: 0;
            top: 0;
            left: 0.48rem;
            height: 1px;
            content: '';
            -webkit-transform: scaleY(.5);
            -ms-transform: scaleY(.5);
            transform: scaleY(.5);
            background-color: #c8c7cc;
          }
        }

      }

      .isRotate {
        display: none;
      }
    }

    /*课程为空图片*/

    .freshImg {
      /*position: absolute;*/
      /*height: ;*/
      height: 11.429rem;

      .blankImg {
        position: relative;
        top: 40%;
        left: 50%;
        width: 8.571rem;
        height: 5.714rem;
        transform: translate(-50%, -50%);

        img {
          width: 100%;
          user-select: none;
        }

        p {
          text-align: center;
          font-family: PingFangSC-Regular;
          font-size: 0.686rem;
          color: #999999;
          letter-spacing: 0;
        }
      }

    }

  }

</style>
