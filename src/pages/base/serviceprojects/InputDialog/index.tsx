import React, { useEffect, useRef } from 'react';
import { ModalForm, ProFormText, ProFormSelect, ProForm } from '@ant-design/pro-components';
import { FormInstance,message, Select } from 'antd';
import { waitTime } from '@/utils/request';
import { createServiceProject, updateServiceProject } from '@/services/api/serviceProjects';

interface InputDialogProps {
  detailData?: API.ServiceProjectsDTO;
  visible: boolean;
  onClose: (result: boolean) => void;
}

const projectTypeOptions = [
  { value: '会员', label: '会员' },
  { value: '非会员', label: '非会员' },
];

export default function InputDialog(props: InputDialogProps) {
  const form = useRef<FormInstance>(null);
  
  useEffect(() => {
    waitTime().then(() => {
      if (props.detailData) {
        // 使用更新的正则表达式来解析项目名称、理发师姓名和项目类型
        const regex = /^(.*?)\[(.*?)\]（(会员|非会员)）$/;
        const matches = props.detailData.projectName?.match(regex);
        if (matches) {
          const [, name, barberName, type] = matches;
          form.current?.setFieldsValue({
            projectName: name,
            barberName: barberName || '', // 如果没有匹配到理发师姓名，则默认为空字符串
            projectType: type || '会员', // 如果没有匹配到项目类型，则默认为"会员"
            projectFee: props.detailData.projectFee,
          });
        } else {
          // 如果没有匹配到理发师姓名和项目类型的格式，假设整个字符串就是项目名称
          form.current?.setFieldsValue({
            projectName: props.detailData.projectName,
            projectType: '会员', // 默认为会员
            projectFee: props.detailData.projectFee,
          });
        }
      } else {
        form.current?.resetFields();
      }
    });
  }, [props.detailData, props.visible]);
  


  const onFinish = async (values: any) => {
    let { projectName, projectType, barberName } = values;
    projectName =projectName + `[${barberName}]` + `（${projectType}）` ;

    const data: API.ServiceProjectsDTO = {
      id: props.detailData?.id,
      projectName,
      projectFee: values.projectFee,
    };

    try {
      if (props.detailData) {
        await updateServiceProject(data, { throwError: true });
      } else {
        await createServiceProject(data, { throwError: true });
      }
      message.success('保存成功');
      props.onClose(true);
    } catch (ex) {
      message.error('保存失败');
      return false;
    }

    return true;
  };

  return (
    <ModalForm
      width={600}
      formRef={form}
      onFinish={onFinish}
      modalProps={{
        onCancel: () => props.onClose(false),
        destroyOnClose: true,
      }}
      title={props.detailData ? '修改项目' : '新建项目'}
      open={props.visible}
    >
    <ProForm.Group>
      <ProFormText
        name="projectName"
        label="项目名称："
        rules={[{ required: true, message: '请输入项目名称！' }]}
        style={{ width: 'calc(50%)' }}
      />
      <ProFormText
        name="barberName"
        label="理发师姓名："
        rules={[{ required: false, message: '请输入理发师姓名！' }]}
        style={{ width: 'calc(50%)' }}
      />
      </ProForm.Group>
      <ProForm.Group>
      <ProFormSelect
        name="projectType"
        label="项目类型："
        options={projectTypeOptions}
        rules={[{ required: true, message: '请选择项目类型！' }]}
        style={{ width: 'calc(50%)' }}
      />
      <ProFormText
        name="projectFee"
        label="项目价格："
        rules={[{ required: true, message: '请输入项目价格！' }]}
        style={{ width: 'calc(50%)' }}
      />
      </ProForm.Group>
    </ModalForm>
  );
}
