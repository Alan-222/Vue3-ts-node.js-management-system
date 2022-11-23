<template>
  <div :id="chartId" style="width: 100%; height: 100%"></div>
</template>


<script lang="ts">
export default { name: 'EchartsPie' };
</script>
<script setup  lang="ts">
/**
 * 饼图
 */
import * as echarts from "echarts";
import { onMounted, ref, watch } from "vue";

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
  EChartObj.value = echarts.init(document.getElementById(props.chartId));
  createEchart();
}
// 创建图表
const createEchart = () => {
  // 无数据不生成图表
  if (!props.chartData.chartValue.length) return;

  // 图表数据
  const chartData = props.chartData.chartValue;

  EChartObjOption.value = {
    color: ["#45789f", "#6df4d5"],
    tooltip: {
      trigger: "item",
    },
    legend: {
      // 对图形的解释部分
      type: "scroll",
      orient: "vertical",
      top: "28%",
      left: "50%",
      y: "center",
      icon: "rect", // 添加
      itemWidth: 4,
      itemHeight: 28,
      formatter: function (name: string) {
        let total = 0;
        let target;
        for (let i = 0; i < chartData.length; i++) {
          total += chartData[i].value;
          if (chartData[i].name === name) {
            target = chartData[i].value;
          }
        }
        let arr = [
          "{a|" + name + "}",
          "{b|" + Math.round((target / total) * 100) + "}",
          "{c|" + "%" + "}",
        ];
        return arr.join("  ");
      },
      textStyle: {
        // 添加
        padding: [8, 0, 0, 0],
        rich: {
          a: {
            fontSize: 16,
            color: "#4E5969",
            padding: [0, 55, 0, 8],
          },
          b: {
            fontSize: 20,
            color: "#1D2129",
          },
          c: {
            fontSize: 12,
            color: "#86909C",
          },
        },
      },
    },

    series: [
      {
        type: "pie",
        radius: ["60%", "70%"],
        center: ["20%", "50%"],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: "center",
          formatter: function () {
            let total = 0;
            for (let i = 0; i < chartData.length; i++) {
              total += chartData[i].value;
            }
            let arr = ["{a|共计}", "{b|" + total + "}"];
            return arr.join("\n");
          },
          rich: {
            a: {
              fontSize: 12,
              color: "#4E5969",
            },
            b: {
              padding: [8, 0, 0, 0],
              fontSize: 24,
              color: "#1D2129",
            },
          },
        },

        data: chartData,
      },
    ],
  };

  // 使用刚指定的配置项和数据显示图表。
  EChartObj.value.setOption(EChartObjOption.value);
}

</script>

<style>

</style>