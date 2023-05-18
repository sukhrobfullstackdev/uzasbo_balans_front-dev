import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Tooltip, Spin, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Fade from "react-reveal/Fade";
import { Link, useLocation } from 'react-router-dom';

import Card from "../../../../components/MainCard";
import TableData from './components/TableData';
import { getListStartAction, setListFilter } from './_redux/getListSlice';

const { Option } = Select;

const InventoryHolding = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [filterForm] = Form.useForm();
  const dispatch = useDispatch();
  const tableList = useSelector((state) => state.InventoryHoldingList);
  const tablePagination = tableList?.paginationData;
  const tableFilterData = tableList?.filterData;
  const mainLoader = tableList?.mainLoader;
  const filterSearchVal = tableList.filterData[`${tableList?.filterType}`];

  const [filterType, setFilterType] = useState(tableList.filterType);

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
    filterForm.setFieldsValue({ Search: null });
  }

  const onFinish = (values) => {
    dispatch(setListFilter({
      [values?.filterType]: values?.Search?.trim(),
    }));
  };

  const onSearch = () => {
    filterForm.validateFields()
      .then(values => {
        onFinish(values);
      })
  };

  return (
    <Spin size='large' spinning={mainLoader}>
      <Card title={t("InventoryHolding")}>
        <Fade>
          <div className="main-table-filter-wrapper">
            <Form
              layout='vertical'
              className='table-filter-form'
              form={filterForm}
              onFinish={onFinish}
              initialValues={{
                ...tableFilterData,
                filterType: filterType,
                Search: filterSearchVal,
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
                    <Option value="InventoryNumber">{t('inventoryNumber')}</Option>
                    <Option value="Name">{t('Name')}</Option>
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
                        <i className="fa fa-plus" aria-hidden="true" />
                      </Link>
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
    </Spin>
  )
}

export default InventoryHolding;