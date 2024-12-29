import { ActionType,ModalForm, ProFormSelect, ProFormInstance,ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';
import React, { useRef, useEffect, useState } from 'react';
import { consume } from '@/services/api/member';
import { listServiceProjects } from '@/services/api/serviceProjects';
import { getMember } from '@/services/api/member';
import InputDialog2 from '../InputDialog2';

interface ConsumeDialogProps {
  detailData?: API.MemberDTO;
  visible: boolean;
  onClose: (result: boolean) => void;
}
interface ServiceProjectOption {
    label: string | undefined;
    value: number | undefined;
    barberName?: string;
  }

//标准化传入的属性和内部使用的数据结构

export default function ConsumeDialog(props: ConsumeDialogProps) {
  const form = useRef<ProFormInstance>(null);
  const refAction = useRef<ActionType>(null);
//useRef 用来存储对表单实例（form）和操作类型（refAction）的引用。这些引用可用于触发重新渲染或访问表单数据。
  const [serviceProjects, setServiceProjects] = useState<ServiceProjectOption[]>([]);
  const [isRechargeDialogVisible, setIsRechargeDialogVisible] = useState(false);
  const [barbersOptions, setBarbersOptions] = useState([{ label: '', value: '' }]);
  const [filteredServiceProjects, setFilteredServiceProjects] = useState<ServiceProjectOption[]>([]);
//useState 用于管理多个状态：
// serviceProjects 存储从 API 获取的服务项目选项数组。
// isRechargeDialogVisible 用于控制是否显示充值对话框。
// barbersOptions 存储理发师选项。
// filteredServiceProjects 存储过滤后的服务项目数组。

  useEffect(() => {
//useEffect 在组件加载和相关依赖变化时触发，用于异步获取服务项目数据。
    const fetchServiceProjects = async () => {
      try {
        let memberBalance = 0;
        if (props.detailData && typeof props.detailData.memberId === 'number') {
        //typeof用来判断类型
          const memberResponse = await getMember({ memberId: props.detailData.memberId });
          if (memberResponse && typeof memberResponse.balance === 'number') {
            memberBalance = memberResponse.balance; //提取 balance（余额）并保存到本地变量
          }
        }
    
        const response = await listServiceProjects({ current: 1, pageSize: 1000 });
        if (response && response.list) {
          const barberSet = new Set<string>(); //存储不重复的理发师名字
          const projectsWithOptions: ServiceProjectOption[] = response.list.map(project => {
            //遍历服务项目列表，对每个项目使用正则表达式从项目名称中提取理发师的名字
            const match = project.projectName?.match(/\[(.*?)\]/); // 正则表达式：\[ 和 \] 是对方括号的转义字符，(.*?) 是一个捕获组
            const barberName = match ? match[1] : '未知';
            barberSet.add(barberName);
            return {
              label: `${project.projectName} - ￥${project.projectFee || 0}`,
              value: project.id,
              barberName, // 确保每个项目都有一个barberName属性
              disabled: (project.projectFee || 0) > memberBalance  //消费不起的不能被选择
            };
          });

          // 更新状态
          setServiceProjects(projectsWithOptions); // 存储所有服务项目列表
          const barbersOptions = Array.from(barberSet).map(name => ({
            label: name, //显示给用户看的文本
            value: name  //实际代表这个选项的值
          }));
          setBarbersOptions(barbersOptions);

          // 默认情况下，所有服务项目都是可用的
          setFilteredServiceProjects(projectsWithOptions);
        }
      } catch (error) {
      }
    };
    fetchServiceProjects();
  }, [props.visible,props.detailData?.memberId]); //依赖项：当对话框可见性或memberId变化时执行

  const handleBarberChange = (value: string) => {
    const filteredProjects = serviceProjects.filter(project => project.barberName === value); //检查每个服务项目的 barberName 属性是否等于用户选择的理发师的名字。
    setFilteredServiceProjects(filteredProjects);
  };

  const updateServiceProjects = async () => {  //逻辑相同--fetchServiceProjects
    try {
      let memberBalance = 0;
      if (props.detailData && typeof props.detailData.memberId === 'number') {
        const memberResponse = await getMember({ memberId: props.detailData.memberId });
        if (memberResponse && typeof memberResponse.balance === 'number') {
          memberBalance = memberResponse.balance;
        }
      }
      const response = await listServiceProjects({ current: 1, pageSize: 1000 });
      if (response && response.list) {
        const projectsWithOptions = response.list.map(project => ({
          label: `${project.projectName} - ￥${project.projectFee || 0}`,
          value: project.id,
          disabled: (project.projectFee || 0) > memberBalance
        }));
        setServiceProjects(projectsWithOptions);
        setFilteredServiceProjects(projectsWithOptions);
      } else {
        setServiceProjects([]);
        setFilteredServiceProjects([]);
      }
    } catch (error) {
      message.error('加载服务项目列表失败');
      setServiceProjects([]);
      setFilteredServiceProjects([]);
    }
  };
  
  const onFinish = async (values: any) => {
    try {
      if (props.detailData && props.detailData.memberId && values.serviceProjectId) {
        const result = await consume({
          memberId: props.detailData.memberId,
          serviceProjectId: values.serviceProjectId,
          password: values.password,
        });
   //最重要的一步！！！这里的判断太需要注意，因为返回的是一个数，检查null，显示的是null但是却是undefined！
        if (result !== null && result !== undefined) {
          message.success('消费成功');
          props.onClose(true);
          await updateServiceProjects();
        } else {
          throw new Error('消费失败');
        }
      } 
    } catch (ex) {
      message.error( '消费失败');
      console.error('Consume failed:', ex);
      props.onClose(false);
    }
    return true;
  };
  

  const handleRechargeDialogClose = (result: boolean) => {
    setIsRechargeDialogVisible(false);
    updateServiceProjects();
    refAction.current?.reload();
  };

  return (
    <ModalForm
      width={600}
      title="会员消费"
      onFinish={onFinish}
      formRef={form} 
//用于在组件之外访问和操作表单的实例，在提交表单或表单验证之前获取表单的值
      modalProps={{
        destroyOnClose: true,
        onCancel: () => props.onClose(false),
      }}
      open={props.visible}
    >
      <ProFormSelect
        name="barber"
        label="选择理发师"
        options={barbersOptions}
        fieldProps={{
          onChange: (value) => handleBarberChange(value as string),  //类型断言，传入handleBarberChange
        }}
        rules={[{ required: true, message: '请选择理发师' }]}
      />

      <ProFormSelect
        name="serviceProjectId"
        label="选择服务项目"
        options={filteredServiceProjects} // 使用过滤后的服务项目列表
        rules={[{ required: true, message: '请选择一个服务项目' }]}
      />

      <ProFormText
        name="password"
        label="密码"
        fieldProps={{
          type: 'password',
        }}
        rules={[{ required: true, message: '请输入会员密码(6位数字)' },
        { pattern: /^\d{6}$/, message: '密码必须是6位数字' }
      ]}
      />
        <InputDialog2
        detailData={props.detailData}
        visible={isRechargeDialogVisible}
        onClose={handleRechargeDialogClose}
      />
    </ModalForm>
    
  );
}
