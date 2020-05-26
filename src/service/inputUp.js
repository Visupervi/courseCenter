export const inputUp = () => {
  //安卓机型，自动上滑露出输入框
  if (/Android/.test(navigator.appVersion)) {
    // console.log("12212121");
    // console.log(document.querySelector('.header'));

    window.addEventListener("resize", () => {
      // console.log("document.querySelector('.header')", document.querySelector('.header'));
      // console.log("document.activeElement.tagName", document.activeElement);
      // console.log("document.querySelector('.coment')",document.querySelector('.breakThrough'));
      if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA" || document.activeElement._prevClass === 'van-field_control') {
        if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") {
          document.activeElement.tagName.scrollIntoView({behavior: "instant", block: "start", inline: "start"})
        } else {
          // if()
          // console.log("document.querySelector('.coment')",document.querySelector('.coment'));
          document.querySelector('.header').scrollIntoView({behavior: "instant", block: "start", inline: "start"});
          document.querySelector('.breakThrough').scrollIntoView({behavior: "instant", block: "start", inline: "start"});
        }
        // document.querySelector('.header').scrollViewIfNeeded()
      }
    })
  }
};
// export const androidHandler = () => {
//   let flag = false;
//   let pageBackNormFunc;
//   if (/Android/.test(navigator.appVersion)) {
//     document.body.addEventListener('focusin', () => {
//       // 软键盘弹起事件
//       flag = true
//       pageBackNormFunc && clearTimeout(pageBackNormFunc)
//     })
//     document.body.addEventListener('focusout', () => {
//       // 软键盘关闭事件
//       if (flag) {
//         pageBackNormFunc = setTimeout(function () {
//           // 当键盘收起的时候让页面回到原始位置
//           window.scrollTo({top: 0, left: 0, behavior: 'smooth'})
//         }, 200)
//       }
//       flag = false
//     })
//   }
// };
