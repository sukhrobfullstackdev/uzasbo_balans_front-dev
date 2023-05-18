import React, { useCallback, useState } from 'react';
import { Input, Form, Button, DatePicker, Tooltip } from "antd";
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
import ResPersonModal from '../../../components/Reports/ResPersonModal';
import InventoryHoldingModal from './components/InventoryHoldingModal';
import FilterModal from './components/FilterModal';

// const { Option } = Select
const { RangePicker } = DatePicker;

const InventoryHoldingCard = () => {
  const { t } = useTranslation();
  // const location = useLocation();
  const [filterForm] = Form.useForm();
  const dispatch = useDispatch();
  const tableList = useSelector((state) => state.inventoryHoldingCardList);
  const tablePagination = tableList?.paginationData;
  const tableFilterData = tableList?.filterData;

  const [subAccModalVisible, setSubAccModalVisible] = useState(false);
  const [subAccId, setSubAccId] = useState(null);
  const [inventoryHoldingModalVisible, setInventoryHoldingModalVisible] = useState(false);
  const [inventoryHoldingId, setInventoryHoldingId] = useState(null);
  const [resPersonModalVisible, setResPersonModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [resPersonId, setResPersonId] = useState(null);

  const getFilterValues = useCallback((values) => {
    values.StartDate = values.range ? values.range[0].format('DD.MM.YYYY') : null
    values.EndDate = values.range ? values.range[1].format('DD.MM.YYYY') : null
    values.range = null;
    values.SubAccID = subAccId;
    values.InventoryHoldingID = inventoryHoldingId;
    values.ResponsiblePersonID = resPersonId;
    return values;
  }, [subAccId, inventoryHoldingId, resPersonId,])

  const onFinish = useCallback((values) => {
    const filterValues = getFilterValues(values)
    dispatch(setListFilter(values));
    dispatch(getListStartAction({
      ...tablePagination,
      ...filterValues,
    }))
  }, [dispatch, tablePagination, getFilterValues]);

  const selectSubAccHandler = useCallback((values) => {
    setSubAccModalVisible(false);
    setSubAccId(values.id);
    filterForm.setFieldsValue({ SubAccCode: values.accCode })
  }, [filterForm]);

  const selectInventoryHoldingHandler = useCallback((values) => {
    setInventoryHoldingModalVisible(false);
    setInventoryHoldingId(values.id);
    filterForm.setFieldsValue({ InventoryHoldingName: values.name })
  }, [filterForm])

  const selectResPersonHandler = useCallback((values) => {
    setResPersonModalVisible(false);
    setResPersonId(values.id);
    filterForm.setFieldsValue({ ResponsiblePersonName: values.name })
  }, [filterForm])

  const printTable = useCallback((type) => {
    filterForm.validateFields()
      .then(values => {
        const filterValues = getFilterValues(values);
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
      })
      .catch(err => err);
  }, [dispatch, filterForm, tableFilterData, tablePagination, getFilterValues])

  const submitFilterDataHandler = useCallback((modalValues) => {
    filterForm.validateFields()
      .then(values => {
        onFinish({ ...values, ...modalValues });
      })
    setFilterModalVisible(false);
  }, [filterForm, onFinish])

  return (
    <MainCard title={t("inventoryHoldingCard")}>
      <Fade>
        <Form
          layout='vertical'
          form={filterForm}
          onFinish={onFinish}
          className='table-filter-form'
          initialValues={{
            ...tableFilterData,
            range: [moment(tableFilterData.StartDate, 'DD.MM.YYYY'), moment(tableFilterData.EndDate, 'DD.MM.YYYY')]
          }}
        >
          <div className="main-table-filter-wrapper">
            <Form.Item
              name="range"
              label={t("period")}
            >
              <RangePicker
                format="DD.MM.YYYY"
                placeholder={[t('from'), t('to')]}
                style={{ width: 250 }}
              />
            </Form.Item>

            <Form.Item
              name='SubAccCode'
              label={t("subAcc")}
              rules={[
                {
                  required: true,
                  message: t("pleaseSelect"),
                }
              ]}
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
              name='ResponsiblePersonName'
              label={t("responsiblePerson")}
              rules={[
                {
                  required: true,
                  message: t("pleaseSelect"),
                }
              ]}
            >
              <Input
                style={{ width: 200 }}
                disabled
                placeholder={t("responsiblePerson")}
                addonAfter={
                  <Button
                    type="primary"
                    className='addon-after-btn'
                    icon={<i className="fas fa-sort-amount-down"></i>}
                    onClick={() => setResPersonModalVisible(true)}
                  />
                }
              />
            </Form.Item>
            <Form.Item
              name='InventoryHoldingName'
              label={t("inventoryHoldingName")}
              rules={[
                {
                  required: true,
                  message: t("pleaseSelect"),
                }
              ]}
            >
              <Input
                style={{ width: 150 }}
                disabled
                placeholder={t("inventoryHoldingName")}
                addonAfter={
                  <Button
                    type="primary"
                    className='addon-after-btn'
                    icon={<i className="fas fa-sort-amount-down"></i>}
                    onClick={() => setInventoryHoldingModalVisible(true)}
                  />
                }
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
              <Button type="primary" htmlType="submit">
                <i className="feather icon-refresh-ccw" />
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                type='primary'
                onClick={() => printTable('PrintExportAccountCardByIH')}
              >
                <i className='feather icon-printer' aria-hidden="true" />
              </Button>
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
        in={resPersonModalVisible}
        timeout={300}
      >
        <ResPersonModal
          visible={resPersonModalVisible}
          onCancel={() => setResPersonModalVisible(false)}
          onOk={selectResPersonHandler}
        />
      </CSSTransition>

      <CSSTransition
        mountOnEnter
        unmountOnExit
        in={inventoryHoldingModalVisible}
        timeout={300}
      >
        <InventoryHoldingModal
          visible={inventoryHoldingModalVisible}
          onCancel={() => setInventoryHoldingModalVisible(false)}
          onOk={selectInventoryHoldingHandler}
        />
      </CSSTransition>

      <CSSTransition
        mountOnEnter
        unmountOnExit
        in={filterModalVisible}
        timeout={300}
      >
        <FilterModal
          visible={filterModalVisible}
          onCancel={() => setFilterModalVisible(false)}
          onOk={submitFilterDataHandler}
        />
      </CSSTransition>
    </MainCard>
  );
};

export default InventoryHoldingCard;