/*
 * @Author: Maclane 1120268073@qq.com
 * @Date: 2024-03-15 21:57:45
 * @LastEditors: Maclane 1120268073@qq.com
 * @LastEditTime: 2024-03-20 23:30:53
 * @FilePath: \web-frontend\config\defaultSettings.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Settings as LayoutSettings } from '@ant-design/pro-components';

/**
 * @name
 */
const Settings: LayoutSettings & {
  pwa?: boolean;
} = {
  navTheme: 'light',
  // 拂晓蓝
  colorPrimary: '#1890ff',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: '理发店记账系统',
  pwa: false,
  iconfontUrl: '',
  footerRender: false
};

export default Settings;
