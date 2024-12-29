import React, { useRef, useEffect, useState } from 'react';
import { ModalForm, ProFormSelect, ProFormInstance } from '@ant-design/pro-components';
import { message } from 'antd';
import { listServiceProjectsForNormal } from '@/services/api/serviceProjects';
import { consumeForPublic } from '@/services/api/member';

interface PublicConsumeDialogProps {
  visible: boolean;
  onClose: (result: boolean) => void;
}

interface ServiceProjectOption {
  label: string | undefined;
  value: number | undefined;
  barberName?: string; // 添加理发师名称属性
}

export default function PublicConsumeDialog(props: PublicConsumeDialogProps) {
  const form = useRef<ProFormInstance>(null);
  const [serviceProjects, setServiceProjects] = useState<ServiceProjectOption[]>([]);
  const [barbers, setBarbers] = useState<Array<{ label: string; value: string }>>([]);
  const [filteredServiceProjects, setFilteredServiceProjects] = useState<ServiceProjectOption[]>([]);

  useEffect(() => {
    const fetchServiceProjects = async () => {
      try {
        const response = await listServiceProjectsForNormal({ current: 1, pageSize: 1000 });
        if (response && response.list) {
          const barberSet = new Set<string>();
          const projectsWithOptions = response.list.map(project => {
            const projectName = project.projectName ?? '未知项目';
            const match = projectName.match(/\[(.*?)\]/);
            const barberName = match ? match[1] : '未指定';
  
            barberSet.add(barberName);
            return {
              label: `${projectName} - ￥${project.projectFee}`,
              value: project.id,
              barberName,
            };
          });
          setServiceProjects(projectsWithOptions);
          setBarbers(Array.from(barberSet).map(name => ({ label: name, value: name })));
        }
      } catch (error) {
        message.error('加载服务项目列表失败');
      }
    };
  
    fetchServiceProjects();
  }, []);

  const handleBarberChange = (barberName: string) => {
    const filteredProjects = serviceProjects.filter(project => project.barberName === barberName);
    setFilteredServiceProjects(filteredProjects);
  };

  const onFinish = async (values: any) => {
    try {
      await consumeForPublic({
        serviceProjectId: values.serviceProjectId,
      });
      message.success('大众消费记录成功');
      props.onClose(true);
    } catch (error) {
      message.error('大众消费记录失败');
      props.onClose(false);
    }
    return true;
  };

  return (
    <ModalForm
      width={600}
      title="大众消费"
      onFinish={onFinish}
      formRef={form}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => props.onClose(false),
      }}
      open={props.visible}
    >
      <ProFormSelect
        name="barber"
        label="选择理发师"
        options={barbers}
        fieldProps={{
          onChange: (value) => handleBarberChange(value as string),
        }}
        rules={[{ required: true, message: '请选择理发师' }]}
      />
      <ProFormSelect
        name="serviceProjectId"
        label="选择服务项目"
        options={filteredServiceProjects}
        rules={[{ required: true, message: '请选择一个服务项目' }]}
      />
    </ModalForm>
  );
}
