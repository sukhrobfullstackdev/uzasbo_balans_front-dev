import { Button, Form, Input, Tooltip, Spin } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Fade from "react-reveal/Fade";

import Card from "../../../../components/MainCard";
import TableData from './components/TableData';
import { getListStartAction, setListFilter } from './_redux/getListSlice';

// const { Option } = Select;

const Currency = () => {
    const { t } = useTranslation();
    const [filterForm] = Form.useForm();
    const dispatch = useDispatch();
    const tableList = useSelector((state) => state.currencyList);
    const tablePagination = tableList?.paginationData;
    const tableFilterData = tableList?.filterData;
    const mainLoader = tableList?.mainLoader;
    const filterSearchVal = tableList.filterData[`${tableList?.filterType}`];

    const [filterType, setFilterType] = useState(tableList?.filterType);

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

    const onSearch = () => {
        filterForm.validateFields()
            .then(values => {
                onFinish(values);
            })
    };



    return (
        <Spin size='large' spinning={mainLoader}>
            <Card title={t("currency")}>
                <Fade>
                    <div className="main-table-filter-wrapper">
                        <Form
                            layout='vertical'
                            form={filterForm}
                            onFinish={onFinish}
                            className='table-filter-form'
                            initialValues={{
                                ...tableFilterData,
                                filterType: filterType,
                                Search: filterSearchVal,
                                
                            }}
                        >
                            <div className="main-table-filter-wrapper">

                                <Form.Item
                                    label={t("Currency")}
                                    name="Code"
                                >
                                    <Input.Search
                                        placeholder={t("Currency")}
                                        enterButton
                                        onChange={filterTypeHandler}
                                        onSearch={onSearch}
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Tooltip title={t('refresh')}>
                                        <Button type="primary" htmlType="submit">
                                            <i className="feather icon-refresh-ccw" />
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
        </Spin>
    )
}

export default Currency;