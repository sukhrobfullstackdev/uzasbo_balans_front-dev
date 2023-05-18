import { Button, Form, Input, Select, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Fade from "react-reveal/Fade";
import { Link, useLocation } from 'react-router-dom';

import Card from "../../../../components/MainCard";
import TableData from './components/TableData';
import { getListStartAction, setListFilter, setListFilterType, setMainLoader } from './_redux/getListSlice';
import ContractorsServices from "../../../../../services/References/Organizational/Contractors/Contractors.services";
import { Notification } from '../../../../../helpers/notifications';

const { Option } = Select;

const Contractors = ({ match }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();

  const contractorsList = useSelector((state) => state.contractorsList);

  let tableData = contractorsList.listSuccessData?.rows;
  let total = contractorsList.listSuccessData?.total;
  let pagination = contractorsList?.paginationData;
  let filter = contractorsList?.filterData;

  const [filterType, setFilterType] = useState(contractorsList.filterType);
  const [filterValue, setFilterValue] = useState(contractorsList.filterData[`${filterType}`]);
  
  useEffect(() => {
    dispatch(
      getListStartAction({
        ...pagination,
        ...filter,
      })
    );
  }, [dispatch, pagination, filter]);

  function filterTypeHandler(value) {
    setFilterType(value);
  };

  const onSearchChange = (event) => {
    setFilterValue(event.target.value)
  }

  const onSearch = (Search) => {
    dispatch(setListFilterType({
      filterType: filterType,
    }));
    dispatch(setListFilter({
      [filterType]: Search,
    }));
  };

  const printHandler = () => {
    dispatch(setMainLoader(true));
    ContractorsServices.print({
      ...pagination,
      ...filter,
    })
      .then(res => {
        if (res.status === 200) {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "UZAsbo_Contractor.xlsx");
          document.body.appendChild(link);
          link.click();

          dispatch(setMainLoader(false));
        }
      })
      .catch(err => {
        Notification('error', err);
        dispatch(setMainLoader(false));
      })
  };

  return (
    <Card title={t("Contractors")}>
      <Fade>
        <Form
          className='table-filter-form'
          initialValues={{
            filterType: filterType,
            search: filterValue,
          }}
        >
          <div className="main-table-filter-elements">
            <Form.Item
              name="filterType"
            // label={t("Filter Type")}
            >
              <Select
                value={filterType}
                allowClear
                style={{ width: 180 }}
                placeholder={t("Filter Type")}
                onChange={filterTypeHandler}
              >
                <Option value="ID">{t('id')}</Option>
                <Option value="INN">{t('OrgINN')}</Option>
                <Option value="Name">{t('Name')}</Option>
                <Option value="SettlementAccount">{t('userSettlementAccount')}</Option>
                <Option value="BankCode">{t('BankCode')}</Option>
              </Select>
            </Form.Item>
            <Form.Item
              // label={t("search")}
              name="search"
            >
              <Input.Search
                placeholder={t("search")}
                enterButton
                onSearch={onSearch}
                onChange={onSearchChange}
                value={filterValue}
              />
            </Form.Item>

            <Form.Item>
              <Tooltip title={t("add-new")}>
                <Button type="primary">
                  <Link to={`${location.pathname}/add`}>
                    <i className="feather icon-plus" aria-hidden="true" />
                  </Link>
                </Button>
              </Tooltip>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                onClick={printHandler}
              >
                <i className="feather icon-printer" />
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Fade>

      <Fade>
        <TableData tableData={tableData} total={total} match={match} />
      </Fade>
    </Card>
  )
}

export default React.memo(Contractors);