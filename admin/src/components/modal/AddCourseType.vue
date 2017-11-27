<template>
    <section>
        <i-button type="info" @click="show">新增课程类型</i-button>
        <Modal
            v-model="modalAdd"
            title="增加课程类型"
            width="500"
            ok-text="确认"
            cancel-text="取消"
            :loading="loading"
            v-on:on-ok="addOk">
            <i-form ref="typeForm" :model="typeForm" :rules="ruleValidate" :label-width="80">
                <form-item label="类型名称" prop="name">
                    <i-input v-model="typeForm.name" placeholder="请输入"></i-input>
                </form-item>
                <form-item label="课程简介" prop="summary">
                    <i-input v-model="typeForm.summary" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></i-input>
                </form-item>
                <form-item label="课程标签" prop="tags">
                    <i-input v-model="typeForm.tags" placeholder="多个标签请以‘,’隔开"></i-input>
                </form-item>
                <form-item label="图片上传">
                    <div class="demo-upload-list" v-for="item in uploadList">
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
                <form-item label="训练效果" pro="eff">
                    <i-input v-model="typeForm.eff" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></i-input>
                </form-item>
                <form-item label="适合人群" prop="suit">
                    <i-input v-model="typeForm.suit" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></i-input>
                </form-item>
                <form-item label="FAQ" prop="faq">
                    <i-input v-model="typeForm.faq" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></i-input>
                </form-item>
                <form-item label="注意事项" prop="notice">
                    <i-input v-model="typeForm.notice" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></i-input>
                </form-item>
            </i-form>
        </Modal>
    </section>
</template>
<script>
const ERR_OK = 0;
export default {
  name: "addcoursetype",
  data() {
    return {
      modalAdd: false,
      loading:true,
      typeForm: {
        name: "",
        summary: "",
        tags: "",
        imgs: "",
        eff:"",
        suit: "",
        faq: "",
        notice: ""
      },
      uploadList: [],
      ruleValidate: {
        name: [
          { required: true, message: "请填写课程类型名称", trigger: "blur"},
          { pattern: /^[\u4E00-\u9FA5A-Za-z0-9]+$/, message: "类型名称不能包含特殊字符", trigger: "blur" }
        ],
        tags: [
          { required: true, message: "请填写标签，并以英文','隔开", trigger: "blur" },
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
  mounted: function() {
    this.uploadList = this.$refs.upload.fileList;
  },
  methods: {
    show:function(){
      for(let i in this.typeForm) this.typeForm[i] = ""
      while (this.uploadList.length > 0) this.uploadList.shift();
      for (var key in this.typeForm) this.typeForm[key] = "";
      this.$refs.typeForm.resetFields();
      this.modalAdd = true;
    },
    addOk: function(name) {
      this.$refs.typeForm.validate(valid => {
        this.changeLoadingBtn()
        if (valid) {
        let imgs = this.uploadList;
        let arr = [];
        for (let i in imgs) arr.push(imgs[i].name);
        this.typeForm.imgs = arr.join();
        this.modalAdd = false;
        this.$emit("add-ok", this.typeForm);
        } else {
            this.$Message.error("请认真填写数据");
        }
      });
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
      if (res.errCode == ERR_OK ){
        file.name = res.result
        file.url = ""+res.result
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
