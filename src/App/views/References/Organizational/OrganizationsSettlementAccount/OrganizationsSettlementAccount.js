import { Button, Form, Input, Tooltip } from 'antd';
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Fade from "react-reveal/Fade";
import { Link } from 'react-router-dom';

import Card from "../../../../components/MainCard";
import TableData from './components/TableData';
import { Notification } from '../../../../../helpers/notifications';
import { getListStartAction, setListFilter, setTableLoading } from './_redux/getListSlice';
import OrgSettleAccServices from '../../../../../services/References/Organizational/OrgSettleAcc/OrgSettleAcc.services';

const OrganizationsSettlementAccount = () => {
  const { t } = useTranslation();
  const [filterForm] = Form.useForm();
  const dispatch = useDispatch();
  const tableList = useSelector((state) => state.orgSettleAccList);
  const tablePagination = tableList?.paginationData;
  const tableFilterData = tableList?.filterData;
  const filterSearchVal = tableList.filterData[`${tableList?.filterType}`];

  useEffect(() => {
    dispatch(
      getListStartAction({
        ...tablePagination,
        ...tableFilterData,
      })
    );
  }, [dispatch, tablePagination, tableFilterData]);

  const onSearch = () => {
    filterForm.validateFields()
      .then(values => {
        dispatch(setListFilter({
          Code: values?.Code?.trim(),
        }));
      })
  };

  const acceptHandler = () => {
    dispatch(setTableLoading(true));
    OrgSettleAccServices.attachSubAcc()
      .then(() => {
        Notification('success', t('saved'));
        dispatch(getListStartAction({
          ...tablePagination,
          ...tableFilterData,
        }))
      })
      .catch((err) => {
        Notification('error', err);
        dispatch(setTableLoading(false));
      });
  };

  return (
    <Card title={t("OrganizationsSettlementAccount")}>
      <Fade>
        <div className="main-table-filter-wrapper">
          <Form
            layout='vertical'
            className='table-filter-form'
            form={filterForm}
            initialValues={{
              ...tableFilterData,
              Search: filterSearchVal,
            }}
          >
            <div className="main-table-filter-wrapper">
              <Form.Item
                label={t("SettleCode")}
                name="Code"
              >
                <Input.Search
                  style={{ width: 300 }}
                  placeholder={t("SettleCode")}
                  enterButton
                  onSearch={onSearch}
                />
              </Form.Item>

              <Form.Item>
                <Tooltip title={t("add-new")}>
                  <Button type="primary">
                    <Link to='/RequestForSettlementAccount'>
                      <i className="fa fa-plus" aria-hidden="true" />
                    </Link>
                  </Button>
                </Tooltip>
              </Form.Item>
              <Form.Item>
                <Tooltip title={t("autoAttachSubAcc")}>
                  <Button type="primary" onClick={() => acceptHandler()}>
                    <i className="feather icon-paperclip" />
                  </Button>
                </Tooltip>
              </Form.Item>
            </div>
          </Form>
        </div>
      </Fade>

      <Fade>
        <TableData />
      </Fade>
    </Card>
  )
}

export default OrganizationsSettlementAccount;