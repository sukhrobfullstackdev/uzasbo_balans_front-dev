import React, { useEffect } from 'react'
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getListStartAction, setListFilter, setListFilterType, setListPagination } from './_redux/changeDocStatusSlice';
import Fade from "react-reveal/Fade";

import Card from "../../../components/MainCard";
import { Button, Input, Select } from 'antd';
import TableChangeDocStatus from './components/TableChangeDocStatus';
import AddDocument from './components/AddDocument';

const { Option } = Select;

const ChangeDocStatus = () => {

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const docStatusList = useSelector((state) => state.changeDocSatus);

    let tableData = docStatusList.listSuccessData?.rows;
    let total = docStatusList.listSuccessData?.total;
    let pagination = docStatusList?.paginationData;
    let filter = docStatusList?.filterData;

    useEffect(() => {
        dispatch(
            getListStartAction({
                ...pagination,
                ...filter,
            })
        );
    }, [pagination, filter]);

    const [filterType, setFilterType] = useState(docStatusList.filterType);
    const [filterValue, setFilterValue] = useState(docStatusList.filterData.Search);

    function filterTypeHandler(value) {
        setFilterType(value);
    }

    const onSearchChange = (event) => {
        setFilterValue(event.target.value)
    }

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

    function handleClearParams() {
        setFilterType(null);
        setFilterValue('');
        dispatch(setListFilterType({
            filterType: null,
        }));
        dispatch(setListFilter({}));
        dispatch(
            setListPagination({
                PageNumber: 1,
                PageLimit: 10,
            })
        );
    };

    return (
        <Card title={t("changeDocumentStatus")}>
            <Fade>
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
                                    <Option value="Search">{t('Name')}</Option>
                                    <Option value="INN">{t('OrgINN')}</Option>
                                </Select>
                            </div>
                            <div>
                                <Input.Search
                                    className="table-search"
                                    placeholder={t("search")}
                                    enterButton
                                    onSearch={onSearch}
                                    onChange={onSearchChange}
                                    value={filterValue}
                                />
                            </div>

                            <Button
                                type="primary"
                                onClick={handleClearParams}
                            >
                                <i className="feather icon-refresh-ccw" />
                            </Button>
                            <AddDocument />
                        </div>
                    </div>
                </div>
            </Fade>
            <Fade>
                <TableChangeDocStatus tableData={tableData} total={total} />
            </Fade>
        </Card>
    )
}

export default ChangeDocStatus;