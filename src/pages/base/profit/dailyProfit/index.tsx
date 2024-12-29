import React, { useEffect, useState } from 'react';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Button, DatePicker, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { calculateDailyProfitBetweenDates,calculateTotalProfitBetweenDates } from '@/services/api/log';
import CardChart, { ChartData, ChartType } from '@/components/CardChart';
import { useNavigate } from 'react-router-dom';

const { RangePicker } = DatePicker;

interface CalculateDailyProfitBetweenDatesParams {
    startDate: string;
    endDate: string;
  }
  
export default () => {
  const [chartType, setChartType] = useState<ChartType>('bar');
  // 初始化日期状态为Dayjs对象数组
  const [dates, setDates] = useState<[Dayjs | null | undefined, Dayjs | null | undefined]>([dayjs().subtract(1, 'months'), dayjs()]);
  const [dataList, setDataList] = useState<ChartData[]>([]);
  const navigate = useNavigate();
  const [totalProfit, setTotalProfit] = useState<number | null>(null); 

  const handleDateSubmit = async () => {
    if (!dates || dates.length !== 2 || !dates[0] || !dates[1] || !dates[0].isValid() || !dates[1].isValid()) {
      message.error('请选择有效的日期范围');
      return;
    }

    const startDate = dates[0].format('YYYY-MM-DD');
    const endDate = dates[1].format('YYYY-MM-DD');

    const params: CalculateDailyProfitBetweenDatesParams = {
        startDate: startDate,
        endDate: endDate,
      };

    try {
      const profitsData = await calculateDailyProfitBetweenDates(params);
      const totalProfits = await calculateTotalProfitBetweenDates(params);
      if (!profitsData || profitsData.length === 0) {
        message.error('获取数据失败或没有数据');
        return;
      }

      const formattedData = profitsData.map((data) => ({
        name: data.date, 
        value: data.profit, 
      }));

      setDataList(formattedData);
      setTotalProfit(totalProfits || null);
    } catch (error) {
      message.error('获取数据失败');
    }
  };

  useEffect(() => {
    handleDateSubmit(); 
  }, [dates]);

  return (
    <PageContainer>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Button style={{ alignSelf: 'flex-start', marginBottom: '16px' }} onClick={() => navigate(-1)}>
          返回
        </Button>
        <ProCard
        title={
            `图表 -${dates[0]?.format('YYYY-MM-DD')} 至 ${dates[1]?.format('YYYY-MM-DD')}总利润: 
            ${typeof totalProfit === 'number' ? totalProfit.toLocaleString() : '0'} `
        }
          headerBordered
          extra={[
            <RangePicker
            defaultValue={dates}
            onChange={(dates) => {
              const dayjsDates: [Dayjs | null | undefined, Dayjs | null | undefined] = dates ? [dayjs(dates[0]), dayjs(dates[1])] : [undefined, undefined];
              setDates(dayjsDates);
            }}
            style={{ width: 250, marginBottom: 16 }}
          />,
          <Button type="primary" onClick={handleDateSubmit} style={{ marginBottom: 16 }}>
            查询
          </Button>,
            <Button key="line" onClick={() => setChartType('line')}>折线图</Button>,
            <Button key="bar" onClick={() => setChartType('bar')}>直方图</Button>,
            <Button key="pie" onClick={() => setChartType('pie')}>饼图</Button>,
          ]}
        >
          <CardChart id="dailyProfitChart" chartType={chartType} data={dataList} height={500} />
        </ProCard>
      </div>
    </PageContainer>
  );
};
