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


const InventoryHoldingIntake = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [filterForm] = Form.useForm();
  const dispatch = useDispatch();
  const tableList = useSelector((state) => state.inventoryHoldingIntakeList);
  const tablePagination = tableList?.paginationData;
  const tableFilterData = tableList?.filterData;
  const mainLoader = tableList?.mainLoader;

  const [filterType] = useState(tableList?.filterType);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [statusList, setStatusList] = useState([]);

  useEffect(() => {
    const getFilterParamData = async () => {
      const [stsList] = await Promise.all([
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

  const onFilter = (filterValues) => {
    filterForm.validateFields()
      .then(values => {
        values.StartDate = values.StartDate.format("DD.MM.YYYY");
        values.EndDate = values.EndDate.format("DD.MM.YYYY");
        dispatch(setListFilter({
          ...values, ...filterValues
        }))
      });

    setFilterModalVisible(false);
  };

  const onFinish = (values) => {
    console.log(values)
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


  return (
    <Spin size='large' spinning={mainLoader}>
      <Card title={t("InventoryHoldingIntake")}>
        <Fade>
          <Form
            layout='vertical'
            form={filterForm}
            onFinish={onFinish}
            className='table-filter-form'
            initialValues={{
              ...tableFilterData,
              filterType: filterType,
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

                <Button type="primary">
                  <Link to={`${location.pathname}/add`}>

                    <i className="fa fa-plus" aria-hidden="true" />
                  </Link>
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
          onCancel={() => setFilterModalVisible(false)}
          onSubmit={onFilter}
          statusList={statusList}
        />
      </CSSTransition>
    </Spin>
  )
}

export default InventoryHoldingIntake;