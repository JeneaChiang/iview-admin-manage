<template>
    <div>
        <div style="margin-bottom:10px;">
            <Breadcrumb>
                <Icon type="folder"></Icon>
                <Breadcrumb-item>资讯管理</Breadcrumb-item>
            </Breadcrumb>
        </div>
        <section>
            <div style="margin-bottom: 10px;">
                <i-button type="info" @click="addCoach">新增资讯</i-button>
            </div>
            <i-table border :columns="newsColumns" :data="newsData" stripe></i-table>
            <div style="margin: 10px;">
                <div style="float: right;">
                    <page :total="2" show-elevator @on-change="changePage"></page>
                </div>
            </div>
        </section>
        <Modal 
      v-model="modalRemove" 
      width="300">
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
    </div>
</template>
<script>
export default {
  data() {
    return {
      modalRemove: false,
      newsColumns: [
        {
          type: "index",
          width: 50,
          align: "center"
        },
        {
          title: "标题",
          key: "newsTitle",
          align: "center"
        },
        {
          title: "简介",
          key: "newsDes",
          align: "center"
        },
        {
          title: "发布时间",
          key: "pubTime",
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
                      this.show(params.index);
                    }
                  }
                },
                "预览"
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
                      this.edit(params.index);
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
                  on: {
                    click: () => {
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
      newsData: [
        {
          newsTitle: "文章标题文章标题文章标题",
          newsDes: "简介简介简介简介简介简介简介简介",
          pubTime: "2017-10-10 10:00:00"
        },
        {
          newsTitle: "文章标题文章标题文章标题",
          newsDes: "简介简介简介简介简介简介简介简介",
          pubTime: "2017-10-10 10:00:00"
        }
      ]
    };
  },
  methods: {
    remove: function(index) {
      this.modalRemove = false;
      this.newsData.splice(index, 1);
      this.$Message.success("删除成功");
    },
    show: function(index) {},
    edit: function(index) {},
    addCoach: function() {},
    changePage: function() {}
  }
};
</script>