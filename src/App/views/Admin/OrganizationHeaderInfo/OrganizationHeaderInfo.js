import React, { useEffect } from 'react'
import { Button, Form, Input, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getListStartAction, setListFilter, setListFilterType } from './_redux/orgHeaderInfoSlice';
import Fade from "react-reveal/Fade";
import { useLocation, Link } from "react-router-dom";
// import moment from 'moment';

import Card from "../../../components/MainCard";
import TablePrefOrgs from './components/TablePrefOrgs';

const { Option } = Select;

const PreferentialOrganizations = ({ match }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [filterForm] = Form.useForm();
    const location = useLocation();

    const orgHeaderInfoList = useSelector((state) => state.orgHeaderInfoList);

    let tableData = orgHeaderInfoList.listSuccessData?.rows;
    let total = orgHeaderInfoList.listSuccessData?.total;
    let pagination = orgHeaderInfoList?.paginationData;
    let filter = orgHeaderInfoList?.filterData;

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
            SettleCode: values?.SettleCode,
            Status: values?.Status,
            DprName: values?.DprName,
            [values?.filterType]: values?.Search,
            StartDate: values?.StartDate,
            EndDate: values?.EndDate,
        }));
    };

    const onSearch = (Search) => {
        filterForm.validateFields()
            .then(values => {
                // values.StartDate = values.StartDate.format("DD.MM.YYYY");
                // values.EndDate = values.EndDate.format("DD.MM.YYYY");
                dispatch(setListFilterType({
                    filterType: values?.filterType,
                }));
                getList(values);
            });
    }

    const onFinish = (values) => {
        // values.StartDate = values.StartDate.format("DD.MM.YYYY");
        // values.EndDate = values.EndDate.format("DD.MM.YYYY");
        dispatch(setListFilterType({
            filterType: values?.filterType,
        }));
        getList(values);
    };

    return (
        <Card title={t("OrganizationHeaderInfo")}>
            <Fade>
                <div className="table-top">
                    <Form
                        form={filterForm}
                        onFinish={onFinish}
                        className='table-filter-form'
                    // initialValues={{
                    //     EndDate: moment().add(30, "days"),
                    //     StartDate: moment().subtract(30, "days"),
                    // }}
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
                <TablePrefOrgs tableData={tableData} total={total} match={match} />
            </Fade>
        </Card>
    )
}

export default PreferentialOrganizations;