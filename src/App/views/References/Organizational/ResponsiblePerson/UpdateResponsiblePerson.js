import { Button, Col, Form, Row, Select, Space, Spin } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import ResponsiblePersonServices from '../../../../../services/References/Organizational/ResponsiblePerson/ResponsiblePerson.services';

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

const UpdateResponsiblePerson = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [mainForm] = Form.useForm();
  const docId = props.match.params.id ? props.match.params.id : 0;

  const [loader, setLoader] = useState(true);
  const [Employee, setEmployee] = useState([]);
  const [ResponsiblePersonTypeList, setResponsiblePersonTypeList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [ResponsiblePerson, Employee, ResponsiblePersonTypeList] = await Promise.all([
        ResponsiblePersonServices.getById(docId),
        HelperServices.getEmployeeList(),
        HelperServices.getStateList(),
      ]);
      setEmployee(Employee.data);
      setResponsiblePersonTypeList(ResponsiblePersonTypeList.data)

      mainForm.setFieldsValue({
        ...ResponsiblePerson.data,
        EmployeeID: ResponsiblePerson.data.EmployeeID ? ResponsiblePerson.data.EmployeeID : null
      });
    };

    fetchData()
      .catch(err => Notification('error', err))
      .finally(() => setLoader(false))
  }, [docId, mainForm]);

  const onMainFormFinish = (values) => {
    setLoader(true);
    values.ID = docId;
    ResponsiblePersonServices.update(values)
      .then(() => {
        history.push(`/ResponsiblePerson`);
        Notification('success', t('success-msg'));
      })
      .catch((err) => Notification('error', err))
      .finally(() => setLoader(false))
  };

  return (
    <Card title={t("ResponsiblePerson")}>
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
                label={t("Employee")}
                name="EmployeeID"
                rules={[
                  {
                    required: true,
                    message: t("pleaseSelect"),
                  },
                ]}
              >
                <Select
                  placeholder={t("Select from list")}
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {Employee.map((item) => (
                    <Option key={item.ID} value={item.ID}>
                      {item.Name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xl={5} lg={12}>
              <Form.Item
                label={t("StateID")}
                name="StateID"
                rules={[
                  {
                    required: true,
                    message: t("pleaseSelect"),
                  },
                ]}
              >
                <Select
                  placeholder={t("Select from list")}
                  allowClear
                  getPopupContainer={(trigger) => trigger.parentNode}
                >
                  {ResponsiblePersonTypeList.map((accs) => (
                    <Option key={accs.ID} value={accs.ID}>
                      {accs.DisplayName}
                    </Option>
                  ))}
                </Select>
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

export default UpdateResponsiblePerson;