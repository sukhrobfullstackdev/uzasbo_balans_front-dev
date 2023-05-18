import React, { useState, useCallback, useEffect} from 'react';
import { Modal, Form, Input, Select, Col, Button } from "antd";
import { useTranslation } from 'react-i18next';
import { UserOutlined } from "@ant-design/icons";
import classes from '../EmployeeMovement.module.css';
import OrganizationModalTable from './OrganisationModalTable';
import HelperServices from "../../../../../services/Helper/helper.services";

const { Option } = Select;

const DocSettAccountModal = (props) => {
  const [organizationList, setOrganizationList] = useState(false);
  const [organizationListTable, setOrganizationListTable] = useState([]);
  const [organizationFullTable, setOrganizationFullTable] = useState([]);
  const [tableList, setTableList] = useState([]);

  //Organization ID kelect bulganda

  const [organizationsSettlemenID, setOrganizationId] = useState([]);
  const [SettelmentAccount, setSettelmentAccount] = useState([]);
  const [FunctionalItemCode, setFunctionalItemCode] = useState([]);
  const [SetLevel, setSetLevel] = useState([]);
  const [status, setStatus] = useState([]);
  const [OwnerId, setOwnerId] = useState([]);
  //    Namelarni olish uchun
  const [names, setNames] = useState([]);


  const [form] = Form.useForm();
  const { t } = useTranslation();


  useEffect(() => {
    async function fetchData() {
     const [tableList, status] = await Promise.all([
      HelperServices.getTableList(),
      HelperServices.getStateList()
     ]);
     setTableList(tableList.data);
     setStatus(status.data)
     setOwnerId(props.doc)

     form.setFieldsValue({

      ...props.data,
      OwnerID: props.doc,
    })
    }
    fetchData();
  }, [form, props.data, props.doc]);



  const createTableDataHandler = useCallback((values) => {

    setOrganizationListTable((organizationListTable) => [...organizationListTable, values])
    setOrganizationList(false)
  }, []);

  const tableListHandler = (id, data) => {

    setNames((prevState => { return ({ ...prevState, TableName: data.children}) }))
    HelperServices.getTableList()
      .then(response => {
        setTableList(response.data)
      })
      .catch(err => Notification('error', err));
  }

  const OrganizationFunctionalItemNameHandler =  (id, data) => {
    setOrganizationFullTable(data['data-setelmentid'])
    setNames((prevState => { return ({ ...prevState, OrganizationsSettlementAccountCode: data.children }) }))
    form.setFieldsValue({
      SettleCodeLevel: data ? data['data-setlevel'] : null,
      OrganizationFunctionalItemCode: data ? data['data-functionalitemcode'] : null,

    })
  }
  const OrganizationFunctionalItemCodeHandler =  (id, data) => {
    setNames((prevState => { return ({ ...prevState, OrganizationFunctionalItemCode: data.children }) }))
  }
  const SetLevelHandler =  (id, data) => {
    setNames((prevState => { return ({ ...prevState, SettleCodeLevel: data.children }) }))
  }

  const getEmpData = (record, id) => {
    setOrganizationId(id);
    //setOrganizationFullTable(record);
    form.setFieldsValue({ OrganizationName: record });
    HelperServices.getSettlementAccountListForOrganization(id)
      .then(response => {
        setSettelmentAccount(response.data)
        setFunctionalItemCode(response.data)
        setSetLevel(response.data)

      })
      .catch(err => Notification('error', err));
  };
  const statusChangeHandler = () => {
    HelperServices.getStateList()
      .then(response => {
        setStatus(response.data)
      })
      .catch(err => Notification('error', err));
  }

  return (
    <Modal
      visible={props.visible}
      title={t("DocSettAccount")}
      okText={t('save')}
      cancelText={t('cancel')}
      onCancel={props.onCancel}
      // forceRender
      onOk={() => {
        form.validateFields()
          .then((values) => {

            values.ID = 0;
            values.Status = 1;
            values.TableID = 274;
            values.OwnerID = OwnerId
            values.key = Math.random().toString();
            values.OrganizationID = organizationsSettlemenID;
            values.OrganizationsSettlementAccountID = organizationFullTable;
            values.OrganizationFunctionalItemCode = names.OrganizationFunctionalItemCode;
            values.OrganizationsSettlementAccountCode = names.OrganizationsSettlementAccountCode;
            values.SettleCodeLevel = names.SettleCodeLevel;
            values.TableName = names.TableName;

            props.onCreate(values);
            form.resetFields();
          })
          .catch(err => err);
      }}
    >

      {organizationList && (
        <OrganizationModalTable
          visible={organizationList}
          onCancel={() => setOrganizationList(false)}
          getEmpData={getEmpData}
          onCreate={createTableDataHandler}
          organizationListTable={organizationListTable}
          parentId={props.parentId}
          OwnerID={props.currentDocId}
          PlasticCardBankID={props.bankId}
          PlasticCardType={props.cardType}
          key="1"
        // getModalData={getModalData}

        />
      )}

      <Form
        layout="vertical"
        form={form}
      >
        <Form.Item
          label={t('TableName')}
          name="TableName"
          rules={[
            {
              required: true,
              message: t("Please select"),
            },
          ]}

        >
          <Select
            style={{ width: "100%" }}
            placeholder={t("TableName")}
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            onChange={tableListHandler}
          >
            {tableList.map(item => {
              return (
                <Option key={item.ID} value={item.ID} >{item.Name}</Option>)
            })}
          </Select>
        </Form.Item>
        <Col xl={24} lg={24}>
          <div className={classes.OrganizationModal}>
            <Form.Item
              label={t("OrganizationName")}
              name="OrganizationName"
              style={{ width: '100%' }}
              rules={[
                {
                  required: true,
                  message: t("Please input valid"),
                },
              ]}
            >
              <Input disabled
                style={{ color: 'black' }} />
            </Form.Item>
            <Button
             label={t(" ")}
              type="primary"
              onClick={() => {
                setOrganizationList(true);
              }}
              shape="circle"
              icon={<UserOutlined />}
            />
          </div>
        </Col>

        <Form.Item
          label={t('OrganizationsSettlementAccountCode')}
          name="OrganizationsSettlementAccountCode"
          rules={[
            {
              required: true,
              message: t('Please select'),
            },
          ]}
        >
          <Select
            style={{ width: "100%" }}
            placeholder={t("OrganizationsSettlementAccountCode")}
            showSearch
            onChange={OrganizationFunctionalItemNameHandler}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }

          >
            {SettelmentAccount.map(item => {
              return (
                <Option key={item.ID} value={item.OrganizationFunctionalItemID}  data-setelmentid = {item.ID} data-setlevel={item.SetLevel}  data-functionalitemcode={item.FunctionalItemCode}>{item.Name}</Option>)
            })}
          </Select>
        </Form.Item>

        <Form.Item
          label={t('SettleCodeLevel')}
          name='SettleCodeLevel'
          rules={[
            {
              required: true,
              message: t("Please input valid"),
            },
          ]}>
          <Select
            style={{ width: "100%" }}
            placeholder={t("SettleCodeLevel")}
            showSearch
            disabled
            onChange={SetLevelHandler}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          //onChange={organizationFunctionalItemCodeChangeHandler}
          >
            {SetLevel.map(item => {
              return (
                <Option key={item.ID} value={item.ID} >{item.SetLevel}</Option>)
            })}
          </Select>
        </Form.Item>

        <Form.Item
          label={t('OrganizationFunctionalItemCode')}
          name='OrganizationFunctionalItemCode'
          rules={[
            {
              required: true,
              message: t("Please input valid"),
            },
          ]}>
          <Select
            style={{ width: "100%" }}
            placeholder={t("OrganizationFunctionalItemCode")}
            showSearch
            disabled
            onChange={OrganizationFunctionalItemCodeHandler}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          //onChange={organizationFunctionalItemCodeChangeHandler}
          >
            {FunctionalItemCode.map(item => {
              return (
                <Option key={item.ID} value={item.ID} >{item.FunctionalItemCode}</Option>)
            })}
          </Select>
        </Form.Item>

        <Form.Item
          label={t('StateID')}
          name="StateID"
          rules={[
            {
              required: true,
            },
          ]}>
          <Select
            style={{ width: "100%" }}
            placeholder={t("StateID")}
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            onChange={statusChangeHandler}

          >
            {status.map(item => {
              return (
                <Option key={item.ID} value={item.ID} >{item.DisplayName}</Option>)
            })}
          </Select>
        </Form.Item>
      </Form>
    </Modal >
  );
};

export default React.memo(DocSettAccountModal);
