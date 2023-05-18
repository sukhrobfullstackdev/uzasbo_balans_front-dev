import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar as AntdCalendar, Spin } from 'antd';
import Card from '../../components/MainCard';

const Calendar = () => {
const { t } = useTranslation();

  return (
    <Card  title={t("Calendar")}>
      <Spin  size='large'  spinning={false}>
        <AntdCalendar 
          className='holidays-calendar'
        />
      </Spin>
    </Card>
  );
};

export default Calendar;