import React, { useState, useRef } from 'react';
import { Button, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { openConfirm } from '@/utils/ui';
import { listAppointment, deleteAppointment } from '@/services/api/appointment'; 
import { convertPageData, orderBy } from '@/utils/request';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import InputDialog from '../InputDialog'; 
import { useNavigate } from 'react-router-dom';

export default function AppointmentsPage() {
  const refAction = useRef<ActionType>(null);
  const [selectedRowKeys, selectRow] = useState<number[]>([]);
  const [appointmentDetails, setAppointmentDetails] = useState<API.AppointmentVO>(); 
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const columns: ProColumns<API.AppointmentVO>[] = [
    {
      title: '预约ID',
      dataIndex: 'appointmentId',
      width: 100,
      search: false,
    },
    {
      title: '会员ID',
      dataIndex: 'memberId',
      width: 100,
    },
    {
        title: '项目id',
        dataIndex: 'serviceProjectId',
        width: 100,
        search: false,
    },
    {
        title: '项目名称',
        dataIndex: 'projectName',
        width: 200,
    },
    {
        title: '开始时间',
        dataIndex: 'appointmentStartTime',
        width: 200,
    },
    {
        title: '结束时间',
        dataIndex: 'appointmentEndTime',
        width: 200,
    },
    {
        title: '状态',
        dataIndex: 'status',
        width: 200,
    },
    {
        title: '备注',
        dataIndex: 'remark',
        width: 200,
        search: false,
    },
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Button
          type="primary"
          key="primary"
          onClick={() => {
            setAppointmentDetails(record);
            setVisible(true);
          }}
        >
          修改
        </Button>,
      ],
    },
  ];

  const handleDelete = async () => {
    if (!selectedRowKeys?.length) return;
    openConfirm(`您确定删除${selectedRowKeys.length}条记录吗`, async () => {
      await deleteAppointment(selectedRowKeys);
      message.success(`已成功删除${selectedRowKeys.length}条记录`);
      refAction.current?.reload();
      selectRow([]);
    });
  };

  return (
    <PageContainer>
      <Button style={{ alignSelf: 'flex-start', marginBottom: '16px' }} onClick={() => navigate(-1)}>
        返回
      </Button>
      <ProTable<API.AppointmentVO>
        actionRef={refAction}
        rowKey="appointmentId"
        pagination={{
          defaultPageSize: 10,
        }}
        request={async (params = {}, sort) => {
          const props = { ...params, orderBy: orderBy(sort) };
          try {
            const response = await listAppointment(props); 
            return convertPageData(response);
          } catch (error) {
            message.error("获取预约列表失败");
            return { data: [], total: 0, success: true };
          }
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setAppointmentDetails(undefined);
              setVisible(true);
            }}
          >
            <PlusOutlined /> 新建预约
          </Button>,
          <Button
            type="primary"
            key="primary"
            danger
            onClick={handleDelete}
            disabled={!selectedRowKeys?.length}
          >
            <DeleteOutlined /> 删除预约
          </Button>,
        ]}
        columns={columns}
        rowSelection={{
          onChange: (rowKeys) => {
            selectRow(rowKeys as number[]);
          },
        }}
      />
      <InputDialog
        detailData={appointmentDetails}
        onClose={(result:any) => {
          setVisible(false);
          if (result) refAction.current?.reload();
        }}
        visible={visible}
      />
    </PageContainer>
  );
}
