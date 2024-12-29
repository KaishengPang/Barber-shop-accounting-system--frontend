import React, { useState } from 'react';

import Bar2D from '@/components/Bar2D';
import Pie2D from '@/components/Pie2D';
import { Table } from 'antd';
import SingleLine2D from '../SingleLine2D';
export type ChartType = 'bar' | 'line' | 'pie' | 'grid';
export interface ChartData {
  /** name */
  name?: string;

  /** value */
  value?: number;

  /** 占比%，可选 */
  percent?: string;
}

export interface ChartDataProps {
  id: string;
  height?: number;
  chartType?: ChartType;
  formatter?: any;
  data: ChartData[];
  children?: React.ReactNode;
  columnsSimple?: boolean;
}

export default function CardChart(props: ChartDataProps) {
  let { height, chartType } = props;
  if (!height) height = 150;

  const xData: string[] = [];
  const yData: number[] = [];
  props.data.forEach((item) => {
    xData.push(item.name!);
    yData.push(item.value!);
  });

  if (chartType === 'line') {
    return (
      <SingleLine2D
        formatter={props.formatter}
        id={props.id}
        xData={xData}
        yData={yData}
        color="#FFA989"
        style={{ height }}
      />
    );
  }

  if (chartType === 'grid') {
    const columns = [
      { title: '名称', flex: 1, dataIndex: 'name' },
      {
        title: '值',
        width: 120,
        dataIndex: 'value',
        render: (v: number) => props.formatter(v),
      },
      {
        title: '百分比',
        width: 120,
        dataIndex: 'percent',
        render: (v: number) => (v ? v + '%' : ''),
      },
    ];

    const columns2 = [
      { title: '名称', flex: 1, dataIndex: 'catalog' },
      {
        title: '点击',
        width: 120,
        dataIndex: 'click',
        render: (v: number) => v,
      },
    ];
    return (
      <Table
        style={{ width: '100%' }}
        scroll={{ y: height - 50 }}
        columns={props.columnsSimple ? columns2 : columns}
        pagination={false}
        dataSource={props.data}
        size="small"
      ></Table>
    );
  }

  return (
    <>
      {chartType === 'bar' ? (
        <Bar2D
          formatter={props.formatter}
          id={props.id}
          xData={xData}
          yData={yData}
          color="#FFA989"
          style={{ height }}
        />
      ) : (
        <Pie2D
          id={props.id}
          formatter={props.formatter}
          data={props.data}
          color="#FFA989"
          style={{ height }}
        />
      )}
    </>
  );
}
