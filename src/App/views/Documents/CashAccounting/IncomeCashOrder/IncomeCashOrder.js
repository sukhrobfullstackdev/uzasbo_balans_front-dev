import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Form, Button, DatePicker, Spin, Tooltip } from "antd";
import Fade from "react-reveal/Fade";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useLocation, Link } from "react-router-dom";
import { CSSTransition } from 'react-transition-group';

import { getListStartAction, setListFilterType, setListFilter } from './_redux/getListSlice';
import GetListTable from './components/GetListTable';
import Card from "../../../../components/MainCard";
import FilterModal from './components/FilterModal';
import { Notification } from '../../../../../helpers/notifications';
import HelperServices from "../../../../../services/Helper/helper.services";

let addBtn;

const IncomeCashOrder = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [filterForm] = Form.useForm();
  const dispatch = useDispatch();
  const tableList = useSelector((state) => state.IncomeCashOrderList);
  const tablePagination = tableList?.paginationData;
  const tableFilterData = tableList?.filterData;
  const mainLoader = tableList?.mainLoader;
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [statusList, setStatusList] = useState([]);

  useEffect(() => {
    const getFilterParamData = async () => {
      const [stsList, ] = await Promise.all([
        HelperServices.getStatusList(),

      ]);
      setStatusList(stsList.data);
    }
    getFilterParamData().catch(err => Notification('error', err))
  }, []);

  useEffect(() => {
    dispatch(
      getListStartAction({
        ...tablePagination,
        ...tableFilterData,
      })
    );
  }, [dispatch, tablePagination, tableFilterData]);

  // const filterTypeHandler = (value) => {
  //   setFilterType(value);
  // }

  const onFinish = (values) => {
    values.StartDate = values.StartDate.format("DD.MM.YYYY");
    values.EndDate = values.EndDate.format("DD.MM.YYYY");
    dispatch(setListFilterType({
      filterType: values?.filterType,
    }));
    dispatch(setListFilter({
      ...values,
      Status: values?.Status,
      [values?.filterType]: values?.Search,
      StartDate: values?.StartDate,
      EndDate: values?.EndDate,
    }));
  };


  // Filter modal
  const submitFilterDataHandler = (modalValues) => {
    filterForm.validateFields()
      .then(values => {
        onFinish({ ...values, ...modalValues });
      })
    setFilterModalVisible(false);
  }
  return (
    <Spin size='large' spinning={mainLoader}>
      <Card title={t("IncomeCashOrder")}>
        <Fade>
          <Form
            layout='vertical'
            form={filterForm}
            onFinish={onFinish}
            className='table-filter-form'
            initialValues={{
              ...tableFilterData,
              // Search: filterSearchVal,
              StartDate: moment(tableFilterData.StartDate, 'DD.MM.YYYY'),
              EndDate: moment(tableFilterData.EndDate, 'DD.MM.YYYY'),
            }}
          >
            <div className="main-table-filter-wrapper">
              <Form.Item
                name="StartDate"
                label={t("startDate")}
              >
                <DatePicker
                  format="DD.MM.YYYY"
                  className='datepicker'
                  placeholder={t("startDate")}
                />
              </Form.Item>

              <Form.Item
                name="EndDate"
                label={t("endDate")}
              >
                <DatePicker
                  format="DD.MM.YYYY"
                  className='datepicker'
                  placeholder={t("endDate")}
                />
              </Form.Item>

              <Form.Item>
                <Tooltip title={t('filter')}>
                  <Button type="primary" onClick={() => setFilterModalVisible(true)}>
                    <i className="feather icon-filter" />
                  </Button>
                </Tooltip>
              </Form.Item>

              <Form.Item>
                <Tooltip title={t('refresh')}>
                  <Button type="primary" htmlType="submit">
                    <i className="feather icon-refresh-ccw" />
                  </Button>
                </Tooltip>
              </Form.Item>
              <Form.Item>
              <Tooltip title={t('add-new')}>
                  <Button type="primary">
                      <Link to={`${location.pathname}/add?id=0`}>
                        
                          <i className="fa fa-plus" aria-hidden="true" />
                      </Link>
                  </Button>
                  </Tooltip>
              </Form.Item>

              <Form.Item>

                <Button type="primary" className="main-table-filter-element">
                  {addBtn}
                </Button>

              </Form.Item>
            </div>
          </Form>
        </Fade>
        <Fade>
          <GetListTable />
        </Fade>
      </Card>
      <CSSTransition
        mountOnEnter
        unmountOnExit
        in={filterModalVisible}
        timeout={300}
      >
        <FilterModal
          visible={filterModalVisible}
          filter={tableFilterData}
          onFilter={submitFilterDataHandler}
          onCancel={() => setFilterModalVisible(false)}
        />
      </CSSTransition>
    </Spin>
  )
}

export default IncomeCashOrder;
