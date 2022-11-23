import { createApp, Directive } from 'vue';
import App from './App.vue';
import router from '@/router/index';
import store from '@/store/index';
// import ElementPlus from 'element-plus';
// import 'element-plus/dist/index.css';

import zhCn from 'element-plus/es/locale/lang/zh-cn';
// 导入markdown编辑器
import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import Prism from 'prismjs';
// 导入markdown预览器
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
// highlightjs
import hljs from 'highlight.js';
// 导入全局样式文件和图标
import '@/assets/styles/common.scss';
import 'virtual:svg-icons-register'; // 引入注册脚本
import SvgIcon from '@/components/svgIcon/index.vue'; // 引入组件

VueMarkdownEditor.use(vuepressTheme, {
  Prism
});
VMdPreview.use(githubTheme, {
  Hljs: hljs
});
const app = createApp(App);
// 导入指令
// 自定义指令
import * as directive from '@/directive';
Object.keys(directive).forEach((key) => {
  app.directive(key, (directive as { [key: string]: Directive })[key]);
});

// 导入路由文件
import '@/permission';

// 定义全局方法
import { hasPerm } from '@/utils/common';
app.config.globalProperties.$hasPerm = hasPerm;
app.component('svg-icon', SvgIcon);

// app.use(ElementPlus, { locale: zhCn });
app.use(router).use(VueMarkdownEditor).use(VMdPreview).use(store).mount('#app');
