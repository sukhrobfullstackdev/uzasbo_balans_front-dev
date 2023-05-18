import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Input, Select, Form, Button } from 'antd';
import Fade from "react-reveal/Fade";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link } from "react-router-dom";

import { getListStartAction, setListFilter, setListFilterType, setListPagination } from './_redux/usersSlice';
import TableUsers from './components/TableUsers';
import Card from "../../../components/MainCard";

const { Option } = Select;

const Users = ({ match }) => {
    const { t } = useTranslation();
    const [filterForm] = Form.useForm();
    const dispatch = useDispatch();
    const location = useLocation();
    const userList = useSelector((state) => state.userList);

    const [filterType, setFilterType] = useState(userList.filterType);
    const filterValue = userList.filterData[`${filterType}`];

    let tableData = userList.listSuccessData?.rows;
    let total = userList.listSuccessData?.total;
    let pagination = userList?.paginationData;
    let filter = userList?.filterData;

    useEffect(() => {
        dispatch(
            getListStartAction({
                ...pagination,
                ...filter,
            })
        );
    }, [pagination, filter, dispatch]);

    function filterTypeHandler(value) {
        setFilterType(value);
        filterForm.setFieldsValue({
            search:null
        })
    }

    const onSearch = (search) => {
        dispatch(setListFilterType({
            filterType: filterType,
        }));
        dispatch(setListFilter({
            [filterType]: search,
        }));
        dispatch(
            setListPagination({
                PageNumber: 1,
                PageLimit: 10,
            })
        );
    };

    // const resetField = () =>{
    //     filterForm.setFields({
    //         search:null
    //     })
    // }

    return (
        <Card title={t("User")}>
            <Fade>
                <Form
                    layout='vertical'
                    form={filterForm}
                    className='table-filter-form'
                    initialValues={{
                        filterType: filterType,
                        search: filterValue,
                    }}
                >
                    <div className="main-table-filter-elements">
                        <Form.Item
                            name="filterType"
                            label={t("Filter Type")}
                        >
                            <Select
                                allowClear
                                style={{ width: 180 }}
                                placeholder={t("Filter Type")}
                                onChange={filterTypeHandler}
                            >
                                <Option value="ID">{t('id')}</Option>
                                <Option value="Name">{t('name')}</Option>
                                <Option value="DisplayName">{t('FullName')}</Option>
                                <Option value="State">{t('State')}</Option>
                                <Option value="OrganizationName">{t('orgFullName')}</Option>
                                <Option value="OrganizationINN">{t('INN')}</Option>
                                <Option value="OrganizationID">{t('CodeOrg')}</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label={t("search")}
                            name="search"
                        >
                            <Input.Search
                                enterButton
                                placeholder={t("search")}
                                onSearch={onSearch}
                                
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" style={{marginTop:30}}>
                                <Link to={`${location.pathname}/add`}>
                                    {/* {t("add-new")}&nbsp; */}
                                    <i className="fa fa-plus" aria-hidden="true" />
                                </Link>
                            </Button>
                        </Form.Item>
                        {/* <Button type="primary" onClick={handleClearParams} >
                        <i className="feather icon-refresh-ccw" />
                        </Button> */}
                    </div>
                </Form>
            </Fade >
            <Fade>
                <TableUsers tableData={tableData} total={total} match={match} />
            </Fade>
        </Card >
    )
}

export default Users;