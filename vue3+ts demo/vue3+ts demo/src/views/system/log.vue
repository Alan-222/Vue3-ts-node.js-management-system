<template>
  <div class="content-title">登录日志</div>
  <div class="content-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true">
      <el-row :gutter="15">
        <el-col :span="1.5">
          <el-button v-hasPerm="['system:log:del']" color="#3c8dbc" :icon="Remove" :disabled="multiple"
            @click="handleDelete">删除
          </el-button>
        </el-col>
        <el-col :span="6">
          <el-form-item label="登录时间" v-hasPerm="['system:log:query']">
            <el-date-picker v-model="dateRange" style="width: 240px" value-format="YYYY-MM-DD" type="daterange"
              range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button v-hasPerm="['system:log:query']" color="#3c8dbc" :icon="Search" @click="handleQuery">搜索
            </el-button>
            <el-button v-hasPerm="['system:log:query']" color="#3c8dbc" :icon="Refresh" @click="resetQuery">重置
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table v-loading="loading" :data="logList" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" prop="user_log_id" width="100" align="center" />
      <el-table-column label="用户帐号" prop="user.username" width="100" align="center" />
      <el-table-column label="IP" prop="ip" width="120" align="center" />
      <el-table-column label="UA" prop="ua" :show-overflow-tooltip="true" align="center" />
      <el-table-column label="登录时间" prop="create_time" width="200" align="center" />
    </el-table>
    <el-pagination v-model:currentPage="queryParams.page" v-model:page-size="queryParams.limit"
      :page-sizes="[1, 3, 5, 10]" layout="total, sizes, prev, pager, next, jumper" :total="total"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px;"
      hide-on-single-page />
  </div>
</template>

<script lang="ts">
export default { name: 'Log' };
</script>

<script lang="ts" setup>
import { getLogList, deleteLog } from '@/utils/Api/user/user-log'
import { Refresh, Search, Remove } from '@element-plus/icons-vue';
import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
import { ref, onMounted, reactive, toRefs } from 'vue';
const queryForm = ref(ElForm);
const state = reactive({
  loading: true,
  // 选中数组
  ids: [],
  // 非单个禁用
  single: true,
  // 非多个禁用
  multiple: true,
  // 日期
  dateRange: [],
  // 查询参数
  queryParams: {
    page: 1,
    limit: 10,
    date: []
  } as logQueryForm,
  // 总数
  total: 0,
  // 日志列表
  logList: [] as logItem[]
})
const {
  loading,
  ids,
  single,
  multiple,
  dateRange,
  queryParams,
  total,
  logList
} = toRefs(state);
onMounted(() => {
  getList()
})

function getList() {
  queryParams.value.date = dateRange.value
  getLogList(queryParams.value).then(res => {
    logList.value = res.data.logs
    total.value = res.data.total
    loading.value = false
  })
}
// 多选框选中数据
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.user_log_id)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}
/** 搜索按钮操作 */
function handleQuery() {
  getList()
}
/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = []
  queryForm.value.resetFields()
  handleQuery()
}
/** 分页改变 */
// 每页显示条数改变 就会触发这个函数
const handleSizeChange = (val: number) => {
  // 保存每页显示的条数
  state.queryParams.limit = val;
  state.queryParams.page = 1;
  // 调用分页函数
  getList();
}
// 当前页码改变 就会触发这个函数
const handleCurrentChange = (val: number) => {
  // 保存当前页码
  state.queryParams.page = val;
  // 调用分页函数
  getList();
}
/** 删除按钮操作 */
function handleDelete(row: logItem) {
  const log_ids = row.user_log_id ? [row.user_log_id] : ids.value
  ElMessageBox.confirm('是否确认删除日志编号为"' + log_ids + '"的数据项?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(function () {
    return deleteLog(log_ids)
  }).then(() => {
    getList()
    ElMessage.success('删除成功')
  })
}


</script>

