<template>
  <div :id="chartId" style="width: 100%; height: 100%"></div>
</template>


<script lang="ts">
export default { name: 'EchartsBar' };
</script>
<script setup  lang="ts">
/**
 * 柱状图
 */
import * as echarts from "echarts";
import { markRaw, onMounted, ref, watch } from "vue";

const props = defineProps({
  // 图表id
  chartId: {
    type: String,
  },
  // 图表数据
  chartData: {
    type: Object,
    default: () => {
      return {
        chartValue: [],
        chartAxis: [],
      };
    },
  },
})

const EChartObj = ref({} as any)
const EChartObjOption = ref({} as any)

watch(
  () => props.chartData, () => {
    createEchart();
  },
  {
    deep: true
  }
),
  onMounted(() => {
    initEchart();

    window.addEventListener("resize", () => {
      // 创建图表
      createEchart();
      // 刷新图表
      EChartObj.value.resize();
    });
  })

// 初始化图表
const initEchart = () => {
  // 创建图表  

  EChartObj.value = markRaw(echarts.init(document.getElementById(props.chartId)));
  createEchart();
}
// 创建图表
const createEchart = () => {
  // 无数据不生成图表
  if (!props.chartData.chartValue.length) return;

  const legends = props.chartData.chartAxis;
  // 图表数据
  const chartData = props.chartData.chartValue.map((item: any, index: number) => {
    return {
      name: legends[index],
      type: "bar",
      barWidth: 30,
      barGap: 1,
      data: [item],
    };
  });

  EChartObjOption.value = {
    color: ['#00A3E0', '#ffc0cb', '#CCCCCC', '#FFA100', '#BBFFAA', '#749f83'],
    tooltip: {
      show: true,
      formatter: (params: any) => `${params.marker} ${params.seriesName}&nbsp&nbsp&nbsp&nbsp${params.data}`

    },
    grid: {
      containLabel: true,
      top: "24%",
      left: "5%",
      right: "5%",
      bottom: "2%",
    },
    legend: {
      show: true,
      icon: "circle",
      top: -3,
      right: "10%",
      itemWidth: 10,
      data: legends,
    },
    xAxis: {
      type: "category",
      axisTick: false,
      axisLine: {
        lineStyle: {
          color: "#c9cdd4",
        },
      },
      axisLabel: false,
    },

    yAxis: {
      type: "value",
      name: "数量",
      nameTextStyle: {
        color: "#86909C",
        align: "right",
        padding: [0, 0, 10, 10],
        lineHeight: 20,
      },
      axisTick: false,
      axisLine: {
        lineStyle: {
          color: "#f0f",
          width: 0,
        },
      },
      splitLine: {
        lineStyle: {
          color: "#e5e6eb",
          type: "dashed",
        },
      },
      axisLabel: {
        color: "#86909C",
        fontSize: 12,
      },
    },
    series: chartData,
  };

  // 使用刚指定的配置项和数据显示图表。
  EChartObj.value.setOption(EChartObjOption.value);
}

</script>

<style>

</style>