export const RreturnBack = (routerName, router) => {
  document.addEventListener("plusready", function () {
    plus.key.addEventListener("backbutton", function (evt) {
      var webview = plus.webview.currentWebview();
      var url = location.hash;
      if (url == "#/home" || url == "#/commission" || url == "#/information" || url == "#/myhome") {
        // 处于app首页,满足退出app操作
        this.$toast("再按一次退出app");
        if (new Date() - time < 2000) {
          // 小于2s,退出app
          webview.close();
        } else {
          // 大于2s，重置时间戳，
          time = new Date();
        }
        return;
      } else {

        history.go(-1); // 不满足退出操作，返回
      }
    }, false);
  });
}

