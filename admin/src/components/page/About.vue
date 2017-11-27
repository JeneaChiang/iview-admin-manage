<template>
    <div>
        <div style="margin-bottom:10px;">
            <Breadcrumb>
                <Icon type="cloud"></Icon>
                <Breadcrumb-item>说明文档</Breadcrumb-item>
            </Breadcrumb>
        </div>
        <div class="admin-doc">
            <h3>后台管理中心</h3>
            <article>
                <h2>前言</h2>
                <p>基于Vue.js 2.x系列 + IVIEW UI 的后台管理系统</p>
                <h2>功能</h2>
                <p disabled checked>登录/注销</p>
                <br>
                <p disabled checked>课程管理</p>
                <br>
                <p disabled checked>教练管理</p>
                <br>
                <p disabled checked>资讯管理（未完成）</p>
                <br>
            </article>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {}
    }
}
</script>

<style scoped>
.admin-doc {
    width: 100%;
}
.admin-doc h3 {
    padding: 9px 10px 10px;
    margin: 0;
    font-size: 14px;
    line-height: 17px;
    background-color: #f5f5f5;
    border: 1px solid #d8d8d8;
    border-bottom: 0;
    border-radius: 3px 3px 0 0;
}
.admin-doc article {
    padding: 20px;
    word-wrap: break-word;
    background-color: #fff;
    border: 1px solid #ddd;
    border-bottom-right-radius: 3px;
    border-bottom-left-radius: 3px;
}
.admin-doc article h1 {
    font-size: 32px;
    padding-bottom: 10px;
    margin-bottom: 15px;
    border-bottom: 1px solid #ddd;
}
.admin-doc article h2 {
    margin: 24px 0 16px;
    font-weight: 600;
    line-height: 1.25;
    padding-bottom: 7px;
    font-size: 24px;
    border-bottom: 1px solid #eee;
}
.admin-doc article p {
    margin-bottom: 15px;
    line-height: 1.5;
}
</style>