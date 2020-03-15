<!--  -->
<template>
  <div class="add">
    <van-nav-bar :title="'发布赛事'" v-show="!showmap" />
    <div class="add-popup">
      <div class="add-popup-main">
        <van-cell title="时间" is-link>
          <mu-date-input
            class="date"
            icon="today"
            v-model="form.game_time"
            label="选择日期和时间"
            type="dateTime"
            label-float
            full-width
            landscape
            container="dialog"
            :min-date="minDate"
          ></mu-date-input>
        </van-cell>
        <van-cell title="时长(小时)">
          <van-stepper
            v-model="form.duration"
            step="0.5"
            min="1"
            max="3"
            input-width="25px"
            button-size="25px"
          />
        </van-cell>
        <van-cell title="赛事类型" :value="form.game_type" @click="selectType = true;" is-link />
        <van-cell title="赛事地点" :value="form.poiaddress" @click="showmap = true;" is-link />
        <van-cell title="我想找几个人">
          <van-stepper v-model="form.game_number" input-width="25px" button-size="25px" />
        </van-cell>
        <van-cell title="我希望他的位置是" :value="form.orientation" @click="showAction = true" is-link />
        <van-cell title="评分限定" :value="rate" @click="showRate = true" is-link />
        <van-cell title="加入审核">
          <van-switch v-model="form.verify" size="20px" />
        </van-cell>
        <van-cell title="场地是否收费">
          <van-switch v-model="form.chargeable" size="20px" />
        </van-cell>
        <van-field
          v-show="form.chargeable"
          v-model.number="form.cost"
          label="价格(元)"
          placeholder="请输入价格"
          size="large"
          type="number"
        />
        <!-- <van-cell title="已有信息">
          <van-switch v-model="has_message" size="20px" />
        </van-cell>
        <van-button
          v-show="has_message"
          type="info"
          size="mini"
          class="addForm"
          @click="showAdd = true;"
        >新增</van-button>

        <table v-show="has_message&&teamInfoArr.length!=0">
          <tr>
            <th>昵称</th>
            <th>位置</th>
            <th>操作</th>
          </tr>
          <tr v-for="(item,index) in teamInfoArr" :key="index">
            <td>{{item.nickname}}</td>
            <td>{{item.orientation}}</td>
            <td>
              <van-icon name="delete" @click="deleteItem(index)" />
            </td>
          </tr>
        </table>-->
        <van-cell title="备注">
          <van-field
            v-model="form.remarks"
            type="textarea"
            placeholder="请输入留言"
            rows="1"
            autosize
            is-link
            maxlength="200"
          />
        </van-cell>
      </div>
      <van-button color="#FC8183" size="large" class="addBtn" @click="publish">安排</van-button>

      <!-- <baidu-map class="map" center="广州" :scroll-wheel-zoom="true"></baidu-map> -->
    </div>

    <!-- <van-popup v-model="selectLocation" position="bottom" :style="{ height: '50%' }">
      <v-distpicker type="mobile" @selected="distpickerSelected"></v-distpicker>
    </van-popup>-->

    <!-- 弹出选择位置 -->
    <van-action-sheet v-model="showRate" :actions="action3" @select="onSelectRate" />

    <van-action-sheet-self
      :showActionSheet="showAction"
      :actions="action1"
      :maxSelect="5"
      @close="showAction = false;"
    ></van-action-sheet-self>

    <van-action-sheet
      v-model="selectType"
      :actions="typeOption"
      cancel-text="取消"
      @select="onSelect"
    />

    <van-action-sheet-self
      :showActionSheet="showActionIn"
      :actions="action2"
      :maxSelect="3"
      @close="showActionIn = false;"
    ></van-action-sheet-self>

    <van-popup v-model="showmap" :style="{ width:'100%', height: '100%' }">
      <TencentMapChooseLocation v-bind:showmap.sync="showmap" @location="backLocation"></TencentMapChooseLocation>
    </van-popup>

    <van-popup v-model="showAdd" :style="{ width:'80%' }" closeable>
      <div class="add-header">新增</div>
      <van-field v-model="teamInfo.nickname" label="昵称" placeholder="请输入昵称" size="large" />
      <van-cell title="请选择位置" :value="teamInfo.orientation" @click="showActionIn = true;" is-link />
      <van-button color="#FC8183" size="mini" class="addTeamPerson" @click="addTeamPerson">新增</van-button>
    </van-popup>
  </div>
</template>

