import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Input, Form, Button, DatePicker, Select, Spin, Tooltip } from "antd";
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

const { Option } = Select;

const Contracts = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [filterForm] = Form.useForm();
  const dispatch = useDispatch();
  const tableList = useSelector((state) => state.contractsList);
  const tablePagination = tableList?.paginationData;
  const tableFilterData = tableList?.filterData;
  const mainLoader = tableList?.mainLoader;
  const filterSearchVal = tableList.filterData[`${tableList?.filterType}`];

  const [filterType, setFilterType] = useState(tableList?.filterType);
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

  const filterTypeHandler = (value) => {
    setFilterType(value);
  }

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

  const onSearch = () => {
    filterForm.validateFields()
      .then(values => {
        onFinish(values);
      })
  };

  // Filter modal
  const submitFilterDataHandler = (modalValues) => {
    filterForm.validateFields()
      .then(values => {
        onFinish({ ...values, ...modalValues });
      })
    setFilterModalVisible(false);
  }
  // Filter modal end

  return (
    <Spin size='large' spinning={mainLoader}>
      <Card title={t("Contracts")}>
        <Fade>
          <Form
            layout='vertical'
            form={filterForm}
            onFinish={onFinish}
            className='table-filter-form'
            initialValues={{
              ...tableFilterData,
              filterType: filterType,
              Search: filterSearchVal,
              StartDate: moment(tableFilterData.StartDate, 'DD.MM.YYYY'),
              EndDate: moment(tableFilterData.EndDate, 'DD.MM.YYYY'),
            }}
          >
            <div className="main-table-filter-wrapper">
              <Form.Item
                name="filterType"
                label={t("Filter Type")}
              >
                <Select
                  allowClear
                  style={{ width: 180 }}
                  placeholder={t("Filter Type")}
                  onChange={filterTypeHandler}
                >
                  <Option value="TreasContractID">{t('treasContractID')}</Option>
                  <Option value="Number">{t('Number')}</Option>
                  <Option value="StartSum">{t('startSum')}</Option>
                  <Option value="EndSum">{t('endSum')}</Option>
                  <Option value="INN">{t('INN')}</Option>
                  <Option value="Ticket">{t('ticket')}</Option>
                  <Option value="ItemOfExpenseCode">{t('itemOfExpenseCode')}</Option>
                  <Option value="SettlementAccount">{t('settlementAccount')}</Option>
                  <Option value="OrganizationsSett">{t('organizationsSett')}</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label={t("search")}
                name="Search"
              >
                <Input.Search
                  placeholder={t("search")}
                  enterButton
                  onSearch={onSearch}
                />
              </Form.Item>

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

              <Form.Item
                name="Status"
                label={t("Status")}
              >
                <Select
                  allowClear
                  showSearch
                  placeholder={t("Status")}
                  style={{ width: 200 }}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {statusList.map(item => <Option key={item.ID} value={item.ID}>{item.DisplayName}</Option>)}
                </Select>
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
                <Tooltip title={t("add-new")}>
                  <Button type="primary">
                    <Link to={`${location.pathname}/add`}>
                      {/* {t("add-new")}&nbsp; */}
                      <i className="fa fa-plus" aria-hidden="true" />
                    </Link>
                  </Button>
                </Tooltip>
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
          onSubmit={submitFilterDataHandler}
          statusList={statusList}
        />
      </CSSTransition>
    </Spin>
  )
}

export default Contracts;