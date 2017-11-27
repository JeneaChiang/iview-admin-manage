<template>
    <section>
        <i-button type="info" @click="show">新增课程</i-button>
        <Modal
            v-model="modalAdd"
            title="增加教练信息"
            width="500"
            ok-text="确认"
            cancel-text="取消"
            :loading="loading"
            v-on:on-ok="addOk">
            <Form ref="courseForm" :model="courseForm" :rules="ruleValidate" :label-width="100">
                <FormItem label="课程类型" prop="courseTypeID">
                <Select v-model="courseForm.courseTypeID"  filterable>
                    <Option v-for="item in typeNameList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem label="课程教练" prop="coachID">
                <Select v-model="courseForm.coachID" filterable >
                    <Option v-for="item in coachNameList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem label="是否为私教" prop="isPrivate">
              <RadioGroup v-model.number="courseForm.isPrivate">
                <Radio label="1">是</Radio>
                <Radio label="0">否</Radio>
              </RadioGroup>
            </FormItem>
            <div>
              <template v-if="courseForm.isPrivate">
              <FormItem label="总课时" prop="count">
                <Input v-model.number="courseForm.count" placeholder="请输入可预约人数/课时"></Input>
              </FormItem>
              <FormItem label="价格" prop="price">
                <Input v-model.number="courseForm.price" placeholder="请输入课程价格"></Input>
              </FormItem>
              </template>
            <template v-else>
              <FormItem label="可预约人数" prop="count">
                <Input v-model.number="courseForm.count" placeholder="请输入可预约人数/课时"></Input>
              </FormItem>
              <FormItem label="价格" prop="price">
                <Input v-model.number="courseForm.price" placeholder="请输入课程价格"></Input>
              </FormItem>
              <FormItem label="VIP价格" prop="vipPrice">
                <Input v-model.number="courseForm.vipPrice" placeholder="请输入课程VIP价格"></Input>
              </FormItem>
              <FormItem label="开始时间" prop="startTime">
                <date-picker type="datetime" placement="top" v-model="courseForm.startTime" format="yyyy-MM-dd HH:mm" placeholder="选择日期和时间"></date-picker>
              </FormItem>
              <FormItem label="结束时间" prop="endTime">
                <date-picker type="datetime" placement="top" v-model="courseForm.endTime" format="yyyy-MM-dd HH:mm" placeholder="选择日期和时间"></date-picker>
              </FormItem>
            </template>
            </div>
            </Form>
        </Modal>
    </section>
</template>
<script>
import axios from "axios";
const ERR_OK = 0;
const BASE_URL = "../../static/";
export default {
  name: "addcourse",
  data() {
    const validateEndTime = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请选择结束时间'));
        } else if (value <= this.courseForm.startTime) {
            callback(new Error('结束时间必须大于开始时间'));
        } else {
            callback();
        }
    };
    return {
      typeNameList: [],
      coachNameList: [],
      modalAdd: false,
      loading:true,
      courseForm: {
        courseTypeID: 0,
        coachID: 0,
        isPrivate: 0,
        price: 0,
        vipPrice: 0,
        startTime: 0,
        endTime: 0,
        count: 0
      },
      ruleValidate: {
        courseTypeID: [
          { required: true, type: "number", message: "请选择课程类型", trigger: "blur", min:1}
        ],
        coachID: [
          { required: true,  type: "number",message: "请选择教练", trigger: "blur",min:1}
        ],
        price: [
          { required: true, message: "请填写价格", trigger: "blur", pattern: /.+/},
          { type: "number", message: "价格只能大于0的数字", trigger: "blur",min:1 }
        ],
        vipPrice: [
          { required: true, message: "请填写VIP价格", trigger: "blur",pattern:/.+/},
          { type: "number", message: "VIP价格只能大于0的数字", trigger: "blur" ,min:1}
        ],
        count: [
          { required: true, message: "请填写预约人数/课时", trigger: "blur",pattern: /.+/},
          { type: "number", message: "预约人数/课时只能大于0的数字", trigger: "blur" ,min:1}
        ],
        startTime: [
          { required: true, message: "请选择开始时间", trigger: "change",pattern: /.+/}
        ],
        endTime: [
          { required: true, pattern: /.+/, validator: validateEndTime, trigger: "change"}
        ]
      }
    };
  },
  created() {
    this.getAllCoach();
    this.getAllType();
  },
  methods: {
    show: function() {
      for (var key in this.courseForm) this.courseForm[key] = 0;
      this.$refs.courseForm.resetFields();
      this.modalAdd = true;
    },
    addOk: function() {
      this.$refs.courseForm.validate(valid => {
        this.changeLoadingBtn();
        if (valid) {
          this.courseForm.startTime = Date.parse(this.courseForm.startTime);
          this.courseForm.endTime = Date.parse(this.courseForm.endTime);
          console.log(this.courseForm);
          this.$emit("add-ok", this.courseForm);
          this.modalAdd = false;
        } else {
          
          this.$Message.error("请认真填写数据");
        }
      });
    },
    getAllCoach: function() {
      let result = [],
        coachNameList = [],
        errCode;
      axios
        .get(BASE_URL+"coach.json")
        .then(res => {
          errCode = res.data.errCode;
          result = res.data.result;
          if (errCode === ERR_OK) {
            for (let i in result)
              coachNameList.push({
                value: result[i].id,
                label: result[i].name
              });
            this.coachNameList = coachNameList;
          }
        })
        .catch(error => {
          console.warn(error);
        });
    },
    getAllType: function() {
      let result = [],
        typeNameList = [],
        errCode;
      axios
        .get(BASE_URL+"courseType.json")
        .then(res => {
          errCode = res.data.errCode;
          result = res.data.result;
          if (errCode === ERR_OK) {
            for (let i in result)
              typeNameList.push({ value: result[i].id, label: result[i].name });
            this.typeNameList = typeNameList;
          }
        })
        .catch(error => {
          console.warn(error);
        });
    },
    changeLoadingBtn:function() {
      this.loading = false;
      this.$nextTick(() => {
        this.loading = true;
      });
    },
  }
};
</script>
<style>

</style>