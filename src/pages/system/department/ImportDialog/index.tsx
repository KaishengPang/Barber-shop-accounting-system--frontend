import { ModalForm, ProFormInstance } from '@ant-design/pro-components';
import { Form, message } from 'antd';
import { useRef } from 'react';

interface InputDialogProps {
  visible: boolean;
  onClose: (result?: number) => void;
}

export default (props: InputDialogProps) => {
  const form = useRef<ProFormInstance>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const onFinish = async (values: any) => {
    if (!inputFileRef?.current?.files?.length) {
      message.error('请选择文件');
      return;
    }
    const formData = new FormData();
    formData.append('file', inputFileRef.current.files[0], inputFileRef.current.files[0].name);

    const result = await fetch('/api/department/importDepartment', {
      method: 'POST',
      body: formData,
    });

    const json = await result.json();

    if (json?.success) {
      message.success(`上传成功，共导入${json?.data || 0}条数据`);
      props.onClose(json?.data || 0);
      return true;
    }

    message.error(json?.errorMessage);
    return false;
  };
  return (
    <ModalForm
      width={600}
      onFinish={onFinish}
      formRef={form}
      layout="horizontal"
      modalProps={{
        destroyOnClose: true,
        onCancel: () => props.onClose(undefined),
      }}
      title="导入读者账户数据"
      open={props.visible}
    >
      <Form.Item label="Excel文件：" rules={[{ required: true, message: '请选择上传文件' }]}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <input type="file" ref={inputFileRef} style={{ flex: 1 }} />
        </div>
      </Form.Item>
    </ModalForm>
  );
};
