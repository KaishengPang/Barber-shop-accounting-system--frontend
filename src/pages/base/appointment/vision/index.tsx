import React, { useState, useEffect } from 'react';
import { Button, DatePicker, Form, message, Timeline } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { listAppointment } from '@/services/api/appointment';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import zhLocale from '@fullcalendar/core/locales/zh-cn';
import dayGridPlugin from '@fullcalendar/daygrid'; 

const { RangePicker } = DatePicker;
interface CalendarEvent {
  id: string ;
  title: string | undefined;
  start: string | undefined;
  end: string | undefined;
  color: string;
}
//定义日历事件的类型

export default function AppointmentsPage() {
  const navigate = useNavigate();
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  //对象数组，并且初始状态为空数组
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([dayjs().subtract(1, 'month'), dayjs()]); //打开页面时立即看到最近一个月的数据或事件

  useEffect(() => {
    if (dateRange[0] && dateRange[1]) {
      fetchAppointments(dateRange[0], dateRange[1]);
    }
  }, [dateRange]);

  const fetchAppointments = async (start:any, end:any) => {
    try {
      const response = await listAppointment({
        current: 1,
        pageSize: 1000,
        appointmentStartTime: start.format('YYYY-MM-DD HH:mm:ss'),
        appointmentEndTime: end.format('YYYY-MM-DD HH:mm:ss'),
      });
      if (response && response.list) {
        //用于遍历数组中的每个元素，并对每个元素执行提供的函数，最后返回一个新的数组
        const events = response.list.map((appointment, index) => ({
          //map不会改变原来的数组
          id: appointment.appointmentId?.toString()|| `default-id-${index}`,  //确保每个事件都有一个唯一标识符
          title: appointment.projectName,
          start: appointment.appointmentStartTime,
          end: appointment.appointmentEndTime,
          color: `hsl(${Math.random() * 360}, 70%, 70%)`, // 随机颜色
        }));
        setCalendarEvents(events); // 更新用于 FullCalendar 的事件数据
      } else {
        setCalendarEvents([]);
      }
    } catch (error) {
      message.error('获取预约列表失败');
    }
  };

  return (
    <PageContainer>
      <Form layout="inline" style={{ marginBottom: '16px' }}>
        <Form.Item label="选择时间范围">
        <RangePicker
          showTime={{ format: 'HH:mm:ss' }}
          value={dateRange}
          onChange={(dates) => {
            if (dates) {
              setDateRange([dayjs(dates[0]), dayjs(dates[1])]);
              fetchAppointments(dayjs(dates[0]), dayjs(dates[1]));
              //set+fetch以获取新日期范围内的预约数据
            }
          }}
          format="YYYY-MM-DD HH:mm:ss"
        />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            onClick={() => fetchAppointments(dateRange[0], dateRange[1])}
          >
            查询
          </Button>
        </Form.Item>
      </Form>
      <Button style={{ marginBottom: '16px' }} onClick={() => navigate(-1)}>
        返回
      </Button>
      <FullCalendar
        plugins={[timeGridPlugin, timelinePlugin,dayGridPlugin]} // 确保 timeGridPlugin 在数组中
        height={650}
        initialView="timeGridWeek" // 设置初始视图为 "timeGridWeek"
        locale={zhLocale}
        slotMinWidth={100}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridDay,timeGridWeek,dayGridMonth'
        }}
        events={calendarEvents}
        eventContent={(eventInfo) => (
          <div className="custom-event" style={{ minWidth: '300px !important' }}>
            <b>{eventInfo.event.title}</b>
          </div>
        )}
        nowIndicator
        editable
        selectable
      />
    </PageContainer>
  );
}
