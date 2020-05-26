<template>
  <div id="app">
    <router-view v-if="isRouterAlive"/>
  </div>
</template>
<script>
  export default {
    name:'App',
    provide(){
      return {
        reload:this.reload
        }
      },
    data(){
      return{
        isRouterAlive:true
      }
    },
    methods:{
      reload () {
        console.log("刷新路由组件123");
        this.isRouterAlive = false;            //先关闭，
        this.$nextTick(function () {
          console.log("一直刷新")
          this.isRouterAlive = true;         //再打开
        })
      }
    }
    }
</script>
<style lang="less">
  html,body{
    height: 100%;
    overflow: hidden;
    width: 100%;
  }
#app {
  /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
  /*-webkit-font-smoothing: antialiased;*/
  /*-moz-osx-font-smoothing: grayscale;*/
  /*text-align: center;*/
  /*color: #2c3e50;*/
  background-color: #fff;
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: fixed;
}

/*#nav {*/
  /*padding: 30px;*/

  /*a {*/
    /*font-weight: bold;*/
    /*color: #2c3e50;*/

    /*&.router-link-exact-active {*/
      /*color: #42b983;*/
    /*}*/
  /*}*/
/*}*/
</style>
