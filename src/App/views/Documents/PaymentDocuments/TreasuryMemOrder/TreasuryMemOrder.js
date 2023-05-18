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
import HelperServices from "./../../../../../services/Helper/helper.services";

const { Option } = Select;

const TreasuryMemOrder = ({ match }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [filterForm] = Form.useForm();
    const location = useLocation();

    const treasuryMemOrderList = useSelector((state) => state.treasuryMemOrderList);

    let tableData = treasuryMemOrderList.listSuccessData?.rows;
    let total = treasuryMemOrderList.listSuccessData?.total;
    let pagination = treasuryMemOrderList?.paginationData;
    let filter = treasuryMemOrderList?.filterData;

    useEffect(() => {
        dispatch(
            getListStartAction({
                ...pagination,
                ...filter,
            })
        );
    }, [dispatch, pagination, filter]);

    const [orgSettleList, setOrgSettleList] = useState([]);

    useEffect(() => {
        const getFilterParamData = async () => {
            const [orgSettleLs] = await Promise.all([
                HelperServices.getOrgSettAccList(),

            ]);
            setOrgSettleList(orgSettleLs.data);
        }
        getFilterParamData().catch(err => Notification('error', err))
    }, []);

    const getList = (values) => {
        dispatch(setListFilter({
            ...values
        }));
    };

    // const [filterType, setFilterType] = useState(paymentOrderList.filterType);
    const [filterModal, setFilterModal] = useState(treasuryMemOrderList.filterType);
    const [OrganizationsSettlementAccountID, setOrganizationsSettlementAccountID] = useState(0);

    // function filterTypeHandler(value) {
    //     setFilterType(value);
    // };

    // const onSearch = () => {
    //     filterForm.validateFields()
    //         .then(values => {
    //             values.StartDate = values.StartDate.format("DD.MM.YYYY");
    //             values.EndDate = values.EndDate.format("DD.MM.YYYY");
    //             dispatch(setListFilterType({
    //                 filterType: filterType,
    //             }));
    //             getList(values);
    //         });
    // };

    const onFilter = (filterValues) => {
        filterForm.validateFields()
            .then(values => {
                values.StartDate = values.StartDate.format("DD.MM.YYYY");
                values.EndDate = values.EndDate.format("DD.MM.YYYY");
                // dispatch(setListFilterType({
                //     filterType: filterType,
                // }));
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
        <Card title={t("TreasuryMemOrder")}>
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
                                name="OrganizationsSettlementAccountID"
                                label={t("organizationsSett")}
                            >
                                <Select
                                    allowClear
                                    showSearch
                                    placeholder={t("organizationsSett")}
                                    style={{ width: 250 }}
                                    optionFilterProp="children"
                                    //   onChange={(id) => setOrgSettleAccId( id )}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    onChange={e => setOrganizationsSettlementAccountID(e)}
                                >
                                    {orgSettleList.map(item => <Option key={item.ID} value={item.ID}>{item.Code}</Option>)}
                                </Select>
                            </Form.Item>

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

                            <Button type="primary" onClick={() => setFilterModal(true)}>
                                <i className="feather icon-filter" />
                            </Button>

                            <Button type="primary" htmlType="submit">
                                <i className="feather icon-refresh-ccw" />
                            </Button>
                            <Form.Item>
                                <Button type="primary" disabled={!OrganizationsSettlementAccountID}>
                                    <Link
                                        to={`${location.pathname}/add?id=0&OrganizationsSettlementAccountID=${OrganizationsSettlementAccountID}`}
                                    >
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
                <TableData
                    tableData={tableData} total={total} match={match}
                    reduxList={treasuryMemOrderList}
                    OrganizationsSettlementAccountID={OrganizationsSettlementAccountID}
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

export default React.memo(TreasuryMemOrder);