import React, { useEffect, useRef,useState } from 'react';
import { message } from 'antd';
import { ModalForm, ProFormText, ProFormSelect, ProFormDateTimePicker,ProFormInstance } from '@ant-design/pro-components';
import { create, updateAppointment } from '@/services/api/appointment';
import { waitTime } from '@/utils/request';
import { listServiceProjects } from '@/services/api/serviceProjects';

interface InputDialogProps {
  detailData?: API.AppointmentDTO;
  visible: boolean;
  onClose: (result: boolean) => void;
}
interface ServiceProjectOption {
  label: string;
  value: number;
}
export default function InputDialog(props: InputDialogProps) {
  const form = useRef<ProFormInstance>(null);
  const [serviceProjects, setServiceProjects] = useState<ServiceProjectOption[]>([]);

  useEffect(() => {
    waitTime().then(() => {
      if (props.detailData) {
        form.current?.setFieldsValue(props.detailData);
      } else {
        form?.current?.resetFields();
      }
    });
    if (props.visible) {
      fetchServiceProjects();
    }
  }, [props.detailData, props.visible]);

  const fetchServiceProjects = async () => {
    try {
      const response = await listServiceProjects({ current: 1, pageSize: 1000 });
      if (response && response.list) {
        const options = response.list.map(project => ({
          label: project.projectName|| '未知项目',
          value: project.id|| 0,
        }));
        setServiceProjects(options);
      }
    } catch (error) {
      message.error('获取服务项目列表失败');
    }
  };
    const onFinish = async (values: any) => {
        const { memberId,serviceProjectId,projectName,appointmentStartTime,appointmentEndTime,status,remark } = values;
        const data: API.AppointmentDTO = {
              appointmentId: props.detailData?.appointmentId,
              memberId,
              serviceProjectId,
              projectName,
              appointmentStartTime,
              appointmentEndTime,
              status,
              remark
            };

    try {
        if(props.detailData){
            await updateAppointment(data,{ throwError: true });
        }else{
            await create(data,{ throwError: true });
        }
      message.success('预约信息更新成功');
      props.onClose(true);
    } catch (error) {
      message.error('预约信息更新失败');
      props.onClose(false);
    }
  };

  return (
    <ModalForm
      title={props.detailData?.appointmentId ? '编辑预约' : '新建预约'}
      formRef={form}
      onFinish={onFinish}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => props.onClose(false),
      }}
      open={props.visible}
    >
      <ProFormText 
        name="memberId" 
        label="会员ID" 
        rules={[
            {
              required: true,
              message: '请输入会员ID！',
            },
          ]}
      />
      <ProFormSelect
        name="serviceProjectId"
        label="服务项目"
        options={serviceProjects}
        rules={[{ required: true, message: '请选择服务项目！' }]}
      />


      <ProFormDateTimePicker 
      name="appointmentStartTime" 
      label="预约开始时间" 
      rules={[
        {
          required: true,
          message: '请选择预约开始时间！',
        },
      ]}
      />
      <ProFormDateTimePicker 
      name="appointmentEndTime" 
      label="预约结束时间" 
      rules={[
        {
          required: true,
          message: '请选择预约结束时间！',
        },
      ]}
      />
      <ProFormSelect 
      name="status" 
      label="状态" 
      options={[
      { value: '预约中', label: '预约中' }, 
      { value: '预约成功', label: '预约成功' },
      { value: '预约失败', label: '预约失败' },
      { value: '已完成', label: '已完成' },
      ]} 
      rules={[
        {
          required: true,
          message: '请选择状态！',
        },
      ]}
      />
      <ProFormText name="remark" label="备注" />
    </ModalForm>
  );
}
