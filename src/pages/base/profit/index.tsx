import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Card, theme } from 'antd';
import React from 'react';
import { history } from '@umijs/max';


const InfoCard: React.FC<{
  title: string;
  index: number;
  desc: string;
  href?: string;
  route?: string; 
}> = ({ title, href, index, desc, route }) => {
  const { useToken } = theme;
  const { token } = useToken();

  const handleClick = () => {
    if (route) {
      // 使用route进行内部跳转
      history.push(route);
    } 
  };

  return (
    <div
      style={{
        backgroundColor: token.colorBgContainer,
        boxShadow: token.boxShadow,
        borderRadius: '8px',
        fontSize: '16px',
        color: token.colorTextSecondary,
        lineHeight: '50px',
        padding: '20px 36px',
        minWidth: '220px',
        flex: 1,
        cursor: 'pointer', 
      }}
            onClick={handleClick} 
    >
      <div
        style={{
          display: 'flex',
          gap: '4px',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            lineHeight: '22px',
            backgroundSize: '100%',
            textAlign: 'center',
            padding: '8px 16px 16px 12px',
            color: '#FFF',
            fontWeight: 'bold',
            backgroundImage:
              "url('https://gw.alipayobjects.com/zos/bmw-prod/daaf8d50-8e6d-4251-905d-676a24ddfa12.svg')",
          }}
        >
          {index}
        </div>
        <div
          style={{
            fontSize: '26px',
            color: token.colorText,
            paddingBottom: 8,
          }}
        >
          {title}
        </div>
      </div>
      <div
        style={{
          fontSize: '18px',
          color: token.colorTextSecondary,
          textAlign: 'justify',
          lineHeight: '22px',
          marginBottom: 8,
        }}
      >
        {desc}
      </div>
      <a href={href} target="_blank" rel="noreferrer"  style={{ fontSize: '20px' }}>
        进入服务 {'>'}
      </a>
    </div>
  );
};

const Welcome: React.FC = () => {
  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');
  return (
    <PageContainer>
      <Card
        style={{
          borderRadius: 8,
        }}
        bodyStyle={{
          backgroundImage:
            initialState?.settings?.navTheme === 'realDark'
              ? 'background-image: linear-gradient(75deg, #1A1B1F 0%, #191C1F 100%)'
              : 'background-image: linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
        }}
      >
        <div
          style={{
            backgroundPosition: '100% -30%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '274px auto',
            backgroundImage:
              "url('https://gw.alipayobjects.com/mdn/rms_a9745b/afts/img/A*BuFmQqsB2iAAAAAAAAAAAAAAARQnAQ')",
          }}
        >
          <div
            style={{
              fontSize: '30px',
              color: token.colorTextHeading,
            }}
          >
            欢迎使用利润统计模块
          </div>
          <p
            style={{
              fontSize: '18px',
              color: token.colorTextSecondary,
              lineHeight: '22px',
              marginTop: 16,
              marginBottom: 32,
              width: '65%',
            }}
          >
            在这里可以进行通过年份查询每月的利润，也可以查询一个月中每天的利润，
            还可以自定义时间进行利润查询。
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
          <InfoCard
            index={1}
            title="年利润查询"
            desc="功能：通过年份对每月的利润进行查询"
            route="/base/profit/yearProfit"
          />

          <InfoCard
            index={2}
            title="日利润查询"
            desc="功能：自由选择时间范围查询每日利润"
            route="/base/profit/dailyProfit"
          />
          <InfoCard
            index={3}
            title="理发师业绩查询"
            desc="功能：根据理发师及时间段查询业绩"
            route="/base/profit/barberProfit"
          />
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
