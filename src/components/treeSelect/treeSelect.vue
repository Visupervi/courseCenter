<!--竖向tab栏切换组件，自定义右边部分-->
<template>
  <div class="treeSelect">
    <van-tree-select
      height="55vw"
      :items="items"
      @click-nav="getListData"
      :main-active-index.sync="active"
    >
      <template #content>
        <van-dropdown-menu>
          <van-dropdown-item @change="dropDownChange" title="排序" v-model="value1":options="option1"/>
          <van-dropdown-item @change="dropDownChange"  title="阅读量" v-model="value2" :options="option2"/>
          <van-dropdown-item @change="dropDownChange" @close="closeMenu" @open="openMenu" :title="selectTitle"
                             ref="item"
                             class="mySelect">
            <button :class="{'isSelect':item.isActive}" type="button" class="mui-btn" v-for="(item,index) in option3"
                    :key="index" @click="selectMenu(item)">
              {{item.text}}
            </button>
          </van-dropdown-item>
        </van-dropdown-menu>
        <courseList v-if="selecData.typeId !==''" :selecData="selecData"></courseList>
      </template>
    </van-tree-select>
  </div>
</template>

<script>
  /**
   * @Author Visupervi
   * @date 2020/3/30 15:52
   * @param
   * @return
   *
   */

  import {getMenuVal} from '../../api';
  import courseList from '../../components/courseList/courseList';
  import {overscroll} from '../../service/superGuide';
  export default {
    inject: ['reload'],
    props: {
      sosoVal: {
        type: String
      },
      selectData: {
        type: Object
      }
    },
    data() {
      return {
        active: "",
        // active: 0,
        items: [],
        typeId: "",
        status: false,
        selectTitle: "筛选",
        tempArr: [],
        index:0,
        selecData: {
          typeId: "" ,
          text: this.sosoVal,
          updateTime: "",
          contentType: "",
          studyFlag: "",
          browserNum: "",
          flag: '1',
          isAlload: false,
          routeName: "collageCourse",
        },
        value1: 0,
        value2: 'a',
        value3: 'd',
        switch1: false,
        switch2: false,
        option1: [
          // {text: '排序', value: 0},
          {text: '时间由远到近', value: 1},
          {text: '时间由近到远', value: 2}
        ],
        option2: [
          // {text: '阅读量', value: 'a'},
          {text: '浏览量由高到低', value: 'b'},
          {text: '浏览量由低到高', value: 'c'},
        ],
        option3: [
          {text: '图文课程', value: 'd', isActive: false},
          {text: '视频课程', value: 'e', isActive: false},
          {text: '正在学习', value: 'f', isActive: false},
          {text: '已学课程', value: 'g', isActive: false},
          {text: '未学课程', value: 'h', isActive: false},
          {text: '全部课程', value: 'i', isActive: false},
        ],
        courseList: []
      }
    },
    beforeCreate() {
      // console.log("this.getStoreKeyWords",this.getStoreKeyWords);
      // this.getStoreKeyWords[0].index === undefined ?  this.active = 0 : this.active = this.getStoreKeyWords[0].index;
      // this.getStoreKeyWords[0].typeId === undefined ? this.selecData.typeId = "" : this.selecData.typeId = this.getStoreKeyWords[0].typeId;
    },
    created() {
      // this.getCourseList();
      this.getMenuValData();

    },
    mounted() {
      if(JSON.parse(localStorage.getItem('currentSelect')) === null) {
        this.active = 0
      }else{
        this.active = JSON.parse(localStorage.getItem('currentSelect'))[0].index;
      }
    },
    methods: {
      //获取竖向菜单
      async getMenuValData() {
        let res = await getMenuVal();
        // let typeId =
        // console.log(res);
        if (parseInt(res.code) === 200) {
          res.result.map((item, index) => {
            this.items.push({text: item.name, id: item.id})
          });
          // this.items = res.result;
          this.items.unshift({text:"全部课程",id: 0});
          if(JSON.parse(localStorage.getItem('currentSelect')) === null) {
            this.selecData.typeId = this.items[0].id
          }else{
            this.selecData.typeId = JSON.parse(localStorage.getItem('currentSelect'))[0].typeId;
          }
          // this.selecData.typeId = this.items[0].id;
          // console.log();
          this.getListData(this.selecData.typeId)
        }
      },
      //竖向菜单切换
      getListData(val) {
        // console.log("竖向菜单val",this.active);
        if (this.items.length > 1) {
          // console.log("this.item",this.items);
          for (let i = 0; i < this.items.length; i++) {
            if(this.active === i){
              // console.log("部位0",this.selectData);
              // console.log(this.items[i].id);
              this.selecData.typeId = this.items[i].id;
              this.$emit('getTreeSelect', this.selecData);
            }
          }
        } else {
        }
        // console.log("121212121212sd",this.selectData);
        this.$store.commit("addToKeyWords", {typeId: this.selecData.typeId, index: this.active});
      },
      //横向菜单切换
      dropDownChange(val,e) {
        console.log('val', val,e);
        switch (val.toString()) {
          case "1":
            this.selecData.updateTime = "1";
            this.selecData.studyFlag = "";
            this.selecData.contentType = "";
            this.selecData.browserNum = "";
            // this.value1 = 0;
            break;
          case "2":
            this.selecData.updateTime = "0";
            this.selecData.browserNum = "";
            this.selecData.studyFlag = "";
            this.selecData.contentType = "";
            // this.value1 = 0;
            break;
          case "b":
            this.selecData.browserNum = "1";
            this.selecData.updateTime = "";
            this.selecData.studyFlag = "";
            this.selecData.contentType = "";
            // this.value2 = "a";
            break;
          case "c":
            this.selecData.browserNum = "2";
            this.selecData.updateTime = "";
            this.selecData.studyFlag = "";
            this.selecData.contentType = "";
            // this.value2 = "a";
            break;
        }
        this.courseList = val
      },
      //横向菜单选择
      selectMenu(item) {
        // console.log("选择菜单", item);
        // this.selectTitle = item.text;
        switch (item.value) {
          case "d":
            !item.isActive ? this.selecData.contentType = "1" : this.selecData.contentType = "";
            this.selecData.studyFlag = "";
            this.selecData.updateTime = "";
            this.selecData.browserNum = "";
            this.cancelSelected(item.text);
            item.isActive = !item.isActive;
            break;
          case "e":
            !item.isActive ? this.selecData.contentType = "0" : this.selecData.contentType = "";
            this.selecData.studyFlag = "";
            this.selecData.updateTime = "";
            this.selecData.browserNum = "";
            this.cancelSelected(item.text);
            item.isActive = !item.isActive;
            break;
          case "f":
            !item.isActive ? this.selecData.studyFlag = "2" : this.selecData.studyFlag = "";
            this.selecData.updateTime = "";
            this.selecData.contentType = "";
            this.selecData.browserNum = "";
            this.cancelSelected(item.text);
            item.isActive = !item.isActive;
            break;
          case "g":
            !item.isActive ? this.selecData.studyFlag = "1" : this.selecData.studyFlag = "";
            this.selecData.updateTime = "";
            this.selecData.contentType = "";
            this.selecData.browserNum = "";
            this.cancelSelected(item.text);
            item.isActive = !item.isActive;
            break;
          case "h":
            !item.isActive ? this.selecData.studyFlag = "0" : this.selecData.studyFlag = "";
            this.selecData.updateTime = "";
            this.selecData.contentType = "";
            this.selecData.browserNum = "";
            this.cancelSelected(item.text);
            item.isActive = !item.isActive;
            break;
          case "i":
            this.selecData.studyFlag = "";
            this.selecData.updateTime = "";
            this.selecData.contentType = "";
            this.selecData.browserNum = "";
            this.cancelSelected(item.text);
            item.isActive = !item.isActive;
            break;
        }
        this.$refs.item.toggle();
      },
      //筛选数组
      cancelSelected(text) {
        for (let i = 0; i < this.option3.length; i++) {
          if (text !== this.option3[i].text) {
            this.option3[i].isActive = false;
          }
        }
      },
      // 关闭/打开下拉菜单
      openMenu() {
        // for (let i = 0; i < this.option3.length; i++) {
        //   this.option3[i].isActive = false;
        // }
      },
      closeMenu() {
        // for (let i = 0; i < this.option3.length; i++) {
        //   this.option3[i].isActive = false;
        // }
      }
    },
    watch: {
      //获取父组件传递的搜索框的值
      sosoVal: {
        immediate: true,
        handler(val) {
          console.log("搜索组件传值", val);
          // this.selecData.text = val;
        },
        deep: true
      },
      selectData: {
        immediate: true,
        handler(val) {
          // console.log("selectData",val)
        },
        deep: true
      },
      getStoreKeyWords:{
        immediate:true,
        handler(val){
          // console.log("本地变化的值121212121",val);
        }
      }
    },
    computed: {
      // getStoreKeyWords() {
      //   return this.$store.getters.getStoreKeyWords;
      // },
    },
    components:{
      courseList
    },
    // beforeRouteEnter (to,from,next){
    //   console.log(this.active)
    //   console.log("JSON.parse(localStorage.getItem('currentSelect'))[0].index",JSON.parse(localStorage.getItem('currentSelect')));
    // }
  };
</script>
<style lang="less" scoped>
  .treeSelect {
    .van-tree-select__content {
      overflow: hidden;
      height: 100%;
    }

    .isSelect {
      /*background-color: red;*/

      &:not(first-child) {
        border: 1px solid #0099FF !important;
        color: #0099FF !important;
      }
    }

  }
</style>
