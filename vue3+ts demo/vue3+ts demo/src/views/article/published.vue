<template>
  <div class="success-box">
    <div class="publich-success-text">
      发布成功,正在审核中...
    </div>
    <div class="publish-success-img">
      <img src="../../assets/image/publish_success.png" alt="发布成功">
    </div>
    <div class="handler">
      <el-button round type="info" @click="checkEssay">查看文章</el-button>
      <el-button round @click="goBack">回到首页</el-button>
    </div>
  </div>
</template>

<script lang="ts">
export default { name: 'Published' };
</script>

<script setup lang="ts">
import { ref } from 'vue';
import { getArticleById } from '@/utils/API/article/article'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const id = ref(Number(route.params.id))

const checkEssay = () => {
  router.replace({
    name: 'Post',
    params: {
      id: id.value
    }
  })
}
const goBack = () => {
  router.replace({
    path: '/'
  })
}
</script>

<style lang='scss' scoped>
.success-box {
  width: 600px;
  position: fixed;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  padding: 24px;
  background: #fff;
  -webkit-box-shadow: 0 1px 8px 0 rgb(0 0 0 / 5%);
  box-shadow: 0 1px 8px 0 rgb(0 0 0 / 5%);
  border-radius: 2px;
  border: 1px solid #f0f0f5;
  display: flex;
  flex-direction: column;
  align-items: center;

  .publich-success-text {
    height: 28px;
    font-size: 20px;
    font-weight: 500;
    color: #222226;
    line-height: 28px;
    margin-bottom: 40px;
  }

  .publish-success-img {
    width: 150px;
    height: 150px;
    opacity: 0.8;
    margin-bottom: 40px;
  }
}
</style>