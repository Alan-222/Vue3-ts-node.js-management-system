<template>
  <div>
    <div class="content-title">文章管理</div>
    <div class="content-container">
      <el-form :model="queryParams" ref="queryFormRef">
        <el-row>
          <el-col :span="4">
            <el-form-item prop="title" v-hasPerm="['article:query']">
              <el-input placeholder="请输入标题关键字" v-model="queryParams.title">
                <template #suffix>
                  <!--   vue3图标使用方式  -->
                  <el-icon class="el-input__icon">
                    <component :is="Search" class="enter-sj" @click="handleQuery" v-hasPerm="['article:query']">
                    </component>
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane v-for="(value, key, tabindex) in stateCountObj" :label="value" :name="tabindex">
        </el-tab-pane>
      </el-tabs>
      <div v-show="activeName === tabindex">
        <el-skeleton :loading="loading" animated :throttle="500">
          <template #template>
            <el-skeleton-item style="width: 50%" />
            <el-skeleton-item />
            <el-skeleton-item style="width: 60%" />
            <el-skeleton-item style="width: 50%" />
          </template>
          <template #default>
            <div v-for="(item, index) in articleArr.list" :key="index" class="essayCard">
              <div class="essay-list">
                <span class="first-line">
                  <el-tag class="ml-2" type="info" v-if="item.state === 0">草 稿</el-tag>
                  <el-tag class="ml-2" type="warning" v-if="item.state === 2">审核中</el-tag>
                  <el-tag class="ml-2" type="danger" v-if="item.state === 3">未通过</el-tag>
                  <router-link class="title" target="_blank" :to="{
                    name: 'Post',
                    params: {
                      id: item.id
                    }
                  }">{{ item.title }}</router-link>
                  <span class="essay-oper">
                    <router-link target="_blank" :to="{
                      name: 'EditArticle',
                      params: {
                        id: item.id
                      }
                    }" class="essay-btn" v-hasPerm="['article:edit']">编辑</router-link>
                    <el-dropdown class="el-dropdown"
                      @command="(command: string | number | object) => { handleCommand(command, item) }">
                      <span class="el-dropdown-link">
                        ...

                      </span>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item command="a">浏览</el-dropdown-item>
                          <el-dropdown-item command="b" v-if="$hasPerm('article:del')">删除</el-dropdown-item>
                          <el-dropdown-item command="c"
                            v-if="(activeName === 3 || activeName === 4) && $hasPerm('article:check')">审核
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </span>
                </span>
                <div class="second-line">
                  <span class="date">{{ item.create_time }}</span>
                  <span class="check-reason" v-if="activeName === 4">不通过原因：{{ item.check_reason }}</span>
                </div>
              </div>
            </div>
          </template>
        </el-skeleton>
        <el-pagination v-model:currentPage="queryParams.currentPage" v-model:page-size="queryParams.pageSize"
          :page-sizes="[1, 3, 5, 10]" layout="total, sizes, prev, pager, next, jumper" :total="articleTotal"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" hide-on-single-page
          style="margin-top: 20px;" />
      </div>
      <el-dialog v-model="dialogFormVisible" title="审核" width="30%">
        <check-article @closeDialog="closeDialog" @getStateCount="getStateCountByPage"
          @getArticleList="getArticleListByPage" :id="checkArticleId"></check-article>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts">
export default { name: 'Article' };
</script>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { ref, reactive, onMounted } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import { FormInstance, ElMessageBox, ElMessage } from 'element-plus';
import { getArticleList, getStateCount, deleteArticleById } from '@/utils/API/article/article'
import { useRouter } from 'vue-router'
import CheckArticle from './checkArticle.vue'

const router = useRouter()
/**
 * 文章参数及方法
 */
