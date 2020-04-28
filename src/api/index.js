import Ajax from '../service/ajax'
//获取差错数据
export const getFailErrorStudy = (data) => Ajax("/errorpush/failErrorStudy", data, "get");
//获取教程详情
export const getCourseData = (data) => Ajax("/errorpush/errorGetCourseDetail", data, "get");
//获取待学习差错数据
export const getStudyDataList = (data) => Ajax('/errorpush/studydataList', data, 'get');
//获取差错数据列表
export const getErrorDetail = (data) => Ajax('/errorpush/getErrorDetail', data, 'get');
//获取历史记录数据
export const historydataList = (data) => Ajax('/errorpush/historydataList', data, 'get');
//获取历史详情
export const getHistoryErrorDetail = (data) => Ajax('/errorpush/getHistoryErrorDetail', data, 'get');
//记录时长
export const recordStudy = (data) => Ajax('/errorpush/recordStudy', data, 'get');
//获取图文数据
export const getImgTextContent = (data) => Ajax("/getImgTextContent", data, "get");
//获取缓存数据
export const getVideoImgCache = (data) => Ajax("/errorpush/getVideoImgCache", data, "get");
//缓存数据
export const setVideoImgCache = (data) => Ajax("/errorpush/cacheVideoImgSchdule", data, "get");
//检查是否绑定课程
export const checkIsHaveCourse = (data) => Ajax("/errorpush/checkErrorTyprCourse", data, "get");
//开始学习课程时更改差错任务的状态的接口
export const setErrorStatus = (data) => Ajax("/errorpush/startStudyCourse", data, "get");
//记录闯关次数
export const setPointNums = (data) => Ajax("/errorpush/checkPointNums", data, "get");
//获取闯关试题
export const getCourseCheckPoint = (data) => Ajax("/app/getCheckPointQue", data, "get");
//提交考试/app/submitCheckPointQue
export const submitCheckPointQue = (data) => Ajax("/app/submitCheckPointQue", data, "post");
// export const submitCheckPointQue = (data) => Ajax("/errorpush/submitCheckPointQue", data, "post");
//获取题目解析
// export const getExamError = (data) => Ajax("/getExamError", data, "get");
export const getExamError = (data) => Ajax("/app/getExamAnswer", data, "get");
//记录闯关成功与失败次数
export const saveCheckPointNums = (data) => Ajax("/errorpush/checkPointFailSuccessNums", data, "get");
//课程评价
export const comCourseText = (data) => Ajax("/errorpush/comCourseText", data, "post");
//获取金币
export const getGold = (data) => Ajax('/errorpush/getGold', data, 'get');
///errorpush/checkComCourse
export const checkComCourse = (data) => Ajax('errorpush/checkComCourse', data, 'get');
//记录进入闯关接口
export const recordPointNum = (data) => Ajax('/errorpush/recordPointNum', data, 'get');
//获取竖向菜单接口
export const getMenuVal = (data) => Ajax('/app/getLessonTypeList', data, 'get');


//获取课程列表
export const getCourseList = (data) => Ajax('/app/getLessonDataList', data, 'get');
//获取课程详情
export const getLessonDetail = (data) => Ajax('/app/getLessonDetail', data, 'get');
//添加到正在学习列表中
export const saveCurrentStudy = (data) => Ajax("/app/saveCurrentStudy", data, 'get');
//设置缓存
export const saveCacheData = (data) => Ajax('/app/saveCacheData', data, 'get');
//变更状态为已学
export const saveHaveLesson = (data) => Ajax('/app/saveHaveLesson', data, 'get');
//获取浏览量
export const saveBrowserNum = (data) => Ajax('/app/saveBrowserNum', data, 'get');
//获取评论
export const getCriticList = (data) => Ajax('/app/getCriticList', data, 'get');
//提交评论
export const submitComent = (data) => Ajax('/app/saveCriticText', data, 'post');
//记录点赞数
export const submitLike = (data) => Ajax('/app/savelikeNum', data, 'get');
//取消点赞
export const cancelLike = (data) => Ajax('/app/dellikeNum', data, 'get');
//收藏
export const saveMyFavorite = (data) => Ajax('/app/saveMyFavorite', data, 'get');
//取消收藏
export const cancelMyFavorite = (data) => Ajax('/app/delMyFavorite', data, 'get');
//获取缓存
export const getCacheData = (data) => Ajax('/app/getCacheData', data, 'get');
//设置缓存
export const setCacheData = (data) => Ajax('/app/saveCacheData', data, 'get');
//记录学习开始时间
export const startStudyTime = (data) => Ajax('/app/startStudyStatic', data, 'get');
//记录学习结束时间
export const endtStudyTime = (data) => Ajax('/app/endStudyStatic', data, 'get');
//保存搜索记录
export const saveSearchData = (data) => Ajax('/app/saveSearchData', data, 'get');
//获取搜索记录
export const getSearchData = (data) => Ajax('/app/getSearchDataList', data, 'get');
//删除搜索记录
export const delSearchData = (data) => Ajax('/app/delSearchDataList', data, 'get');
//排行榜
export const getRankList = (data) => Ajax('/app/getRankList', data, 'get');
//已学习
export const getHaveLessonList = (data) => Ajax('/app/getHaveLessonList', data, 'get');
//已收藏
export const getFavoriteLessonList = (data) => Ajax('/app/getFavoriteLessonList', data, 'get');
//正在学习
export const getStudyLessonList = (data) => Ajax('/app/getStudyLessonList', data, 'get');
//推荐
export const getRecomList = (data) => Ajax('/app/getRecomList', data, 'get');
//检查是否收藏
export const checkFavoriteInfo = (data) => Ajax('/app/checkFavoriteInfo', data, 'get');
//检查是否点赞
export const checkLikeInfo = (data) => Ajax('/app/checkLikeInfo', data, 'get');

// 提交评论

export const postComent = (data) => Ajax('/app/singleCom',data,'get');







