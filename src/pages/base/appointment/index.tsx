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
  route?: string; // 新增route属性
}> = ({ title, href, index, desc, route }) => {
  const { useToken } = theme;
  const { token } = useToken();

  const handleClick = () => {
    if (route) {
      // 使用route进行内部跳转
      history.push(route);
    } else if (href) {
      // 使用href打开新的外部链接
      window.open(href, '_blank');
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
        cursor: 'pointer', // 添加指针样式表示可点击
      }}
            onClick={handleClick} // 添加点击事件
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
            欢迎使用预约管理模块
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
            在这里可以对预约项目进行增加、修改、删除、查询
            以及根据预约情况进行时间轴可视化展示等
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
            title="预约明细管理"
            desc="功能：对预约项目进行增加、删除、修改、查找"
            route="/base/appointment/table"
          />

          <InfoCard
            index={2}
            title="预约可视化显示"
            desc="功能：预约项目可视化显示"
            route="/base/appointment/vision"
          />
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
