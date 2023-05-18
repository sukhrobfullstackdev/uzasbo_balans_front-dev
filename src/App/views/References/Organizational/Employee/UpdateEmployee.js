import { Button, Col, Form, Input, Row, Select, Space, Spin } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import EmployeeServices from '../../../../../services/References/Organizational/Employee/Employee.services';
import { useDispatch } from 'react-redux';

import Card from "../../../../components/MainCard";
import HelperServices from '../../../../../services/Helper/helper.services';
import { useHistory } from 'react-router-dom';
import { Notification } from '../../../../../helpers/notifications';
import { openModal } from '../../../../../store/history-modal-slice';

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const { Option } = Select;

const UpdateEmployee = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [mainForm] = Form.useForm();
  const dispatch = useDispatch();
  const docId = props.match.params.id ? props.match.params.id : 0;

  const [loader, setLoader] = useState(true);
  const [employee, setEmployee] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [status, setStatus] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [employee, departmentList, status] = await Promise.all([
        EmployeeServices.getById(props.match.params.id ? props.match.params.id : 0),
        HelperServices.getDepartmentList(),
        HelperServices.getStateList()
      ]);
      setEmployee(employee.data);
      setDepartmentList(departmentList.data);
      setStatus(status.data);

      mainForm.setFieldsValue({
        ...employee.data,
        StateID: employee.data.StateID === 0 ? null : employee.data.StateID
      });
      setLoader(false);
    };

    fetchData().catch(err => {
      Notification('error', err);
      setLoader(false);
    });
  }, [props.match.params.id, mainForm]);

  const onMainFormFinish = (values) => {
    setLoader(true);
    EmployeeServices.update({
      ...employee, ...values,
    })
      .then((res) => {
        if (res.status === 200) {
          setLoader(false);
          history.push(`/Employee`);
          docId === 0 ? Notification('success', t('success-msg')) : Notification('success', t('edited'));
        }
      })
      .catch((err) => {
        Notification('error', err);
        setLoader(false);
      });
  };

  return (
    <Card title={t("Employee")}>
      <Spin spinning={loader} size='large'>
        <Form
          {...layout}
          form={mainForm}
          id="mainForm"
          onFinish={onMainFormFinish}
        >
          <Row gutter={[15, 0]}>
            <Col xl={6} lg={12}>
              <Form.Item
                label={t("FullName")}
                name="Name"
                style={{ width: "100%" }}
                rules={[
                  {
                    required: true,
                    message: t("inputValidData"),
                  },
                ]}
              >
                <Input
                  className={'addonInput'}
                  placeholder={t("FullName")}
                  addonAfter={
                    <div
                      onClick={() => dispatch(openModal({
                        visible: true,
                        DataID: props.match.params.id,
                        TableID: 134,
                        ColumnName: 'FullName'
                      }))}
                    >
                      <i className="fa fa-history" style={{ color: 'white', margin: '0 6px' }} />
                    </div>
                  }
                />
              </Form.Item>
            </Col>

            <Col xl={4} lg={12}>
              <Form.Item
                label={t("inn")}
                name="INN"
                style={{ width: "100%" }}
                rules={[
                  {
                    required: true,
                    message: t("pleaseSelect"),
                  },
                ]}
              >

                <Input
                  className={'addonInput'}
                  placeholder={t("inn")}
                  maxLength={9}
                  addonAfter={
                    <div
                      onClick={() => dispatch(openModal({
                        visible: true,
                        id: props.match.params.id,
                        tableId: 134,
                        inputName: 'INN'
                      }))}
                    >
                      <i className="fa fa-history" style={{ color: 'white', margin: '0 6px' }} />
                    </div>
                  }
                />
              </Form.Item>
            </Col>

            <Col xl={4} md={8}>
              <Form.Item
                label={t("PosName")}
                name="Occupation"
                style={{ width: "100%" }}
                rules={[
                  {
                    required: true,
                    message: t("inputValidData"),
                  },
                ]}
              >
                <Input placeholder={t("PosName")} />
              </Form.Item>
            </Col>

            <Col xl={3} lg={12}>
              <Form.Item
                label={t("status")}
                name="StateID"
                rules={[
                  {
                    required: true,
                    message: t("Please select status"),
                  },
                ]}
              >
                <Select
                  placeholder={t("Select Status")}
                  allowClear
                  getPopupContainer={(trigger) => trigger.parentNode}
                >
                  {status.map((status) => (
                    <Option key={status.ID} value={status.ID}>
                      {status.DisplayName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xl={7} md={16}>
              <Form.Item
                label={t("Department")}
                name="DepartmentID"
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
                  {departmentList.map((department) => (
                    <Option key={department.ID} value={department.ID}>
                      {department.Name}
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

export default UpdateEmployee;