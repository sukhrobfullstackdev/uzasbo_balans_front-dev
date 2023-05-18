import React, { useState, useCallback,useEffect } from 'react';
import { Modal, Form, Input, Select, Col, Button } from "antd";
import { useTranslation } from 'react-i18next';
import { UserOutlined } from "@ant-design/icons";
import classes from '../EmployeeMovement.module.css';
// import OrganizationModalTable from './OrganisationModalTable';
import HelperServices from "../../../../../services/Helper/helper.services";

const { Option } = Select;

const EditDocSettAccountModal = (props) => {
  const [organizationList, setOrganizationList] = useState(false);
  const [organizationListTable, setOrganizationListTable] = useState([]);
  const [organizationFullTable, setOrganizationFullTable] = useState([]);
  const [tableList, setTableList] = useState([]);

  //Organization ID kelect bulganda
// console.log(props)
const [organizationsSettlemenID, setOrganizationId] = useState([]);
  const [SettelmentAccount, setSettelmentAccount] = useState([]);
  const [FunctionalItemCode, setFunctionalItemCode] = useState([]);
  const [SetLevel, setSetLevel] = useState([]);
  const [status, setStatus] = useState([]);
  //    Namelarni olish uchun
  const [names, setNames] = useState([]);


  const [form] = Form.useForm();
  const { t } = useTranslation();


    useEffect(() => {
      setOrganizationId(props.data.OrganizationID)
      async function fetchData() {

        const [tableList, status ] = await Promise.all([
         HelperServices.getTableList(),
         HelperServices.getStateList(),
        ]);

        setTableList(tableList.data);
        setStatus(status.data);
        setOrganizationId(props.data.OrganizationID)
        form.setFieldsValue({
         ...props.data,
       })
       }
       console.log(props.data);
       fetchData();
      }, [form, props.data]);


  const createTableDataHandler = useCallback((values) => {

    setOrganizationListTable((organizationListTable) => [...organizationListTable, values])
    setOrganizationList(false)
  }, []);

  const tableListHandler = (id, data) => {

    // console.log(data, data.children);
    setNames((prevState => { return ({ ...prevState, Document: data.children}) }))
    HelperServices.getTableList()
      .then(response => {
        setTableList(response.data)
      })
      .catch(err => Notification('error', err));
  }

  const OrganizationFunctionalItemNameHandler =  (id, data) => {
    setNames((prevState => { return ({ ...prevState, OrganizationFunctionalItemName: data.children }) }))
  }
  const OrganizationFunctionalItemCodeHandler =  (id, data) => {
    setNames((prevState => { return ({ ...prevState, OrganizationFunctionalItemCode: data.children }) }))
  }
  const SetLevelHandler =  (id, data) => {
    console.log(data.children)
   setNames((prevState => { return ({ ...prevState, SettleCodeLevel: data.children }) }))
 
  }

  const organizationFunctionalItemCodeChangeHandler = () =>{
    HelperServices.getSettlementAccountListForOrganization(props.data.OrganizationID)
    .then(response => {
      setSetLevel(response.data)

    })
    .catch(err => Notification('error', err));
  }

  // const getEmpData = (record, id) => {
  //  // setOrganizationId(id);
  //   //setOrganizationFullTable(record);
  //   form.setFieldsValue({ Name: record });
  //   HelperServices.getSettlementAccountListForOrganization(id)
  //     .then(response => {
  //       setSettelmentAccount(response.data)
  //       setFunctionalItemCode(response.data)
  //       setSetLevel(response.data)

  //     })
  //     .catch(err => Notification('error', err));
  // };
  const statusChangeHandler = () => {
    HelperServices.getStateList()
      .then(response => {
        console.log(response.data)
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
      onCancel={() => {
        props.onCancel();
        form.resetFields();
      }}
      onOk={() => {
        form.validateFields()
          .then((values) => {
            values.OrganizationID = organizationsSettlemenID; 
            values.SettleCodeLevel = names.SettleCodeLevel;
            values.ID = props.data.ID;
            values.Status = values.ID === 0 ? values.Status = 1 : values.Status = 2;
            const newData = [...props.tableData];
           const key = props.data.ID === 0 ? props.data.key : props.data.ID;
            const index = newData.findIndex(item => key === (item.ID === 0 ? item.key : item.ID));
            newData[index] = values;
           console.log(newData);
             props.onEdit(newData);
             props.onCancel();
          })
          .catch(err => console.log(err));
      }}
    >
{/* 
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
      )} */}

      <Form
        layout="vertical"
        form={form}
        
      >
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
            disabled
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
          label={t('TableName')}
          name="TableName"
        //   rules={[
        //     {
        //       required: true,
        //       message: t("Please select"),
        //     },
        //   ]}
      
        >
        <Select
            style={{ width: "100%" }}
            placeholder={t("TableName")}
            showSearch
            disabled
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
        <Form.Item
          label={t('OrganizationsSettlementAccountCode')}
          name="OrganizationsSettlementAccountCode"
          // rules={[
          //   {
          //     required: true,
          //     message: t('Please select'),
          //   },
          // ]}
        >
          <Select
            style={{ width: "100%" }}
            placeholder={t("OrganizationFunctionalItem")}
            showSearch
            disabled
            onChange={OrganizationFunctionalItemNameHandler}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }

          >
            {SettelmentAccount.map(item => {
              return (
                <Option key={item.ID} value={item.ID} >{item.Name}</Option>)
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
            onChange={SetLevelHandler}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            onClick={organizationFunctionalItemCodeChangeHandler}
          >
            {SetLevel.map(item => {
              return (
                <Option key={item.ID} value={item.ID} >{item.SetLevel}</Option>)
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
          disabled
            style={{ width: "100%" }}
            placeholder={t("StateID")}
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            onFocus={statusChangeHandler}
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

export default React.memo(EditDocSettAccountModal);