<script>
import VanNavBar from "@/components/VanNavBar";
import VanActionSheet from "@/components/VanActionSheet";
import VDistpicker from "v-distpicker";
import TencentMapChooseLocation from "@/components/TencentMapChooseLocation";
import { gameRequest } from "@/api";
export default {
  components: {
    "van-nav-bar": VanNavBar,
    "van-action-sheet-self": VanActionSheet,
    VDistpicker,
    TencentMapChooseLocation
  },
  data() {
    return {
      minDate: new Date(),
      showAction: false,
      selectType: false,
      showmap: false,
      showAdd: false,
      showActionIn: false,
      showRate: false,
      has_message: false,
      rate: "无限定",
      form: {
        game_time: "",
        game_number: 1,
        orientation: "",
        game_type: "5V5",
        poiaddress: "",
        duration: 0,
        remarks: "",
        cityname: "",
        lat: 0,
        lng: 0,
        chargeable: false,
        cost: null,
        rate: null,
        verify: false
      },
      teamInfo: {
        nickname: "",
        orientation: ""
      },
      teamInfoArr: [
        {
          username: this.$store.state.user.userInfo.username,
          nickname: this.$store.state.user.userInfo.nickname,
          orientation: this.$store.state.user.userInfo.orientation
        }
      ],
      action1: [
        { name: "控球后卫" },
        { name: "得分后卫" },
        { name: "小前锋" },
        { name: "大前锋" },
        { name: "中锋" }
      ],
      action2: [
        { name: "控球后卫" },
        { name: "得分后卫" },
        { name: "小前锋" },
        { name: "大前锋" },
        { name: "中锋" }
      ],
      action3: [
        {
          name: "4.5以上",
          value: 4.5,
          disabled: this.$store.state.user.userInfo.rate >= 4.5 ? false : true
        },
        {
          name: "3.5以上",
          value: 3.5,
          disabled: this.$store.state.user.userInfo.rate >= 3.5 ? false : true
        },
        {
          name: "2.5以上",
          value: 2.5,
          disabled: this.$store.state.user.userInfo.rate >= 2.5 ? false : true
        },
        { name: "无限定", value: 0 }
      ],
      typeOption: [{ name: "5V5" }, { name: "4V4" }, { name: "3V3" }]
    };
  },
  computed: {
    userInfo: function() {
      return this.$store.state.user.userInfo;
    }
  },
  watch: {
    action1: {
      //深度监听，可监听到对象、数组的变化
      handler: function(val) {
        //如果颜色高亮的就是被选中的项目
        //重置
        this.form.orientation = "";
        val.forEach(element => {
          if (element.color) {
            this.form.orientation += element.name + " ";
          }
        });
      },
      deep: true
    },
    action2: {
      //深度监听，可监听到对象、数组的变化
      handler: function(val) {
        //如果颜色高亮的就是被选中的项目
        //重置
        this.teamInfo.orientation = "";
        val.forEach(element => {
          if (element.color) {
            this.teamInfo.orientation += element.name + " ";
          }
        });
      },
      deep: true
    }
  },
  methods: {
    onSelect(item, index) {
      this.form.game_type = item.name;
      this.selectType = false;
    },
    onSelectRate(item) {
      // 默认情况下，点击选项时不会自动关闭菜单
      // 可以通过 close-on-click-action 属性开启自动关闭
      this.showRate = false;
      this.rate = item.name;
    },
    backLocation(location) {
      //console.log(location);
      this.form.poiaddress = location.poiaddress + location.poiname;
      this.form.cityname = location.cityname;
      this.form.lat = location.latlng.lat;
      this.form.lng = location.latlng.lng;
    },
    addTeamPerson() {
      this.teamInfoArr.push(Object.assign({}, this.teamInfo));
      this.teamInfo.nickname = "";
      this.teamInfo.orientation = "";
      this.showAdd = false;
    },
    publish() {
      if (this.form.game_time == "") {
        this.$toast.fail({
          forbidClick: true,
          message: "请选择时间",
          duration: 1500
        });
        return;
      }

      if (this.form.cityname == "") {
        this.$toast.fail({
          forbidClick: true,
          message: "请选择地点",
          duration: 1500
        });
        return;
      }

      if (this.form.orientation == "") {
        this.$toast.fail({
          forbidClick: true,
          message: "请选择位置",
          duration: 1500
        });
        return;
      }

      this.form.teamInfoArr = this.teamInfoArr;
      this.form.username = this.userInfo.username;

      if (this.rate == "无限定") {
        this.form.rate = 0;
      } else {
        this.form.rate = parseFloat(this.rate.replace("以上"));
      }

      if (!this.form.chargeable) {
        this.form.cost = 0;
      }

      gameRequest
        .addGame(this.form)
        .then(res => {
          console.log(res);
          if (res.status == 201) {
            this.$toast.success({
              forbidClick: true,
              message: "安排上了",
              duration: 1500
            });
            this.$store.commit("CHANGE_GAME_NUMBER", 1);
            setTimeout(() => {
              this.$router.back(-1);
            }, 1800);
          }
        })
        .catch(reason => {});
    },
    deleteItem(index) {
      if (index == 0) {
        this.$toast("不能删除自己");
        return;
      }
      this.teamInfoArr.splice(index, 1);
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {}
};
</script>
<style scoped lang="less">
.add {
  // margin: 10px;
  margin-top: 46px;
}
.van-cell__title {
  font-size: 16px;
}
.van-cell__value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  /* padding-left: 10px; */
}
.van-switch--on {
  background-color: #fc8183;
}
table {
  border-collapse: collapse;
  margin-bottom: 10px;
  width: 94%;
  text-align: center;
  margin: 0 auto;
}

table,
td,
th {
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 0.39rem;
  padding: 0.1rem;
}

td .van-icon-delete {
  font-size: 0.5rem;
}
.mu-input {
  margin: 0;
  padding: 0;
  min-height: 0;
}
.add /deep/ .mu-text-field-input {
  background-color: white;
  margin-top: -10px;
  z-index: 1000;
  text-align: right;
}
.addBtn {
  display: block;
  width: 94%;
  margin: 0.333333rem auto;
}
.addForm {
  float: right;
  margin: 0.266667rem;
}
.add-header {
  text-align: center;
  font-size: 0.4rem;
  margin: 0.4rem;
}
.addTeamPerson {
  float: right;
  margin: 0.5rem;
}
.add /deep/ .van-field__control {
  text-align: right;
}
.van-cell__value .van-field {
  padding: 0.1rem 0;
}
</style>