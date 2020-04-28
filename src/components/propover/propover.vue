<template>
  <div class="propover">
    <van-popup
      v-model="isShow"
      @close='closeProp'
      closeable
      round='round'
      position="bottom"
      :style="{ height: '60%' }"
    >
      <div class="title">
        <p>差错详情</p>
      </div>
      <div class="errorList">
        <div class="mui-scroll-wrapper scrollWrap" ref="scrollWrap">
          <div class="mui-scroll">
            <ul class="mui-table-view">
              <!--[index % 2 == 0 ? 'odd' : 'even']-->
              <li class="mui-table-view-cell" :class="{'odd':index%2==0,'even':index%3 == 0,'remainder4':index%4==0}"
                  v-for="(item,index) in list " :key="index" ref="lis">
                <div class="errorListWrap">
                  <div>
                    <p><span v-if="index < 9">0</span>{{index + 1}}</p>
                  </div>
                  <div>
                    <p :class="{'doneColor':item.status =='已完成' }">{{item.status}}</p>
                  </div>
                  <div>
                    <p>编号:{{item.errorCode}}</p>
                  </div>
                  <div class="errorName">
                    <p>单号:{{item.deliveryNum}}</p>
                  </div>
                  <div>
                    <p>有效时间:{{item.create_time.split("T")[0]}} 至 {{item.endTime.split("T")[0]}}</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>


    </van-popup>
  </div>
</template>

<script>
  import {getErrorDetail,getHistoryErrorDetail} from '../../api'

  export default {
    props: ['show'],
    data() {
      return {
        isShow: this.show,
        round: true,
        list: []
      }
    },
    created() {
    },
    mounted() {

    },
    methods: {
      closeProp() {
        this.$emit('getSendData', this.isShow)
      },
      async getParentData(data) {
        this.isShow = data.show;
        let res;
        data.flag === "1" ? res = await getErrorDetail({eTypeId: data.eTypeId,taskCode:data.taskCode}) : res = await getHistoryErrorDetail({eTypeId: data.eTypeId,taskCode:data.taskCode});

        if (parseInt(res.code) === 200) {
          res.result.map((val, key) => {
            switch (val.status) {
              case "0":
                val.status = "未开始";
                break;
              case "1":
                val.status = "进行中";
                break;
              case "2":
                val.status = "已完成";
                break;
              case "3":
                val.status = "超期未完成";
                break;
              case "4":
                val.status = "超期已完成";
                break;
            }
          });
          this.list = res.result;

        } else {
          mui.toast('暂无数据', '温馨提示')
        }
        console.log('res', res);
      }
    },
    watch: {
      show(newVal, oldVal) {
        // console.log(oldVal, newVal)

      },
      deep: true
    }
  };
</script>
<style scoped lang="less">
  .propover {
    height: 100%;
    .mui-toast-container {
      top: 0px; //顶部显示
      left: 0;
      width: 100%;//宽度修改为100%宽度
      -webkit-transform:none;
      transform: none;
    }
    .title {
      margin-top: 0.771rem;

      p {
        text-align: center;
        font-family: PingFangSC-Medium;
        font-size: 1.029rem;
        color: #333;
        font-weight: 600;
      }


    }

    .errorList {

      position: relative;
      height: calc(100% - 47px);

      .scrollWrap {
        overflow-y: scroll;

        .errorListWrap {
          display: flex;
          width: 100%;
          flex-wrap: wrap;
          justify-content: space-between;
          background: #F4F6FF;
          border-radius: 6px;
          padding: 0.029rem 0.457rem;
          box-sizing: border-box;

          div {
            width: 50%;
            font-family: PingFangSC-Regular;
            line-height: 34px;
            color: #666666;
            margin-bottom: 0.286rem;

            p {
              /*text-indent: 0.5rem;*/
              line-height: 1.143rem;
              text-align: right;
              font-size: 0.8rem;
              /*margin-right: 0.686rem;*/
            }
          }

          div:nth-child(5) {
            width: 100%;

            p {
              font-family: PingFangSC-Regular;
              font-size: 0.686rem;
              color: #999999;
              line-height: 34px;
              text-align: left;
              /*margin-left: 0.686rem;*/
            }
          }

          div:nth-child(2) {
            p {
              font-family: PingFangSC-Regular;
              font-size: 0.686rem;
              color: #0091FF;
              text-align: right;
              margin-right: 0.686rem;
            }
            .doneColor {
              color: #999999;
            }

          }


          div:nth-child(1) {
            p {
              font-family: PingFangSC-Medium;
              font-size: 0.8rem;
              color: #FFFFFF;
              line-height: 0.8rem;
              top: 0.759rem;
              left: 0.643rem;
              z-index: 999;
              position: absolute;
              margin-left: 0.368rem;
            }
          }
          div:nth-child(3) {
            width: 56%;
            p{
              text-align: left;
            }
          }
          div:nth-child(4) {
           width: 44%;
          }

          .errorListTitle {
            width: 100%;

            .left {
              float: left;
            }

            .right {
              float: right;
            }
          }
        }
      }

      .mui-table-view-cell:after, .mui-table-view:after, .mui-table-view:before {
        height: 0;
      }

      .mui-table-view-cell {
        /*background: #F4F6FF;*/
        /*border-radius: 6px;*/

      }

      .mui-table-view-cell:before {
        position: absolute;
        top: 0.5rem;
        left: 0.6rem;
        content: "";
        background: #FF524D;
        width: 1.886rem;
        height: 1.429rem;
        border-radius: 0 1.386rem 1.386rem 0;
        /*filter: drop-shadow(10px 10px 5px #FF524D);*/
      }

      .mui-table-view-cell:after {
        position: absolute;
        content: "";
        width: 0;
        height: 0;
        top: 0.1111rem;
        left: 0.577rem;
        border-style: solid;
        border-width: 0 0 0.571rem 0.571rem;
        border-color: #FF524D transparent;
        background-color: transparent;
      }

      .odd::before {
        background: #FBA93F;
      }

      .odd::after {
        border-width: 0 0 0.571rem 0.571rem;
        border-color: #FBA93F transparent;
        background-color: transparent;
      }

      .even::before {
        background: #FED200;
      }

      .even::after {
        border-width: 0 0 0.571rem 0.571rem;
        border-color: #FED200 transparent;
        background-color: transparent;
      }

      .remainder4::before {
        background: #79BDFF;
      }

      .remainder4::after {
        border-width: 0 0 0.571rem 0.571rem;
        border-color: #79BDFF transparent;
        background-color: transparent;
      }

    }
  }
</style>
