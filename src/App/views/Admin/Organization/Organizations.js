import { Button, Input, Select, Form, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation, withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Fade from "react-reveal/Fade";
// import { withRouter } from 'react-router-dom';
import { useLocation, Link } from "react-router-dom";
import { CSSTransition } from 'react-transition-group';
import OrganizationServices from "../../../../services/Admin/Organization/Organization.services";
import Card from "../../../components/MainCard";
import TableOrganizations from './components/TableOrganizations';
import { getListStartAction, setListFilter, setListFilterType, setListPagination } from './_redux/organizationsSlice';
import FilterModal from './Modals/FilterModal';
const { Option } = Select;

const Organizations = ({ match }) => {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const location = useLocation();

    const organizationList = useSelector((state) => state.organizationList);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [filterForm] = Form.useForm();
    let tableData = organizationList.listSuccessData?.rows;
    let total = organizationList.listSuccessData?.total;
    let pagination = organizationList?.paginationData;
    let filter = organizationList?.filterData;

    useEffect(() => {
        dispatch(
            getListStartAction({
                ...pagination,
                ...filter,
            })
        );
    }, [pagination, filter]);

    const [filterType, setFilterType] = useState(organizationList.filterType);

    const [filterValue, setFilterValue] = useState(organizationList.filterData[`${filterType}`]);

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

    // const onFinish = (values) => {
    //     console.log(values);
    //     // values.BeginDate = values.BeginDate.format("DD.MM.YYYY");
    //     // values.EndDate = values.EndDate.format("DD.MM.YYYY");
    //     dispatch(setListFilterType({
    //         filterType: values?.filterType,
    //     }));
    //     dispatch(setListFilter({
    //         ...values,
    //         Status: values?.Status,
    //         [values?.filterType]: values?.Search,
    //         BeginDate: values?.BeginDate,
    //         EndDate: values?.EndDate,
    //     }));
    // };


    // Filter modal
    const submitFilterDataHandler = (modalValues) => {
        console.log(modalValues);
        OrganizationServices.postDataRecalcAccAccountBookOrganization(modalValues)
            .then(res => {
                dispatch(
                    setListPagination({
                        PageNumber: 1,
                        PageLimit: 10,
                    })
                );
                setFilterModalVisible(false);
                //onFinish({ ...values, ...modalValues });
            })
            .catch(err => {
                Notification('error', err);
                setFilterModalVisible(false);
              })
        setFilterModalVisible(false);
    }


    return (

        <Card title={t("Organization")}>
            <Fade>
                <Form

                    layout='vertical'
                    form={filterForm}
                   // onFinish={onFinish}
                    className='table-filter-form'
                    initialValues={{
                        //   ...tableFilterData,
                        //   filterType: filterType,
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
                                        <Option value="INN">{t('INN')}</Option>
                                        <Option value="Name">{t('name')}</Option>
                                        <Option value="Oblast">{t('Oblast')}</Option>
                                        <Option value="Region">{t('Region')}</Option>
                                        {/* <Option value="Headerorganization">{t('Headerorganization')}</Option> */}
                                    </Select>
                                </div>
                                <div>
                                    {/* <label>{t("search")}</label> */}
                                    <Input.Search
                                        className="table-search"
                                        placeholder={t("search")}
                                        enterButton
                                        onSearch={onSearch}
                                        onChange={onSearchChange}
                                        value={filterValue}
                                    />
                                </div>
                                <Tooltip title={t('refresh')}>
                                <Button type="primary" onClick={handleClearParams} >
                                    <i className="feather icon-refresh-ccw" />
                                </Button>
                                </Tooltip>
                                <Tooltip title={t('Prerashot')}>
                                <Button type="primary" onClick={() => setFilterModalVisible(true)}>
                                    <i className="feather icon-command" />
                                </Button>
                                </Tooltip>
                                <Form.Item>
                                <Tooltip title={t('add-new')}>
                                    <Button type="primary">
                                        <Link to={`${location.pathname}/add`}>
                                           
                                            <i className="fa fa-plus" aria-hidden="true" />
                                        </Link>
                                    </Button>
                                    </Tooltip>
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                </Form>
            </Fade>
            <Fade>
                <TableOrganizations tableData={tableData} total={total} match={match} />
            </Fade>

            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={filterModalVisible}
                timeout={300}
            >
                <FilterModal
                    visible={filterModalVisible}
                    onCancel={() => setFilterModalVisible(false)}
                    onCreate={submitFilterDataHandler}

                />
            </CSSTransition>
        </Card>
    )
};

export default Organizations;