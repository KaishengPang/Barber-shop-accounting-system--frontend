/*
 * @Description: 饼图
 * @Author: 李洪文
 * @Date: 2023-4-13 22:09:28
 * @LastEditors: 李洪文
 */
import React, { useEffect, CSSProperties } from 'react';
import * as echarts from 'echarts';
import 'echarts/lib/chart/pie';
import { renderHint } from '@/utils/ui';

interface PieData {
  name?: string;
  value?: number;
}
export interface BarProps {
  id: string;
  data: PieData[];
  color?: string;
  formatter?: any;
  style?: CSSProperties;
  className?: string;
  animation?: boolean;
}

function Bar2D(props: BarProps) {
  const { id, data, className, style = { width: '100%', height: 200 } } = props;

  const formatter = (v: any) => {
    console.dir(v);
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
      tooltip: {
        trigger: 'item',
        formatter: formatter,
      },
      animation: props.animation,
      xAxis: { show: false },
      yAxis: { show: false },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      series: [
        {
          name: '总量',
          type: 'pie',
          //stack: '总量',
          data: data,
        },
      ],
    });

    return () => {
      chart.dispose();
    };
  }, [data]);

  return <div id={id} style={{ ...style }} className={className}></div>;
}

export default Bar2D;
