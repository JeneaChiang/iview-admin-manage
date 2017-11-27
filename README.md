# iview-admin-manage
基于vue2+iview2的后台管理系统

---

### 说明：

 1、页面： <a href="https://www.iviewui.com/">iview</a>
 
 2、图片上传：<a href="https://www.iviewui.com/components/upload">使用iview自带的图片上传组件</a>
 
 3、数据交互：<a href="https://www.kancloud.cn/yunye/axios/234845">axios</a>
 
 4、部分内容参考： <a href="https://github.com/lin-xin/vue-manage-system">Vue2 后台管理系统解决方案</a>
 
 5、编辑器：未完成
 
 PS：正式项目，接口已清除
 
---
 
### 使用
<pre>
  <code>
    npm i               // 安装依赖
    npm run dev         // 本地开发
    npm run build       // 生产部署
  </code>
</pre>

---

### 目录结构
<pre>
  <code>
 |-- admin                                      // 后台管理系统页面 
 |   |-- static                                 // 静态文件目录
 |   |-- src                                    // 源码目录
 |       |-- components                         // 组件
 |           |-- common                         // 全局
 |           |-- modal                          // 自定义对话框组件
 |           |-- page                           // 主要页面
 |       |-- config                             // 项目打包路径
 |       |-- libs                               // 工具函数
 |       |-- template                           // 母版页
 |       |-- utils                              // 插件
 |       |-- App.vue                            // 页面入口
 |       |-- main.js                            // 程序入口
 |       |-- router.js                          // 路由配置文件
 |       |-- vendors.js                         // 入口文件打包
 |   |-- .babelrc                               // ES6语法编译配置
 |   |-- .editorconfig                          // 代码编写规格
 |   |-- .eslintignore                          // ESLint忽略文件
 |   |-- .eslintrc.json                         // ESLint配置文件
 |   |-- .gitignore                             // push忽略文件
 |   |-- index.html                             // 入口html页面
 |   |-- package.json                           // 依赖及配置
 |   |-- webpack.base.config.js                 // webpack基础配置文件
 |   |-- webpack.dev.config.js                  // webpack开发环境配置文件
 |   |-- webpack.prod.config.js                 // webpack生产环境配置文件
 |-- pages                                      // 前端展示页面（移动端）
 |-- README.md                                  // 简介
</code>
</pre>
