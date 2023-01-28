<template>
  <!-- 2.定义容器存放echarts图表 -->
  <div class="chart" ref="chartEl"></div>
</template>

<script setup lang="ts">
// 1.引入echarts组件
import * as echarts from 'echarts'
import { markRaw, Ref, ref, onMounted, watch } from 'vue';
import emptyOption from '@/utils/chartOptions/emptyOption';
// 1.定义图表元素初始值
const chart = ref({} as any)
const chartEl: Ref<HTMLElement | any> = ref(null);
const chartoptions = ref({} as any)
// 3.获取图表配置
const props = defineProps({
  option: {
    type: Object,
    default: () => { }
  }
})

// 4.配置并创建图表的方法
const createChart = () => {
  // 判断暂无数据的情况
  if (props.option.series && props.option.series.length) {
    let count = 0;
    props.option.series.forEach((element: any) => {
      if (element.data && element.data.length == 0) {
        count++;
      }
    });
    if (count === props.option.series.length) {
      chartoptions.value = emptyOption
    } else {
      chartoptions.value = props.option
    }
  } else {
    chartoptions.value = props.option
  }
  chart.value.setOption(chartoptions.value)
}
onMounted(() => {
  // 指定图表的配置项和数据
  chart.value = markRaw(echarts.init(chartEl.value));
  createChart()
  window.addEventListener("resize", () => {
    // 创建图表
    createChart();
    // 刷新图表
    chart.value.resize();
  });
})
// 5.监听图表数据的变化
watch(
  () => props.option
  , (newData) => {
    // console.log(newData);
    createChart()
  },
  { deep: true })

</script>

<style>
.chart {
  width: 100%;
  height: 100%;
}
</style>
