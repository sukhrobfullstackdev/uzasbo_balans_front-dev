import { Button, Col, Form, Input, Row, Select, Space, Spin, Switch } from 'antd';
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';

import SubAccServices from '../../../../../services/References/Organizational/SubAcc/SubAcc.services';
import CommonApis from '../../../../../services/common/commonApis';
import Card from "../../../../components/MainCard";
import HelperServices from '../../../../../services/Helper/helper.services';
import { Notification } from '../../../../../helpers/notifications';

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const { Option } = Select;

const UpdateSubAcc = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const locationParams = useLocation().search;
  const docId = props.match.params.id ? props.match.params.id : 0;
  const [mainForm] = Form.useForm();

  const [loader, setLoader] = useState(true);
  const [accList, setAccList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [subAcc, accList] = await Promise.all([
        CommonApis.clone('SubAcc', locationParams ? locationParams : `?id=${docId}`),
        HelperServices.getAccList(),
      ]);
      setAccList(accList.data);

      mainForm.setFieldsValue({
        ...subAcc.data,
        AccID: subAcc.data.AccID === 0 ? null : subAcc.data.AccID
      });
      setLoader(false);
    };

    fetchData().catch(err => {
      Notification('error', err);
      setLoader(false);
    });
  }, [mainForm, locationParams, docId]);


  const onMainFormFinish = (values) => {
    setLoader(true);
    const data = { ...values };
    data.ID = docId;

    SubAccServices.update(data)
      .then(() => {
        history.push(`/SubAcc`);
        docId === 0 ? Notification('success', t('success-msg')) : Notification('success', t('edited'));
      })
      .catch((err) => Notification('error', err))
      .finally(() => setLoader(false));
  };

  const accListChangeHandler = useCallback((_, data) => {
    mainForm.setFieldsValue({ Name: data?.children?.slice(6) })
  }, [mainForm])

  return (
    <Card title={t("SubAcc")}>
      <Spin spinning={loader} size='large'>
        <Form
          {...layout}
          form={mainForm}
          id="mainForm"
          onFinish={onMainFormFinish}
        >
          <Row gutter={[15, 0]}>
            <Col xl={4} md={8}>
              <Form.Item
                label={t("Code")}
                name="Code"
                style={{ width: "100%" }}
                rules={[
                  {
                    required: true,
                    message: t("inputValidData"),
                  },
                ]}
              >
                <Input placeholder={t("Code")} />
              </Form.Item>
            </Col>

            <Col xl={8} md={16}>
              <Form.Item
                label={t("subAcc")}
                name="AccID"
                rules={[
                  {
                    required: true,
                    message: t("pleaseSelect"),
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder={t("Select from list")}
                  allowClear
                  getPopupContainer={(trigger) => trigger.parentNode}
                  onChange={accListChangeHandler}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {accList.map((accs) => (
                    <Option key={accs.ID} value={accs.ID}>
                      {accs.Code}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xl={8} md={16}>
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

            <Col xl={2} md={16}>
              <Form.Item
                label={t('IsCurrency')}
                name='IsCurrency'
                valuePropName="checked"
              >
                <Switch />
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

export default UpdateSubAcc;