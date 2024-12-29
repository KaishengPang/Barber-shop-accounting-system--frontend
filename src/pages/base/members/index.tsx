
import React, { useState,useRef } from 'react';
import { Button, Modal, Form, Input, InputNumber, message } from 'antd';
import { PlusOutlined,DeleteOutlined,EditOutlined,UndoOutlined  } from '@ant-design/icons';
import { registerMember,listMembers, deleteMembers,cancelLastFinancialChange,rechargeForBonus  } from '@/services/api/member';
import { convertPageData, orderBy } from '@/utils/request';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { openConfirm } from '@/utils/ui';
import InputDialog1 from './InputDialog1';
import InputDialog2 from './InputDialog2';
import InputDialog3 from './InputDialog3';
import PublicConsumeDialog from './InputDialog4';

interface Member {
  memberId: number;
  name: string;
  phone: string;
  balance: number;
}

export default () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, selectRow] = useState<number[]>([]);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [Input2visible, setInput2Visible] = useState(false);
  const [Input3visible, setInput3Visible] = useState(false);
  const showModal = () => setIsModalVisible(true);
  const refAction = useRef<ActionType>(null);
  const [member1, setMember1] = useState<API.MemberVO>();
  const [member2, setMember2] = useState<API.MemberVO>();
  const [member3, setMember3] = useState<API.MemberVO>();
  const [publicConsumeVisible, setPublicConsumeVisible] = useState(false);
  const showPublicConsumeDialog = () => setPublicConsumeVisible(true);

  const columns: ProColumns<API.MemberVO>[] = [
    {
      title: '会员ID',
      dataIndex: 'memberId',
      width: 60,
      search: false,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 80,
      render: (dom, record) => {
        return (
          <a
            onClick={() => {
              setMember1(record);
              setVisible(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '电话号码',
      dataIndex: 'phone',
      width: 120,
    },
    {
      title: '余额',
      dataIndex: 'balance',
      width: 80,
      search: false,
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
      //render 函数在表格的每一行都会被调用，record 参数包含了当前行的所有数据，这里的record是免输入id的核心之一
        <Button type="primary" 
        icon={<PlusOutlined />}
        style={{backgroundColor:'green'}}  
        onClick={() => {
          setMember2(record);
          setInput2Visible(true);
        }}>
          充值
        </Button>,
        <Button type="primary" 
        icon={<EditOutlined />}
        style={{backgroundColor:'orange'}}  
        onClick={() => {
          setMember3(record);
          setInput3Visible(true);
        }}>
          消费
        </Button>,
      ],
    },
  ];

  const handleDelete = async () => {
    if (!selectedRowKeys?.length) return;
    openConfirm(`您确定删除${selectedRowKeys.length}条记录吗`, async () => {
      await deleteMembers(selectedRowKeys);
      message.success(`已成功删除${selectedRowKeys.length}条记录`);
      refAction.current?.reload();
      selectRow([]);
    });
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      // 调用注册会员的API，这里假设API直接返回新注册会员的ID（一个整数）
      const memberId = await registerMember({
        name: values.name,
        phone: values.phone,
        balance: values.balance,
        password: values.password,
      });
  
      // 确保返回了有效的会员ID
      if (typeof memberId === 'number' && memberId > 0) {
        message.success('会员注册成功');
        
        // 检查是否有赠送金额
        if (values.bonusAmount && values.bonusAmount > 0) {
          // 调用赠送金额的API
          await rechargeForBonus({
            memberId: memberId, // 直接使用返回的会员ID
            amount: values.bonusAmount,
          });
          message.success(`成功赠送${values.bonusAmount}金额到会员账户`);
        }
      } else {
        // 如果没有有效的会员ID，视为注册失败
        throw new Error('会员注册失败');
      }
      // 关闭模态框并重置表单
      setIsModalVisible(false);
      form.resetFields();
      // 重新加载列表
      refAction.current?.reload();
    } catch (error) {
      // 处理异常情况，显示错误消息
      console.error(error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };
  
  const handleCancelLastFinancialChange = async () => {
    try {
      const result = await cancelLastFinancialChange(); 
      if (result !== null && result !== undefined) { 
      message.success('最近的财务变动已成功撤销');
      refAction.current?.reload(); // 重新加载数据
    } }catch (error) {
      message.error('财务变动撤销失败');
    }
  
  };

  return (
    <PageContainer>
      <ProTable<API.MemberDTO>
        actionRef={refAction}
        rowKey="memberId"
        pagination={{
          defaultPageSize: 10,
        }}
        request={async (params = {}, sort) => {
          const props = {
            ...params,
            orderBy: orderBy(sort),
          };
          const originalData = await listMembers(props);
          // 过滤掉会员ID为0的数据
          const filteredData = convertPageData(originalData).data.filter((member: Member) => member.memberId !== 1);  //大众会员不显示
          // 返回过滤后的数据给ProTable
          return {
            ...convertPageData(originalData),
            data: filteredData,
          };
        }}
        
        columns={columns}
        rowSelection={{
          onChange: (rowKeys) => {
            selectRow(rowKeys as number[]);
          },
        }}
        toolBarRender={() => [
        <Button type="primary" icon={<EditOutlined />} onClick={showModal}>
          新建会员
        </Button>,
        <Button
            type="primary"
            icon={<EditOutlined />}
            style={{backgroundColor:'orange'}}  
            onClick={showPublicConsumeDialog} // 点击时显示PublicConsumeDialog
        >
        大众消费
        </Button>,
        <Button type="primary" icon={<UndoOutlined />} danger onClick={handleCancelLastFinancialChange}>
          撤销充值/消费
        </Button>,

        <Button
            type="primary"
            key="primary"
            danger
            onClick={handleDelete}
            disabled={!selectedRowKeys?.length}
          >
            <DeleteOutlined /> 删除
        </Button>,
      ]}

    />

    <Modal title="新建会员" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} forceRender>
      <Form form={form} layout="vertical" name="registerMemberForm">

        <Form.Item
          name="name"
          label="会员姓名"
          rules={[{ required: true, message: '请输入会员姓名' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phone"
          label="会员电话"
          rules={[{ required: true, message: '请输入会员电话' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="会员密码"
          rules={[{ required: true, message: '请输入会员密码(6位数字)' },
          { pattern: /^\d{6}$/, message: '密码必须是6位数字' }
          ]}
        >
          <Input.Password maxLength={6}/>
        </Form.Item>

        <Form.Item
          name="balance"
          label="首次充值金额"
          rules={[{ required: true, message: '请输入首次充值金额' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
        name="bonusAmount"
        label="赠送金额"
        rules={[{ required: false, message: '请输入赠送金额！' }]}
      >
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>
      </Form>


    </Modal>
    

      <InputDialog1
        detailData={member1}
        onClose={(result) => {
          setVisible(false);
          result && refAction.current?.reload();
        }}
        visible={visible}
      />

      <InputDialog2
        detailData={member2}
        visible={Input2visible}
        onClose={(result) => {
          setInput2Visible(false);
          result && refAction.current?.reload();
        }}
      />
      <InputDialog3
        detailData={member3}
        visible={Input3visible}
        onClose={(result) => {
          setInput3Visible(false);
          result && refAction.current?.reload();
        }}
      />
      <PublicConsumeDialog
        visible={publicConsumeVisible}
        onClose={(result) => {
          setPublicConsumeVisible(false);
          result && refAction.current?.reload();
        }} // 在关闭时更新状态
      />
    </PageContainer>
  );
};

