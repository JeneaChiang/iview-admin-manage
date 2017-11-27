<template>
    <section>
        <div style="margin-bottom:10px;">
            <Breadcrumb>
                <Icon type="document-text"></Icon>
                <Breadcrumb-item>课程管理</Breadcrumb-item>
                <Breadcrumb-item>课程发布</Breadcrumb-item>
            </Breadcrumb>
        </div>
        <section>
            <div class="mb10">
                <addcourse v-on:add-ok="add"></addcourse>
            </div>
            <i-table border :columns="courseColumns" :data="courseData" stripe></i-table>
            <div style="margin: 10px;">
                <div style="float: right;">
                    <page :total="totalPage" show-elevator @on-change="changePage"></page>
                </div>
            </div>
        </section>
        <Modal
        v-model="modalEdit"
        title="编辑课程信息"
        width="500"
        ok-text="确认"
        cancel-text="取消"
        :loading="loading"
        v-on:on-ok="edit">
        <Form ref="courseForm1" :model="editData" :label-width="150" :rules="ruleValidate" >
            <FormItem label="课程类型" prop="courseTypeID">
                <Select v-model="editData.courseTypeID"  filterable>
                    <Option v-for="item in typeNameList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem label="课程教练" prop="coachID">
                <Select v-model="editData.coachID" filterable >
                    <Option v-for="item in coachNameList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem label="是否为私教" prop="isPrivate">
              <RadioGroup v-model.number="editData.isPrivate">
                <Radio label="1">是</Radio>
                <Radio label="0">否</Radio>
              </RadioGroup>
            </FormItem>
            <div>
              <template v-if="editData.isPrivate">
              <FormItem label="总课时" prop="count">
                <Input v-model.number="editData.count" placeholder="请输入可预约人数/课时"></Input>
              </FormItem>
              <FormItem label="价格" prop="price">
                <Input v-model.number="editData.price" placeholder="请输入课程价格"></Input>
              </FormItem>
              </template>
            <template v-else>
              <FormItem label="可预约人数" prop="count">
                <Input v-model.number="editData.count" placeholder="请输入可预约人数/课时"></Input>
              </FormItem>
              <FormItem label="价格" prop="price">
                <Input v-model.number="editData.price" placeholder="请输入课程价格"></Input>
              </FormItem>
              <FormItem label="VIP价格" prop="vipPrice">
                <Input v-model.number="editData.vipPrice" placeholder="请输入课程VIP价格"></Input>
              </FormItem>
              <FormItem label="开始时间" prop="startTime">
                <date-picker type="datetime" placement="top" v-model="editData.startTime" format="yyyy-MM-dd HH:mm" placeholder="选择日期和时间"></date-picker>
              </FormItem>
              <FormItem label="结束时间" prop="endTime">
                <date-picker type="datetime" placement="top" v-model="editData.endTime" format="yyyy-MM-dd HH:mm" placeholder="选择日期和时间"></date-picker>
              </FormItem>
            </template>
            </div>
            
        </Form>
      </Modal>
        <Modal v-model="modalRemove" width="300">
            <p slot="header" style="color:#f60;">
                <Icon type="information-circled"></Icon>
                <span>删除确认</span>
            </p>
            <div style="text-align:center">
                <p>确认删除该条信息？</p>
            </div>
            <div slot="footer">
              <Button type="text" @click="modalRemove=false">取消</Button>
                <Button type="error" @click="remove">删除</Button>
            </div>
        </Modal>
    </section>
</template>
<script>
import axios from "axios";
import addcourse from "../modal/AddCourse.vue";
import dateUtil from "../../utils/date";

