import React, { useState } from 'react';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Button, DatePicker, Input, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { calculateProfitByBarberNameAndDateRange, calculateDailyBarberProfit } from '@/services/api/log';
import CardChart, { ChartData, ChartType } from '@/components/CardChart';
import { useNavigate } from 'react-router-dom';

const { RangePicker } = DatePicker;

export default () => {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [dates, setDates] = useState<[Dayjs | null | undefined, Dayjs | null | undefined]>([dayjs().subtract(1, 'months'), dayjs()]);
  const [barberName, setBarberName] = useState<string>('');
  const [dataList, setDataList] = useState<ChartData[]>([]);
  const [totalProfit, setTotalProfit] = useState<number | null>(null); 
  const navigate = useNavigate();

  const handleDateAndBarberSubmit = async () => {
    if (!dates || dates.length !== 2 || !dates[0] || !dates[1] || !dates[0].isValid() || !dates[1].isValid() || !barberName.trim()) {
      message.error('请确保选择了有效的日期范围并且输入了理发师姓名');
      return;
    }

    const startDate = dates[0].format('YYYY-MM-DD');
    const endDate = dates[1].format('YYYY-MM-DD');

    try {
      const params = {
        barberName, // 来自状态的理发师姓名
        startDate, // 选择的开始日期
        endDate, // 选择的结束日期
      };
      const dailyProfits = await calculateDailyBarberProfit(params);
      const totalProfit = await calculateProfitByBarberNameAndDateRange(params);
      if (!dailyProfits || dailyProfits.length === 0 || totalProfit === null) {
        message.error('获取数据失败或没有数据');
        return;
      }

      setDataList(dailyProfits.map((profit) => ({
        name: profit.profitDate, 
        value: profit.dailyProfit, 
      })));
      setTotalProfit(totalProfit !== undefined ? totalProfit :null); // 设置总金额
    } catch (error) {
      message.error('获取数据失败');
    }
  };

  return (
    <PageContainer>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Button style={{ alignSelf: 'flex-start', marginBottom: '16px' }} onClick={() => navigate(-1)}>
          返回
        </Button>
        <div style={{ display: 'flex', marginBottom: '16px', alignItems: 'center', gap: '16px' }}>
          <Input
            placeholder="请输入理发师姓名"
            value={barberName}
            onChange={(e) => setBarberName(e.target.value)}
            style={{ flex: 1 }}
          />
          <RangePicker
            format="YYYY-MM-DD"
            defaultValue={dates}
            onChange={(dates, dateString) => {
              const dayjsDates: [Dayjs | null | undefined, Dayjs | null | undefined] = dates ? [dayjs(dates[0]), dayjs(dates[1])] : [undefined, undefined];
              setDates(dayjsDates);
            }}
            style={{ flex: 2 }}
          />
          <Button type="primary" onClick={handleDateAndBarberSubmit}>
            查询
          </Button>
        </div>
        <ProCard
          style={{ marginBottom: 16 }}
          bordered
          title="总金额"
        >
          <div>{ `${barberName} 总业绩为: ${totalProfit !== null ? totalProfit.toLocaleString() : '0'}`}</div>
        </ProCard>
        <ProCard
          title={`利润图表 - ${barberName} `}
          headerBordered
          extra={[
            <Button key="line" onClick={() => setChartType('line')}>折线图</Button>,
            <Button key="bar" onClick={() => setChartType('bar')}>直方图</Button>,
            <Button key="pie" onClick={() => setChartType('pie')}>饼图</Button>,
          ]}
        >
          <CardChart id="barberProfitChart" chartType={chartType} data={dataList} height={500} />
        </ProCard>
      </div>
    </PageContainer>
  );
};
