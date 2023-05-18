import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select } from "antd";
import { useTranslation } from 'react-i18next';
import HelperServices from "../../../../../services/Helper/helper.services";

// import { Notification } from '../../../../../helpers/notifications';
//import classes from '../../Employee.module.css';

const { Option } = Select;

const SignModal = (props) => {
const [treasuryBranchList, setTreasuryBranchList] = useState([]);
const [bankList, setBankList] = useState([]);
const [OrganizationId, setOrganizationId] = useState([]);

    //FunctionalItemCode
    //ChapterCode

  const [form] = Form.useForm();
  const { t } = useTranslation();

  useEffect(() => {
    form.setFieldsValue({
      
      ...props.data,
      OrganizationID: props.doc,
    })
  }, [form, props.data]);

  const TreasuryBranchNameChangeHandler = ()  => {
    HelperServices.getTreasuryBranchList()
    .then(response => {
        setTreasuryBranchList(response.data)
    })
    .catch(err => Notification('error', err));
  }
  const bankNameChangeHandler = ()  => {
    HelperServices.GetBankList()
    .then(response => {
        setBankList(response.data)
    })
    .catch(err => Notification('error', err));
  }
 

  return (
    <Modal
      visible={props.visible}
      title={t("Sign")}
      okText={t('save')}
      cancelText={t('cancel')}
      onCancel={props.onCancel}
      // forceRender
      onOk={() => {
        form.validateFields()
          .then((values) => {
            values.ID = 0;  
            values.Status = 1; 
            values.OrganizationID = props.doc; 
            values.key = Math.random().toString();
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
          disabled
         
          >
          <Input  disabled placeholder={t('id')} maxLength={7} />
        </Form.Item>
      */}
          <Form.Item
            label={t('FIO')}
            name="FIO"
            // rules={[
            //   {
            //     required: true,
            //     message: t("Please select"),
            //   },
            // ]}
          >
             <Input placeholder={t('FIO')} maxLength={7} />
          </Form.Item>
          <Form.Item
            label={t('SignNumber')}
            name="SignNumber"
            // rules={[
            //   {
            //     required: true,
            //     message: t('Please select'),
            //   },
            // ]}
          >
           <Input placeholder={t('SignNumber')} maxLength={7} />
          </Form.Item>
     
        <Form.Item
          label={t('PositionNameRus')}
          name='PositionNameRus'
          // rules={[
          //   {
          //     required: true,
          //     message: t("Please input valid"),
          //   },
          // ]}
          >
             <Input placeholder={t('PositionNameRus')} maxLength={7} />
        </Form.Item>
        <Form.Item
          label={t('PositionNameUzb')}
          name='PositionNameUzb'
          // rules={[
          //   {
          //     required: true,
          //     message: t("Please input valid"),
          //   },
          // ]}
          >
             <Input placeholder={t('PositionNameUzb')} maxLength={7} />
        </Form.Item>
        
      </Form>
    </Modal >
  );
};

export default React.memo(SignModal);