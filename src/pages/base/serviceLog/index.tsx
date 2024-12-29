import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import React, { useRef, useState } from 'react';
import { convertPageData, orderBy, waitTime } from '@/utils/request';
import { listLog } from '@/services/api/log';
import { cancelById } from '@/services/api/member';
import { Button,message } from 'antd';
import { MinusOutlined,ExportOutlined } from '@ant-design/icons';
import { downloadFile } from '@/utils/download-utils';

export default () => {
  const refAction = useRef<ActionType>(null);
  const [downloading, setDownloading] = useState(false);
  const [searchProps, setSearchProps] = useState<API.LogQueryDTO>({});
  const columns: ProColumns<API.LogVO>[] = [
    {
      title: '日志ID',
      dataIndex: 'logId',
      fixed: true,
      width: 100,
      search: false,
    },
    {
      title: '会员ID',
      dataIndex: 'memberId',
      sorter: true,
      fixed: true,
      width: 100,
    },
    {
      title: '操作',
      search: false,
      dataIndex: 'changeFlag',
      width: 120,
    },
    {
      title: '服务项目ID',
      search: false,
      dataIndex: 'serviceProjectId',
      width: 150,
    },
    {
      title: '服务项目名称',
      search: false,
      dataIndex: 'projectName',
      width: 150,
    },
    {
      title: '变动金额',
      dataIndex: 'changeAmount',
      search: false,
      width: 100,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      search: false,
      width: 200,
      ellipsis: true,
    },
    {
      title: '操作时间',
      width: 150,
      dataIndex: 'changeDate',
      valueType: 'date',
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Button
          type="primary"
          key="primary"
          danger
          icon={<MinusOutlined />}
          onClick={async () => {
            try {
              const result = await cancelById(
                {logId: record.logId as number}
              );
              if (result !== null && result !== undefined) {
              message.success('撤销成功');
              refAction.current?.reload();
              }
            } catch (error) {
              message.error('撤销失败: ');
            }
          }}
        >
          撤销
        </Button>,
      ]
    }
  ];

  const handleExport = () => {
    setDownloading(true);
    downloadFile(`/api/log/exportLog`, searchProps, '日志导出表.xls').then(() => {
      waitTime(1000).then(() => setDownloading(false));
    });
  };

  return (
    <PageContainer>
      <ProTable<API.LogVO>
        actionRef={refAction}
        rowKey="id"
        pagination={{
          defaultPageSize: 10,
        }}
        search={{
          labelWidth: 120,
        }}
        scroll={{ x: 100 }}
        request={async (params = {}, sort) => {
          console.log(sort);
          const props = {
            ...params,
            orderBy: orderBy(sort),
          };
          setSearchProps(props);
          return convertPageData(await listLog({ ...params, orderBy: orderBy(sort) }));
        }}
        toolBarRender={() => [
          <Button type="primary"  style={{backgroundColor:'green'}}   onClick={handleExport} loading={downloading}>
            <ExportOutlined /> 导出
          </Button>,
        ]}
        columns={columns}
      />
    </PageContainer>
  );
};