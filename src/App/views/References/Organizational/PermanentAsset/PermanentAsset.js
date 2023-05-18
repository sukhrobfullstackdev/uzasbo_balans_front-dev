import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Input, Select, Tooltip } from 'antd';

import Card from "../../../../components/MainCard";
import Fade from "react-reveal/Fade";
import { Link, useLocation } from 'react-router-dom';
import TableData from './components/TableData';
import { getListStartAction, setListFilter, setListFilterType } from './_redux/getListSlice';

const { Option } = Select;

const PermanentAsset = ({ match }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();

  const premanetAssetsList = useSelector((state) => state.premanetAssetsList);

  let tableData = premanetAssetsList.listSuccessData?.rows;
  let total = premanetAssetsList.listSuccessData?.total;
  let pagination = premanetAssetsList?.paginationData;
  let filter = premanetAssetsList?.filterData;
  const filterSearchVal = premanetAssetsList.filterData[`${premanetAssetsList?.filterType}`];
  
  const [filterType, setFilterType] = useState(premanetAssetsList.filterType);
  
  useEffect(() => {
    dispatch(
      getListStartAction({
        ...pagination,
        ...filter,
      })
    );
  }, [dispatch, pagination, filter]);

  const filterTypeHandler = (value) => {
    setFilterType(value);
  };
  
  const onSearch = (Search) => {
    dispatch(setListFilterType({
      filterType: filterType,
    }));
    dispatch(setListFilter({
      [filterType]: Search?.trim(),
    }));
  };

  return (
    <Card title={t("PermanentAsset")}>
      <Fade>
        <Form
          className='table-filter-form'
          initialValues={{
            filterType: filterType,
            search: filterSearchVal,
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
                <Option value="Number">{t('InventoryNumber')}</Option>
                <Option value="Name">{t('Name')}</Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              // label={t("search")}
              name="search"
            >
              <Input.Search
                placeholder={t("search")}
                onSearch={onSearch}
                enterButton
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
          </div>
        </Form>
      </Fade>

      <Fade>
        <TableData tableData={tableData} total={total} match={match} />
      </Fade>
    </Card>
  )
}

export default React.memo(PermanentAsset);