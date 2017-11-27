<template>
    <section>
        <i-button type="info" @click="show">新增教练信息</i-button>
        <Modal
            v-model="modalAdd"
            title="增加教练信息"
            width="500"
            ok-text="确认"
            cancel-text="取消"
            :loading="loading"
            v-on:on-ok="addOk">
            <i-form ref="coachForm" :model="coachForm" :rules="ruleValidate" :label-width="80">
                <form-item label="教练姓名" prop="name">
                    <i-input v-model="coachForm.name" placeholder="请输入"></i-input>
                </form-item>
                <form-item label="教练性别" prop="sex">
                    <RadioGroup v-model.number="coachForm.sex">
                        <Radio label="0">男</Radio>
                        <Radio label="1">女</Radio>
                    </RadioGroup>
                </form-item>
                <form-item label="头像上传">
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
                        :max-size="2048" 
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
                    <p style="color:#f00;">*必填项，请上传正方形图片</p>
                </form-item>
                <form-item label="教练介绍" prop="detail">
                    <i-input v-model="coachForm.detail" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></i-input>
                </form-item>
            </i-form>
        </Modal>
    </section>
</template>
<script>
const ERR_OK = 0;
export default {
  name: "addcoach",
  data() {
    return {
      modalAdd: false,
      loading:true,
      coachForm: {
        name: "",
        sex: 0,
        detail: "",
        img: ""
      },
      uploadList: [],
      ruleValidate: {
        name: [
          { required: true, message: "请输入教练姓名", trigger: "blur" },
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
  mounted: function() {
    this.uploadList = this.$refs.upload.fileList;
  },
  methods: {
    show: function() {
      for (let i in this.coachForm) this.coachForm[i] = "";
      while (this.uploadList.length > 0) this.uploadList.shift();
      this.$refs.coachForm.resetFields();
      this.modalAdd = true;
    },
    addOk: function(name) {
      this.$refs.coachForm.validate(valid => {
        this.changeLoadingBtn();
        if (valid) {
          let img = this.uploadList;
          let arr = [];
          for (let i in img) arr.push(img[i].name);
          this.coachForm.img = arr.join();
          if(this.coachForm.img){
            console.log(this.coachForm);
            this.$emit("add-ok", this.coachForm);
            this.modalAdd = false;
          }
          else{
            this.$Message.error("请上传教练头像");
          }
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
      if (res.errCode == ERR_OK) {
        file.name = res.result;
        file.url = "" + res.result;
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
        desc: "文件 " + file.name + " 图片太大，不能超过 2M。"
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
