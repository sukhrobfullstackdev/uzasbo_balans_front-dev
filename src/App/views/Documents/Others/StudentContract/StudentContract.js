import React, { useState, useEffect } from 'react';
import Fade from "react-reveal/Fade";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Form, Button, Input, Spin, Space, DatePicker, Select } from "antd";
import moment from "moment";

import Card from "../../../../components/MainCard";
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import TableData from './components/TableData';
import { useDispatch, useSelector } from 'react-redux';
import { getListStartAction, setListFilter, setListFilterType, setListPagination } from './_redux/getListSlice';
import { CSSTransition } from 'react-transition-group';
import FilterModal from './components/FilterModal';

const { Option } = Select;

const StudentContract = ({ match }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [filterForm] = Form.useForm();
    const location = useLocation();

    const studentContractList = useSelector((state) => state.studentContractList);

    let tableData = studentContractList.listSuccessData?.rows;
    let total = studentContractList.listSuccessData?.total;
    let pagination = studentContractList?.paginationData;
    let filter = studentContractList?.filterData;

    useEffect(() => {
        dispatch(
            getListStartAction({
                ...pagination,
                ...filter,
            })
        );
    }, [dispatch, pagination, filter]);

    const getList = (values) => {
        dispatch(setListFilter({
            ...values
        }));
    };

    const [filterType, setFilterType] = useState(studentContractList.filterType);
    const [filterModal, setFilterModal] = useState(studentContractList.filterType);

    function filterTypeHandler(value) {
        setFilterType(value);
    };

    const onSearch = () => {
        filterForm.validateFields()
            .then(values => {
                values.StartDate = values.StartDate.format("DD.MM.YYYY");
                values.EndDate = values.EndDate.format("DD.MM.YYYY");
                dispatch(setListFilterType({
                    filterType: filterType,
                }));
                getList(values);
            });
    };

    const onFilter = (filterValues) => {
        filterForm.validateFields()
            .then(values => {
                values.StartDate = values.StartDate.format("DD.MM.YYYY");
                values.EndDate = values.EndDate.format("DD.MM.YYYY");
                dispatch(setListFilterType({
                    filterType: filterType,
                }));
                getList({ ...values, ...filterValues });
            });
    };

    const onFinish = (values) => {
        values.StartDate = values.StartDate.format("DD.MM.YYYY");
        values.EndDate = values.EndDate.format("DD.MM.YYYY");
        dispatch(setListFilterType({
            filterType: values?.filterType,
        }));
        getList(values);
    };

    return (
        <Card title={t("StudentContract")}>
            <Fade>
                <div className="table-top">
                    <Form
                        form={filterForm}
                        onFinish={onFinish}
                        className='table-filter-form'
                        initialValues={{
                            ...filter,
                            EndDate: moment().add(30, "days"),
                            StartDate: moment().subtract(30, "days"),
                        }}
                    >
                        <div className="main-table-filter-elements">
                            <Form.Item
                                name="filterType"
                                label={t("Filter Type")}>
                                <Select
                                    allowClear
                                    style={{ width: 180 }}
                                    placeholder={t("Filter Type")}
                                // onChange={filterTypeHandler}
                                >
                                    <Option value="ID">{t('id')}</Option>
                                    <Option value="Search">{t('FullName')}</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label={t("search")}
                                name="Search">
                                <Input.Search
                                    className="table-search"
                                    placeholder={t("search")}
                                    enterButton
                                    onSearch={onSearch}
                                />
                            </Form.Item>
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

                            <Button type="primary" onClick={() => setFilterModal(true)}>
                                <i className="feather icon-filter" />
                            </Button>

                            <Button type="primary" htmlType="submit">
                                <i className="feather icon-refresh-ccw" />
                            </Button>
                            <Form.Item>
                                <Button type="primary">
                                    <Link to={`${location.pathname}/add`}>
                                        {t("add-new")}&nbsp;
                                        <i className="fa fa-plus" aria-hidden="true" />
                                    </Link>
                                </Button>
                            </Form.Item>
                        </div>
                    </Form>
                </div>
            </Fade>

            <Fade>
                <TableData tableData={tableData} total={total} match={match} />
            </Fade>

            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={filterModal}
                timeout={300}
            >
                <FilterModal
                    visible={filterModal}
                    filter={filter}
                    onFilter={onFilter}
                    onCancel={() => {
                        setFilterModal(false);
                    }}
                />
            </CSSTransition>
        </Card>
    )
}

export default React.memo(StudentContract);