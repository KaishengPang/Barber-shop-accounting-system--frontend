/*
 * @Description: 柱状图
 * @Author: 李洪文
 * @Date: 2023-4-13 22:09:28
 * @LastEditors: 李洪文
 */
import React, { CSSProperties, useEffect } from 'react';
import * as echarts from 'echarts';
import 'echarts/lib/chart/bar';
import { renderHint } from '@/utils/ui';

export interface BarProps {
  id: string;
  xData: string[];
  yData: number[];
  formatter?: any;
  color?: string;
  style?: CSSProperties;
  animation?: boolean;
  className?: string;
}

function Bar2D(props: BarProps) {
  const {
    id,
    xData,
    yData,
    className,
    color = '#6AA7FF',
    style = { width: '100%', height: 200 },
  } = props;

  const formatter = (v: any) => {
    let percent = '';
    if (v.percent) percent = `(${v.percent}%)`;
    let text = '';
    if (props.formatter) {
      text = renderHint(v.name, props.formatter(v.value) + percent);
    } else {
      text = renderHint(v.name, v.value + percent);
    }

    return text;
  };
  useEffect(() => {
    const chart = echarts.init(document.getElementById(id) as HTMLCanvasElement);
    chart.setOption({
      animation: props.animation,
      tooltip: {
        trigger: 'item',
        formatter: formatter,
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
          type: 'bar',
          barWidth: '70%',
          data: yData,
          itemStyle: {
            color,
          },
        },
      ],
    });

    const resize = () => chart.resize();
    setTimeout(() => {
      resize();
    }, 1);
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      chart.dispose();
    };
  }, [xData, yData]);

  return <div id={id} style={{ ...style }} className={className}></div>;
}

export default Bar2D;
