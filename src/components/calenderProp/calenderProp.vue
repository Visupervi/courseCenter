<template>
  <div class="calenderProp">
    <div class="dateRange">
      <van-popup
        v-model="show"
        position="bottom"
        :style="{ height: '85%' }"
      >
        <div class="errorBtn">
          <div class="errorCancel">
            <van-button type="default" @click="cancelCalProp">取消</van-button>
          </div>
          <div class="errorSure">

            <van-button type="info" @click="sureSelect">确认</van-button>
          </div>
        </div>
        <div class="onepxLine"></div>
        <div class="time">开始时间</div>
        <van-datetime-picker
          v-model="startTime"
          type="date"
          :show-toolbar="showToolbar"
          :min-date="minDate"
          :max-date="maxDate"
        />
        <div class="time">结束时间</div>
        <van-datetime-picker
          v-model="endTime"
          type="date"
          :show-toolbar="showToolbar"
          :min-date="minDate"
          :max-date="maxDate"
        />
      </van-popup>

    </div>
  </div>
</template>

<script>
  import {formatTime} from '../../service/superGuide'
  import {Toast,Notify} from 'vant';
  export default {
    props: {},
    data() {
      return {
        startTime: new Date(), // 开始时间
        endTime: new Date(), // 结束时间
        minDate: new Date(1970, 0, 1), // 最小时间
        maxDate: new Date(2100, 11, 1), // 最大时间
        show: false, // 弹出层是否显示
        showToolbar: false // 是否显示日期插件工具栏
      }
    },
    methods: {
      /**
       * 关闭弹出层
       */
      cancelCalProp() {
        console.log(this.endTime.toLocaleDateString(), this.startTime);
        this.show = false;
      },
      /**
       * 获取父组件的值
       * @param data
       */
      getParentData(data) {
        console.log(data);
        this.show = data.show;
      },
      /**
       * 确认事件
       */
      sureSelect() {
        console.log(new Date(formatTime(this.endTime).replace(/-/g, '/')).getTime());
        if(new Date(formatTime(this.endTime).replace(/-/g, '/')).getTime() < new Date(formatTime(this.startTime).replace(/-/g, '/')).getTime()){
          Notify({ type: 'primary', message: '结束时间必须小于开始时间' });
        } else{
          this.show = false;
          this.$emit("getCalenderData", {
            startTime: this.startTime,
            endTime: this.endTime,
            show:this.show
          });

        }

      }
    }

  };
</script>
<style scoped lang="less">
  .calenderProp {
    height: 100%;
    .errorBtn {
      display: flex;
      justify-content: space-between;
      display: -webkit-flex;
      -webkit-justify-content: space-between;

      margin-top: 10px;

      .van-button {
        height: 1.257rem;
        line-height: 1.257rem;
        border: none;
      }

      .van-button--info {
        background-color: #fff;
        color: #1989fa;
        border: none;
      }
    }

    .time {
      text-align: center;
      font-size: 0.85rem;
      color: #999;
    }

    .onepxLine {
      width: 100%;
      height: 1px;
      background-color: #E3E3E3;
      transform: scaleY(.5);
      margin-top: 10px;
    }
  }

</style>
