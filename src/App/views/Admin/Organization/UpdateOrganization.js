import React, { useCallback, useState, useEffect } from "react";
import { Row, Col, Form, Button, Input, Spin, Space, Tabs, Card, Select, Table, Popconfirm, Tag, Tooltip, DatePicker } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import Fade from 'react-reveal/Fade';
import { SearchOutlined, DeleteOutlined, ExclamationCircleOutlined, CheckSquareOutlined, MinusCircleOutlined, MinusSquareOutlined, CheckCircleFilled } from "@ant-design/icons";
import { CSSTransition } from 'react-transition-group';
import HelperServices from "../../../../services/Helper/helper.services";
import moment from "moment";
import MainCard from "../../../components/MainCard";
import { Notification } from "../../../../helpers/notifications";
import OrganizationModal from "./OrganizationModal";
import OrganizationServices from "../../../../services/Admin/Organization/Organization.services";
import classes from "./EmployeeMovement.module.css";
import SettlementAccountModal from "./Modals/SettlementAccount.Modal";
import FunctionalItemModal from "./Modals/FunctionalItem.Modal";
import EditFunctionalItemModal from "./Modals/EditFunctionalItemModal";
import SignModal from "./Modals/Sign.Modal";
import EsitSignModal from "./Modals/EditSignModal";
import DocSettAccountModal from "./Modals/DocSettAccountModal";
import EditDocSettAccountModal from "./Modals/EditDocSettAccountModal";
import EditSettlementAccountModal from "./Modals/EditSettlementAccountModal";

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};
const { TabPane } = Tabs;
const { Option } = Select;

