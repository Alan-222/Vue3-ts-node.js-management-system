import { getEssayNum } from '@/utils/API/dashboard/dashboard';
import { AxiosResponse } from 'axios';
let res: AxiosResponse;
res = await getEssayNum();
const chartValues = res.data;
const chartData = chartValues.filter((item: essayChartArray) => {
  return item.name === '已审核文章' || item.name === '未审核文章';
});
export default {
  color: ['#45789f', '#6df4d5'],
  tooltip: {
    trigger: 'item'
  },
  legend: {
    // 对图形的解释部分
    type: 'scroll',
    orient: 'vertical',
    top: '28%',
    left: '50%',
    y: 'center',
    icon: 'rect', // 添加
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
      let arr = ['{a|' + name + '}', '{b|' + Math.round((target / total) * 100) + '}', '{c|' + '%' + '}'];
      return arr.join('  ');
    },
    textStyle: {
      // 添加
      padding: [8, 0, 0, 0],
      rich: {
        a: {
          fontSize: 16,
          color: '#4E5969',
          padding: [0, 55, 0, 8]
        },
        b: {
          fontSize: 20,
          color: '#1D2129'
        },
        c: {
          fontSize: 12,
          color: '#86909C'
        }
      }
    }
  },

  series: [
    {
      type: 'pie',
      radius: ['60%', '70%'],
      center: ['20%', '50%'],
      avoidLabelOverlap: false,
      label: {
        show: true,
        position: 'center',
        formatter: function () {
          let total = 0;
          for (let i = 0; i < chartData.length; i++) {
            total += chartData[i].value;
          }
          let arr = ['{a|共计}', '{b|' + total + '}'];
          return arr.join('\n');
        },
        rich: {
          a: {
            fontSize: 12,
            color: '#4E5969'
          },
          b: {
            padding: [8, 0, 0, 0],
            fontSize: 24,
            color: '#1D2129'
          }
        }
      },

      data: chartData
    }
  ]
};
