<template>
    <div class="header">
        <div class="logo">后台管理系统</div>
        <div class="dropdown">
            <dropdown trigger="click" @on-click="handleCommand">
                 <a href="javascript:void(0)" style="display: flex;line-height: 45px;">
                    <Avatar icon="person" size="large" /> &nbsp;&nbsp;{{username}}
                </a>
                <dropdown-menu slot="list">
                    <dropdown-item name="loginout">退出</dropdown-item>
                </dropdown-menu>
            </dropdown>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            username: 'admin'
        }
    },
    methods: {
        handleCommand(name) {
            if (name == 'loginout') {
                this.$router.push('/login');
            }
        }
    }
}
</script>
<style scoped>
#app,
.wrapper,
body,
html {
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    line-height: 70px;
    color: #fff;
    background-color: #242f42;
}

.header .logo {
    float: left;
    width: 250px;
    text-align: center;
}

.header .dropdown {
    float: right;
    padding-right: 40px;
    font-size: 16px;
    color: #fff;
}

.header .ivu-btn-text {
    color: #fff;
}
</style>
