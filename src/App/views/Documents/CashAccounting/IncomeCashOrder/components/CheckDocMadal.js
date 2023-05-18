import React, { useState } from "react";
import { Modal, Form, Spin, Space, Input, Button, Typography } from "antd";
import { useTranslation } from "react-i18next";

 import { Notification } from '../../../../../../helpers/notifications';
//import { Notification } from '../../../../../../../helpers/notifications';
import IncomeCashOrderServices from '../../../../../../services/Documents/CashAccounting/IncomeCashOrder/IncomeCashOrderservices';

const { Text } = Typography;

const CheckDocModal = (props) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const [numberOfAcception, setNumberOfAcception] = useState([]);
  const [showTariffScale, setShowTariffScale] = useState(false);

  const checkDocHandler = () => {
    setLoading(true);
    IncomeCashOrderServices.getAccept(props.id, numberOfAcception)
      .then(res => {
        setLoading(false);
        setErrMsg(res.data);
        setShowTariffScale(res.data)
      })
      .catch(err => {
        console.log('error', err);
        Notification('error', err);
        setErrMsg(err.data);
        setLoading(false);
      })
  }    

  const modalAcceptHandler = () => {
    setLoading(true);
    IncomeCashOrderServices.Accept(props.id)
      .then((res) => {
        if (res.status === 200) {
          Notification('success', t('accepted'));
          // dispatch(getListStartAction({
          //   ...filterData,
          //   ...paginationData,
          // }));
          setLoading(false);
        }
      })
      .catch((err) => {
        Notification('error', err);
        setLoading(false);
      });
  };

  return (
    <Modal
      visible={props.visible}
      title={t("plasticPaymentInfo")}
      okText={t("confirm")}
      cancelText={t("cancel")}
      onCancel={props.onCancel}

      footer={[
        <Button key="back" onClick={props.onCancel}>
            {t("close")}
        </Button>,
        <Button
            disabled={showTariffScale}
            type="primary"
            onClick={modalAcceptHandler}
           
        >
            {t("confirm")}
        </Button>,
    ]}      
    >
      <Spin spinning={loading}>
        <Form
          layout='vertical'
          form={form}
          // initialValues={{
          //   paymentOrderId: props.paymentOrderId
          // }}
          onFinish={checkDocHandler}
        >
          <Space align="end">
            <Form.Item
              label={t("Тўлов_топшириқнома")}
              name="Тўлов_топшириқнома"
              rules={[
                {
                  required: true,
                  message: t("Please input valid"),
                },
              ]}
            >
              <Input 
               allowClear
               placeholder={t("Тўлов топшириқнома ID си")}
               style={{ width: "100%" }} 
               onChange={(event) => setNumberOfAcception(event.target.value)}               
               />
            </Form.Item>
            <Form.Item>
              <Button
                htmlType="submit"
                //disabled={props.paymentOrderId !== 0}
              >
                {t('check')}
              </Button>
            </Form.Item>
          </Space>
        </Form>
        {errMsg && <Text type="danger">{errMsg}</Text>}
      </Spin>
    </Modal>
  );
}
export default CheckDocModal;
