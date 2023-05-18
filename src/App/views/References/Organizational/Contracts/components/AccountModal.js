import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Button, Spin } from "antd";
import { useTranslation } from 'react-i18next';

import HelperServices from "../../../../../../services/Helper/helper.services";
import ContractorsServices from "../../../../../../services/References/Organizational/Contractors/Contractors.services";
import { Notification } from "../../../../../../helpers/notifications";

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};

const AccountModal = (props) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const [bankList, setBankList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    HelperServices.GetBankList()
      .then(res => {
        setBankList(res.data);
        setLoading(false);
      })
      .catch(err => {
        Notification('error', err);
        setLoading(false);
      })
  }, [])

  const onFormFinish = (values) => {
    setLoading(true);
    values.ID = 0;
    ContractorsServices.updateProfile(values)
      .then(res => {
        setLoading(false);
      })
      .catch(err => {
        Notification('error', err);
        setLoading(false);
      })
    props.onSave();
  }

  return (
    <Modal
      visible={props.visible}
      title={t("accountInfo")}
      okText={t('save')}
      cancelText={t('cancel')}
      onCancel={props.onCancel}
      footer={[
        <Button form="form" htmlType="submit" key='submit' type="primary">
          {t('save')}
        </Button>,
        <Button form="form" key='cancel' onClick={props.onCancel}>
          {t('cancel')}
        </Button>
      ]}
    >
      <Spin spinning={loading}>
        <Form
          {...formItemLayout}
          id='form'
          form={form}
          onFinish={onFormFinish}
          initialValues={{
            EditName: 'Основной'
          }}
        >
          <Form.Item
            label={t('accountname')}
            name='EditName'
            rules={[
              {
                required: true,
                message: t('inputValidData'),
              },
            ]}
          >
            <Input placeholder={t('accountname')} />
          </Form.Item>

          <Form.Item
            label={t('settlementAccount')}
            name='SettlementAccount'
            rules={[
              {
                required: true,
                pattern: /^[\d]{20}$/,
                message: t('inputValidData'),
              },
            ]}
          >
            <Input placeholder={t('settlementAccount')} maxLength={20} />
          </Form.Item>

          <Form.Item
            label={t('BankCode')}
            name="BankID"
            rules={[
              {
                required: true,
                message: t('pleaseSelect'),
              },
            ]}
          >
            <Select
              allowClear
              showSearch
              placeholder={t("BankCode")}
              style={{ width: '100%' }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {bankList.map(item => <Option key={item.ID} value={item.ID}>{item.Code}</Option>)}
            </Select>
          </Form.Item>
        </Form>
      </Spin>
    </Modal >
  );
};

export default React.memo(AccountModal);