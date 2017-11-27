<template>
    <section>
      <div style="margin-bottom:10px;">
          <Breadcrumb>
              <Icon type="person"></Icon>
              <Breadcrumb-item>教练管理</Breadcrumb-item>
          </Breadcrumb>
      </div>
      <section>
          <div class="mb10">
            <addcoach v-on:add-ok="add"></addcoach>
          </div>
          <i-table border :columns="coachColumns" :data="coachData" stripe></i-table>
          <div style="margin: 10px;">
              <div style="float: right;">
                  <page :total="totalPage" show-elevator @on-change="changePage"></page>
              </div>
          </div>
      </section>
      <Modal
      v-model="modalEdit"
      title="编辑教练信息"
      width="500"
      ok-text="确认"
      cancel-text="取消"
      :loading="loading"
      v-on:on-ok="edit">
      <i-form ref="coachForm1" :model="editData" :rules="ruleValidate" :label-width="80">
        <form-item label="教练姓名" prop="name">
            <i-input v-model="editData['name']" placeholder="请输入"></i-input>
        </form-item>
        <form-item label="教练性别" prop="sex">
            <RadioGroup v-model.number="editData['sex']">
                <Radio label="0">男</Radio>
                <Radio label="1">女</Radio>
            </RadioGroup>
        </form-item>
        <form-item label="头像上传" props="img">
            <div v-for="item in uploadList" style="display:inline-block">
              <template v-if="item.name">
                <div class="demo-upload-list">
                <template v-if="item.status === 'finished'">
                    <img :src="item.url">
                    <div class="demo-upload-list-cover">
                        <icon type="ios-trash-outline" @click.native="handleRemove(item)"></icon>
                    </div>
                </template>
                <template v-else>
                    <i-progress v-if="item.showProgress" :percent="item.percentage" hide-info></i-progress>
                </template>
                </div>
              </template>
            </div>
            <upload 
                ref="upload" 
                :show-upload-list="false" 
                :on-success="handleSuccess"
                :format="['jpg','jpeg','png']" 
                :max-size="500" 
                :on-format-error="handleFormatError" 
                :on-exceeded-size="handleMaxSize" 
                :before-upload="handleBeforeUpload"
                type="drag" 
                action="" 
                style="display: inline-block;width:58px;">
                <div style="width: 58px;height:58px;line-height: 58px;">
                    <icon type="camera" size="20"></icon>
                </div>
            </upload>
            <p style="color:#f00;">*必填项，请上传正方形图片</p>
          </form-item>
          <form-item label="教练介绍" prop="detail">
              <i-input v-model="editData['detail']" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></i-input>
          </form-item>
        </i-form>
      </Modal>
      <Modal
          v-model="modalShow"
          title="查看教练信息"
          width="500">
          <p class='info'><strong>教练姓名：</strong>{{this.showData.name}}</p>
          <p class='info'><strong>教练性别：</strong>
            <template v-if="this.showData.sex==0">男</template>
            <template v-else>女</template>
          </p>
          <p class='info'><strong>教练头像：</strong></p>
          <div v-for="item in this.showImgUrl" style="display:inline-block">
            <template v-if="item.name">
              <div class="demo-upload-list">
                <img :src="item.url">
                <div class="demo-upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="imgView(item.url)"></Icon>
                </div>
              </div>
            </template>
            <template v-else>
                无图
            </template>
          </div>
          <p class='info'><strong>教练介绍：</strong>{{this.showData.detail}}</p>
          <div slot="footer">
              <Button type="primary" @click="modalShow=false">确定</Button>
          </div>
      </Modal>
      <Modal 
      v-model="modalImg"
      title="查看图片"
      width="600">
        <img :src="imgUrl" v-if="modalImg" style="width:auto;max-width:100%;">
    </Modal>
    </section>
