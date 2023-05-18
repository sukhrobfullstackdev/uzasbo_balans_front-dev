import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Form, Button, DatePicker, Spin, Tooltip } from "antd";
import Fade from "react-reveal/Fade";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useLocation, Link } from "react-router-dom";
import { CSSTransition } from 'react-transition-group';

import { getListStartAction, setListFilterType, setListFilter } from './_redux/getListSlice';
import Card from "../../../../components/MainCard";
import FilterModal from './components/FilterModal';
import TableData from './components/TableData';


const FoodstuffIntake = ({ match }) => {
    const { t } = useTranslation();
    const [filterForm] = Form.useForm();
    const dispatch = useDispatch();
    const location = useLocation();

    const reduxList = useSelector((state) => state.foodstuffIntakeList);

    let tableData = reduxList.listSuccessData?.rows;
    let total = reduxList.listSuccessData?.total;
    let pagination = reduxList?.paginationData;
    let filter = reduxList?.filterData;

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

    // const [filterType, setFilterType] = useState(reduxList.filterType);
    const [filterModal, setFilterModal] = useState(reduxList.filterType);

    const onFilter = (filterValues) => {
        filterForm.validateFields()
            .then(values => {
                values.StartDate = values.StartDate.format("DD.MM.YYYY");
                values.EndDate = values.EndDate.format("DD.MM.YYYY");
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
        <Card title={t("InventoryHoldingIntake")}>
            <Fade>
                <Form
                    layout='vertical'
                    form={filterForm}
                    onFinish={onFinish}
                    className='table-filter-form'
                    initialValues={{
                        ...filter,
                        StartDate: moment(filter.StartDate, 'DD.MM.YYYY'),
                        EndDate: moment(filter.EndDate, 'DD.MM.YYYY'),
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
                            <Tooltip title={t('filter')}>
                                <Button type="primary" onClick={() => setFilterModal(true)}>
                                    <i className="feather icon-filter" />
                                </Button>
                            </Tooltip>
                        </Form.Item>

                        <Form.Item>
                            <Tooltip title={t('refresh')}>
                                <Button type="primary" htmlType="submit">
                                    <i className="feather icon-refresh-ccw" />
                                </Button>
                            </Tooltip>
                        </Form.Item>

                        <Form.Item>

                            <Button type="primary">
                                <Link to={`${location.pathname}/add`}>

                                    <i className="fa fa-plus" aria-hidden="true" />
                                </Link>
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </Fade>

            <Fade>
                <TableData
                    tableData={tableData} total={total} match={match} reduxList={reduxList}
                />
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

export default FoodstuffIntake;