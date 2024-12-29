/*
 * @Author: Maclane 1120268073@qq.com
 * @Date: 2024-03-18 22:37:18
 * @LastEditors: Maclane 1120268073@qq.com
 * @LastEditTime: 2024-04-19 10:42:36
 * @FilePath: \web-frontend\src\pages\base\members\InputDialog1\index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ModalForm, ProFormInstance, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';
import { useEffect, useRef } from 'react';
import { waitTime } from '@/utils/request';
import { updateMembers} from '@/services/api/member';

interface InputDialogProps1 {
    detailData?: API.MemberDTO;
    visible: boolean;
    onClose: (result: boolean) => void;
  }

export default function InputDialog1(props: InputDialogProps1) {
    const form = useRef<ProFormInstance>(null);
//预填数据的钩子 
    useEffect(() => {
        waitTime().then(() => {
          if (props.detailData) {
            const { password, ...otherFields } = props.detailData;
            form.current?.setFieldsValue(otherFields);
          } else {
            form?.current?.resetFields();
          }
        });
      }, [props.detailData, props.visible]);

    const onFinish = async (values: any) => {
    const { name, phone,password } = values;
    const data: API.MemberDTO = {
          memberId: props.detailData?.memberId,
          name,
          phone,
          password,
          balance:props.detailData?.balance, //不改变原值！
        };

    try {
      if (props.detailData) {
        await updateMembers(data, { throwError: true });
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
      title={'修改会员'}
      open={props.visible}
    >
      <ProFormText
        name="name"
        label="会员姓名"
        rules={[
          {
            required: true,
            message: '请输入会员姓名！',
          },
        ]}
      />
        <ProFormText
          name="phone"
          label="会员电话"
          rules={[
            {
              required: true,
              message: '请输入会员电话！',
            },
          ]}
        />
          <ProFormText
          name="password"
          label="会员密码"
          rules={[
            {
              message: '请输入会员密码！',
            },
          ]}
        />
    </ModalForm>
  );
}