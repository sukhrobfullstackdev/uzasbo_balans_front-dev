import { Button, Col, Form, Input, Row, Space, Spin } from 'antd';
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';

import CommonApis from '../../../../../services/common/commonApis';
import Card from "../../../../components/MainCard";
import { Notification } from '../../../../../helpers/notifications';

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const UpdateRequestForSettlementAccount = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const [mainForm] = Form.useForm();
  const docId = props.match.params.id ? props.match.params.id : 0;
  const docName = location.pathname.split('/')[1];

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [docData] = await Promise.all([
        CommonApis.getDocData(docName, { id: docId }),
      ]);

      mainForm.setFieldsValue({
        ...docData.data,
      });
    };

    fetchData()
      .catch(err => Notification('error', err))
      .finally(() => setLoading(false));
  }, [mainForm, docId, docName]);

  const onMainFormFinish = (values) => {
    setLoading(true);
    const data = { ...values };
    data.ID = docId;

    CommonApis.updateDoc(docName, data)
      .then(() => {
        history.push(`/${docName}`);
        docId === 0 ? Notification('success', t('success-msg')) : Notification('success', t('edited'));
      })
      .catch((err) => Notification('error', err))
      .finally(() => setLoading(false));
  };

  return (
    <Card title={t("requestForSettlementAccount")}>
      <Spin spinning={loading} size='large'>
        <Form
          {...layout}
          form={mainForm}
          id="mainForm"
          onFinish={onMainFormFinish}
        >
          <Row gutter={[15, 0]}>
            <Col xl={8} lg={12}>
              <Form.Item
                label={t("Name")}
                name="Name"
                style={{ width: "100%" }}
                rules={[
                  {
                    required: true,
                    message: t("Please input valid"),
                  },
                ]}
              >
                <Input placeholder={t("Name")} />
              </Form.Item>
            </Col>

            <Col xl={8} lg={12}>
              <Form.Item
                label={t("orgSettAcc")}
                name="Code"
                style={{ width: "100%" }}
                rules={[
                  {
                    required: true,
                    message: t("inputValidData"),
                  },
                ]}
              >
                <Input placeholder={t("orgSettAcc")} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Space size='middle' className='btns-wrapper'>
          <Button
            type="danger"
            onClick={() => {
              history.goBack();
              Notification("warning", t("not-saved"));
            }}
          >
            {t("back")}
          </Button>
          <Button
            htmlType="submit"
            form="mainForm"
            type="primary"
          >
            {t("save")}
          </Button>
        </Space>
      </Spin>
    </Card>
  )
}

export default UpdateRequestForSettlementAccount;