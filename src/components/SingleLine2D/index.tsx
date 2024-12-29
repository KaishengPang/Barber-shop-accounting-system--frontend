/*
 * @Description: 折线图
 * @Author: 李洪文
 * @Date: 2023-4-13 22:09:28
 * @LastEditors: 李洪文
 */
import { CSSProperties, useEffect } from 'react';
import * as echarts from 'echarts';
import 'echarts/lib/chart/line';
import { renderHint } from '@/utils/ui';
export interface BarProps {
  id: string;
  xData: string[];
  yData: number[];
  color?: string;
  formatter: any;
  style?: CSSProperties;
  className?: string;
}

function SingleLine2D(props: BarProps) {
  const {
    id,
    xData,
    yData,
    className,
    color = '#6AA7FF',
    style = { width: '100%', height: 200 },
  } = props;
  useEffect(() => {
    const chart = echarts.init(document.getElementById(id) as HTMLCanvasElement);
    chart.setOption({
      animation: false,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (v) => {
          if (props.formatter) {
            return renderHint(v[0].name, props.formatter(v[0].value));
          }

          return v[0].value;
        },
      },
      grid: {
        left: 80,
        right: 10,
        bottom: 30,
        top: 10,
        containLabel: false,
      },
      xAxis: [
        {
          type: 'category',
          data: xData,
          axisTick: {
            alignWithLabel: false,
          },

          axisLabel: {
            show: true,
            color: '#666666',
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: true,
            color: '#666666',
            formatter: props.formatter,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#F0F0F0',
              opacity: 0.8,
            },
          },
        },
      ],
      series: [
        {
          name: '总量',
          type: 'line',
          barWidth: '70%',
          data: yData,
          itemStyle: {
            color,
          },
        },
      ],
    });

    return () => {
      chart.dispose();
    };
  }, [xData, yData]);

  return <div id={id} style={{ ...style }} className={className}></div>;
}

export default SingleLine2D;
