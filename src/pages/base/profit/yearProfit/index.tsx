import React, { useEffect, useState } from 'react';
import CardChart, { ChartData, ChartType } from '@/components/CardChart';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Button, DatePicker, message } from 'antd';
import { calculateMonthlyProfitForYear,yearProfit} from '@/services/api/log';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

export default () => {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [year, setYear] = useState(moment('2024', 'YYYY'));
  const [dataList, setDataList] = useState<ChartData[]>([]);
  const [annualProfit, setAnnualProfit] = useState<number | null>(null); 
  const navigate = useNavigate();

  const handleYearSubmit = async () => {
    if (!year || !year.isValid()) {
      message.error('请选择有效的年份');
      return;
    }
    const yearInt = year.year(); 
    try {
      const params = { year: yearInt };
      const monthlyProfits = await calculateMonthlyProfitForYear(params);
      const yearProfits = await yearProfit(params);
      if (!monthlyProfits) {
        message.error('获取数据失败');
        return;
      }

      const initializedDataList = Array.from({ length: 12 }, (_, index) => ({
        name: `${index + 1}月`,
        value: 0,
      }));

      monthlyProfits.forEach((profit) => {
        if (typeof profit.month === 'string') {
          const monthNumber = parseInt(profit.month, 10);
          const monthIndex = monthNumber - 1;
          if (monthIndex >= 0 && monthIndex < 12) {
            initializedDataList[monthIndex].value = profit.profit || 0;
          }
        }
      });

      setDataList(initializedDataList);
      setAnnualProfit(yearProfits || null);
    } catch (error) {
      message.error('获取数据失败');
    }
  };

  useEffect(() => {
    handleYearSubmit();
  }, [year]); 

  return (
    <PageContainer>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Button style={{ alignSelf: 'flex-start', marginBottom: '16px' }} onClick={() => navigate(-1)}>
          返回
        </Button>
      <ProCard
        title={
          `图表 - ${year?.isValid() ? year.format('YYYY') : '未选择'}年总利润: ${typeof annualProfit === 'number' ? annualProfit.toLocaleString() : '0'}`
        } // 使用年度总利润更新标题
        headerBordered
        extra={[
          <DatePicker
            key="yearPicker"
            picker="year"
            value={year}
            onChange={(date) => {
              if (date !== null) {
                setYear(date);
              } else {
              }
            }}
            style={{ width: 150, marginRight: 10 }}
          />,
          <Button key="submit" type="primary" onClick={handleYearSubmit}>
            提交
          </Button>,
          <Button key="line" onClick={() => setChartType('line')}>折线图</Button>,
          <Button key="bar" onClick={() => setChartType('bar')}>直方图</Button>,
          <Button key="pie" onClick={() => setChartType('pie')}>饼图</Button>,
        ]}
      >
        <CardChart id="mycharts1" chartType={chartType} data={dataList} height={500} />
      </ProCard>
      </div>
    </PageContainer>
  );
};