</template>
<script>
import axios from "axios";
import addcoach from "../modal/AddCoach.vue";
const ERR_OK = 0;
const BASE_URL = "../../static/";
export default {
  data() {
    return {
      totalPage: 1,
      current: 1,
      modalEdit: false,
      loading:true,
      uploadList: [],
      modalShow: false,
      modalRemove: false,
      modalImg: false,
      opIndex: -1,
      imgUrl: "",
      editData:  {
        name: "",
        sex: "",
        detail: "",
        img: ""
      },
      showData: [],
      coachData: [],
      showImgUrl: [],
      coachColumns: [
        {
          title: "id",
          key: "id",
          align: "center",
          sortable: true,
          width: "100"
        },
        {
          title: "姓名",
          key: "name",
          align: "center",
          width: "150",
          sortable: true,
          render: (h, params) => {
            return h("div", [h("strong", params.row.name)]);
          }
        },
        {
          title: "性别",
          key: "sex",
          align: "center",
          render: (h, params) => {
            return h("div", [params.row.sex?'女':'男']);
          }
        },
        {
          title: "头像",
          key: "img",
          align: "center",
          width: "80",
          render: (h, params) => {
            return h("div", [
              h("img", {
                attrs: {
                  src: BASE_URL+params.row.img
                },
                style: {
                  width: "40px",
                  height: "40px"
                }
              })
            ]);
          }
        },
        {
          title: "介绍",
          key: "detail",
          align: "center"
        },
        {
          title: "操作",
          key: "userAction",
          width: 150,
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
                      for (let i in params.row) {
                        if (i !== "_index" && i !== "_rowKey") {
                          this.showData[i] = params.row[i];
                        }
                      }
                      let imgStr = this.showData.img.split(",");
                      let showImgUrl = [];
                      for (let n in imgStr) {
                        showImgUrl.push({
                          name: imgStr[n],
                          url: BASE_URL + imgStr[n]
                        });
                      }
                      this.showImgUrl = showImgUrl;
                      this.modalShow = true;
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
                      while (this.uploadList.length > 0)
                        this.uploadList.shift();
                      let arr = this.editData.img.split(",");
                      if (arr.length >= 1 && arr[0] != "") {
                        for (let i in arr)
                          this.uploadList.push({
                            name: arr[i],
                            url: BASE_URL + arr[i],
                            showProgress: false,
                            status: "finished"
                          });
                      }
                      this.modalEdit = true;
                    }
                  }
                },
                "编辑"
              )
            ]);
          }
        }
      ],
      ruleValidate: {
        name: [
          { required: true, message: "请输入教练姓名", trigger: "blur"},
          { pattern: /^[\u4E00-\u9FA5A-Za-z]+$/, message: "姓名只能使用中文及大小写字母", trigger: "blur" }
        ],
        sex: [
          { required: true, type:"number", message: "请选择性别", trigger: "change"}
        ],
        detail: [
          { required: true, message: "请填写教练介绍", trigger: "blur"}
        ]
      }
    };
  },
  components: {
    addcoach
  },
  mounted: function() {
    this.uploadList = this.$refs.upload.fileList;
  },
  created() {
    this.getCoachData(1);
  },
  methods: {
    imgView: function(url) {
      this.imgUrl = url;
      this.modalImg = true;
    },
    edit: function() {
      this.$refs.coachForm1.validate(valid => {
        this.changeLoadingBtn()
        if (valid) {
            let img = this.uploadList;
            let arr = [];
            for (let i in img) arr.push(img[i].name);
            this.editData.img = arr.join();
            let data = {};
            for (let i in this.editData) {
              data[i] = this.editData[i];
            }
            if(data['img']){
            axios
            .put("", data)
            .then(res => {
              console.log(res);
              if (res.data.errCode == ERR_OK) {
                this.$Message.success("修改成功");
                this.getCoachData(this.current);
              } else {
                this.$Message.error(res.data.result);
              }
              this.modalEdit = false;
            })
            .catch(error => {
              console.log(error);
            });
          }
          else{
            this.$Message.error("请上传教练头像");
          }
        } else {
          this.$Message.error("请认真填写数据");
        }
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
            this.getCoachData(this.current);
          } else {
            this.$Message.error(res.data.result);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getCoachData: function(page) {
      let result = [],
        errCode,
        coachData = [],
        totalPage;
      axios
        .get(BASE_URL + "coach.json", {
          params: { page: page }
        })
        .then(res => {
          errCode = res.data.errCode;
          result = res.data.result;
          totalPage = res.data.total;
          console.info(result);
          if (errCode === ERR_OK) {
            this.coachData = result;
            this.totalPage = totalPage;
          }
        })
        .catch(error => {
          console.warn(error);
        });
    },
    changePage: function(page) {
      this.current = page;
      this.getCoachData(page);
    },
    changeLoadingBtn:function() {
      this.loading = false;
      this.$nextTick(() => {
        this.loading = true;
      });
    },
    handleRemove(file) {
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
    },
    handleSuccess(res, file) {
      if (res.errCode == ERR_OK) {
        file.name = res.result;
        file.url = BASE_URL + res.result;
      }
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "文件格式不正确",
        desc: "文件 " + file.name + " 格式不正确，请上传 jpg 或 png 格式的图片。"
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "超出文件大小限制",
        desc: "文件 " + file.name + " 图片太大，不能超过 500KB。"
      });
    },
    handleBeforeUpload() {
      const check = this.uploadList.length < 1;
      if (!check) {
        this.$Notice.warning({
          title: "最多只能上传 1 张图片。"
        });
      }
      return check;
    }
  }
};
</script>