const UpdateOrganization = (props) => {
  const [employeeEnrQualicationModal, setEmployeeEnrQualicationModal] = useState(false);
  const [headerId, setHeaderId] = useState(null);
  const [FinancingLevel, setFinancingLevel] = useState([]);
  const [docId] = useState(props.match.params.id ? props.match.params.id : 0[0]);
  const [loader, setLoader] = useState(true);
  const [chapter, setChapter] = useState([]);
  const [okedList, setOkedList] = useState([]);
  const [region, setRegion] = useState([]);
  const [district, setDistrict] = useState([]);
  const [organizationTypeList, setOrganizationTypeList] = useState([]);
  const [HeaderOrganization, setHeaderOrganization] = useState([]);
  const [, setTableEdited] = useState(false);

  const [tablePagination, setTablePagination] = useState({
    pagination: {
      current: 1,
      pageSize: 50
    }
  });

  //Modals  settlementAccount
  const [settlementAccountVisible, setSettlementAccountVisible] = useState(false);
  const [editsettlementAccountVisible, setEditSettlementAccountVisible] = useState(false);
  const [settlementAccountData, setSettlementAccountData] = useState([]);
  const [editsettlementAccountData, setEditSettlementAccountData] = useState([]);
  //FunctionalItemModal
  const [functionalItemModalVisible, setFunctionalItemModalVisible] = useState(false);
  const [functionalItemModalData, setFunctionalItemModalData] = useState([]);
  const [editfunctionalItemModalVisible, setEditFunctionalItemModalVisible] = useState(false);
  const [editfunctionalItemModalData, setEditFunctionalItemModalData] = useState([]);
  //FunctionalItemModal
  const [SignModalVisible, setSignModalVisible] = useState(false);
  const [SignModalData, setSignModalData] = useState([]);
  const [editSignModalData, setEditSignModalData] = useState([]);
  const [EditSignModalVisible, setEditSignModalVisible] = useState(false);

  //DocSettAccountModal
  const [DocSettAccountModalVisible, setDocSettAccountModalVisible] = useState(false);
  const [DocSettAccountModalData, setDocSettAccountModalData] = useState([]);
  const [editDocSettAccountModalVisible, setEditDocSettAccountModalVisible] = useState(false);
  const [editDocSettAccountModalData, setEditDocSettAccountModalData] = useState([]);

  //table filter
  const [userUNSsModelFilter, setUserUNSsModelFilter] = useState([]);
  const [userUNSsModel1Filter, setUserUNSsModel1Filter] = useState([]);
  const [userUNSsModel2Filter, setUserUNSsModel2Filter] = useState([]);



  const { t } = useTranslation();
  const history = useHistory();
  const [mainForm] = Form.useForm();
  const { size } = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [organizationLs, chapter, okedList, regionList, organizationTypeList, HeaderOrganization] = await Promise.all([OrganizationServices.getById(props.match.params.id ? props.match.params.id : 0),
        HelperServices.getChapterList(),
        HelperServices.GetOKEDList(),
        HelperServices.getRegionList(),
        HelperServices.getOrganizationTypeList(),
        HelperServices.getHeaderOrganizationList()

        ]);

        if (props.match.params.id) {
          const districtList = await HelperServices.getDistrictList(organizationLs.data.OblastID);
          setDistrict(districtList.data)
        }
        setChapter(chapter.data)
        setOkedList(okedList.data)
        setRegion(regionList.data);
        setOrganizationTypeList(organizationTypeList.data);
        setHeaderOrganization(HeaderOrganization.data);
        setSettlementAccountData(organizationLs.data.SettlementAccount)
        setUserUNSsModelFilter(organizationLs.data.SettlementAccount)
        setFunctionalItemModalData(organizationLs.data.FunctionalItem)
        setUserUNSsModel1Filter(organizationLs.data.FunctionalItem)
        setSignModalData(organizationLs.data.Sign)
        setDocSettAccountModalData(organizationLs.data.DocSettAccount)
        setUserUNSsModel2Filter(organizationLs.data.DocSettAccount)
        setLoader(false);

        setTablePagination((prevState) => (
          {
            pagination: {
              ...prevState.pagination,
              total: organizationLs.data.SettlementAccount
            }
          }
        ));
        mainForm.setFieldsValue({

          ...organizationLs.data,
          IncomeDate: moment(organizationLs.data.IncomeDate, 'DD.MM.YYYY'),

        })

      } catch (err) {
        Notification('error', err);
        setLoader(false);
      }
    }
    fetchData();
  }, [props.match.params.id, mainForm]);

  const getHeaderStaffListOrganizationName = (name, FinancingLevel, HeaderID) => {
    setHeaderId(HeaderID);
    setFinancingLevel(FinancingLevel)

    mainForm.setFieldsValue({ CentralOrganizationName: name });
  };
  const onReset = () => {
    mainForm.setFieldsValue({ CentralOrganizationName: null });
  };

  const innHandler = () => {
    // setLoader(true);
    // mainForm.validateFields()
    //     .then((values) => {

    console.log(mainForm.getFieldValue('INN'))
    setLoader(true);
    HelperServices.getCheckINNOrganization(mainForm.getFieldValue('INN'))
      .then(res => {
        if (res.status === 200) {
          Notification("success", t("checked"));
          setLoader(false);

        }
      })
      .catch(err => {
        Notification('error', err)
        setLoader(false);
      })
    // })
    // .catch(err => {
    //     Notification('error', err);
    //     setLoader(false);
    // })
  }

  const saveAllHandler = () => {
    setLoader(true);
    mainForm.validateFields()
      .then((values) => {

        setLoader(true);
        values.ID = +docId;
        values.CentralOrganizationID = headerId ? headerId : null;
        values.FinancingLevelID = 1;
        values.TreasuryBranchID = 1;
        values.IncomeDate = values.IncomeDate.format('DD.MM.YYYY');
        values.SettlementAccount = settlementAccountData;
        values.FunctionalItem = functionalItemModalData;
        values.Sign = SignModalData;
        values.DocSettAccount = DocSettAccountModalData;
        OrganizationServices.postData(values)
          .then(res => {
            if (res.status === 200) {
              Notification("success", t("saved"));
              setLoader(false);
              history.push('/Organization');
            }
          })
          .catch(err => {
            // console.log(err);
            Notification('error', err)
            setLoader(false);
          })
      })
      .catch(err => {
        // Notification('error', t(""));
        setLoader(false);
      })
  }

  // fillTableHandler
  const fillTableHandler = () => {
    setLoader(true);
    mainForm.validateFields()
      .then((values) => {

        setLoader(true);
        values.ID = +docId;
        values.CentralOrganizationID = headerId ? headerId : null;
        values.FinancingLevelID = 1;
        values.TreasuryBranchID = 1;
        values.IncomeDate = values.IncomeDate.format('DD.MM.YYYY');
        values.SettlementAccount = settlementAccountData;
        values.FunctionalItem = functionalItemModalData;
        values.Sign = SignModalData;
        values.DocSettAccount = DocSettAccountModalData;
        OrganizationServices.postFillData(values)
          .then(res => {
            if (res.status === 200) {
              console.log(res.data)
              setSettlementAccountData(res.data.SettlementAccount);
              setUserUNSsModelFilter(res.data.SettlementAccount);
              setFunctionalItemModalData(res.data.FunctionalItem)
              // setSignModalData(res.data.Sign)
              // setDocSettAccountModalData(res.data.DocSettAccount)
              setLoader(false);
            }
          })
          .catch(err => {
            // console.log(err);
            Notification('error', err)
            setLoader(false);
          })
      })
      .catch(err => {
        Notification('error', err);
      })
  }

  const regionChangeHandler = (id) => {
    mainForm.setFieldsValue({ RegionID: null });
    HelperServices.getDistrictList(id)
      .then(response => {
        setDistrict(response.data)
      })
      .catch((err) => Notification('error', err));
  }

  const { pagination } = tablePagination;

  //Table sort 



  // const onTableFilterHandler = (filterValues) => {
  //   const { pagination } = tablePagination;
  //   fetchTableData({ pagination }, filterValues);
  // };

  // const handleTableChange = (pagination, filters, sorter) => {
  //   fetchTableData({
  //     sortField: sorter.field,
  //     sortOrder: sorter.order,
  //     pagination,
  //     ...filters,
  //   });
  // };
  // Modal Setelment Account
  const closeSettlementAccountModal = useCallback(() => {
    setSettlementAccountVisible(false)
  }, []);

  const createSettlementAccountDataHandler = useCallback((values) => {

    Notification('success', t('success-msg'));
    setSettlementAccountData((prevState) => [values, ...prevState])
    setSettlementAccountVisible(false);
  }, [t]);



  const editSettlementAccountDataHandler = useCallback((values) => {
    setSettlementAccountData(values);
    setEditSettlementAccountVisible(false);
    Notification('success', t('edited'));
  }, [t]);


  const onSearchChange = (event) => {

    const filteredModels = userUNSsModelFilter.filter(model => model.Code.toLowerCase().includes(event.target.value.toLowerCase()));
    setSettlementAccountData(filteredModels);
   
  }

  const SettlementAccountColumns = [
    {
      title: t('id'),
      dataIndex: 'ID',
      key: 'ID',
      sorter: (a, b) => a.ID - b.ID,
      sortDirections: ['descend', 'ascend'],
      // sorter: {
      //   compare: (a, b) => a.math - b.math,
      //   multiple: 10,
      // },
    },
    {
      title: t('Name'),
      dataIndex: 'Name',
      key: 'Name',
      //sorter: (a, b) => a.Name - b.Name,
    },
    {
      title: t('Code'),
      dataIndex: 'Code',
      key: 'Code',
      sorter: (a, b) => a.Code - b.Code,
    },
    {
      title: t('TreasuryBranchName'),
      dataIndex: 'TreasuryBranchName',
      key: 'TreasuryBranchName',
    },
    {
      title: t('BankCode'),
      dataIndex: 'BankCode',
      key: 'BankCode',
      sorter: (a, b) => a.BankCode - b.BankCode,
    },
    {
      title: t('OrganizationFunctionalItemCode'),
      dataIndex: 'OrganizationFunctionalItemCode',
      key: 'OrganizationFunctionalItemCode',
      sorter: (a, b) => a.OrganizationFunctionalItemCode - b.OrganizationFunctionalItemCode,
    },
    {
      title: t('OutOfBalance'),
      dataIndex: 'OutOfBalance',
      key: 'OutOfBalance',
      sorter: (a, b) => a.OutOfBalance - b.OutOfBalance,
      align: 'center',
      width: 110,
      render: (record) => {
        if (record === true) {
          return (<CheckCircleFilled style={{ align: 'center', fontSize: '200%', color: "#56c427" }} />)
        } else if (record === false) {
          return (<MinusCircleOutlined style={{ align: 'center', fontSize: '200%', color: "blue" }} />)
        }
      }
    },
    {
      title: t('OrganizationID'),
      dataIndex: 'OrganizationID',
      key: 'OrganizationID',
      sorter: (a, b) => a.OrganizationID - b.OrganizationID,
      render: record => <div className="ellipsis-2">{record}</div>
      
    },
    {
      title: t('status'),
      dataIndex: 'StateID',
      key: 'StateID',      
      sorter: (a, b) => a.StateID - b.StateID,
      render: (record) => {
        if (record === 1) {
          return (<Tag color="#87d068" >{t('active')}</Tag>)
        } else if (record === 2) {
          return (<Tag color="#f50" >{t('passive')}</Tag>)
        }
      }
    },
    {
      title: t('actions'),
      key: 'action',
      align: 'center',
      render: (record) => {
        return (
          <Space size="middle">
            <Tooltip title={t('Edit')}>
              <span
                onClick={() => {
                  setEditSettlementAccountVisible(true);
                  setEditSettlementAccountData(record);
                }}
              >
                <i className={`feather icon-edit action-icon `} />
              </span>
            </Tooltip>

          </Space>
        )
      },
    },


  ];

  // Modal FunctionalItem

  const closeFunctionalItemModal = useCallback(() => {
    setFunctionalItemModalVisible(false)
  }, []);

  const createFunctionalItemHandler = useCallback((values) => {
    Notification('success', t('success-msg'));
    setFunctionalItemModalData((prevState) => [values, ...prevState])
    setFunctionalItemModalVisible(false);
  }, [t]);

  const editFunctionalItemHandler = useCallback((values) => {
    setFunctionalItemModalData(values)
    setEditFunctionalItemModalVisible(false);
    Notification('success', t('edited'));
  }, [t]);

  const onSearchChangeFunctionalItem = (event) => {

    const filteredModels = userUNSsModel1Filter.filter(model => model.Code.toLowerCase().includes(event.target.value.toLowerCase()));
    setFunctionalItemModalData(filteredModels);
    console.log(event.target.value)
    console.log(filteredModels)
  }

  const FunctionalItemColumns = [
    {
      title: t('id'),
      dataIndex: 'ID',
      key: 'ID',
      sorter: (a, b) => a.ID - b.ID,
    },
    {
      title: t('Code'),
      dataIndex: 'Code',
      key: 'Code',
      sorter: (a, b) => a.Code - b.Code,
    },
    {
      title: t('FunctionalItemCode'),
      dataIndex: 'FunctionalItemCode',
      key: 'FunctionalItemCode',
      sorter: (a, b) => a.FunctionalItemCode - b.FunctionalItemCode,
    },
    {
      title: t('ChapterCode'),
      dataIndex: 'ChapterCode',
      key: 'ChapterCode',
      sorter: (a, b) => a.ChapterCode - b.ChapterCode,
    },


    {
      title: t('actions'),
      key: 'action',
      align: 'center',
      render: (record) => {
        return (
          <Space size="middle">
            <Tooltip title={t('Edit')}>
              <span
                onClick={() => {
                  setEditFunctionalItemModalVisible(true);
                  setEditFunctionalItemModalData(record);
                }}
              >
                <i className={`feather icon-edit action-icon`} />
              </span>
            </Tooltip>

          </Space>
        )
      },
    },
  ];

  // Modal Sign

  const closeSignModal = useCallback(() => {
    setSignModalVisible(false)
  }, []);

  const createSignHandler = useCallback((values) => {
    Notification('success', t('success-msg'));
    setSignModalData((prevState) => [values, ...prevState])
    setSignModalVisible(false);
  }, [t]);


  const SignDeleteHandler = useCallback((record) => {
    setTableEdited(prevState => !prevState);
    record.Status = 3;
  }, [])

  const EditSignHandler = useCallback((values) => {
    setSignModalData(values)
    setEditSignModalVisible(false);
    Notification('success', t('edited'));
  }, [t]);

  const SignColumns = [
    {
      title: t('id'),
      dataIndex: 'ID',
      key: 'ID',
      sorter: (a, b) => a.ID - b.ID,
    },
    {
      title: t('FIO'),
      dataIndex: 'FIO',
      key: 'FIO',
      //sorter: (a, b) => a.FIO - b.FIO,
    },
    {
      title: t('SignNumber'),
      dataIndex: 'SignNumber',
      key: 'SignNumber',
      sorter: (a, b) => a.SignNumber - b.SignNumber,
    },
    {
      title: t('PositionNameRus'),
      dataIndex: 'PositionNameRus',
      key: 'PositionNameRus',
      //sorter: (a, b) => a.PositionNameRus - b.PositionNameRus,
    },
    {
      title: t('PositionNameUzb'),
      dataIndex: 'PositionNameUzb',
      key: 'PositionNameUzb',
    },


    {
      title: t('actions'),
      key: 'action',
      align: 'center',
      render: (record) => {
        return (
          <Space size="middle">
            <Tooltip title={t('Edit')}>
              <span
                onClick={() => {
                  setEditSignModalVisible(true);
                  setEditSignModalData(record);
                }}
                style={{ cursor: 'pointer', color: '#1890ff' }}
              >
                <i
                  className='feather icon-edit action-icon'
                  aria-hidden="true"
                />
              </span>
            </Tooltip>
            <Tooltip title={t('Delete')}>
              <Popconfirm
                // disabled={validPerson}
                title={t('delete')}
                okText={t('yes')}
                cancelText={t('cancel')}
                // onConfirm={() => {
                //   DocSettAccountColumnsDeleteHandler(record);
                //   Notification('warning', t('deleted'));
                // }}
                onConfirm={() => {
                  SignDeleteHandler(record);
                }}
              >
                <span>
                  <i className={`feather icon-trash-2 action-icon `} />
                </span>
              </Popconfirm>
            </Tooltip>
          </Space>
        )
      },
    },
  ];

  // Modal DocSettAccount

  const closeDocSettAccount = useCallback(() => {
    setDocSettAccountModalVisible(false)
  }, []);

  const closeEditDocSettAccount = useCallback(() => {
    setEditDocSettAccountModalVisible(false)
  }, []);

  const DocSettAccountHandler = useCallback((values) => {
    Notification('success', t('success-msg'));
    setDocSettAccountModalData((prevState) => [values, ...prevState])
    setDocSettAccountModalVisible(false);
  }, [t]);

  const EditDocSettAccountHandler = (values) => {
    Notification('success', t('edited'));
    setEditDocSettAccountModalVisible(false)
    setDocSettAccountModalData(values)


  };



  const DocSettAccountColumnsDeleteHandler = useCallback((record) => {
    setTableEdited(prevState => !prevState);
    record.Status = 3;
  }, [])

  const onSearchChangeDocSettAccount = (event) => {

    const filteredModels = userUNSsModel2Filter.filter(model => model.OrganizationsSettlementAccountCode.toLowerCase().includes(event.target.value.toLowerCase()));
    setDocSettAccountModalData(filteredModels);

  }
  const DocSettAccountColumns = [
    {
      title: t('id'),
      dataIndex: 'ID',
      key: 'ID',
       sorter: (a, b) => a.ID - b.ID,
    },
    {
      title: t('OrganizationName'),
      dataIndex: 'OrganizationName',
      key: 'OrganizationName',
    },
    {
      title: t('TableName'),
      dataIndex: 'TableName',
      key: 'TableName',
    },
    {
      title: t('OrganizationsSettlementAccountCode'),
      dataIndex: 'OrganizationsSettlementAccountCode',
      key: 'OrganizationsSettlementAccountCode',
       sorter: (a, b) => a.OrganizationsSettlementAccountCode - b.OrganizationsSettlementAccountCode,
    },
    {
      title: t('OrganizationFunctionalItemCode'),
      dataIndex: 'OrganizationFunctionalItemCode',
      key: 'OrganizationFunctionalItemCode',
      sorter: (a, b) => a.OrganizationFunctionalItemCode - b.OrganizationFunctionalItemCode,
    },
    {
      title: t('SettleCodeLevel'),
      dataIndex: 'SettleCodeLevel',
      key: 'SettleCodeLevel',
      sorter: (a, b) => a.SettleCodeLevel - b.SettleCodeLevel,
    },

    {
      title: t('status'),
      dataIndex: 'StateID',
      key: 'StateID',
      sorter: (a, b) => a.StateID - b.StateID,
      render: (record) => {
        if (record === 1) {
          return (<Tag color="#87d068" >{t('active')}</Tag>)
        } else if (record === 2) {
          return (<Tag color="#f50" >{t('passive')}</Tag>)
        }
      }
    },
    {
      title: t('actions'),
      key: 'action',
      align: 'center',
      render: (record) => {
        return (
          <Space size="middle">
            <Tooltip title={t('Edit')}>
              <span
                onClick={() => {
                  setEditDocSettAccountModalVisible(true);
                  setEditDocSettAccountModalData(record);
                }}
                style={{ cursor: 'pointer', color: '#1890ff' }}
              >
                <i
                  className='feather icon-edit action-icon'
                  aria-hidden="true"
                />
              </span>
            </Tooltip>
            <Tooltip title={t('Delete')}>
              <Popconfirm
                // disabled={validPerson}
                title={t('delete')}
                okText={t('yes')}
                cancelText={t('cancel')}
                // onConfirm={() => {
                //   DocSettAccountColumnsDeleteHandler(record);
                //   Notification('warning', t('deleted'));
                // }}
                onConfirm={() => {
                  DocSettAccountColumnsDeleteHandler(record);
                }}
              >
                <span>
                  <i className={`feather icon-trash-2 action-icon `} />
                </span>
              </Popconfirm>
            </Tooltip>
          </Space>
        )
      },
    },
  ];




  return (
    <Fade>
      <MainCard title={t('Organization')}>
        <Spin spinning={loader} size='large'>
          <Form
            {...layout}
            form={mainForm}
            id='mainForm'
            scrollToFirstError
          >
            <Row gutter={[16, 16]} align="top">
              <Col xl={2} lg={12}>
                <Form.Item
                  label={t("IncomeNumber")}
                  name="IncomeNumber"
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData")
                    },
                  ]}
                >
                  <Input placeholder={t("IncomeNumber")} />
                </Form.Item>
              </Col>

              <Col xl={2} lg={12}>
                <Form.Item
                  label={t("IncomeDate")}
                  name="IncomeDate"
                // rules={[
                //     {
                //         required: true,
                //         message: t("inputValidData")
                //     },
                // ]}
                >
                  <DatePicker format="DD.MM.YYYY" style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              <Col xl={3} lg={12}>
                <div className={classes.EmployeeEnrolmentModal}>
                  <Form.Item
                    label={t("INN")}
                    name="INN"
                    rules={[
                      {
                        required: true,
                        message: t("inputValidData")
                      },
                    ]}
                  >
                    <Input placeholder={t("INN")} />
                  </Form.Item>
                  <Button
                    type="primary"
                    onClick={innHandler}
                    shape="circle"
                    style={{ marginTop: 38 }}
                    icon={<ExclamationCircleOutlined />}
                    size={size}
                  />
                </div>
              </Col>

              <Col xl={3} lg={12}>
                <Form.Item
                  label={t("ChapterID")}
                  name="ChapterID"
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData")
                    },
                  ]}
                >
                  <Select
                    placeholder={t("ChapterID")}
                    // style={{ width: '100%' }}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }

                  >
                    {chapter.map((chapter) => (<Option key={chapter.ID} value={chapter.ID} >{chapter.Name}</Option>))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={4} lg={12}>
                <Form.Item
                  label={t("name")}
                  name="Name"
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData")
                    },
                  ]}
                >
                  <Input placeholder={t("name")} />
                </Form.Item>
              </Col>
              <Col xl={4} lg={12}>
                <Form.Item
                  label={t("ShortName")}
                  name="FullName"
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData")
                    },
                  ]}
                >
                  <Input placeholder={t("ShortName")} />
                </Form.Item>
              </Col>
              <Col xl={3} lg={12}>
                <Form.Item
                  label={t("Oked")}
                  name="OKONHID"
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData")
                    },
                  ]}
                >
                  <Select
                    placeholder={t("position")}
                    // style={{ width: '100%' }}
                    showSearch
                    optionFilterProp="children"
                  // filterOption={(input, option) =>
                  // option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  // }

                  >
                    {okedList.map(item => <Option key={item.ID} value={item.ID} >{item.Name}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={3} lg={12}>
                <Form.Item
                  label={t("OblastID")}
                  name="OblastID"
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData")
                    },
                  ]}
                >
                  <Select
                    placeholder={t("position")}
                    // style={{ width: '100%' }}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={regionChangeHandler}
                  >
                    {region.map(item => <Option key={item.ID} value={item.ID} >{item.Name}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={3} lg={12}>
                <Form.Item
                  label={t("RegionID")}
                  name="RegionID"
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData")
                    },
                  ]}
                >
                  <Select
                    placeholder={t("position")}
                    // style={{ width: '100%' }}
                    showSearch

                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }


                  >
                    {district.map(item => <Option key={item.ID} value={item.ID} >{item.Name}</Option>)}
                  </Select>
                </Form.Item>
              </Col>

              <Col xl={3} lg={12}>
                <Form.Item
                  label={t("ContactInfo")}
                  name="ContactInfo"
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData")
                    },
                  ]}
                >
                  <Input placeholder={t("ContactInfo")} />
                </Form.Item>
              </Col>
              <Col xl={6} lg={12}>
                <Form.Item
                  label={t("Adress")}
                  name="Adress"
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData")
                    },
                  ]}
                >
                  <Input placeholder={t("Adress")} />
                </Form.Item>
              </Col>

              <Col xl={6} lg={12}>
                <Form.Item
                  label={t("Director")}
                  name="Director"
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData")
                    },
                  ]}
                >
                  <Input placeholder={t("Director")} />
                </Form.Item>
              </Col>
              <Col xl={6} lg={12}>
                <Form.Item
                  label={t("Accounter")}
                  name="Accounter"
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData")
                    },
                  ]}
                >
                  <Input placeholder={t("Accounter")} />
                </Form.Item>
              </Col>

              <Col xl={6} lg={12}>
                <Form.Item
                  label={t("Cashier")}
                  name="Cashier"
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData")
                    },
                  ]}
                >
                  <Input placeholder={t("Cashier")} />
                </Form.Item>
              </Col>
              {/* <Col xl={3} lg={12}>
                                <Form.Item
                                    label={t("TreasuryDepartmentHeader")}
                                    name="TreasuryDepartmentHeader"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("inputValidData")
                                        },
                                    ]}
                                >
                                    <Input placeholder={t("TreasuryDepartmentHeader")}  />
                                </Form.Item>
                            </Col>
                            <Col xl={3} lg={12}>
                                <Form.Item
                                    label={t("TreasuryResPerson")}
                                    name="TreasuryResPerson"
                                    // rules={[
                                    //     {
                                    //         required: true,
                                    //         message: t("inputValidData")
                                    //     },
                                    // ]}
                                >
                                    <Input placeholder={t("TreasuryResPerson")}  />
                                </Form.Item>
                            </Col> */}
              <Col xl={6} lg={12}>
                <div className={classes.EmployeeEnrolmentModal}>
                  <CSSTransition
                    mountOnEnter
                    unmountOnExit
                    in={employeeEnrQualicationModal}
                    timeout={300}
                  >
                    <OrganizationModal
                      visible={employeeEnrQualicationModal}
                      onCancel={() => setEmployeeEnrQualicationModal(false)}
                      getHeaderStaffListOrganizationName={getHeaderStaffListOrganizationName}
                    />
                  </CSSTransition>
                  <Form.Item
                    label={t("CentralOrganizationName")}
                    name="CentralOrganizationName"
                    style={{ width: "100%" }}
                    rules={[
                      {
                        // required: true,
                        message: t("Please input valid"),
                      },
                    ]}>
                    <Input disabled
                      style={{ color: 'black' }} />
                  </Form.Item>
                  <Button
                    type="primary"
                    onClick={() => {
                      setEmployeeEnrQualicationModal(true);
                    }}
                    shape="circle"
                    style={{ marginTop: 38 }}
                    icon={<SearchOutlined />}
                    size={size}
                  />
                  <Button
                    type="primary"
                    onClick={onReset}
                    shape="circle"
                    style={{ marginTop: 38 }}
                    icon={<DeleteOutlined />}
                    size={size}
                  />
                </div>
              </Col>
              <Col xl={4} lg={12}>
                <Form.Item
                  label={t("OrganizationTypeID")}
                  name="OrganizationTypeID"
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData")
                    },
                  ]}
                >
                  <Select
                    placeholder={t("OrganizationTypeID")}
                    // style={{ width: '100%' }}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }

                  >
                    {organizationTypeList.map(item => <Option key={item.ID} value={item.ID} >{item.Name}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={4} lg={12}>
                <Form.Item
                  label={t("HeaderOrganizationName")}
                  name="HeaderOrganizationID"
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData")
                    },
                  ]}
                >
                  <Select
                    placeholder={t("HeaderOrganizationName")}
                    // style={{ width: '100%' }}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }

                  >
                    {HeaderOrganization.map(item => <Option key={item.ID} value={item.ID} >{item.Name}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={4} lg={12}>
                <Form.Item
                  label={t("ZipCode")}
                  name="ZipCode"
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData")
                    },
                  ]}
                >
                  <Input placeholder={t("ZipCode")} />
                </Form.Item>
              </Col>

            </Row>
            <Tabs defaultActiveKey="1">
              <TabPane tab={t('SettelmentAccount')} key="1">
                <Card>
                  <Space size={[24, 24]} >
                    <Button
                      // disabled={validPerson}
                      className={classes.ModalOpener}
                      type="primary"
                      onClick={() => { setSettlementAccountVisible(true); }}>
                      {t('add-new')} +
                    </Button>

                    <Button
                      // disabled={validPerson}
                      className={classes.ModalOpener}
                      type="primary"
                      onClick={fillTableHandler}>
                      {t('Fill')}
                    </Button>

                    <Input
                      className="table-search"
                      placeholder={t("search")}
                      enterButton
                      // onSearch={onSearchChange}
                      onChange={onSearchChange}
                    // value={filterValue}
                    />
                  </Space>
                  <CSSTransition
                    mountOnEnter
                    unmountOnExit
                    in={settlementAccountVisible}
                    timeout={300}
                  >
                    <SettlementAccountModal
                      visible={settlementAccountVisible}
                      tableData={settlementAccountData}
                      onCancel={closeSettlementAccountModal}
                      onCreate={createSettlementAccountDataHandler}
                      doc={docId}
                    />
                  </CSSTransition>
                  <CSSTransition
                    mountOnEnter
                    unmountOnExit
                    in={editsettlementAccountVisible}
                    timeout={300}
                  >
                    <EditSettlementAccountModal
                      visible={editsettlementAccountVisible}
                      tableData={settlementAccountData}
                      onCancel={() => setEditSettlementAccountVisible(false)}
                      onEdit={editSettlementAccountDataHandler}
                      data={editsettlementAccountData}
                      doc={docId}
                    />
                  </CSSTransition>
                  <Table
                    bordered
                    className='main-table'
                    rowClassName="table-row"
                    columns={SettlementAccountColumns}
                    // onFinish={onTableFilterHandler}
                    // onChange={handleTableChange}
                    onFilter = {(value, record) => record.Name.includes(value)}
                    dataSource={settlementAccountData}
                    rowKey={record => record.ID === 0 ? record.key : record.ID}
                    pagination={false}
                    onRow={(record) => {

                      return {
                        onDoubleClick: () => {
                          setEditSettlementAccountVisible(true);
                          setEditSettlementAccountData(record);
                        },

                      }
                    }}

                  />
                </Card>
              </TabPane>
              <TabPane tab={t('FunctionalItem')} key="2">
                <Card>
                  <Space size={[24, 24]} >
                    <Button
                      // disabled={validPerson}
                      className={classes.ModalOpener}
                      type="primary"
                      onClick={() => {
                        setFunctionalItemModalVisible(true);
                      }}>
                      {t('add-new')} +
                    </Button>

                    <Input
                      // className={classes.ModalOpener}
                      className="table-search"
                      placeholder={t("search")}
                      enterButton
                      // onSearch={onSearchChange}
                      onChange={onSearchChangeFunctionalItem}
                    // value={filterValue}
                    />
                  </Space>

                  <CSSTransition
                    mountOnEnter
                    unmountOnExit
                    in={functionalItemModalVisible}
                    timeout={300}
                  >
                    <FunctionalItemModal
                      visible={functionalItemModalVisible}
                      tableData={functionalItemModalData}
                      onCancel={closeFunctionalItemModal}
                      onCreate={createFunctionalItemHandler}
                    />
                  </CSSTransition>
                  <CSSTransition
                    mountOnEnter
                    unmountOnExit
                    in={editfunctionalItemModalVisible}
                    timeout={300}
                  >
                    <EditFunctionalItemModal
                      visible={editfunctionalItemModalVisible}
                      onCancel={() => setEditFunctionalItemModalVisible(false)}
                      onEdit={editFunctionalItemHandler}
                      tableData={functionalItemModalData}
                      data={editfunctionalItemModalData}
                    />
                  </CSSTransition>
                  <Table
                    bordered
                    className='main-table'
                    rowClassName="table-row"
                    columns={FunctionalItemColumns}
                    dataSource={functionalItemModalData}
                    rowKey={record => record.ID === 0 ? record.key : record.ID}
                    pagination={false}
                    onRow={(record) => {

                      return {
                        onDoubleClick: () => {
                          setEditFunctionalItemModalVisible(true);
                          setEditFunctionalItemModalData(record);
                        },

                      }
                    }}

                  />
                </Card>
              </TabPane>
              <TabPane tab={t('Sign')} key="43">
                <Card>
                  <Button
                    // disabled={validPerson}
                    className={classes.ModalOpener}
                    type="primary"
                    onClick={() => {
                      setSignModalVisible(true);
                    }}>
                    {t('add-new')} +
                  </Button>

                  <CSSTransition
                    mountOnEnter
                    unmountOnExit
                    in={SignModalVisible}
                    timeout={300}
                  >
                    <SignModal
                      visible={SignModalVisible}
                      tableData={SignModalData}
                      onCancel={closeSignModal}
                      onCreate={createSignHandler}
                      doc={docId}
                    />
                  </CSSTransition>
                  <CSSTransition
                    mountOnEnter
                    unmountOnExit
                    in={EditSignModalVisible}
                    timeout={300}
                  >
                    <EsitSignModal
                      visible={EditSignModalVisible}
                      onCancel={() => setEditSignModalVisible(false)}
                      tableData={SignModalData}
                      onEdit={EditSignHandler}
                      data={editSignModalData}
                      doc={docId}
                    />
                  </CSSTransition>
                  <Table
                    bordered
                    className='main-table'
                    rowClassName="table-row"
                    columns={SignColumns}
                   
                    dataSource={SignModalData.filter(item => item.Status !== 3)}
                    rowKey={record => record.ID === 0 ? record.key : record.ID}
                    pagination={false}
                    onRow={(record) => {
                      return {
                        onDoubleClick: () => {
                          setEditSignModalVisible(true);
                          setEditSignModalData(record);
                        },
                      };
                    }}
                  />
                </Card>
              </TabPane>
              <TabPane tab={t('DocSettAccount')} key="4" forceRender>
                <Card>
                  <Space size={[24, 24]} >
                    <Button
                      // disabled={validPerson}
                      className={classes.ModalOpener}
                      type="primary"
                      onClick={() => {
                        setDocSettAccountModalVisible(true);
                      }}>
                      {t('add-new')} +
                    </Button>
                    <Input
                      // className={classes.ModalOpener}
                      className="table-search"
                      placeholder={t("search")}
                      enterButton
                      // onSearch={onSearchChange}
                      onChange={onSearchChangeDocSettAccount}
                    // value={filterValue}
                    />


                  </Space>
                  <CSSTransition
                    mountOnEnter
                    unmountOnExit
                    in={DocSettAccountModalVisible}
                    timeout={300}
                  >
                    <DocSettAccountModal
                      visible={DocSettAccountModalVisible}
                      tableData={DocSettAccountModalData}
                      onCancel={closeDocSettAccount}
                      onCreate={DocSettAccountHandler}
                      doc={docId}
                    />

                  </CSSTransition>
                  <CSSTransition
                    mountOnEnter
                    unmountOnExit
                    in={editDocSettAccountModalVisible}
                    timeout={300}
                  >
                    <EditDocSettAccountModal
                      visible={editDocSettAccountModalVisible}
                      onCancel={() => setEditDocSettAccountModalVisible(false)}
                      //onCancel={closeEditDocSettAccount}
                      onEdit={EditDocSettAccountHandler}
                      tableData={DocSettAccountModalData}
                      data={editDocSettAccountModalData}
                      doc={docId}
                    />
                  </CSSTransition>

                  <Table
                    bordered
                    className='main-table'
                    rowClassName="table-row"
                    columns={DocSettAccountColumns}
                    dataSource={DocSettAccountModalData.filter(item => item.Status !== 3)}
                    rowKey={record => record.ID === 0 ? record.key : record.ID}
                    pagination={false}
                    onRow={(record) => {

                      return {
                        onDoubleClick: () => {
                          setEditDocSettAccountModalVisible(true);
                          setEditDocSettAccountModalData(record);
                        },

                      }
                    }}

                  />
                </Card>
              </TabPane>
            </Tabs>

          </Form>


          <Space size='middle' className='btns-wrapper'>
            <Button
              type="danger"
              onClick={() => {
                Notification("warning", t("not-saved"));
                history.goBack();
              }}
            >
              {t("back")}
            </Button>
            <Button
              onClick={saveAllHandler}
              type="primary"
            >
              {t("save")}
            </Button>
          </Space>
        </Spin>
      </MainCard>
    </Fade >
  );
};

export default UpdateOrganization;
