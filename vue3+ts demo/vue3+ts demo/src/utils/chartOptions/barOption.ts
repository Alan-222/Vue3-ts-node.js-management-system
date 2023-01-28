import { getEssayNum } from '@/utils/API/dashboard/dashboard';
import { AxiosResponse } from 'axios';
let res: AxiosResponse;
res = await getEssayNum();
const chartValues = res.data;
const series = chartValues.map((item: essayChartArray) => {
  return {
    type: 'bar',
    barWidth: 30,
    barGap: 1,
    name: item.name,
    data: [item.value]
  };
});

export default {
  color: ['#00A3E0', '#ffc0cb', '#CCCCCC', '#FFA100', '#BBFFAA', '#749f83'],
  tooltip: {
    show: true,
    formatter: (params: any) => `${params.marker} ${params.seriesName}&nbsp&nbsp&nbsp&nbsp${params.value}`
  },
  grid: {
    containLabel: true,
    top: '24%',
    left: '5%',
    right: '5%',
    bottom: '2%'
  },
  legend: {
    show: true,
    icon: 'circle',
    top: -3,
    left: '10%',
    itemWidth: 10
  },
  xAxis: {
    type: 'category',
    axisTick: false,
    axisLine: {
      lineStyle: {
        color: '#c9cdd4'
      }
    },
    axisLabel: false
  },

  yAxis: {
    type: 'value',
    name: '数量',
    nameTextStyle: {
      color: '#86909C',
      align: 'right',
      padding: [0, 0, 10, 10],
      lineHeight: 20
    },
    axisTick: false,
    axisLine: {
      lineStyle: {
        color: '#f0f',
        width: 0
      }
    },
    splitLine: {
      lineStyle: {
        color: '#e5e6eb',
        type: 'dashed'
      }
    },
    axisLabel: {
      color: '#86909C',
      fontSize: 12
    }
  },
  series: series
};
