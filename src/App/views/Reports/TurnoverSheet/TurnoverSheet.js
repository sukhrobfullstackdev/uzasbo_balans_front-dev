import React, { useCallback, useMemo, useState } from 'react';
import { Input, Form, Button, DatePicker, Menu, Dropdown } from "antd";
import { useDispatch, useSelector } from "react-redux";
// import { useLocation, Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Fade from "react-reveal/Fade";
import moment from "moment";
import { CSSTransition } from 'react-transition-group';

import { getListStartAction, setListFilter, setLoading } from './_redux/getListSlice';
import MainCard from '../../../components/MainCard';
import { Notification } from '../../../../helpers/notifications';
// import HelperServices from '../../../../services/Helper/helper.services';
import TurnoverSheetApis from '../../../../services/Report/InventoryAccounting/TurnoverSheet/TurnoverSheetApis'
import GetListTable from './components/GetListTable';
import SubAccModal from '../../../components/Reports/SubAccModal';
import DepartmentModal from './components/DepartmentModal';
import ResPersonModal from '../../../components/Reports/ResPersonModal';

// const { Option } = Select
const { RangePicker } = DatePicker;

const TurnoverSheet = () => {
  const { t } = useTranslation();
  // const location = useLocation();
  const [filterForm] = Form.useForm();
  const dispatch = useDispatch();
  const tableList = useSelector((state) => state.turnoverSheetList);
  const tablePagination = tableList?.paginationData;
  const tableFilterData = tableList?.filterData;

  // const [isIntervalDays, setIntervalDays] = useState(false);
  const [subAccModalVisible, setSubAccModalVisible] = useState(false);
  const [subAccId, setSubAccId] = useState(null);
  const [departmentModalVisible, setDepartmentModalVisible] = useState(false);
  const [departmentId, setDepartmentId] = useState(null);
  const [resPersonModalVisible, setResPersonModalVisible] = useState(false);
  const [resPersonId, setResPersonId] = useState(null);

  const getFilterValues = useCallback((values) => {
    values.StartDate = values.range ? values.range[0].format('DD.MM.YYYY') : null;
    values.EndDate = values.range ? values.range[1].format('DD.MM.YYYY') : null;
    values.range = null;
    values.SubAccID = subAccId;
    values.DepartmentID = departmentId;
    values.ResponsiblePersonID = resPersonId;
    return values;
  }, [subAccId, departmentId, resPersonId,])

  const onFinish = useCallback((values) => {
    const filterValues = getFilterValues(values)
    dispatch(setListFilter(values));
    dispatch(getListStartAction({
      ...tablePagination,
      ...filterValues,
    }))
  }, [dispatch, tablePagination, getFilterValues]);

  // const intervalDaysChangeHandler = useCallback((e) => {
  //   setIntervalDays(e.target.checked);
  // }, [])

  const selectSubAccHandler = useCallback((values) => {
    setSubAccModalVisible(false);
    setSubAccId(values.id);
    filterForm.setFieldsValue({ SubAccCode: values.accCode })
  }, [filterForm]);

  const selectDepartmentHandler = useCallback((values) => {
    setDepartmentModalVisible(false);
    setDepartmentId(values.id);
    filterForm.setFieldsValue({ DepartmentName: values.name })
  }, [filterForm])

  const selectResPersonHandler = useCallback((values) => {
    setResPersonModalVisible(false);
    setResPersonId(values.id);
    filterForm.setFieldsValue({ ResponsiblePersonName: values.name })
  }, [filterForm])

  const printTable = useCallback((type) => {
    const filterValues = getFilterValues(filterForm.getFieldsValue())
    dispatch(setListFilter(filterValues));
    TurnoverSheetApis.print(type, { ...tablePagination, ...filterValues })
      .then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "print.xlsx");
        document.body.appendChild(link);
        link.click();
        dispatch(getListStartAction({
          ...tablePagination,
          ...tableFilterData,
        }))
      })
      .catch(err => {
        Notification('error', err);
        dispatch(setLoading(false));
      })
  }, [dispatch, filterForm, tableFilterData, tablePagination, getFilterValues])

  const menu = useMemo(() => (
    <Menu
      items={[
        {
          label: (
            <span onClick={() => printTable('PrintAccountBookByIH')} style={{ display: 'block' }}>
              {t("print")}
            </span>
          ),
          key: "print"
        },
        {
          label: (
            <span onClick={() => printTable('PrintExportActInventory')} style={{ display: 'block' }}>
              {t("inventoryList")}
            </span>
          ),
          key: "inventoryList"
        },
        {
          label: (
            <span onClick={() => printTable('PrintExportAccountCardByIH')} style={{ display: 'block' }}>
              {t("card")}
            </span>
          ),
          key: "card"
        },
      ]}
    />
  ), [t, printTable]);

  return (
    <MainCard title={t("turnoverSheet")}>
      <Fade>
        <Form
          layout='vertical'
          form={filterForm}
          onFinish={onFinish}
          className='table-filter-form'
          initialValues={{
            ...tableFilterData,
            // isIntervalDays: isIntervalDays,
            // StartDate: moment(tableFilterData.StartDate, 'DD.MM.YYYY'),
            // EndDate: moment(tableFilterData.EndDate, 'DD.MM.YYYY'),
            range: [moment(tableFilterData.StartDate, 'DD.MM.YYYY'), moment(tableFilterData.EndDate, 'DD.MM.YYYY')]
          }}
        >
          <div className="main-table-filter-wrapper">
            {/* <Form.Item
              label={t("intervalDays")}
              onChange={intervalDaysChangeHandler}
              valuePropName="checked"
            >
              <Checkbox />
            </Form.Item> */}
            {/* {isIntervalDays &&
              <>
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
              </>
            } */}
            {/* {!isIntervalDays &&
              <> */}
            <Form.Item
              name="range"
              label={t("period")}
            >
              <RangePicker
                // picker="month"
                format="DD.MM.YYYY"
                placeholder={[t('from'), t('to')]}
                style={{ width: 250 }}
              />
            </Form.Item>
            {/* </>
            } */}
            <Form.Item
              name="IhName"
              label={t("ihName")}
            >
              <Input
                placeholder={t("ihName")}
              />
            </Form.Item>
            <Form.Item
              name='SubAccCode'
              label={t("subAcc")}
            >
              <Input
                style={{ width: 100 }}
                disabled
                placeholder={t("subAcc")}
                addonAfter={<Button
                  type="primary"
                  className='addon-after-btn'
                  icon={<i className="fas fa-sort-amount-down"></i>}
                  onClick={() => {
                    setSubAccModalVisible(true);
                  }}
                />}
              />
            </Form.Item>
            <Form.Item
              name='DepartmentName'
              label={t("department")}
            >
              <Input
                style={{ width: 120 }}
                disabled
                placeholder={t("department")}
                addonAfter={<Button
                  type="primary"
                  className='addon-after-btn'
                  icon={<i className="fas fa-sort-amount-down"></i>}
                  onClick={() => {
                    setDepartmentModalVisible(true);
                  }}
                />}
              />
            </Form.Item>
            <Form.Item
              name='ResponsiblePersonName'
              label={t("responsiblePerson")}
            >
              <Input
                style={{ width: 200 }}
                disabled
                placeholder={t("responsiblePerson")}
                addonAfter={<Button
                  type="primary"
                  className='addon-after-btn'
                  icon={<i className="fas fa-sort-amount-down"></i>}
                  onClick={() => {
                    setResPersonModalVisible(true);
                  }}
                />}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                <i className="feather icon-refresh-ccw" />
              </Button>
            </Form.Item>
            <Form.Item>
              <Dropdown
                arrow
                placement="bottom"
                // trigger={['click']}
                overlay={menu}
              >
                <Button type='primary'><i className='feather icon-printer' aria-hidden="true" /></Button>
              </Dropdown>
            </Form.Item>
          </div>
        </Form>
      </Fade>
      <Fade>
        <GetListTable />
      </Fade>
      <CSSTransition
        mountOnEnter
        unmountOnExit
        in={subAccModalVisible}
        timeout={300}
      >
        <SubAccModal
          visible={subAccModalVisible}
          onCancel={() => setSubAccModalVisible(false)}
          onOk={selectSubAccHandler}
        />
      </CSSTransition>
      <CSSTransition
        mountOnEnter
        unmountOnExit
        in={departmentModalVisible}
        timeout={300}
      >
        <DepartmentModal
          visible={departmentModalVisible}
          onCancel={() => setDepartmentModalVisible(false)}
          onOk={selectDepartmentHandler}
        />
      </CSSTransition>
      <CSSTransition
        mountOnEnter
        unmountOnExit
        in={resPersonModalVisible}
        timeout={300}
      >
        <ResPersonModal
          visible={resPersonModalVisible}
          onCancel={() => setResPersonModalVisible(false)}
          onOk={selectResPersonHandler}
        />
      </CSSTransition>
    </MainCard>
  );
};

export default TurnoverSheet;