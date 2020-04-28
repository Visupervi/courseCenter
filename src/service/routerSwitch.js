import {communicationWithNative, getQueryString} from './superGuide'
export const routerSwitch = (fromName, routerObj, methodsName = "", callback) => {
  console.log("routerObj", routerObj);
  console.log("methodsName", methodsName);
  switch (fromName) {
    case "myCollect":
      if (methodsName === "") {
        console.log(window.location);
        // local.location = `${window.}`
        routerObj.push(`/myCollect?accessToken=${getQueryString('accessToken')}`).catch(err => {
          console.log(err)
        });
      } else {
        routerObj.replace(`/myCollect?accessToken=${getQueryString('accessToken')}`).catch(err => {
          console.log(err)
        });
        callback()
      }
      location.reload();
      break;
    case "hasStudy":
      if (methodsName === "") {
        routerObj.replace(`/hasStudy?accessToken=${getQueryString('accessToken')}`).catch(err => {
          console.log(err)
        });
      } else {
        routerObj.replace(`/hasStudy?accessToken=${getQueryString('accessToken')}`).catch(err => {
          console.log(err)
        });
      }
      location.reload();
      break;
    case "moreLearning":
      if (methodsName === "") {
        routerObj.replace(`/moreLearning?accessToken=${getQueryString('accessToken')}`).catch(err => {
          console.log(err)
        });
      } else {
        routerObj.replace(`/moreLearning?accessToken=${getQueryString('accessToken')}`).catch(err => {
          console.log(err)
        });
      }
      location.reload();
      break;
    case "moreRecommend":
      if (methodsName === "") {
        routerObj.replace(`/moreRecommend?accessToken=${getQueryString('accessToken')}`).catch(err => {
          console.log(err)
        });
      } else {
        routerObj.replace(`/moreRecommend?accessToken=${getQueryString('accessToken')}`).catch(err => {
          console.log(err)
        });
      }
      location.reload();
      break;
    case "collageCourse":
      if (methodsName === "") {
        routerObj.replace(`/collageCourse?accessToken=${getQueryString('accessToken')}`).catch(err => {
          console.log(err)
        });
      } else {
        routerObj.replace(`/collageCourse?accessToken=${getQueryString('accessToken')}`).catch(err => {
          console.log(err)
        });
      }
      // location.reload();
      break;
    case 'fromIndex':
      communicationWithNative({
        method: 'finish',
        args: null
      }, {
        method: 'finish',
        args: []
      });
      break;
  }
};
