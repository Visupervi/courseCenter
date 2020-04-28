<template>
  <div class="videoComponent" ref="videoComponent">
    <iframe :src=`${window.location}` allowfullscreen="allowfullscreen" mozallowfullscreen="mozallowfullscreen"
            msallowfullscreen="msallowfullscreen" oallowfullscreen="oallowfullscreen"
            webkitallowfullscreen="webkitallowfullscreen">
      <vueMiniPlayer ref="vueMiniPlayer" :video="video" :mutex="true" @fullscreen="handleFullscreen"/>
    </iframe>
  </div>

</template>

<script>
  /**
   * @Author Visupervi
   * @Date 2019/12/17 9:53
   * @Name 视频组件
   * @Param
   * @Return
   * @Description
   */
  export default {
    props: {},
    name: "index",
    data() {
      return {
        video: {
          url: 'https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4',
          cover: 'https://i.loli.net/2019/06/06/5cf8c5d9c57b510947.png',
          muted: false,
          loop: false,
          preload: 'metadata',
          poster: '',
          volume: 1,
          autoplay: false
        }
      }
    },
    created() {
      // this.hideNativeHeder();
    },
    mounted() {
    },
    computed: {
      // $video () {
      //   return this.$refs.vueMiniPlayer.$video;
      // }
    },
    methods: {
      handleFullscreen() {
      }
    },
  }
</script>

<style scoped lang="less">
  .videoComponent {
    height: 12.5rem;
    position: relative;
    bottom: 0;
    left: 0;
    right: 0;

    .videoPlay {
      height: 100%;

      .dplayer-video-wrap {
        /*height: 12.5rem !important;*/
      }
    }
  }

</style>
