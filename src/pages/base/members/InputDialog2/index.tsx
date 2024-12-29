import { ModalForm, ProFormText,ProForm } from '@ant-design/pro-components';
import { message, Card, Row, Col, Typography } from 'antd';
import React, { useState, useEffect } from 'react';
import { recharge, rechargeForBonus } from '@/services/api/member';

interface InputDialogProps2 {
  detailData?: API.MemberDTO;
  visible: boolean;
  onClose: (result: boolean) => void;
}

const rechargeOptions = [
  { id: 1, rechargeAmount: 1000, bonus: 500 },
  { id: 2, rechargeAmount: 500, bonus: 200 },
  { id: 3, rechargeAmount: 200, bonus: 60 },
];

export default function InputDialog2(props: InputDialogProps2) {
  const [formKey, setFormKey] = useState<number>(0);  //加上key可以保证每次打开的充值窗口都是重置的，否则不人性化

  useEffect(() => {
    if (props.visible) {
      // 使用当前时间戳作为 key 的一种简单方式，确保它是唯一的
      setFormKey(Date.now());
    }
  }, [props.visible]);

  const handleRechargeOptionClick = async (option: typeof rechargeOptions[0]) => {
    if (props.detailData && props.detailData.memberId) {
      try {
        await recharge({
          memberId: props.detailData.memberId,
          amount: option.rechargeAmount,
        });
        await rechargeForBonus({
          memberId: props.detailData.memberId,
          amount: option.bonus,
        });
        message.success('充值成功');
        props.onClose(true);
      } catch (error) {
        message.error('充值失败');
        console.error('Recharge failed:', error);
        props.onClose(false);
      }
    } else {
      message.error('会员信息缺失');
    }
  };

  const onFinish = async (values: any) => {
    if (props.detailData && props.detailData.memberId) {
      try {
        await recharge({
          memberId: props.detailData.memberId,
          amount: values.balance,
        });
        if (values.bonusAmount && values.bonusAmount > 0) {
          await rechargeForBonus({
            memberId: props.detailData.memberId,
            amount: values.bonusAmount,
          });
        }
        message.success('充值成功');
        props.onClose(true);
      } catch (error) {
        message.error('充值失败');
        console.error('Recharge failed:', error);
        props.onClose(false);
      }
    }
    return true;
  };

  const cardStyle = {
    background: 'linear-gradient(45deg, #F2DDA6, #A3DCF1)', // 从蓝色渐变到浅绿色
    border: '1px solid #d9d9d9', // 灰色边框
    borderRadius: '20px', // 圆角
    boxShadow: '0 6px 6px rgba(0, 0, 0, 0.3)', // 阴影
    cursor: 'pointer', // 鼠标悬停时显示指针
    padding: '12px', // 内部填充
    height: '90%', // 确保所有卡片高度一致
    color: '#000000', // 由于背景是深色的渐变，设置文本颜色为白色以提高可读性
  };
  

  return (
    <ModalForm
      key={formKey}
      width={600}
      title={'会员充值'}
      visible={props.visible}
      onFinish={onFinish}
      modalProps={{
        onCancel: () => props.onClose(false),
      }}
    >
    <div style={{ marginBottom: '30px' }}>
    </div> 
    <Row gutter={16} style={{ marginTop: 16 }}>
      {rechargeOptions.map((option) => (
        <Col key={option.id} span={8}>
          <Card
            hoverable
            style={cardStyle}
            title={`充${option.rechargeAmount}送${option.bonus}`}
            onClick={() => handleRechargeOptionClick(option)}
          >
            点击选择此套餐
          </Card>
        </Col>
      ))}
    </Row>
      <Typography.Text 
        type="secondary"
        style={{ display: 'block', textAlign: 'right' }}
        >说明：少于200元不赠送余额，只享受会员价格。
      </Typography.Text>
      <div style={{ marginBottom: '26px' }}>
      </div> 
      <Typography.Text
        style={{
          fontSize: '28px', // 设置字体大小
          fontFamily: '"KaiTi", "楷体", serif',
          marginLeft: '0px',
          fontWeight: 'bold', // 设置字重为粗体
          color: '#5B82D0', // 设置字体颜色
        }}
      >
        自定义充值:
      </Typography.Text>
      <div style={{ marginBottom: '20px' }}>
      </div> 
      <ProForm.Group>
      <ProFormText
        name="balance"
        label="充值金额"
        rules={[{ required: true, message: '请输入充值金额！' }]}
        style={{ width: 'calc(50%)' }}
      />
      <ProFormText
        name="bonusAmount"
        label="赠送金额"
        rules={[{ required: false, message: '请输入赠送金额！' }]}
        style={{ width: 'calc(50%)' }}
      />
      </ProForm.Group>
    </ModalForm>
  );
}
