# 理发店记账系统-前端

本项目基于课程：山东大学信息学院崇新学堂-2024Spring-开放性创新与实践1-软件部分-前端

## 项目要求介绍-理发店记账系统

- 理发店老板现在用 Excel 记录会员充值信息，每次客户消费手动扣除计算余额在写会 Excel 文件。请帮他实现消费的记账管理功能。

### (1) 要求：运行在单机笔记本上
- [x] **会员表字段**：会员ID、手机号、姓名、余额、创建日期、密码  
- [x] **服务项目表**：ID、项目名称、项目费用、创建日期、更新日期  
- [x] **余额变动日志**：日志ID、会员ID、充值/消费标志、服务项目ID、变动金额、备注、变动日期  

### (2) 实现功能
- [x] 开通会员、会员充值功能  
- [x] 充值撤销功能（撤销后余额要改）  
- [x] 会员查询、会员列表、会员管理  

### (3) 服务项目维护
- [x] 服务项目的增删改查  

### (4) 会员消费功能
- [x] 服务项目下拉选择  
- [x] 消费撤销功能（撤销后余额要改）  

### (5) 日志查询
- [x] 会员消费/充值日志分页面查询及数据导出 Excel 文件  

### (6) 理发店年盈利统计
- [x] 根据输入的年份，统计该年每个月的盈利。

## 技术介绍
后端：Springboot 3+ , jdk17+, Mybatis, openAPI 3

## 项目现有功能

- [x] 开通会员  
- [x] 会员消费密码（六位的数字密码）  
- [x] 会员信息列表分页显示  
- [x] 根据会员姓名与电话号码进行模糊查询  
- [x] 会员对应行修改  
- [x] 选择删除会员  
- [x] 会员对应行充值  
- [x] 赠送充值  
- [x] 三种自动优惠充值方式  
- [x] 选择理发师选择  
- [x] 根据理发师姓名选择项目  
- [x] 会员消费密码确认  
- [x] 消费时余额不足项目无法被选择  
- [x] 提供大众消费的方式，计入盈利  
- [x] 统一实现一键撤销，只能撤销上一次的操作  
- [x] 服务项目分页面展示  
- [x] 服务项目增删改查，对应行修改  
- [x] 将项目名称内容丰富，继续存储理发师姓名与项目类型  
- [x] 服务项目分组管理（VIP、非VIP和理发师三组）  
- [x] 会员消费/充值日志根据会员ID与操作时间分页查询  
- [x] 加入一列服务项目名称，统计理发师业绩  
- [x] 数据导出 Excel 文件  
- [x] 根据年份统计每月盈利  
- [x] 根据自定义时间段统计每天盈利  
- [x] 根据理发师姓名以及自定义时间段统计理发师业绩  
- [x] 进行预约明细管理，包括增删改查  
- [x] 根据选定的时间范围实现预约的日历可视化  


## 技术说明

本项目基于Ant design pro改造，支持操作员权限配置，和web-backend配套使用

## Environment Prepare

Install `node_modules`:

```bash
npm install
```

or

```bash
yarn
```

## Provided Scripts

Ant Design Pro provides some useful script to help you quick start and build with web project, code style check and test.

Scripts provided in `package.json`. It's safe to modify or add additional script:

### Start project

```bash
npm start
```

### Build project

```bash
npm run build
```

### Check code style

```bash
npm run lint
```

You can also use script to auto fix some lint error:

```bash
npm run lint:fix
```

### Test code

```bash
npm test
```

## More

You can view full document on our [official website](https://pro.ant.design). And welcome any feedback in our [github](https://github.com/ant-design/ant-design-pro).