const ERR_OK = 0;
const BASE_URL = "../../static/";
export default {
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
      opIndex: -1,
      totalPage: 1,
      current: 1,
      modalRemove: false,
      modalEdit: false,
      loading:true,
      editData: {
        courseTypeID: 0,
        coachID: 0,
        price: "",
        vipPrice: "",
        isPrivate: 0,
        startTime: "",
        endTime: "",
        count: ""
      },
      courseData: [],
      typeNameList: [],
      coachNameList: [],
      courseColumns: [
        {
          title: "id",
          key: "id",
          align: "center",
          sortable: true,
          width: "100"
        },
        {
          title: "课程类型",
          key: "courseTypeName",
          align: "center",
          render: (h, params) => {
            return h("div", [h("strong", params.row.courseTypeName)]);
          }
        },
        {
          title: "课程教练",
          key: "coachName",
          align: "center",
          render: (h, params) => {
            return h("div", [h("strong", params.row.coachName)]);
          }
        },
        {
          title: "是否为私教课程",
          key: "isPrivate",
          align: "center",
          render: (h, params) => {
            return h("div", [params.row.isPrivate?'是':'否']);
          }
        },
        {
          title: "可预约人数/课时",
          key: "count",
          align: "center",
          sortable: true
        },
        {
          title: "价格",
          key: "price",
          align: "center",
          sortable: true
        },
        {
          title: "VIP价格",
          key: "vipPrice",
          align: "center",
          sortable: true,
          render: (h, params) => {
            return h("div", [params.row.isPrivate?'/':params.row.vipPrice]);
          }
        },
        {
          title: "开始时间",
          key: "startTime",
          align: "center",
          sortable: true,
          render: (h, params) => {
            return h("div", [params.row.isPrivate?'/':dateUtil.format(params.row.startTime,"yyyy-MM-dd HH:mm")]);
          }
        },
        {
          title: "结束时间",
          key: "endTime",
          align: "center",
          sortable: true,
          render: (h, params) => {
            return h("div", [params.row.isPrivate?'/':dateUtil.format(params.row.endTime,"yyyy-MM-dd HH:mm")]);
          }
        },
        {
          title: "操作",
          key: "userAction",
          width: 180,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "success",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.show(params.index);
                    }
                  }
                },
                "查看"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      for (let i in params.row) {
                        if (i !== "_index" && i !== "_rowKey") {
                          this.editData[i] = params.row[i];
                        }
                      }
                      this.modalEdit = true;
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.opIndex = params.row["_index"];
                      this.modalRemove = true;
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      ruleValidate: {
        courseTypeID: [
          { required: true, type: "number", message: "请选择课程类型", trigger: "blur" ,pattern:/.+/,min:1}
        ],
        coachID: [
          { required: true, type: "number",message: "请选择教练", trigger: "blur" ,pattern:/.+/,min:1 }
        ],
        price: [
          { required: true, message: "请填写价格", trigger: "blur" ,pattern:/.+/},
          { type: "number", message: "价格只能大于0的数字", trigger: "blur",min:1 }
        ],
        vipPrice: [
          { required: true, message: "请填写VIP价格", trigger: "blur" ,pattern:/.+/},
          { type: "number", message: "VIP价格只能大于0的数字", trigger: "blur" ,min:1}
        ],
        count: [
          { required: true, message: "请填写预约人数/课时", trigger: "blur" ,pattern:/.+/},
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
  components: {
    addcourse
  },
  created() {
    this.getAllCoach();
    this.getAllType();
    this.getCourseData(1);
  },
  methods: {
    show: function(index) {
      this.$Modal.info({
        title: "课程详细信息",
        width: "400",
        content:
          `<p class='mb10'><strong>课程类型：</strong>${this.courseData[index]
            .courseTypeName}</p>` +
          `<p class='mb10'><strong>课程教练：</strong>${this.courseData[index]
            .coachName}</p>` +
          `<p class='mb10'><strong>是否为私教课程：</strong>${this.courseData[index]
          .isPrivate?'是':'否'}</p>` +
          `<p class='mb10'><strong>可预约人数/课时：</strong>${this.courseData[index]
            .count}</p>` +
          `<p class='mb10'><strong>价格：</strong>${this.courseData[index]
            .price}</p>` +
          `<p class='mb10'><strong>VIP价格：</strong>${this.courseData[index]
          .isPrivate?'/':this.courseData[index].vipPrice}</p>` +
          `<p class='mb10'><strong>开始时间：</strong>${this.courseData[index]
          .isPrivate?'/':dateUtil.format(this.courseData[index].startTime,"yyyy-MM-dd HH:mm")}</p>` +
          `<p class='mb10'><strong>结束时间：</strong>${this.courseData[index]
          .isPrivate?'/':dateUtil.format(this.courseData[index].endTime,"yyyy-MM-dd HH:mm")}</p>`
      });
    },
    add: function(data) {
      console.log(data);
      axios
        .post("", data)
        .then(res => {
          console.log(res);
          if (res.data.errCode == ERR_OK) {
            this.$Message.success("添加成功");
            this.getCourseData(this.current);
          } else {
            this.$Message.error(res.data.result);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    remove: function() {
      let id = this.courseData[this.opIndex].id;
      axios
        .delete("" + id)
        .then(res => {
          console.log(res);
          this.modalRemove = false;
          if (res.data.errCode == ERR_OK) {
            this.$Message.success("删除成功");
            this.getCourseData(this.current);
          } else {
            this.$Message.error(res.data.result);
          }
        })
        .catch(error => {
          console.warn(error);
        });
    },
    edit: function() {
      this.$refs.courseForm1.validate(valid => {
        if (valid) {
          let data = {};
          for (let i in this.editData) data[i] = this.editData[i];
          if (data.startTime instanceof Object) data.startTime = Date.parse(data.startTime);
          if (data.endTime instanceof Object) data.endTime = Date.parse(data.endTime);
          axios
          .put("", data)
          .then(res => {
            console.log(res);
            if (res.data.errCode == ERR_OK) {
              this.$Message.success("修改成功");
              this.getCourseData(this.current);
            } else {
              this.$Message.error(res.data.result);
            }
            this.changeLoadingBtn()
            this.modalEdit = false;
          })
          .catch(error => {
            console.log(error);
          });
        } else {
          this.changeLoadingBtn()
          this.$Message.error("请认真填写数据");
        }
      });
    },
    getCourseData: function(page) {
      let result = [],
        errCode,
        courseData = [],
        totalPage;
      axios
        .get(BASE_URL+"course.json", {
          params: { page: page }
        })
        .then(res => {
          errCode = res.data.errCode;
          result = res.data.result;
          totalPage = res.data.total;
          console.info(result);
          if (errCode === ERR_OK) {
            this.courseData = result;
            this.totalPage = totalPage;
          }
        })
        .catch(error => {
          console.warn(error);
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
              typeNameList.push({ 
                value: result[i].id, 
                label: result[i].name 
              });
            this.typeNameList = typeNameList;
          }
        })
        .catch(error => {
          console.warn(error);
        });
    },
    changePage: function(page) {
      this.current = page;
      this.getCourseData(page);
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