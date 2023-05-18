import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Switch } from "antd";
import { useTranslation } from 'react-i18next';
import HelperServices from "../../../../../services/Helper/helper.services";
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
// import { Notification } from '../../../../../helpers/notifications';
import classes from '../EmployeeMovement.module.css';

const { Option } = Select;

const SettlementAccountModal = (props) => {
const [treasuryBranchList, setTreasuryBranchList] = useState([]);
const [bankList, setBankList] = useState([]);
const [organizationFunctionalItemList, setOrganizationFunctionalItemList] = useState([]);
const [status, setStatus] = useState([]);
const [names, setNames] = useState([]);
const [OrganizationId, setOrganizationId] = useState([]);

  const [form] = Form.useForm();
  const { t } = useTranslation();

  useEffect(() => {
    setOrganizationId(props.doc)
    async function fetchData() {
     const [treasuryBranchList, bankList, organizationFunctionalItemList, status] = await Promise.all([
      HelperServices.getTreasuryBranchListSetelment(),
      HelperServices.GetBankList(),
      HelperServices.getOrganizationFunctionalItemList(OrganizationId),
      HelperServices.getStateList(),
     ]);
     setTreasuryBranchList(treasuryBranchList.data);
     setBankList(bankList.data)
     setStatus(status.data)
     setOrganizationFunctionalItemList(organizationFunctionalItemList.data)
     
    
     setOrganizationId(props.doc)

      form.setFieldsValue({
        OutOfBalance: false,
        ...props.data,
        OrganizationID: props.doc,
      })

    }
    fetchData();
    console.log(props.doc);
    console.log(OrganizationId);

  }, []);

  const TreasuryBranchNameChangeHandler = (id, data)  => {
    setNames((prevState => { return ({ ...prevState, TreasuryBranchName: data.children}) }))
    HelperServices.getTreasuryBranchListSetelment()
    .then(response => {
        setTreasuryBranchList(response.data)
    })
    .catch(err => Notification('error', err));
  }
  const bankNameChangeHandler = (id, data)  => {
    setNames((prevState => { return ({ ...prevState, BankCode: data.children}) }))
    HelperServices.GetBankList()
    .then(response => {
        setBankList(response.data)
    })
    .catch(err => Notification('error', err));
  }
  const organizationFunctionalItemCodeChangeHandler = (OrganizationId, data)  => {
    setNames((prevState => { return ({ ...prevState, OrganizationFunctionalItemCode: data.children}) }))
    HelperServices.getOrganizationFunctionalItemList(OrganizationId)
    .then(response => {
        setOrganizationFunctionalItemList(response.data)
    })
    .catch(err => Notification('error', err));
  }
  const statusChangeHandler = ()  => {
    HelperServices.getStateList()
    .then(response => {
        setStatus(response.data)
    })
    .catch(err => Notification('error', err));
  }

  return (
    <Modal
      visible={props.visible}
       title={t("SettlementAccount")}
      okText={t('save')}
      cancelText={t('cancel')}
      onCancel={props.onCancel}
      // forceRender
      onOk={() => {
        form.validateFields()
          .then((values) => {
            values.ID = 0;
            values.Status = 1;
            values.OwnerID = OrganizationId;
            values.key = Math.random().toString();
            values.TreasuryBranchName = names.TreasuryBranchName;
            values.OrganizationFunctionalItemCode = names.OrganizationFunctionalItemCode;
            values.BankCode = names.BankCode;
            
            props.onCreate(values);
            form.resetFields();
          
          })
          .catch(err => err);
      }}
    >
      <Form
        layout="vertical"
        form={form}
      >
          {/* <div   className={classes.InputsWrapper}>
        <Form.Item
          label={t('ID')}
          name='ID'
          // rules={[
          //   {
          //     required: true,
          //     pattern: /[A-Z]{2,2}$/,
          //     message: t("inputValidData"),
          //   },
          // ]}
          >
          <Input disabled placeholder={t('ID')} />
        </Form.Item>
        <Form.Item
          label={t('OrganizationID')}
          name='OrganizationID'
          // rules={[
          //   {
          //     required: true,
          //     message: t("Please input valid"),
          //   },
          // ]}
          >
          <Input disabled placeholder={t('OrganizationID')} />
        </Form.Item>
        </div> */}
       
        <Form.Item
          label={t('Name')}
          name='Name'
          rules={[
            {
              required: true,
              message: t("inputValidData"),
            },
          ]}
          >
          <Input   placeholder={t('Name')}  />
        </Form.Item>
     
          <Form.Item
            label={t('Code')}
            name="Code"
            width={'80%'}
            rules={[
              {
                required: true,
                pattern: /^[\d]{27}$/,
                message: t('inputValidData'),
              },
            ]}
          >
             <Input placeholder={t('Code')} maxLength={27} />
          </Form.Item>
         
          <Form.Item
            label={t('TreasuryBranchName')}
            name="TreasuryBranchID"
            rules={[
              {
                required: true,
                message: t('Please select'),
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              placeholder={t("TreasuryBranchName")}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={TreasuryBranchNameChangeHandler}
            >
              {treasuryBranchList.map(item => {
                return (
                  <Option key={item.ID} value={item.ID} >{item.Name}</Option>)
              })}
                    </Select>
          </Form.Item>
     
        <Form.Item
          label={t('BankCode')}
          name='BankID'
          rules={[
            {
              required: true,
              message: t("Please input valid"),
            },
          ]}>
            <Select
              style={{ width: "100%" }}
              placeholder={t("BankCode")}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={bankNameChangeHandler}
            >
              {bankList.map(item => {
                return (
                  <Option key={item.ID} value={item.ID} >{item.Code}</Option>)
              })}
                    </Select>
        </Form.Item>
        <Form.Item
          label={t('OrganizationFunctionalItemCode')}
          name='OrganizationFunctionalItemID'
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
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={organizationFunctionalItemCodeChangeHandler}
            >
              {organizationFunctionalItemList.map(item => {
                return (
                  <Option key={item.ID} value={item.ID} >{item.Code}</Option>)
              })}
                    </Select>
        </Form.Item>
        <div   className={classes.InputsWrapper}>
        <Form.Item
            label={t('OutOfBalance')}
            name='OutOfBalance'
            valuePropName="checked"
          >
            <Switch checkedChildren={<CheckOutlined  /> }
              unCheckedChildren={<CloseOutlined />}> </Switch>
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
        </div>
      </Form>
    </Modal >
  );
};

export default React.memo(SettlementAccountModal);