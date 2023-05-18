import { Button, Form, Input, Select, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Fade from "react-reveal/Fade";
import { Link, useLocation } from 'react-router-dom';

import Card from "../../../../components/MainCard";
import TableData from './components/TableData';
import { getListStartAction, setListFilter, setListFilterType } from './_redux/getListSlice';

const { Option } = Select;

const Children = ({ match }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const [filterForm] = Form.useForm();

  const childrenList = useSelector((state) => state.childrenList);
  let tableData = childrenList.listSuccessData?.rows;
  let total = childrenList.listSuccessData?.total;
  let pagination = childrenList?.paginationData;
  let filter = childrenList?.filterData;

  const [filterType, setFilterType] = useState(childrenList.filterType);

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
    filterForm.setFieldsValue({ Search: null })
  };

  const onFinish = (values) => {
    dispatch(setListFilterType({
      filterType: values?.filterType,
    }));
    dispatch(setListFilter({
      [values?.filterType]: values?.Search?.trim(),
    }))
  };

  const onSearch = () => {
    filterForm.validateFields()
      .then(values => {
        dispatch(setListFilterType({
          filterType: filterType,
        }));
        onFinish(values);
      });
  };

  const handleRefresh = () => {
    dispatch(
      getListStartAction({
        ...pagination,
        ...filter,
      })
    );
  };

  return (
    <Card title={t("Children")}>
      <Fade>
        <Form
          layout='vertical'
          form={filterForm}
          onFinish={onFinish}
          initialValues={{
            filterType: filterType,
            Search: filter[`${filterType}`],
          }}
        >
          <div className="main-table-filter-wrapper">
            <Form.Item
              name="filterType"
              label={t("Filter Type")}
            >
              <Select
                value={filterType}
                allowClear
                style={{ width: 180 }}
                placeholder={t("Filter Type")}
                onChange={filterTypeHandler}
              >
                <Option value="Number">{t('Таб.№')}</Option>
                <Option value="Department">{t('Department')}</Option>
                <Option value="Name">{t('Name')}</Option>
                <Option value="DocumentSeries">{t('DocumentSeries')}</Option>
                <Option value="DocumentNumber">{t('DocumentNumber')}</Option>
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
              <Tooltip title={t("refresh")}>
                <Button
                  type="primary"
                  onClick={handleRefresh}
                >
                  <i className="feather icon-refresh-ccw" />
                </Button>
              </Tooltip>
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
          </div>
        </Form>
      </Fade>

      <Fade>
        <TableData tableData={tableData} total={total} />
      </Fade>
    </Card>
  )
}

export default React.memo(Children);