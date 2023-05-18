import React, { useEffect,  } from 'react'
import { useTranslation } from 'react-i18next';
import { Form, Button, DatePicker, Spin, Tooltip } from "antd";
import Fade from "react-reveal/Fade";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useLocation, Link } from "react-router-dom";

import { getListStartAction, setListFilterType, setListFilter } from './_redux/getListSlice';
import GetListTable from './components/GetListTable';
import Card from "../../../../components/MainCard";


let addBtn;

const PermanentAssetMovement = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [filterForm] = Form.useForm();
  const dispatch = useDispatch();
  const tableList = useSelector((state) => state.PermanentAssetMovementList);
  const tablePagination = tableList?.paginationData;
  const tableFilterData = tableList?.filterData;
  const mainLoader = tableList?.mainLoader;

  useEffect(() => {
    dispatch(
      getListStartAction({
        ...tablePagination,
        ...tableFilterData,
      })
    );
  }, [dispatch, tablePagination, tableFilterData]);

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


  return (
    <Spin size='large' spinning={mainLoader}>
      <Card title={t("PermanentAssetMovement")}>
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
                <Tooltip title={t('refresh')}>
                  <Button type="primary" htmlType="submit">
                    <i className="feather icon-refresh-ccw" />
                  </Button>
                </Tooltip>
              </Form.Item>
              <Form.Item>
              <Tooltip title={t('add-new')}>
                  <Button type="primary">
                      <Link to={`${location.pathname}/add`}>
                        
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
    
    </Spin>
  )
}

export default PermanentAssetMovement;