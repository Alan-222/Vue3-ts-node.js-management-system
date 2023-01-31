<template>
  <div class="content-title">登录日志</div>
  <div class="content-container">
    <!-- 搜索栏、表格 -->
    <dataTable ref="dataTableRef" :requestApi="getLogList" :tableColumn="tableColumn" :otherConfig="otherConfig"
      :pageSizes="[1, 3, 5, 10]" selection="multiple" :tableColumnConfig="tableColumnConfig" :setupConfig="setupConfig"
      :searchConfig="searchConfig" :searchReset="searchReset" :searchBtnConfig="searchBtnConfig" border>
      <template #multiple-operation="{ selectionData }">
        <el-button v-hasPerm="['system:log:del']" color="#3c8dbc" :icon="Remove" :disabled="!selectionData.length"
          @click="handleDelete(selectionData)">批量删除
        </el-button>
      </template>
    </dataTable>
  </div>
</template>

<script lang="ts">
export default { name: 'Log' };
</script>

<script lang="ts" setup>
import dataTable from '@/components/table/table.vue'
import { getLogList, deleteLog } from '@/utils/Api/user/user-log'
import { Remove } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref, reactive, toRefs } from 'vue';

/**
 * 表格参数
 */
const dataTableRef = ref()
const tableState = reactive({
  tableColumn: [
    { prop: 'user_log_id', label: '编号' },
    { prop: "user.username", label: '用户名', format: (row: any) => { return row.user.username } },
    { prop: 'ip', label: 'IP' },
    { prop: 'ua', label: 'UA', ellipsis: true },
    { prop: 'create_time', label: '登录时间', width: '200' },
  ],
  tableColumnConfig: {
    align: "center"
  },
  otherConfig: {
    list: 'logs'
  },
  setupConfig: {
    width: '0',
    fixed: "right",
    align: "center"
  },
  searchConfig: [
    { type: 'date-picker', datePickerType: 'daterange', prop: 'date', label: "登录时间" },
  ],
  searchReset: {
    create_time: undefined,
  },
  searchBtnConfig: {
    color: "#3c8dbc"
  }
})
const { tableColumn, tableColumnConfig, otherConfig, setupConfig, searchConfig, searchReset, searchBtnConfig } = toRefs(tableState)

function getList() {
  dataTableRef.value.getData()
}

/** 删除按钮操作 */
function handleDelete(rows: logItem | logItem[]) {
  let log_ids: number[];
  if (Array.isArray(rows)) {
    log_ids = rows.map((item) => item.user_log_id)
  } else {
    log_ids = [rows.user_log_id]
  }
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

