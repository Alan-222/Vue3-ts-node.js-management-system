<template>
  <Chart :option="barOption" />
</template>


<script lang="ts">
export default { name: "EchartsBar" };
</script>
<script setup  lang="ts">
/**
 * 柱状图
 */
import Chart from "./Chart.vue";
import barOption from "@/utils/chartOptions/barOption";

</script>
