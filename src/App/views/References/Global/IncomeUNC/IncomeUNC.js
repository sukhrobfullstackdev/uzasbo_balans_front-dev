import { Button, Form, Input, Select, Spin } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Fade from "react-reveal/Fade";
import { Link, useLocation } from 'react-router-dom';

import Card from "../../../../components/MainCard";
import TableData from './components/TableData';
import { getListStartAction, setListFilter, setListFilterType, setListPagination } from './_redux/getListSlice';

const { Option } = Select;

const IncomeUNC = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const [filterForm] = Form.useForm();
    const dispatch = useDispatch();
    const tableList = useSelector((state) => state.IncomeUNCList);
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
    }

    const onFinish = (values) => {
        dispatch(setListFilter({
            ...values,

            [values?.filterType]: values?.Search,

        }));
    };

    const onSearch = (Search) => {
        dispatch(setListFilterType({
            filterType: filterType,
        }));
        dispatch(setListFilter({
            [filterType]: Search,
        }));
        dispatch(
            setListPagination({
                PageNumber: 1,
                PageLimit: 10,
            })
        );
    };
    return (
        <Spin size='large' spinning={mainLoader}>
            <Card title={t("IncomeUNC")}>
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
                            <div className="table-top">
                                <div className='table-filter-form'>
                                    <div className="main-table-filter-elements">
                                        <div>
                                            <Select
                                                value={filterType}
                                                allowClear
                                                style={{ width: 180 }}
                                                placeholder={t("Filter Type")}
                                                onChange={filterTypeHandler}
                                            >
                                                <Option value="ID">{t('id')}</Option>
                                                <Option value="Code">{t('code')}</Option>
                                                <Option value="Name">{t('Name')}</Option>
                                                <Option value="Search">{t('status')}</Option>

                                            </Select>
                                        </div>

                                        <div>
                                            <Input.Search
                                                className="table-search"
                                                placeholder={t("search")}
                                                enterButton
                                                onSearch={onSearch}
                                            />
                                        </div>

                                        <Form.Item>
                                            <Button type="primary">
                                                <Link to={`${location.pathname}/add`}>
                                                    <i className="fa fa-plus" aria-hidden="true" />
                                                </Link>
                                            </Button>
                                        </Form.Item>
                                    </div>
                                </div>
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

export default IncomeUNC;