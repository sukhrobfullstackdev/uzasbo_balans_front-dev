import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Tabs, Button, Form, Input, Tooltip, Spin, Select, Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, Link } from "react-router-dom";
import Fade from "react-reveal/Fade";

import TableData from './components/TableData';
import Card from "../../../../App/components/MainCard";
import { getListStartAction, setListFilter } from './_redux/getListSlice';
import { Notification } from '../../../../helpers/notifications';
import HelperServices from "../../../../services/Helper/helper.services";
import OrganizationsDocSettAccountServices from "../../../../services/References/Global/OrganizationsDocSettAccount/OrganizationsDocSettAccount.services"

const { Option } = Select;

const { TabPane } = Tabs;
function callback(key) {
}

const OrganizationsDocSettAccount = () => {
  const { t } = useTranslation();
  const [filterForm] = Form.useForm();
  const [filterForm1] = Form.useForm();
  const [filterForm2] = Form.useForm();
  const location = useLocation();
  const dispatch = useDispatch();
  const tableList = useSelector((state) => state.OrganizationsDocSettAccountList);
  const tablePagination = tableList?.paginationData;
  const tableFilterData = tableList?.filterData;
  const mainLoader = tableList?.mainLoader;
  const filterSearchVal = tableList.filterData[`${tableList?.filterType}`];

  const [filterType, setFilterType] = useState(tableList?.filterType);
  const [oblastList, setOblastList] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [tableData1, setTableData1] = useState([]);
  const [settlefilterValues, setFilterValues] = useState({});
  const [loader, setLoader] = useState(false);

  // const [settlementTablePagination, setSettlementTablePagination] = useState({
  //   settlementTablePagination: {
  //     current: 1,
  //     pageSize: 10
  //   }
  // });


  useEffect(() => {
    const getFilterParamData = async () => {
      const [oblList, tableData, tableData1] = await Promise.all([
        HelperServices.getRegionList(),
        OrganizationsDocSettAccountServices.getSettlmentList(1, 10),
        OrganizationsDocSettAccountServices.getNoSettlmentList(1, 10)
      ]);
      setOblastList(oblList.data);
      setTableData(tableData.data.rows);
      setTableData1(tableData1.data.rows);
    }
    getFilterParamData().catch(err => Notification('error', err))
  }, []);

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

  const onSearch1 = () => {
    filterForm1.validateFields()
      .then(values => {
        fetchSattlementTableData(values);
      })

  };

  const onSearch2 = () => {
    filterForm2.validateFields()
      .then(values => {
        fetchSattlementTableData1(values);
      })

  };

  const currentRegionChangeHandler = (id) => {
    filterForm.setFieldsValue({ OblastID: null });
    HelperServices.getDistrictList(id)
      .then(response => {
        setRegionList(response.data)
      })
      .catch((err) => Notification('error', err));
  }

  const handleTableChange = (pagination, filters, sorter) => {
    fetchSattlementTableData({
      sortField: sorter.field,
      sortOrder: sorter.order,
      pagination,
      ...filters,
    }, settlefilterValues)
  }

  const fetchSattlementTableData = (values) => {
    setLoader(true);
    // let orderType = params.sortOrder,
    //   sortColumn = params.sortField

    OrganizationsDocSettAccountServices.getSettlmentList(values.Search)
      .then((res) => {
        if (res.status === 200) {
          setTableData(res.data.rows);
          setLoader(false);
          // setSettlementTablePagination({
          //   settlementTablePagination: {
          //     ...params.pagination,
          //     total: res.data.total,
          //   },
          // });
        }
      })
      .catch((err) => {
        Notification('error', err);
        setLoader(false);
      });
  }

  const fetchSattlementTableData1 = (values) => {
    setLoader(true);

    OrganizationsDocSettAccountServices.getNoSettlmentList(values.Search)
      .then((res) => {
        if (res.status === 200) {
          setTableData1(res.data.rows);
          setLoader(false);
        }
      })
      .catch((err) => {
        Notification('error', err);
        setLoader(false);
      });
  }


  // const tableFilterHandler = (values) => {
  //   // console.log(values)
  //   const { settlementTablePagination: pagination } = settlementTablePagination;
  //   setFilterValues(values);
  //   fetchSattlementTableData({ pagination }, values);
  // }

  const columns = [
    {
      title: t("id"),
      dataIndex: "ID",
      key: "ID",
      sorter: true,
      // width: 100,
    },

    {
      title: t("parentorganizationName"),
      dataIndex: "parentorganizationName",
      key: "parentorganizationName",
      // width: 150,
      // sorter: true,
    },
    {
      title: t("parentorganizationINN"),
      dataIndex: "parentorganizationINN",
      key: "parentorganizationINN",
      width: 150,
      sorter: true,
    },
    {
      title: t("organizationName"),
      dataIndex: "organizationName",
      key: "organizationName",
      //width: 100,
      // sorter: true,
    },
    {
      title: t("organizationINN"),
      dataIndex: "organizationINN",
      key: "organizationINN",
      width: 130,
      sorter: true,
    },
    {
      title: t("name"),
      dataIndex: "Name",
      key: "Name",
      width: 100,
      // sorter: true,
    },
    {
      title: t("Code"),
      dataIndex: "Code",
      key: "Code",
      width: 80,
      // sorter: true,
    },
    {
      title: t("SettleCodeLevel"),
      dataIndex: "SettleCodeLevel",
      key: "SettleCodeLevel",
      width: 120,
      // sorter: true,
    },
    {
      title: t("OrganizationFunctionalItemCode"),
      dataIndex: "OrganizationFunctionalItemCode",
      key: "OrganizationFunctionalItemCode",
      width: 150,
      // sorter: true,
    },
  ];

  const columns1 = [
    {
      title: t("id"),
      dataIndex: "ID",
      key: "ID",
      sorter: true,
      // width: 100,
    },

    {
      title: t("organizationName"),
      dataIndex: "organizationName",
      key: "organizationName",
      // width: 150,
      sorter: true,
    },
    {
      title: t("INN"),
      dataIndex: "INN",
      key: "INN",
      // width: 100,
      sorter: true,
    },
    {
      title: t("settlementAccountName"),
      dataIndex: "settlementAccountName",
      key: "settlementAccountName",
      // width: 100,
      sorter: true,
    },
    {
      title: t("settlementAccountCode"),
      dataIndex: "settlementAccountCode",
      key: "settlementAccountCode",
      // width: 100,
      sorter: true,
    },



  ];

  // const { settlementTablePagination: slrCalcTablePagination } = settlementTablePagination;

  return (
    <Spin size='large' spinning={mainLoader}>
      <Card title={t("OrganizationsDocSettAccount")}>
        <Fade>

          <Tabs defaultActiveKey="1" onChange={callback}>

            <TabPane tab={t("organization")} key="1">
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
                        label={t("Search")}
                        name="Search"
                      >
                        <Input.Search
                          placeholder={t("Search")}
                          enterButton
                          onChange={filterTypeHandler}
                          onSearch={onSearch}
                        />
                      </Form.Item>

                      <Form.Item
                        name="OblastId"
                        label={t("OblastID")}
                      >
                        <Select
                          allowClear
                          showSearch
                          placeholder={t("OblastID")}
                          style={{ width: 200 }}
                          optionFilterProp="children"
                          onChange={currentRegionChangeHandler}
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {oblastList.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
                        </Select>
                      </Form.Item>

                      <Form.Item
                        name="RegionId"
                        label={t("RegionID")}
                      >
                        <Select
                          allowClear
                          showSearch
                          placeholder={t("RegionID")}
                          style={{ width: 200 }}
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {regionList.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
                        </Select>
                      </Form.Item>

                      <Form.Item>
                        <Tooltip title={t('refresh')}>
                          <Button type="primary" htmlType="submit">
                            <i className="feather icon-refresh-ccw" />
                          </Button>
                        </Tooltip>
                      </Form.Item>
                      <Form.Item>
                        <Tooltip title={t("add-new")}>
                          <Button type="primary">
                            <Link to={`${location.pathname}/add`}>
                              {/* {t("add-new")}&nbsp; */}
                              <i className="fa fa-plus" aria-hidden="true" />
                            </Link>
                          </Button>
                        </Tooltip>
                      </Form.Item>
                    </div>
                  </Form>
                </div>
                <TableData />
              </Fade>
            </TabPane>

            <TabPane tab={t("Settlement")} key="2">
              <Fade>
                <div className="main-table-filter-wrapper">
                  <Form
                    layout='vertical'
                    form={filterForm1}
                    // onFinish={tableFilterHandler}
                    className='table-filter-form'
                  >
                    <div className="main-table-filter-wrapper">

                      <Form.Item
                        label={t("Search")}
                        name="Search"
                      >
                        <Input.Search
                          placeholder={t("Search")}
                          enterButton
                          onChange={filterTypeHandler}
                          onSearch={onSearch1}
                        />
                      </Form.Item>
                    </div>
                  </Form>
                </div>
                {/* <SettelmentTableData /> */}
                <Table
                  bordered
                  size="middle"
                  rowClassName="table-row"
                  className="main-table"
                  columns={columns}
                  loading={loader}
                  dataSource={tableData}
                  onChange={handleTableChange}
                  scroll={{
                    x: "max-content",
                    y: '50vh'
                  }}
                  // pagination={{
                  //   ...slrCalcTablePagination,
                  //   showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
                  // }}
                />
              </Fade>
            </TabPane>

            <TabPane tab={t("NoSettlement")} key="3">
              <Fade>
                <div className="main-table-filter-wrapper">
                  <Form
                    layout='vertical'
                    form={filterForm2}
                    // onFinish={onFinish}
                    className='table-filter-form'
                  >
                    <div className="main-table-filter-wrapper">
                      <Form.Item
                        label={t("Search")}
                        name="Search"
                      >
                        <Input.Search
                          placeholder={t("Search")}
                          enterButton
                          onChange={filterTypeHandler}
                          onSearch={onSearch2}
                        />
                      </Form.Item>

                    </div>
                  </Form>
                </div>
                {/* <NoSettelmentTableData /> */}
                <Table
                  bordered
                  size="middle"
                  rowClassName="table-row"
                  className="main-table"
                  columns={columns1}
                  loading={loader}
                  dataSource={tableData1}
                  onChange={handleTableChange}
                  scroll={{
                    x: "max-content",
                    y: '50vh'
                  }}
                />
              </Fade>
            </TabPane>
          </Tabs>
        </Fade>
      </Card>
    </Spin>
  )
};

export default OrganizationsDocSettAccount;