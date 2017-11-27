<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <div class="content">
            <div class="content-main" :style="contentStyle">
                <transition name="move" mode="out-in">
                    <router-view></router-view>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
import vHead from './Header.vue';
import vSidebar from './Sidebar.vue';
export default {
    data() {
        return {}
    },
    components: {
        vHead, vSidebar
    },
    computed: {
        contentStyle: function() {
            var innerHeight = window.innerHeight;
            var contentHeight = innerHeight-70-50;
            return "min-height: " + contentHeight + "px";
        }
    }
}
</script>
<style scoped>
.content {
    background: none repeat scroll 0 0 #f5f5f5;
    position: absolute;
    left: 200px;
    right: 0;
    top: 70px;
    bottom: 0;
    width: auto;
    padding: 15px;
    box-sizing: border-box;
    overflow-y: scroll;
}
.content-main {
    min-height: 200px;
    margin-bottom:15px;
    box-sizing: border-box;
    overflow: hidden;
}
</style>
