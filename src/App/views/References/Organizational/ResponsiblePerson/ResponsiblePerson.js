import { Button, Form, Input, Tooltip } from 'antd';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Fade from "react-reveal/Fade";
import { Link, useLocation } from 'react-router-dom';

import Card from "../../../../components/MainCard";
import TableData from './components/TableData';
import { getListStartAction, setListFilter } from './_redux/getListSlice';

const ResponsiblePerson = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [filterForm] = Form.useForm();
  const dispatch = useDispatch();
  const tableList = useSelector((state) => state.ResponsiblePersonList);
  const tablePagination = tableList?.paginationData;
  const tableFilterData = tableList?.filterData;

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
          Name: values?.Name?.trim()
        }));
      })
  };

  return (
    <Card title={t("ResponsiblePerson")}>
      <Fade>
        <div className="main-table-filter-wrapper">
          <Form
            layout='vertical'
            className='table-filter-form'
            form={filterForm}
            initialValues={tableFilterData}
          >
            <div className="main-table-filter-wrapper">
              <Form.Item
                label={t("Name")}
                name="Name"
              >
                <Input.Search
                  placeholder={t("Name")}
                  enterButton
                  onSearch={onSearch}
                />
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
  )
}

export default ResponsiblePerson;