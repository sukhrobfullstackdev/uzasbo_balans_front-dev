import React, { useState, useEffect } from 'react';
import Fade from "react-reveal/Fade";
import { useTranslation } from "react-i18next";
import { Form, Button, Input, DatePicker, Select } from "antd";
import moment from "moment";

import Card from "../../../../components/MainCard";
import TableData from './components/TableData';
import { useDispatch, useSelector } from 'react-redux';
import { getListStartAction, setListFilter, setListFilterType, setMainLoader } from './_redux/getListSlice';
import OnlinePaymentServices from '../../../../../services/Documents/PaymentDocuments/OnlinePayment/OnlinePayment';
import SentPaymentOrderServices from '../../../../../services/Documents/PaymentDocuments/SentPaymentOrder/SentPaymentOrder.services';

const { Option } = Select;

const SentPaymentOrder = ({ match }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [filterForm] = Form.useForm();

    const reduxList = useSelector((state) => state.sentPaymentOrderList);

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
        console.log(values);
        dispatch(setListFilter({
            [filterType]: values?.Search,
            StartDate: values?.StartDate,
            EndDate: values?.EndDate,
        }));
    };

    const [filterType, setFilterType] = useState(reduxList.filterType);

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

    const onFinish = (values) => {
        values.StartDate = values.StartDate.format("DD.MM.YYYY");
        values.EndDate = values.EndDate.format("DD.MM.YYYY");
        dispatch(setListFilterType({
            filterType: values?.filterType,
        }));
        getList(values);
    };

    const handlePrint = () => {
        // dispatch(setMainLoader(true));
        // SentPaymentOrderServices.print({
        //   ...pagination,
        //   ...filter,
        // })
        //   .then(res => {
        //     if (res.status === 200) {
        //       const url = window.URL.createObjectURL(new Blob([res.data]));
        //       const link = document.createElement("a");
        //       link.href = url;
        //       link.setAttribute("download", "UZAsbo_OnlinePayment(UzCARD).xlsx");
        //       document.body.appendChild(link);
        //       link.click();
    
        //       dispatch(setMainLoader(false));
        //     }
        //   })
        //   .catch(err => {
        //     Notification('error', err);
        //     dispatch(setMainLoader(false));
        //   })
    }

    return (
        <Card title={t("SentPaymentOrder")}>
            <Fade>
                <div className="table-top">
                    <Form
                        form={filterForm}
                        onFinish={onFinish}
                        className='table-filter-form'
                        initialValues={{
                            ...filter,
                            EndDate: moment().add(30, "days"),
                            StartDate: moment().subtract(330, "days"),
                        }}
                    >
                        <div className="main-table-filter-elements">

                            <Form.Item
                                name="StartDate"
                            // label={t("startDate")}
                            >
                                <DatePicker
                                    format="DD.MM.YYYY"
                                    className='datepicker'
                                    placeholder={t("startDate")}
                                />
                            </Form.Item>

                            <Form.Item
                                name="EndDate"
                            // label={t("endDate")}
                            >
                                <DatePicker
                                    format="DD.MM.YYYY"
                                    className='datepicker'
                                    placeholder={t("endDate")}
                                />
                            </Form.Item>
                            <Button type="primary" htmlType="submit">
                                <i className="feather icon-refresh-ccw" />
                            </Button>
                            <Button type="primary" onClick={handlePrint}>
                                <i className="feather icon-printer" />
                            </Button>
                        </div>
                    </Form>
                </div>
            </Fade>

            <Fade>
                <TableData
                    tableData={tableData} total={total} match={match}
                    reduxList={reduxList}
                />
            </Fade>
        </Card>
    )
}

export default React.memo(SentPaymentOrder);