<template>
    <div class="sidebar">
        <i-menu ref="leftMenu" theme="dark" width="auto" :active-name="active" :open-names="['2']" @on-select="routeTo">
            <Menu-item name="about">
                <Icon type="cloud"></Icon>
                <span>说明文档</span>
            </Menu-item>
            <Submenu name="2">
                <template slot="title">
                    <Icon type="document-text"></Icon>
                    <span>课程管理</span>
                </template>
                <Menu-item name="coursetype">课程类型</Menu-item>
                <Menu-item name="course">课程发布</Menu-item>
            </Submenu>
            <Menu-item name="coach">
                <Icon type="person"></Icon>
                <span>教练管理</span>
            </Menu-item>
            <Menu-item name="news">
                <Icon type="folder"></Icon>
                <span>资讯管理</span>
            </Menu-item>
        </i-menu>
    </div>
</template>

<script>
export default {
    data() {
        return {
            active: 'about'
        }
    },
    mounted: function() {
        var name=this.$route.path.replace('/','');
        this.active=name;
    },
    methods: {
        routeTo(name) {
            this.$router.push(name);
        }
    }
}
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    width: 200px;
    left: 0;
    top: 70px;
    bottom: 0;
    background: #2e363f;
}
</style>
