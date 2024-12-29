import { ModalForm, ProForm, ProFormInstance, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';
import { useEffect, useRef } from 'react';
import { waitTime } from '@/utils/request';
import { addDepartment, updateDepartment } from '@/services/api/department';

interface InputDialogProps {
  detailData?: API.DepartmentDTO;
  visible: boolean;
  onClose: (result: boolean) => void;
}

export default function InputDialog(props: InputDialogProps) {
  const form = useRef<ProFormInstance>(null);

  useEffect(() => {
    waitTime().then(() => {
      if (props.detailData) {
        form?.current?.setFieldsValue(props.detailData);
      } else {
        form?.current?.resetFields();
      }
    });
  }, [props.detailData, props.visible]);

  const onFinish = async (values: any) => {
    const { departmentName, description, contact, contactPhone } = values;
    const data: API.DepartmentDTO = {
      id: props.detailData?.id,
      contact,
      departmentName,
      contactPhone,
      description,
    };

    try {
      if (props.detailData) {
        await updateDepartment(data, { throwError: true });
      } else {
        await addDepartment(data, { throwError: true });
      }
    } catch (ex) {
      return true;
    }

    props.onClose(true);
    message.success('保存成功');
    return true;
  };

  return (
    <ModalForm
      width={600}
      onFinish={onFinish}
      formRef={form}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => props.onClose(false),
      }}
      title={props.detailData ? '修改部门' : '新建部门'}
      open={props.visible}
    >
      <ProFormText
        name="departmentName"
        label="部门名称"
        rules={[
          {
            required: true,
            message: '请输入部门名称！',
          },
        ]}
      />
      <ProForm.Group>
        <ProFormText
          name="contact"
          label="联系人"
          rules={[
            {
              required: true,
              message: '请输入联系人名称！',
            },
          ]}
        />
        <ProFormText
          name="contactPhone"
          label="联系电话"
          rules={[
            {
              required: true,
              message: '请输入联系人名称！',
            },
          ]}
        />
      </ProForm.Group>
      <ProFormText name="description" label="备注" />
    </ModalForm>
  );
}
