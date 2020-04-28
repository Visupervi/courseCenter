<template>
  <div :class="[isFull ? 'my-fullScreen':'myPlayer']" ref="myPlayer">
    <video :src="videoUrl" :class="[isFull ? 'my-fullVideo': 'my-video']" :poster="imgUrl" ref="video"
           playsinline="true">
    </video>
    <div class="play-icon" @click="videoPlay" v-show="isShowIcon">
      <div class="video-paly" v-show="!showPlay">

      </div>
      <div class="video-purse" v-show="showPlay">
        <span class="video-H"></span>
        <span class="video-H"></span>
      </div>
    </div>
    <div class="my-video-control">
      <ul id="video-controls" class="controls">
        <li>
          <button id="playpause" type="button" @click="videoPlay">
            <img src="../../assets/images/paly.svg" alt="" v-show="playShow">
            <img src="../../assets/images/pause.svg" alt="" v-show="!playShow">
          </button>
          <!--<button id="playpause" type="button">Play/Pause</button>-->
        </li>
        <li class="progress">
          <progress id="progress" value="0" min="0">
            <span id="progress-bar"></span>
          </progress>
        </li>
        <li>
          <button id="mute" type="button">Mute/Unmute</button>
        </li>
        <li>
          <button id="volinc" type="button">Vol+</button>
        </li>
        <li>
          <button id="voldec" type="button">Vol-</button>
        </li>
        <li>
          <button id="fs" type="button" @click="fullScreen">
            <img src="../../assets/images/fullscreen.svg" alt="" v-show="!isFull">
            <img src="../../assets/images/small.svg" alt="" v-show="isFull">
          </button>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
import {getDeviceInfo} from '../../service/superGuide'
  /**
   * @Author Visupervi
   * @Date 2020/1/2 10:44
   * @Name
   * @Param
   * @Return
   * @Description 视频组件简单封装
   */
  export default {
    name: "index",
    data() {
      return {
        videoUrl: '',
        imgUrl: require("../../assets/logo.png"),
        isPlay: false, //判断视频是否播放
        showPlay: false, // 开始
        showPurse: false, // 暂停
        isShowIcon: true, // 是否隐藏图片上的播放按钮
        timer: "",//定时器
        playShow: true,
        isFull: false //是否全屏显示
      }

    },
    created() {
    },
    mounted() {

    },
    methods: {
      videoPlay() {
        this.showPlay = !this.isPlay;
        this.playShow = !this.playShow;

        if (this.isPlay) {
          this.$refs.video.pause();
          clearTimeout(this.timer);
          this.isShowIcon = this.isPlay;
        } else {
          this.timer = setTimeout(() => {
            this.isShowIcon = !this.isPlay;
            this.$refs.video.play();
            clearTimeout(this.timer)
          }, 300);
        }
        this.isPlay = !this.isPlay;
      },
      fullScreen() {
        this.isFull = !this.isFull;
      }
    }
  }
</script>

<style scoped lang="less">
  .myPlayer, .my-fullScreen {
    /*height: 10rem;*/
    position: absolute;

    .my-video, .my-fullVideo {
      width: 100%;
      /*height: 50%;*/
      /*position: absolute;*/
      /*top: 50%;*/
      /*transform: translateY(-50%);*/
      object-fit: fill
    }

    .play-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 1.5rem;
      height: 1.5rem;
      border: 1px solid #ccc;
      border-radius: 50%;
      display: flex;
      align-items: center;
      display: -webkit-flex;
      -webkit-justify-content: center;
      -webkit-align-items: center;
      justify-content: center;
      /*flex-direction: column;*/

      .video-paly {
        height: 0;
        width: 0;
        border-top: 0.5rem solid transparent;
        border-right: 0.5rem solid transparent;
        border-bottom: 0.5rem solid transparent;
        border-left: 0.5rem solid #ccc;
        margin-right: -0.75rem;

      }

      .video-purse {
        width: 100%;
        height: 100%;
        display: flex;
        display: -webkit-flex;
        -webkit-justify-content: center;
        -webkit-align-items: center;
        align-items: center;
        justify-content: center;

        .video-H {
          height: 0.75rem;
          margin-left: 0.125rem;
          display: block;
          width: 0.125rem;
          background-color: #ccc;

          &:first-child {
            margin-left: 0;
          }
        }
      }

    }

    .my-video-control {
      position: absolute;
      bottom: 0.25rem;

      ul {
        display: flex;
        display: -webkit-flex;
        /*-webkit-justify-content: space-between;*/
        /*-webkit-align-items: center;*/
        flex-direction: row;
        -webkit-flex-direction: row;

        li {
          padding: 0;
          margin: 0;

          button {
            padding: 0;
            margin: 0;
            display: block;
            height: 1.125rem;
            width: 1.125rem;
            border-radius: 50%;
            border: none;
            outline: none;

            img {
              width: 100%;
            }
          }
        }

      }
    }
  }

  .my-fullVideo {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  .my-fullScreen {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, .2);
  }

</style>
