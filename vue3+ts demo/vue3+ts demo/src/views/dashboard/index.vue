<template>
  <!-- 数据 -->
  <el-row :gutter="40" class="card-panel__col">
    <el-col :xs="24" :sm="12" :lg="6" class="card-panel__col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-user">
          <svg-icon icon-class="user" size="4em" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">用户数</div>
          <div class="card-panel-num">{{ count.userSum }}</div>
        </div>
      </div>
    </el-col>

    <el-col :xs="24" :sm="12" :lg="6" class="card-panel__col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-role">
          <svg-icon icon-class="peoples" size="4em" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">角色数</div>
          <div class="card-panel-num">{{ count.roleSum }}</div>
        </div>
      </div>
    </el-col>

    <el-col :xs="24" :sm="12" :lg="6" class="card-panel__col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-article">
          <svg-icon icon-class="documentation" size="4em" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">文章数</div>
          <div class="card-panel-num">{{ count.articleSum }}</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :lg="6" class="card-panel__col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-artcate">
          <svg-icon icon-class="tree-table" size="4em" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">文章分类数</div>
          <div class="card-panel-num">{{ count.artcateSum }}</div>
        </div>
      </div>
    </el-col>
  </el-row>
  <el-row :gutter="40" class="card-panel__col">
    <el-col :span="12">
      <div class="card-log">
        <div class="card-log-title">
          登录日志
        </div>
        <el-scrollbar height="200px">
          <el-timeline>
            <el-timeline-item v-for="(activity, index) in activities" :key="index" :timestamp="activity.create_time">
              <span class="card-log-user">{{ activity.user.roles[0].role_name }} {{ activity.user.username }}</span>
              &nbsp;<span class="card-log-info">登录了系统</span>
            </el-timeline-item>
          </el-timeline>
          <div class="card-log-icon-wrapper icon-log">
            <svg-icon icon-class="job" size="6em" />
          </div>
        </el-scrollbar>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="card-log">
        <div class="card-log-title">
          最新文章
        </div>
        <el-scrollbar height="200px">
          <div class="essay-list" v-for="item in essays">
            <div class="essay-list__info">
              <el-tooltip :content="item.title" placement="top">
                <router-link class="title" target="_blank" :to="{
                  name: 'Post',
                  params: {
                    id: item.id
                  }
                }">{{ item.title }}</router-link>
              </el-tooltip>
              <span class="artcate">{{ item.artcates && item.artcates.length ? item.artcates.map(item => item.name) : ''
              }}</span>
              <span class="author">作者：{{ item.user.username }}</span>
              <span class="create_time">{{ item.create_time }}</span>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </el-col>
  </el-row>
  <el-row :gutter="40">
    <el-col :span="12">
      <div class="card-log">
        <div class="card-log-title">
          文章审核情况分布图
        </div>
        <div class="card-log-body">
          <echarts-pie chartId="dashboardChartOne" :chartData="chartValues"></echarts-pie>
        </div>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="card-log">
        <div class="card-log-title">
          文章分类数量图
        </div>
        <div class="card-log-body">
          <EchartsBar chartId="dashboardChartTwo" :chartData="chartOneValues"></EchartsBar>
        </div>
      </div>
    </el-col>
  </el-row>

</template>

<script lang="ts">
export default { name: "Dashboard", components: { EchartsPie, EchartsBar } };
</script>

<script setup lang="ts">
// 组件引用
import SvgIcon from '@/components/SvgIcon/index.vue';
import { onMounted, reactive, ref } from 'vue';
import { getAllModelCount, getLogList, getEssayList, getEssayNum } from '@/utils/API/dashboard/dashboard'
import EchartsPie from '@/components/Echarts/EchartsPie.vue';
import EchartsBar from '@/components/Echarts/EchartsBar.vue';


