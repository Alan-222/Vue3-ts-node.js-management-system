<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Edit,
  Menu as IconMenu,
  Tools,
  Location,
  Setting
} from '@element-plus/icons-vue'
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus';
import ResetPassword from './resetPassword.vue';
import permission from '@/store/module/permission';
import SidebarItem from './SidebarItem.vue';

const store = useStore()
const route = useRoute()
const router = useRouter()
const routes = computed(() => permission.state.routes);
const dialogFormVisible = ref(false)
const activeIndex = ref('1')
const logout = () => {
  ElMessageBox.confirm(
    '确定注销并退出系统吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    store.dispatch('FedLogOut').then(() => {
      router.replace('/login')
    })
  })
}
const closeDialog = () => {
  dialogFormVisible.value = false
}
</script>

<template>
  <div class="app-container">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" text-color="#ffffff"
      :ellipsis="false">
      <el-menu-item index="1" class="menu-title" @click="router.push('/')">
        <el-icon>
          <Tools />
        </el-icon>
        &nbsp后台管理系统
      </el-menu-item>
      <div class="flex-grow"></div>
      <el-sub-menu index="2">
        <template #title>
          <img :src="store.state.user_pic" class="user_icon" />
          <div class="user_name">{{ store.state.username }}</div>
        </template>
        <el-menu-item index="2-1" style="color: #3c8dbc;" @click="router.push('/personalCenter')">个人中心</el-menu-item>
        <el-menu-item index="2-2" style="color: #3c8dbc;" @click="dialogFormVisible = true">重置密码</el-menu-item>
        <el-menu-item index="2-3" style="color: #3c8dbc;" @click="logout">退出登录</el-menu-item>
      </el-sub-menu>
    </el-menu>
    <div class="main-content">
      <el-menu active-text-color="#ffd04b" background-color="#545c64" class="side-menu" :default-active="$route.path"
        text-color="#fff" router>
        <SidebarItem v-for="route in routes" :item="route" :key="route.path" :base-path="route.path" />
        <!-- <el-menu-item index="/backEnd">
          <el-icon>
            <location />
          </el-icon>
          <span>首 页</span>
        </el-menu-item>
        <el-menu-item index="/artcate">
          <el-icon>
            <icon-menu />
          </el-icon>
          <span>文章分类管理</span>
        </el-menu-item>
        <el-menu-item index="/article">
          <el-icon>
            <icon-menu />
          </el-icon>
          <span>文章管理</span>
        </el-menu-item>
        <el-menu-item index="/editArticle" :route="{ name: 'EditArticle', params: { id: -1 } }">
          <el-icon>
            <Edit />
          </el-icon>
          <span>发布新文章</span>
        </el-menu-item> -->
      </el-menu>
      <div class="main-container">
        <router-view />
      </div>
    </div>
    <el-dialog v-model="dialogFormVisible" width="30%" title="重置密码">
      <reset-password @closeDialog="closeDialog"></reset-password>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.menu-title {
  font-size: 20px;
}

.flex-grow {
  flex-grow: 1;
}

.el-menu-demo {
  flex: 0 0 58px;
  background-color: #3c8dbc;
}

.user_icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.user_name {
  margin-left: 10px;
}

:deep(.el-menu--horizontal>.el-menu-item.is-active),
:deep(.el-menu--horizontal>.el-sub-menu.is-active .el-sub-menu__title) {
  border-bottom: 2px solid #ffd04b;
}

:deep(.el-menu--horizontal>.el-sub-menu.is-active .el-sub-menu__title),
:deep(.el-menu--horizontal>.el-menu-item.is-active) {
  color: #ffd04b !important;
}

:deep(.el-menu--horizontal>.el-sub-menu .el-sub-menu__title:hover),
:deep(.el-menu--horizontal>.el-menu-item:not(.is-disabled):focus),
:deep(.el-menu--horizontal>.el-menu-item:not(.is-disabled):hover) {
  background-color: #d6d6d6;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: row;
}

.side-menu {
  width: 200px;
  height: 100%;
}

.main-container {
  position: relative;
  margin-left: 3px;
  padding: 36px 24px;
  flex: 1;
  background-color: #efefef;
  overflow: hidden;
}
</style>
