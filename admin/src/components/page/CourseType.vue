<template>
    <section>
        <div style="margin-bottom:10px;">
            <Breadcrumb>
                <Icon type="document-text"></Icon>
                <Breadcrumb-item>课程管理</Breadcrumb-item>
                <Breadcrumb-item>课程类型</Breadcrumb-item>
            </Breadcrumb>
        </div>
        <section>
            <div class="mb10">
              <addcoursetype v-on:add-ok="add"></addcoursetype>
            </div>
            <i-table border :columns="typeColumns" :data="typeData" stripe></i-table>
            <div style="margin: 10px;">
                <div style="float: right;">
                    <page :total="totalPage" show-elevator @on-change="changePage"></page>
                </div>
            </div>
        </section>
        <Modal
        v-model="modalEdit"
        title="编辑课程类型"
        width="500"
        ok-text="确认"
        cancel-text="取消"
        :loading="loading"
        v-on:on-ok="edit">
        <i-form ref="typeForm1" :model="editData" :rules="ruleValidate" :label-width="80">
          <form-item label="类型名称" prop="name">
              <i-input v-model="editData['name']" placeholder="请输入"></i-input>
          </form-item>
          <form-item label="课程简介" prop="summary">
              <i-input v-model="editData['summary']" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></i-input>
          </form-item>
          <form-item label="课程标签" prop="tags">
              <i-input v-model="editData['tags']" placeholder="多个标签请以‘,’隔开"></i-input>
          </form-item>
          <form-item label="图片上传" prop="imgs">
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
                  :max-size="1024" 
                  :on-format-error="handleFormatError" 
                  :on-exceeded-size="handleMaxSize" 
                  :before-upload="handleBeforeUpload" 
                  multiple 
                  type="drag" 
                  action="" 
                  style="display: inline-block;width:58px;">
                  <div style="width: 58px;height:58px;line-height: 58px;">
                      <icon type="camera" size="20"></icon>
                  </div>
              </upload>
          </form-item>
          <form-item label="训练效果" prop="eff">
              <i-input v-model="editData['eff']" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></i-input>
          </form-item>
          <form-item label="适合人群" prop="suit">
              <i-input v-model="editData['suit']" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></i-input>
          </form-item>
          <form-item label="FAQ" prop="faq">
              <i-input v-model="editData['faq']" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></i-input>
          </form-item>
          <form-item label="注意事项" prop="notice">
              <i-input v-model="editData['notice']" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></i-input>
          </form-item>
        </i-form>
    </Modal>
    <Modal
        v-model="modalShow"
        title="查看课程类型"
        width="500">
        <p class='info'><strong>类型名称：</strong>{{this.showData.name}}</p>
        <p class='info'><strong>课程简介：</strong>{{this.showData.summary}}</p>
        <p class='info'><strong>课程标签：</strong>{{this.showData.tags}}</p>
        <p class='info'><strong>课程图片：</strong></p>
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
        <p class='info'><strong>训练效果：</strong>{{this.showData.eff}}</p>
        <p class='info'><strong>适合人群：</strong>{{this.showData.suit}}</p>
        <p class='info'><strong>FAQ：</strong>{{this.showData.faq}}</p>
        <p class='info'><strong>注意事项：</strong>{{this.showData.notice}}</p>
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
import addcoursetype from "../modal/AddCourseType.vue";
const ERR_OK = 0;
const BASE_URL = "../../static/";
export default {
  data() {
    return {
      totalPage: 1,
      current: 1,
      modalEdit: false,
      uploadList: [],
      modalShow: false,
      modalImg: false,
      loading:true,
      opIndex:-1,
      imgUrl: "",
      editData: {
        name: "",
        summary: "",
        tags: "",
        imgs: "",
        eff:"",
        suit: "",
        faq: "",
        notice: ""
      },
      showData: [],
      typeData: [],
      showImgUrl: [],
      typeColumns: [
        {
          title: "id",
          key: "id",
          align: "center",
          sortable: true,
          width: "100"
        },
        {
          title: "课程类型",
          key: "name",
          width: 180,
          align: "center",
          sortable: true,
          render: (h, params) => {
            return h("div", [h("strong", params.row.name)]);
          }
        },
        {
          title: "课程简介",
          key: "summary",
          align: "center"
        },
        {
          title: "标签",
          key: "tags",
          align: "center"
        },
        {
          title: "操作",
          key: "typeAction",
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
                      let imgStr = this.showData.imgs.split(",");
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
                      let arr = this.editData.imgs.split(",");
                      if(arr.length >=1 && arr[0] != ""){
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
          { required: true, message: "请填写课程类型名称", trigger: "blur"},
          { pattern: /^[\u4E00-\u9FA5A-Za-z0-9]+$/, message: "类型名称不能包含特殊字符", trigger: "blur" }
        ],
        tags: [
          { required: true, message: "请填写标签，并以英文逗号','隔开", trigger: "blur" },
          { pattern: /(^[\u4e00-\u9fa5A-Za-z0-9][\u4e00-\u9fa5A-Za-z0-9,]*[\u4e00-\u9fa5A-Za-z0-9]$)|^[\u4e00-\u9fa5]$/, message: "请勿使用中文逗号'，'，单个标签无需使用逗号", trigger: "blur" }
        ],
        summary: [
          { required: true, message: "请填写课程类型简介", trigger: "blur"}
        ],
        suit: [
          { required: true, message: "请填写适合人群", trigger: "blur"}
        ],
        notice: [
          { required: true, message: "请填写注意事项", trigger: "blur"}
        ]
      }
    };
  },
  components: {
    addcoursetype
  },
  mounted: function() {
    this.uploadList = this.$refs.upload.fileList;
  },
  created() {
    this.getTypeData(1);
  },
  methods: {
    imgView: function(url) {
      this.imgUrl = url;
      this.modalImg = true;
    },
    edit: function() {
      this.$refs.typeForm1.validate(valid => {
        if (valid) {
          let imgs = this.uploadList;
          let arr = [];
          for (let i in imgs) arr.push(imgs[i].name);
          this.editData.imgs = arr.join();
          let data = {};
          for (let i in this.editData) {
            data[i] = this.editData[i];
          }
        axios
          .put("", data)
          .then(res => {
            console.log(res);
            if(res.data.errCode == ERR_OK){
              this.$Message.success("修改成功");
              this.getTypeData(this.current)
            } else {
              this.$Message.error(res.data.result);
            }
            this.changeLoadingBtn();
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
    add: function(data) {
      console.log(data);
      axios
        .post("", data)
        .then(res=>{
          console.log(res);
          if(res.data.errCode == ERR_OK){
            this.$Message.success("添加成功");
            this.getTypeData(-1)
          } else {
            this.$Message.error(res.data.result);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getTypeData: function(page) {
      let result = [],
        errCode,
        typeData = [],
        totalPage;
      axios
        .get(BASE_URL+"courseType.json", {
          params: { page: page }
        })
        .then(res => {
          errCode = res.data.errCode;
          result = res.data.result;
          totalPage = res.data.total;
          console.info(result);
          if (errCode === ERR_OK) {
            this.typeData = result;
            this.totalPage = totalPage;
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
    changePage: function(page) {
      this.current = page;
      this.getTypeData(page);
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
        desc: "文件 " + file.name + " 图片太大，不能超过 1M。"
      });
    },
    handleBeforeUpload() {
      const check = this.uploadList.length < 5;
      if (!check) {
        this.$Notice.warning({
          title: "最多只能上传 5 张图片。"
        });
      }
      return check;
    }
  }
};
</script>
<style>
.content-main .ivu-table-cell {
  padding: 10px !important;
  white-space: nowrap !important;
}

.ivu-modal-confirm-body img {
  margin: 10px 5px 10px 0;
}
td.ivu-table-column-center,
th.ivu-table-column-center {
  padding: 10px;
}
.content-main .ivu-table-row .ivu-table-column-center .ivu-table-cell {
  padding: 0 !important;
}
.mb10 {
  margin-bottom: 10px;
}
p.info {
  margin-top: 10px;
  font-size: 14px;
}
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}

.demo-upload-list img {
  width: 100%;
  height: 100%;
}

.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}

.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}

.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>