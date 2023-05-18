import { Button, Form, Input, Select } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Fade from "react-reveal/Fade";
import { Link, useLocation } from 'react-router-dom';

import Card from "../../../components/MainCard";
import TableData from './components/TableData';
import { getListStartAction, setListFilter, setListFilterType } from './_redux/getListSlice';

const { Option } = Select;

const FormaDKPositionCanEdit = ({ match }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const location = useLocation();
    const [filterForm] = Form.useForm();

    const formaDKPositionList = useSelector((state) => state.formaDKPositionList);

    let tableData = formaDKPositionList.listSuccessData?.rows;
    let total = formaDKPositionList.listSuccessData?.total;
    let pagination = formaDKPositionList?.paginationData;
    let filter = formaDKPositionList?.filterData;

    useEffect(() => {
        dispatch(
            getListStartAction({
                ...pagination,
                ...filter,
            })
        );
    }, [pagination, filter]);

    const getList = (values) => {
        dispatch(setListFilter({
            Code: values?.search,
        }));
    };

    const [filterType, setFilterType] = useState(formaDKPositionList.filterType);

    function filterTypeHandler(value) {
        setFilterType(value);
    };

    const onSearch = (Search) => {
        filterForm.validateFields()
            .then(values => {
                console.log(values);
                dispatch(setListFilterType({
                    filterType: filterType,
                }));
                getList(values);
            });
    };

    const onFinish = (values) => {
        dispatch(setListFilterType({
            filterType: values?.filterType,
        }));
        getList(values);
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
        <Card title={t("FormaDKPositionCanEdit")}>
            <Fade>
                <div className="table-top">
                    <Form
                        className='table-filter-form'
                        form={filterForm}
                        onFinish={onFinish}
                        initialValues={{
                            filterType: filterType,
                            Search: filter[`${filterType}`],
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
                                    <Option value="Code">{t('Code')}</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                // label={t("search")}
                                name="search"
                            >
                                <Input.Search
                                    className="table-search"
                                    placeholder={t("search")}
                                    enterButton
                                    onSearch={onSearch}
                                />
                            </Form.Item>

                            <Button
                                type="primary"
                                onClick={handleRefresh}
                            >
                                <i className="feather icon-refresh-ccw" />
                            </Button>

                            <Button type="primary">
                                <Link to={`${location.pathname}/add`}>
                                    {t("add-new")}&nbsp;
                                    <i className="feather icon-plus" aria-hidden="true" />
                                </Link>
                            </Button>
                        </div>
                    </Form>
                </div>
            </Fade>

            <Fade>
                <TableData tableData={tableData} total={total} match={match} />
            </Fade>
        </Card>
    )
}

export default React.memo(FormaDKPositionCanEdit);