// 分页参数
const queryParams = reactive<articleQueryParams>({
  currentPage: 1,    // 当前页
  pageSize: 5,       // 每页条数
  title: undefined,
  state: undefined
})
const articleTotal = ref<number>(0)
const queryFormRef = ref<FormInstance>()
// 是否显示骨架屏
let loading = ref(true)
// tab显示状态数量
const stateCountObj = reactive<stateCount>({
  total: '全部（0）',
  release: '已发布（0）',
  draft: '草稿（0）',
  review: '审核中（0）',
  notPass: '未通过（0）'
})
// 文章对象
const articleArr = reactive({ list: [] as articleForm[] })
// 获取各状态文章数量方法
const getStateCountByPage = () => {
  // 发送ajax请求 获取所有状态的文章数量
  getStateCount()
    .then(res => {
      let { total, release, draft, review, notPass } = res.data
      stateCountObj.total = `全部（${total}）`
      stateCountObj.release = `已发布（${release}）`
      stateCountObj.draft = `草稿（${draft}）`
      stateCountObj.review = `审核中（${review}）`
      stateCountObj.notPass = `未通过（${notPass}）`
    })
}
// 分页获取列表方法
const getArticleListByPage = () => {
  // 发送ajax请求 把分页数据发送给后端
  getArticleList(queryParams)
    .then(res => {
      // 接收后端返回的数据总条数 total 和 对应页码的数据 data
      let { count, rows } = res.data;
      // 赋值给对应的变量即可
      articleTotal.value = count;
      articleArr.list = rows;
      // 如果当前页没有数据 且 排除第一页
      if (!rows.length && queryParams.currentPage !== 1) {
        // 页码减去 1
        queryParams.currentPage -= 1;
        // 再调用自己
        getArticleListByPage();
      }
    })
    .finally(() => {
      loading.value = false;
    })
}
// 每页显示条数改变 就会触发这个函数
const handleSizeChange = (val: number) => {
  // 保存每页显示的条数
  queryParams.pageSize = val;
  queryParams.currentPage = 1;
  // 调用分页函数
  getArticleListByPage();
}
// 当前页码改变 就会触发这个函数
const handleCurrentChange = (val: number) => {
  // 保存当前页码
  queryParams.currentPage = val;
  // 调用分页函数
  getArticleListByPage();
}
// 查询方法
const handleQuery = () => {
  queryParams.currentPage = 1
  getArticleListByPage()
}
// 浏览方法
const goEssay = (id: number) => {
  const Essay = router.resolve({
    name: 'Post',
    params: {
      id: id
    }
  })
  window.open(Essay.href, '_blank')
}
// 删除方法
const deleteEssay = (id: number) => {
  ElMessageBox.confirm(
    '确认删除此文章?',
    'Warning',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    deleteArticleById(id).then(res => {
      ElMessage.success('删除文章成功')
      const totalPage = Math.ceil((articleTotal.value - 1) / queryParams.pageSize) // 总页数
      queryParams.currentPage = queryParams.currentPage > totalPage ? totalPage : queryParams.currentPage
      queryParams.currentPage = queryParams.currentPage < 1 ? 1 : queryParams.currentPage
      getStateCountByPage()
      getArticleListByPage()
    })
  })
}
// 审核方法
const checkEssay = (id: number) => {
  checkArticleId.value = id
  dialogFormVisible.value = true
}

// 文章操作方法
const handleCommand = (command: string | number | object, item: articleForm) => {
  switch (command) {
    case 'a':
      goEssay(item.id)
      break
    case 'b':
      deleteEssay(item.id)
      break
    case 'c':
      checkEssay(item.id)
      break
  }
}
/**
 * 标签参数及方法
 */
const activeName = ref(0)
const tabindex = ref(0)
const handleClick = (tab: TabsPaneContext, event: Event) => {
  queryParams.currentPage = 1
  // console.log(tab, event)
  if (tab.index === '0') {
    queryParams.state = undefined
    tabindex.value = 0
  } else if (tab.index === '1') {
    queryParams.state = 1
    tabindex.value = 1
  } else if (tab.index === '2') {
    queryParams.state = 0
    tabindex.value = 2
  } else if (tab.index === '3') {
    queryParams.state = 2
    tabindex.value = 3
  } else if (tab.index === '4') {
    queryParams.state = 3
    tabindex.value = 4
  }
  getArticleListByPage()
}
/**
 *  审核表单参数及方法
 */
const dialogFormVisible = ref(false)
const checkArticleId = ref(0)
const closeDialog = () => {
  dialogFormVisible.value = false
}

onMounted(() => {
  getStateCountByPage()
  getArticleListByPage()
})
</script>

<style lang="scss" scoped>
/*样式穿透*/
:deep(.el-input__suffix:hover) {
  cursor: pointer !important;
}

// tabs标签
.demo-tabs>.el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

// 文章卡片
.essayCard {
  display: block;
  padding: 0 20px;

  .essay-list {
    box-sizing: border-box;
    width: 100%;
    padding: 16px 0;
    border-bottom: 1px solid #e5e6eb;

    .first-line {
      position: relative;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;

      .title {
        text-decoration: none;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        color: #1d2129;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1;
      }

      .title:hover {
        color: #409eff;
      }

      .essay-oper {
        width: 80px;
        padding: 0;
        margin: 0;
        font-size: 14px;
        box-sizing: border-box;

        .essay-btn {
          text-decoration: none;
          color: #606266;
          padding: 0 12px;
          cursor: pointer;
        }

        .el-dropdown {
          display: inline-block;
          position: relative;
          bottom: 8px;
        }

        .el-dropdown-link {
          margin-left: 12px;
          font-size: 20px;
          cursor: pointer;
          color: #606266;
          display: flex;
          align-items: center;
        }
      }
    }

    .second-line {
      // font-weight: 400;
      font-size: 14px;
      height: 22px;
      line-height: 22px;
      display: flex;
      align-items: center;
      color: #86909c;
      width: 100%;

      .date {
        width: 138px;
        font-weight: 400;
        height: 22px;
        line-height: 22px;
        display: flex;
        align-items: center;
        color: #86909c;
      }

      .check-reason {
        margin-left: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1;
        color: #f56c6c;
        width: 0px
      }
    }
  }
}
</style>