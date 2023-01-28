<template>
  <Chart :option="pieOption" />
</template>


<script lang="ts">
export default { name: "EchartsBar", components: { Chart } };
</script>
<script setup  lang="ts">
/**
 * 柱状图
 */
import Chart from "./Chart.vue";
import pieOption from "@/utils/chartOptions/pieOption";

</script>
