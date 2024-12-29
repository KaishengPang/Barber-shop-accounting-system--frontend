import React, { useState,useRef } from 'react';
import { Button, message } from 'antd';
import { PlusOutlined,DeleteOutlined } from '@ant-design/icons';
import { openConfirm } from '@/utils/ui';
import { listServiceProjects,deleteServiceProjects } from '@/services/api/serviceProjects';
import { convertPageData, orderBy } from '@/utils/request';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import InputDialog from '../InputDialog';
import { useNavigate } from 'react-router-dom';

export default () => {
  const refAction = useRef<ActionType>(null);
  const [selectedRowKeys, selectRow] = useState<number[]>([]);
  const [serviceProjects, setServiceProjects] = useState<API.ServiceProjectsVO>();
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const columns: ProColumns<API.ServiceProjectsVO>[] = [
    {
      title: '项目ID',
      dataIndex: 'id',
      width: 100,
      search: false,
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
      width: 200,
      render: (dom, record) => {
        return (
          <a
            onClick={() => {
              setServiceProjects(record);
              setVisible(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '项目费用',
      dataIndex: 'projectFee',
      width: 100,
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 150,
      search: false,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      width: 150,
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
          setServiceProjects(record);
          setVisible(true);
        }}
      >
        修改
      </Button>
      ],
    },
  ];

  const handleDelete = async () => {
    if (!selectedRowKeys?.length) return;
    openConfirm(`您确定删除${selectedRowKeys.length}条记录吗`, async () => {
      await deleteServiceProjects(selectedRowKeys);
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
      <ProTable<API.ServiceProjectsVO>
        actionRef={refAction}
        rowKey="id"
        pagination={{
          defaultPageSize: 10,
        }}
        request={async (params = {}, sort) => {
          const props = { ...params, orderBy: orderBy(sort) };
          try {
            const response = await listServiceProjects(props);

            if (response?.list) {
              const filteredData = response.list.filter(project => 
                project.projectName && !project.projectName.includes("非会员")
              );
              
              return convertPageData({ ...response, list: filteredData });
            }
          } catch (error) {
            message.error("获取服务项目列表失败");
          }
          return { data: [], total: 0, success: true };
        }}
        toolBarRender={() => [
          <Button
          type="primary"
          key="primary"
          onClick={() => {
            setServiceProjects(undefined);
            setVisible(true);
          }}
        >
          <PlusOutlined /> 新建
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
        columns={columns}
        rowSelection={{
          onChange: (rowKeys) => {
            selectRow(rowKeys as number[]);
          },
        }}
      />
      <InputDialog
        detailData={serviceProjects}
        onClose={(result) => {
          setVisible(false);
          result && refAction.current?.reload();
        }}
        visible={visible}
      />
    </PageContainer>
  );

}