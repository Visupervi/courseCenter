<template>
  <div class="header">
    <van-nav-bar
      :title="title"
      left-arrow
      @click-left="onClickLeft"
      ref="header">
      <template #left>
        <van-icon v-show="title !== ''" name="down"/>
        <!--<van-icon v-show="title !== '学霸排行榜'" name="arrow-left"/>-->
      </template>
    </van-nav-bar>

  </div>
</template>

<script>
  import {communicationWithNative, getQueryString} from "../../service/superGuide";
  import {checkComCourse, endtStudyTime, startStudyTime} from '../../api';
  import {routerSwitch} from '../../service/routerSwitch'
  export default {
    props: ['title'],
    name: "index",
    data() {
      return {
        flag: false,
        fromeName: "",
      }
    },
    created() {
    },
    mounted() {
    },
    methods: {
      /**
       * 解决页面后退不刷新
       * window.onpageshow = function(evt){
       *  if(evt.persisted){
       *     document.body.style.display ="none ";
       *    location.reload();
       *  }
       *  };
       */
      onClickLeft() {
        // console.log("this.$route", this.$router)
        this.$emit("childFn", this.flag);
        switch (this.$route.name) {
          case "rankList":
            communicationWithNative({
              method: 'finish',
              args: null
            }, {
              method: 'finish',
              args: []
            });
            break;
          case "myCollect":
            communicationWithNative({
              method: 'finish',
              args: null
            }, {
              method: 'finish',
              args: []
            });
            break;
          case "collageCourse":
            communicationWithNative({
              method: 'finish',
              args: null
            }, {
              method: 'finish',
              args: []
            });
            break;
          case "hasStudy":
            communicationWithNative({
              method: 'finish',
              args: null
            }, {
              method: 'finish',
              args: []
            });
            break;
          case "moreLearning":
            communicationWithNative({
              method: 'finish',
              args: null
            }, {
              method: 'finish',
              args: []
            });
            break;
          case "moreRecommend":
            communicationWithNative({
              method: 'finish',
              args: null
            }, {
              method: 'finish',
              args: []
            });
            break;
          case "question":
            startStudyTime({lessonId: this.$route.params.lessonId});
            this.$router.replace(`/courseBrief/${this.$route.params.lessonId}/${this.$route.params.fromName}?accessToken=${getQueryString('accessToken')}`).catch(err => {
              err
            });
            break;
          case "viewParsing":
            this.$router.replace(`/courseBrief/${this.$route.params.lessonId}/${this.$route.params.fromName}?accessToken=${getQueryString('accessToken')}`).catch(err => {
              err
            });
            break;
          case "carouse":
            if (this.$route.params.fromName === "collageCourse") {
              communicationWithNative({
                method: 'finish',
                args: null
              }, {
                method: 'finish',
                args: []
              });
            } else {
              routerSwitch(this.$route.params.fromName, this.$router, "", () => {
              });
            }
            break;
          case "courseBrief":
            this.$emit("childFn", {isComplite: true});
            this.$router.replace(`/carouse/${this.$route.params.lessonId}/${this.$route.params.fromName}?accessToken=${getQueryString('accessToken')}`).catch(err => {
              err
            });
            break;
          case 'evaluation':
            // console.log(this.$route.params.fromName)
            // console.log(this.$route.name)
            // mui.alert("您的评分使我们进步", "提示", () => {
            // });
            if (this.$route.params.fromName === "collageCourse") {
              communicationWithNative({
                method: 'finish',
                args: null
              }, {
                method: 'finish',
                args: []
              });
            } else {
              routerSwitch(this.$route.params.fromName, this.$router, "", () => {
              });
            }
            break;
        }
      }
    },
    watch: {
      fromRoute: {
        immediate: true,
        handler(val) {
          // console.log("va数字据", val);
          this.fromeName = val;
        }
      }
    }
  }
</script>

<style scoped lang="less">

</style>
