<template>
    <div class="login-wrap">
        <div class="ms-title">后台管理中心</div>
        <div class="ms-login">
            <i-form ref="formInline" :model="formInline" :rules="ruleInline" inline>
                <form-item prop="user">
                    <i-input type="text" v-model="formInline.user" placeholder="Username" long>
                        <icon type="ios-person-outline" slot="prepend" size="20"></icon>
                    </i-input>
                </form-item>
                <form-item prop="password">
                    <i-input type="password" v-model="formInline.password" placeholder="Password" long>
                        <icon type="ios-locked-outline" slot="prepend" size="20"></icon>
                    </i-input>
                </form-item>
                <form-item>
                    <i-button type="primary" @click="handleSubmit('formInline')" long>登录</i-button>
                </form-item>
            </i-form>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            formInline: {
                user: '',
                password: '',
            },
            ruleInline: {
                user: [{
                    required: true,
                    message: '请填写用户名',
                    trigger: 'blur'
                }],
                password: [{
                    required: true,
                    message: '请填写密码',
                    trigger: 'blur'
                }, {
                    type: 'string',
                    min: 6,
                    message: '密码长度不能小于6位',
                    trigger: 'blur'
                }]
            }
        }
    },
    methods: {
        handleSubmit(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$Message.success('登录成功!');
                    this.$router.push('/about');
                } else {
                    this.$Message.error('登录验证失败!');
                }
            })
        },
        handleReset(val) {
            console.log(val)
        }
    }
}

</script>
<style scoped>
.login-wrap {
    position: fixed;
    width: 100%;
    height: 100%;
    background: #324157;
}
.ms-title {
    position: absolute;
    top: 50%;
    width: 100%;
    margin-top: -230px;
    text-align: center;
    font-size: 30px;
    color: #fff;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 380px;
    height: 240px;
    margin: -150px 0 0 -190px;
    padding: 40px;
    border-radius: 5px;
    background: #fff;
}
.ms-login .ivu-form-item{
    width: 100%!important;
}
</style>
