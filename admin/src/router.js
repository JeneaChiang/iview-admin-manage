const routers = [
    {
        path: '/',
        component: (resolve) => require(['././components/page/Login.vue'], resolve)
    },
    {
        path: '/about',
        component: resolve => require(['././components/common/Home.vue'], resolve),
        children: [
            {
                path: '/',
                component: resolve => require(['././components/page/About.vue'], resolve)
            },
            {
                path: '/coursetype',
                component: resolve => require(['././components/page/CourseType.vue'], resolve)
            },
            {
                path: '/course',
                component: resolve => require(['././components/page/Course.vue'], resolve)
            },
            {
                path: '/coach',
                component: resolve => require(['././components/page/Coach.vue'], resolve)
            },
            {
                path: '/news',
                component: resolve => require(['././components/page/News.vue'], resolve)
            }
        ]
    },
    {
        path: '/login',
        component: resolve => require(['././components/page/Login.vue'], resolve)
    }
];
export default routers;