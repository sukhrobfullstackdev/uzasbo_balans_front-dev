import React, { useCallback, useState, useEffect } from "react";
import { Form, Button, Input, Spin, Space, Divider, Table, Popconfirm, Tag, Tooltip, } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import Fade from 'react-reveal/Fade';
import { UnorderedListOutlined } from "@ant-design/icons";
import { CSSTransition } from 'react-transition-group';

import MainCard from "../../../../App/components/MainCard";
import { Notification } from "../../../../helpers/notifications";
import OrganizationModal from "./OrganizationModal";
import OrganizationsDocSettAccountServices from "../../../../services/References/Global/OrganizationsDocSettAccount/OrganizationsDocSettAccount.services"
import classes from "./EmployeeMovement.module.css";

import DocSettAccountModal from "./Modals/DocSettAccountModal";
import EditDocSettAccountModal from "./Modals/EditDocSettAccountModal";

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};



const UpdateOrganizationsDocSettAccount = (props) => {
  const [employeeEnrQualicationModal, setEmployeeEnrQualicationModal] = useState(false);
  const [disabledAddBtn, setDisabledAddBtn] = useState(false);
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [docId] = useState(props.match.params.id ? props.match.params.id : 0[0]);
  const [loader, setLoader] = useState(true);

  const [, setTableEdited] = useState(false);
  // const [name, setName] = useState();




  //DocSettAccountModal
  const [DocSettAccountModalVisible, setDocSettAccountModalVisible] = useState(false);
  const [docSettAccountTableData, setDocSettAccountTableData] = useState([]);
  const [editDocSettAccountModalVisible, setEditDocSettAccountModalVisible] = useState(false);
  const [editDocSettAccountModalData, setEditDocSettAccountModalData] = useState([]);

  const { t } = useTranslation();
  const history = useHistory();
  const [mainForm] = Form.useForm();
  const { size } = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {

        const [organizationLs, organizationTable] = await Promise.all([
          OrganizationsDocSettAccountServices.getById(props.match.params.id ? props.match.params.id : 0),
          OrganizationsDocSettAccountServices.getTableList(docId)

        ]);
        if (docId) {
          setDisabledBtn(true);
        } else {
          setDisabledBtn(false);
        }

        if (organizationLs.data.OrganizationName === null) {
          setDisabledAddBtn(true);
        }

        setDocSettAccountTableData(organizationTable.data.rows)
        setLoader(false);
        mainForm.setFieldsValue({
          ...organizationLs.data,

        })


      } catch (err) {
        Notification('error', err);
        setLoader(false);
      }
    }
    fetchData();
  }, [props.match.params.id, mainForm]);

  const getHeaderStaffListOrganizationName = (name) => {
    if (name !== null) {
      setDisabledAddBtn(false);
    }
    mainForm.setFieldsValue({ OrganizationName: name });
  };

  // Modal DocSettAccount

  const closeDocSettAccount = useCallback(() => {
    setDocSettAccountModalVisible(false)
  }, []);


  const DocSettAccountHandler = useCallback((values) => {
    Notification('success', t('success-msg'));
    setDocSettAccountTableData((prevState) => [values, ...prevState])
    setDocSettAccountModalVisible(false);
  }, [t]);

  const EditDocSettAccountHandler = (values) => {
    Notification('success', t('edited'));
    setEditDocSettAccountModalVisible(false)
    setDocSettAccountTableData(values)


  };


  const DocSettAccountColumnsDeleteHandler = useCallback((record) => {
    setTableEdited(prevState => !prevState);
    record.Status = 3;
  }, [])

  const onFinish = (value) => {
    setLoader(true);
    OrganizationsDocSettAccountServices.getTableList(docId, value)
      .then((res) => {
        if (res.status === 200) {
          setDocSettAccountTableData(res.data.rows)
          setLoader(false);
        }
      })
      .catch((err) => {
        Notification('error', err);
        setLoader(false);
      });
  }

  const onSearch = () => {
    mainForm.validateFields()
      .then(values => {
        onFinish(values.Search);
      })
  };

  const DocSettAccountColumns = [
    {
      title: t('id'),
      dataIndex: 'ID',
      key: 'ID',
    },
    {
      title: t('TableName'),
      dataIndex: 'TableName',
      key: 'TableName',
    },
    {
      title: t('OrganizationName'),
      dataIndex: 'OrganizationName',
      key: 'OrganizationName',
    },
    {
      title: t('SettleCodeLevel'),
      dataIndex: 'SettleCodeLevel',
      key: 'SettleCodeLevel',
    },
    {
      title: t('OrganizationFunctionalItemCode'),
      dataIndex: 'OrganizationFunctionalItemCode',
      key: 'OrganizationFunctionalItemCode',
    },
    {
      title: t('OrganizationsSettlementAccountCode'),
      dataIndex: 'OrganizationsSettlementAccountCode',
      key: 'OrganizationsSettlementAccountCode',
    },
    {
      title: t('status'),
      dataIndex: 'StateID',
      key: 'StateID',
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
      <MainCard title={t('OrganizationsDocSettAccount')}>
        <Spin spinning={loader} size='large'>
          <Form
            {...layout}
            form={mainForm}
            id='mainForm'
            scrollToFirstError
            onFinish={onFinish}
          >
            {/* <Row gutter={[16, 16]} align="top"> */}
            {/* <Col xl={6} lg={12}> */}
            <div className={classes.OrgModal}>
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
                label={t("OrganizationName")}
                name="OrganizationName"
                // style={{ width: "100%" }}
                rules={[
                  {
                    // required: true,
                    message: t("Please input valid"),
                  },
                ]}>
                <Input
                  style={{ color: 'black' }} />
              </Form.Item>
              <Button
                type="primary"
                disabled={disabledBtn}
                onClick={() => {
                  setEmployeeEnrQualicationModal(true);
                }}
                // shape="circle"
                style={{ marginTop: 38 }}
                icon={<UnorderedListOutlined />}
                size={size}
              />

            </div>
            {/* </Col> */}


            {/* </Row> */}

            <Divider style={{ margin: '5px 0 15px 0' }} />

            <div className={classes.TableTop}>
              <Form.Item
                label={t("Search")}
                name="Search"
              >
                <Input.Search
                  placeholder={t("Search")}
                  enterButton
                  // onChange={filterTypeHandler}
                  onSearch={onSearch}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  // disabled={validPerson}
                  // className={classes.ModalOpener}
                  style={{ marginTop: 43 }}
                  type="primary"
                  disabled={disabledAddBtn}
                  onClick={() => {
                    setDocSettAccountModalVisible(true);
                  }}>
                  +
                </Button>
              </Form.Item>
            </div>


            <CSSTransition
              mountOnEnter
              unmountOnExit
              in={DocSettAccountModalVisible}
              timeout={300}
            >
              <DocSettAccountModal
                visible={DocSettAccountModalVisible}
                tableData={docSettAccountTableData}
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
                tableData={docSettAccountTableData}
                data={editDocSettAccountModalData}
                doc={docId}
              />
            </CSSTransition>

            <Table
              bordered
              className='main-table'
              rowClassName="table-row"
              columns={DocSettAccountColumns}
              dataSource={docSettAccountTableData}
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
            {/* </Card> */}

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
              onClick={() => {
                Notification("warning", t("saved"));
                history.goBack();
              }}
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

export default UpdateOrganizationsDocSettAccount;