const count = reactive({
  userSum: 0,
  roleSum: 0,
  articleSum: 0,
  artcateSum: 0
})
const activities = ref([] as logListItem[])
const essays = ref([] as essayItem[])
const chartValues = ref({
  chartValue: [] as essayChartArray[],
  chartAxis: []
})
const chartOneValues = ref({
  chartValue: [] as number[],
  chartAxis: [] as string[],
})
onMounted(() => {
  getAllModel()
  getLog()
  getEssays()
  getEssaysCount()
})
function getAllModel() {
  getAllModelCount().then(res => {
    count.userSum = res.data.userSum
    count.roleSum = res.data.roleSum
    count.articleSum = res.data.articleSum
    count.artcateSum = res.data.artcateSum
  })
}
function getLog() {
  getLogList().then(res => {
    activities.value = res.data
  })
}
function getEssays() {
  getEssayList().then(res => {
    essays.value = res.data
  })
}
function getEssaysCount() {
  getEssayNum().then(res => {
    res.data.forEach((item: essayChartArray) => {
      if (item.name === "已审核文章" || item.name === "未审核文章") {
        chartValues.value.chartValue.push({
          value: item.value,
          name: item.name
        })
      }
    });
    chartOneValues.value.chartValue = res.data.map((item: essayChartArray) => {
      return item.value

    });
    chartOneValues.value.chartAxis = res.data.map((item: essayChartArray) => {
      return item.name
    });
  })
}
</script>

<style lang="scss" scoped>
.card-panel__col {
  margin-bottom: 12px;
}

.card-panel {
  height: 108px;
  font-size: 12px;
  position: relative;
  overflow: hidden;
  color: #666;
  background: #fff;
  border-radius: 10px;
  box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.05);

  .icon-user {
    color: #40c9c6;
  }

  .icon-role {
    color: #36a3f7;
  }

  .icon-article {
    color: #f4516c;
  }

  .icon-artcate {
    color: #ab69d4;
  }

  &:hover {
    .card-panel-icon-wrapper {
      color: #fff;
    }

    .icon-user {
      background: #40c9c6;
    }

    .icon-role {
      background: #36a3f7;
    }

    .icon-article {
      background: #f4516c;
    }

    .icon-artcate {
      background: #ab69d4;
    }
  }

  .card-panel-icon-wrapper {
    float: left;
    margin: 14px 0 0 14px;
    padding: 16px;
    transition: all 0.38s ease-out;
    border-radius: 6px;
  }

  .card-panel-description {
    float: right;
    font-weight: bold;
    margin: 26px 20px 0;

    .card-panel-text {
      line-height: 18px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 16px;
      margin-bottom: 12px;
    }

    .card-panel-num {
      font-size: 20px;
      text-align: right;
    }
  }
}

:deep(.el-timeline) {
  padding-left: 10px;
  width: 50%;
}

.card-log {
  background: #fff;
  box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 12px;
  position: relative;

  .card-log-icon-wrapper {
    // float: right;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 999;
    margin: 14px 14px 0 0;
    padding: 16px;
    transition: all 0.38s ease-out;
    border-radius: 6px;
    pointer-events: none;
  }

  .icon-log {
    color: #7ca6c6;
  }

  &:hover {
    .card-log-icon-wrapper {
      color: #fff;
    }

    .icon-log {
      background: #36a3f7;
    }
  }

  .card-log-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .card-log-body {
    height: 190px;
  }

  .card-log-user {
    color: #666;
  }

  .card-log-info {
    font-weight: bold;
  }
}

.essay-list {
  // width: 100%;
  padding-left: 10px;

  .essay-list__info {
    clear: both;
    font-size: 14px;
    height: 26px px;
    line-height: 26px;
    text-indent: 8px;

    .title {
      float: left;
      max-width: 35%;
      text-decoration: none;
      font-weight: 400;
      color: #1d2129;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      &:hover {
        color: #7ca6c6;
      }
    }

    .artcate {
      float: left;
      color: #7D7D7D;
      font-size: 12px;
    }

    .author {
      float: left;
      color: #8a5b22;
      font-size: 12px;
    }

    .create_time {
      float: right;
      color: #8a5b22;
    }
  }
}

@media screen and (max-width: 1024px) {
  .card-log-icon-wrapper {
    display: none;
  }
}
</style>