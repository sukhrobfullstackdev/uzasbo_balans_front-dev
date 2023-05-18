import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select } from "antd";
import { useTranslation } from 'react-i18next';
import HelperServices from "../../../../../services/Helper/helper.services";

// import { Notification } from '../../../../../helpers/notifications';
//import classes from '../../Employee.module.css';

const { Option } = Select;

const FunctionalItemModal = (props) => {
const [treasuryBranchList, setTreasuryBranchList] = useState([]);
const [bankList, setBankList] = useState([]);
const [names, setNames] = useState([]);


  const [form] = Form.useForm();
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchData() {
     const [treasuryBranchList, bankList] = await Promise.all([
      HelperServices.getTreasuryBranchList(),
      HelperServices.getChapterList()
     ]);
     setTreasuryBranchList(treasuryBranchList.data);
     setBankList(bankList.data)
    }
    fetchData();
  }, []);

  
  const TreasuryBranchNameChangeHandler = (id, data)  => {
    
    setNames((prevState => { return ({ ...prevState, FunctionalItemCode: data.children}) }))
    HelperServices.getTreasuryBranchList()
    .then(response => {
        setTreasuryBranchList(response.data)
    })
    .catch(err => Notification('error', err));
  }
  const bankNameChangeHandler = (id, data)  => {
    setNames((prevState => { return ({ ...prevState, ChapterCode: data.children}) }))
    HelperServices.getChapterList()
    .then(response => {
        setBankList(response.data)
    })
    .catch(err => Notification('error', err));
  }
 

  return (
    <Modal
      visible={props.visible}
      title={t("FunctionalItem")}
      okText={t('save')}
      cancelText={t('cancel')}
      onCancel={props.onCancel}
      // forceRender
      onOk={() => {
        form.validateFields()
          .then((values) => {
            values.ID =0;
            values.Status = 1;
            values.key = Math.random().toString();
            values.ChapterCode = names.ChapterCode;
            values.FunctionalItemCode = names.FunctionalItemCode;
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
         
        {/* <Form.Item
          label={t('ID')}
          name='ID'
          // rules={[
          //   {
          //     required: true,
          //     pattern: /^[\d]{7,7}$/,
          //     message: t("inputValidData"),
          //   },
          // ]}
          >
          <Input disabled placeholder={t('Name')} maxLength={7} />
        </Form.Item> */}
     
          <Form.Item
            label={t('Code')}
            name="Code"
            // rules={[
            //   {
            //     required: true,
            //     message: t("Please select"),
            //   },
            // ]}
          >
             <Input disabled placeholder={t('Code')} maxLength={7} />
          </Form.Item>
          <Form.Item
            label={t('FunctionalItemCode')}
            name="FunctionalItemCode"
            rules={[
              {
                required: true,
                message: t('Please select'),
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              placeholder={t("FunctionalItemCode")}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={TreasuryBranchNameChangeHandler}
             
            >
              {treasuryBranchList.map(item => {
                return (
                  <Option key={item.ID} value={item.ID} >{item.Code}</Option>)
              })}
                    </Select>
          </Form.Item>
     
        <Form.Item
          label={t('ChapterCode')}
          name='ChapterCode'
          rules={[
            {
              required: true,
              message: t("Please input valid"),
            },
          ]}>
            <Select
              style={{ width: "100%" }}
              placeholder={t("ChapterCode")}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={bankNameChangeHandler}
            >
              {bankList.map(item => {
                return (
                  <Option key={item.ID} value={item.ID} >{item.Name}</Option>)
              })}
                    </Select>
        </Form.Item>
        
      </Form>
    </Modal >
  );
};

export default React.memo(FunctionalItemModal);