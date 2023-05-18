import { Button, Col, Form, Input, Row, Select, Space, Spin } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import ConstantValueServices from '../../../../../services/References/Organizational/ConstantValue/ConstantValue.services';

import Card from "../../../../components/MainCard";
import HelperServices from '../../../../../services/Helper/helper.services';
import { useHistory } from 'react-router-dom';
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

const UpdateConstantValue = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [mainForm] = Form.useForm();
  const docId = props.match.params.id ? props.match.params.id : 0

  const [loader, setLoader] = useState(true);
  const [constTypeList, setConstTypeList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [ConstantValue, constTypeLs,] = await Promise.all([
        ConstantValueServices.getById(docId),
        HelperServices.getConstantTypeList(),
      ]);
      setConstTypeList(constTypeLs.data);

      mainForm.setFieldsValue({
        ...ConstantValue.data,
        ConstantID: ConstantValue.data.ConstantID ? ConstantValue.data.ConstantID : null
      });
    };

    fetchData()
      .catch(err => Notification('error', err))
      .finally(() => setLoader(false));
  }, [docId, mainForm]);

  const onMainFormFinish = (values) => {
    values.ID = docId;
    setLoader(true);
    ConstantValueServices.update(values)
      .then(() => {
        history.push(`/ConstantValue`);
        Notification('success', t('success-msg'));
      })
      .catch((err) => Notification('error', err))
      .finally(() => setLoader(false));
  };

  return (
    <Card title={t("ConstantValue")}>
      <Spin spinning={loader} size='large'>
        <Form
          {...layout}
          form={mainForm}
          id="mainForm"
          onFinish={onMainFormFinish}
        >
          <Row gutter={[15, 0]}>
            <Col xl={8} lg={12}>
              <Form.Item
                label={t("ConstantValue")}
                name="ConstantID"
                rules={[
                  {
                    required: true,
                    message: t("pleaseSelect"),
                  },
                ]}
              >
                <Select
                  allowClear
                  showSearch
                  placeholder={t("Select from list")}
                  getPopupContainer={(trigger) => trigger.parentNode}
                  filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {constTypeList.map((accs) => (
                    <Option key={accs.ID} value={accs.ID}>
                      {accs.DisplayName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xl={6} lg={12}>
              <Form.Item
                label={t("Value")}
                name="Value"
                rules={[
                  {
                    required: true,
                    message: t("inputValidData"),
                  },
                ]}
              >
                <Input placeholder={t("Value")} />
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

export default UpdateConstantValue;