# debon-app

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### 开发文档

##### 1. 请求接口地址同统一封装，放在api/index中,添加接口就在此文件中添加
##### 2. 请求拦截（请求，响应）同统一封装，放在service/index中,包括了错误信息的统一拦截处理
##### 3. axios/fetch统一封装，放在service/ajax与service/fetch中,统一返回promise
##### 4. 解决Android键盘弹起会把定位在页面最下面的button撑开，然后遮档输入框，统一封装inputUp方法，放在service/inputUp中
##### 5. 统一使用超导js与原生交互方法，隐藏app自带header，返回app首页。service/superGuid
##### 7. 统一使用Dplayer对video进行封装，使其在Android与ios中尽量保持一致
##### 8. 统一使用MUI对需要滚动元素处理，防止ios点击穿透以及在根元素加overflow:hidden导致滚动元素不能滚动
##### 9. 拉取代码打包SVG报错
```css
.mui-spinner:after
{
    display: block;

    width: 100%;
    height: 100%;

    content: '';

    background-image: url("data:image/svg+xml;charset=utf-8,\"<svg viewBox=\'0 0 120 120\' xmlns=\'http://www.w3.org/2000/svg\' xmlns:xlink=\'http://www.w3.org/1999/xlink\'><defs><line id=\'l\' x1=\'60\' x2=\'60\' y1=\'7\' y2=\'27\' stroke=\'%236c6c6c\' stroke-width=\'11\' stroke-linecap=\'round\'/></defs><g><use xlink:href=\'%23l\' opacity=\'.27\'/><use xlink:href=\'%23l\' opacity=\'.27\' transform=\'rotate(30 60,60)\'/><use xlink:href=\'%23l\' opacity=\'.27\' transform=\'rotate(60 60,60)\'/><use xlink:href=\'%23l\' opacity=\'.27\' transform=\'rotate(90 60,60)\'/><use xlink:href=\'%23l\' opacity=\'.27\' transform=\'rotate(120 60,60)\'/><use xlink:href=\'%23l\' opacity=\'.27\' transform=\'rotate(150 60,60)\'/><use xlink:href=\'%23l\' opacity=\'.37\' transform=\'rotate(180 60,60)\'/><use xlink:href=\'%23l\' opacity=\'.46\' transform=\'rotate(210 60,60)\'/><use xlink:href=\'%23l\' opacity=\'.56\' transform=\'rotate(240 60,60)\'/><use xlink:href=\'%23l\' opacity=\'.66\' transform=\'rotate(270 60,60)\'/><use xlink:href=\'%23l\' opacity=\'.75\' transform=\'rotate(300 60,60)\'/><use xlink:href=\'%23l\' opacity=\'.85\' transform=\'rotate(330 60,60)\'/></g></svg>\"");
    background-repeat: no-repeat;
    background-position: 50%;
    background-size: 100%;
}

.mui-spinner-white:after
{
    background-image: url("data:image/svg+xml;charset=utf-8,\"<svg viewBox=\'0 0 120 120\' xmlns=\'http://www.w3.org/2000/svg\' xmlns:xlink=\'http://www.w3.org/1999/xlink\'><defs><line id=\'l\' x1=\'60\' x2=\'60\' y1=\'7\' y2=\'27\' stroke=\'%23fff\' stroke-width=\'11\' stroke-linecap=\'round\'/></defs><g><use xlink:href=\'%23l\' opacity=\'.27\'/><use xlink:href=\'%23l\' opacity=\'.27\' transform=\'rotate(30 60,60)\'/><use xlink:href=\'%23l\' opacity=\'.27\' transform=\'rotate(60 60,60)\'/><use xlink:href=\'%23l\' opacity=\'.27\' transform=\'rotate(90 60,60)\'/><use xlink:href=\'%23l\' opacity=\'.27\' transform=\'rotate(120 60,60)\'/><use xlink:href=\'%23l\' opacity=\'.27\' transform=\'rotate(150 60,60)\'/><use xlink:href=\'%23l\' opacity=\'.37\' transform=\'rotate(180 60,60)\'/><use xlink:href=\'%23l\' opacity=\'.46\' transform=\'rotate(210 60,60)\'/><use xlink:href=\'%23l\' opacity=\'.56\' transform=\'rotate(240 60,60)\'/><use xlink:href=\'%23l\' opacity=\'.66\' transform=\'rotate(270 60,60)\'/><use xlink:href=\'%23l\' opacity=\'.75\' transform=\'rotate(300 60,60)\'/><use xlink:href=\'%23l\' opacity=\'.85\' transform=\'rotate(330 60,60)\'/></g></svg>\"");
}
```
在最外层加上""以后，还需要对svg标签添加"",但是需要\转义

##### 10.工程有三个分支，master是精准推送第一版，deppon-collage是课程中心，error-app-v2是精准推送改版
##### 11.开发 npm run dev / npm  run build-dev 生产 npm run build / npm run build-pro



