import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Col, Form, Input, Row, Select, Space, Spin, Switch } from 'antd';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import moment from "moment";
import { useDispatch } from 'react-redux';

import HelperServices from '../../../../../services/Helper/helper.services';
import ChildrenServices from '../../../../../services/References/Organizational/Children/Children.services';
import Card from "../../../../components/MainCard";
import { Notification } from '../../../../../helpers/notifications';
import { DatePicker } from "antd";
import DepartmentsListModal from './components/DepartmentsListModal';
import { openModal } from '../../../../../store/history-modal-slice';

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const docSeries = [
  { code: 'I-QQ', name: 'I-QQ Республика Каракалпакстан' },
  { code: 'I-AN', name: 'I-AN Андижанская' },
  { code: 'I-BH', name: 'I-BH Бухарская' },
  { code: 'I-GZ', name: 'I-GZ Джизакская' },
  { code: 'I-QD', name: 'I-QD Кашкадарьинская' },
  { code: 'I-NV', name: 'I-NV Навоийская' },
  { code: 'I-NA', name: 'I-NA Наманганская' },
  { code: 'I-SM', name: 'I-SM Самаркандская' },
  { code: 'I-SR', name: 'I-SR Сырдарьинская' },
  { code: 'I-SU', name: 'I-SU Сурхандарьинская' },
  { code: 'I-FR', name: 'I-FR Ферганская' },
  { code: 'I-HR', name: 'I-HR Хорезмская' },
  { code: 'I-TV', name: 'I-TV Ташкентская' },
  { code: 'I-TN', name: 'I-TN Город Ташкент' },
  { code: 'II-QQ', name: 'II-QQ Республика Каракалпакстан' },
  { code: 'II-AN', name: 'II-AN Андижанская' },
  { code: 'II-BH', name: 'II-BH Бухарская' },
  { code: 'II-GZ', name: 'II-GZ Джизакская' },
  { code: 'II-QD', name: 'II-QD Кашкадарьинская' },
  { code: 'II-NV', name: 'II-NV Навоийская' },
  { code: 'II-NA', name: 'II-NA Наманганская' },
  { code: 'II-SM', name: 'II-SM Самаркандская' },
  { code: 'II-SR', name: 'II-SR Сырдарьинская' },
  { code: 'II-SU', name: 'II-SU Сурхандарьинская' },
  { code: 'II-FR', name: 'II-FR Ферганская' },
  { code: 'II-HR', name: 'II-HR Хорезмская' },
  { code: 'II-TV', name: 'II-TV Ташкентская' },
  { code: 'II-TN', name: 'II-TN Город Ташкент' },
  { code: 'III-QQ', name: 'III-QQ Республика Каракалпакстан' },
  { code: 'III-AN', name: 'III-AN Андижанская' },
  { code: 'III-BH', name: 'III-BH Бухарская' },
  { code: 'III-GZ', name: 'III-GZ Джизакская' },
  { code: 'III-QD', name: 'III-QD Кашкадарьинская' },
  { code: 'III-NV', name: 'III-NV Навоийская' },
  { code: 'III-NA', name: 'III-NA Наманганская' },
  { code: 'III-SM', name: 'III-SM Самаркандская' },
  { code: 'III-SR', name: 'III-SR Сырдарьинская' },
  { code: 'III-SU', name: 'III-SU Сурхандарьинская' },
  { code: 'III-FR', name: 'III-FR Ферганская' },
  { code: 'III-HR', name: 'III-HR Хорезмская' },
  { code: 'III-TV', name: 'III-TV Ташкентская' },
  { code: 'III-TN', name: 'III-TN Город Ташкент' },
];

const { Option } = Select;
const { TextArea } = Input;

const UpdateChildren = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const [mainForm] = Form.useForm();
  const locationParams = useLocation().search;
  const docId = props.match.params.id ? props.match.params.id : 0;

  const [loader, setLoader] = useState(true);
  const [children, setChildren] = useState([]);
  const [docTypeList, setDocTypeList] = useState([]);
  const [childrenGroupTypeList, setChildrenGroupTypeList] = useState([]);
  const [workSheduleKindList, setWorkSheduleKindList] = useState([]);
  const [childHoursTypeList, setChildHoursTypeList] = useState([]);
  const [departmentsListModal, setDepartmentsListModal] = useState(false);

  const [IsEmployee, setIsEmployee] = useState(true);
  const [DocumentTypeID, setDocumentTypeID] = useState(null);
  const [ChildrenGroupTypeID, setChildrenGroupTypeID] = useState(null);
  const [departmentID, setDepartmentID] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const [children, docTypeList, childrenGroupTypeList, workSheduleKindList] = await Promise.all([
        ChildrenServices.getById(locationParams ? locationParams : `?id=${docId}`),
        HelperServices.getDocumentTypeList(),
        HelperServices.childrenGroupTypeList(),
        HelperServices.workSheduleKindList(),
      ]);

      if (docId) {
        const childHoursTypeLs = await HelperServices.childHoursTypeList(children.data.ChildrenGroupTypeID);
        setChildHoursTypeList(childHoursTypeLs.data);
      }

      setChildren(children.data);
      setDocTypeList(docTypeList.data);
      setChildrenGroupTypeList(childrenGroupTypeList.data);
      setWorkSheduleKindList(workSheduleKindList.data);
      setIsEmployee(children.data.IsEmployee);
      setDocumentTypeID(children.data.DocumentTypeID);
      setChildrenGroupTypeID(children.data.ChildrenGroupTypeID);

      mainForm.setFieldsValue({
        ...children.data,
        DateOfBirth: children.data.DateOfBirth ? moment(children.data.DateOfBirth, 'DD.MM.YYYY') : null,
        DateOfReception: children.data.DateOfReception ? moment(children.data.DateOfReception, 'DD.MM.YYYY') : null,
        DateOfDismissal: children.data.DateOfDismissal ? moment(children.data.DateOfDismissal, 'DD.MM.YYYY') : null,
      });
    };

    fetchData()
      .catch(err => Notification('error', err))
      .finally(() => setLoader(false))
  }, [docId, mainForm, locationParams]);

  const onMainFormFinish = (values) => {
    setLoader(true);
    values.ID = docId;
    values.DepartmentID = departmentID;
    ChildrenServices.update(values)
      .then(() => {
        history.push(`/Children`);
        docId === 0 ? Notification('success', t('success-msg')) : Notification('success', t('edited'))
      })
      .catch((err) => Notification('error', err))
      .finally(() => setLoader(false))
  };

  const handleIsEmployee = (e) => {
    setIsEmployee(e);
    mainForm.setFieldsValue({
      [`DocumentTypeID`]: null,
    });
    setDocumentTypeID(null);
    setChildren({ ...children, DocumentTypeID: null });
  };

  const handleDocumentTypeID = (value) => {
    setDocumentTypeID(value);
    mainForm.setFieldsValue({
      [`DocumentSeries`]: null,
      [`DocumentNumber`]: null,
    });
    setChildren({ ...children, DocumentSeries: null, DocumentNumber: null });
  };

  const handleChildrenGroupTypeID = (value) => {
    setLoader(true);
    HelperServices.childHoursTypeList(value)
    .then(res => {
      setChildHoursTypeList(res.data);
    })
    .catch(err => Notification('error', err))
    .finally(() => setLoader(false))
    
    setChildrenGroupTypeID(value);
    mainForm.setFieldsValue({
      [`MoreThanOneChild`]: null,
      [`NoPayment`]: null,
      [`IsRent`]: null,
    });
    setChildren({ ...children, MoreThanOneChild: null, NoPayment: null, IsRent: null });
  };

  const onSelect = (data) => {
    mainForm.setFieldsValue({
      DepartmentName: data.NameValue,
    });
    setDepartmentID(data.ID)
  };

  return (
    <Card title={t("Children")}>
      <Spin spinning={loader} size='large'>
        <Form
          {...layout}
          form={mainForm}
          id="mainForm"
          onFinish={onMainFormFinish}
        >
          <Row gutter={[15, 0]}>
            <Col xl={6} md={8}>
              <Form.Item
                label={t("FullName")}
                name="Name"
                style={{ width: "100%" }}
                rules={[
                  {
                    required: true,
                    message: t("Please input valid"),
                  },
                ]}
              >
                <Input
                  placeholder={t("FullName")}
                  addonAfter={
                    <Button
                      type='primary'
                      icon={<i className="fa fa-history" />}
                      onClick={() => dispatch(openModal({
                        visible: true,
                        id: docId,
                        tableId: 248,
                        inputName: 'Name'
                      }))}
                    />
                  }
                />
              </Form.Item>
            </Col>
            <Col xl={6} lg={12}>
              <Form.Item
                label={t('foodPayment')}
                name="IsEmployee"
                valuePropName="checked"
              >
                <Switch onChange={handleIsEmployee} />
              </Form.Item>
            </Col>
            {(IsEmployee === false || IsEmployee === null) && (
              <>
                <Col xl={6} lg={12}>
                  <Form.Item
                    label={t("docType")}
                    name="DocumentTypeID"
                    rules={[
                      {
                        required: true,
                        message: t("pleaseSelect"),
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      allowClear
                      placeholder={t("Select from list")}
                      getPopupContainer={(trigger) => trigger.parentNode}
                      onChange={handleDocumentTypeID}
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {docTypeList.map((type) => (
                        <Option key={type.ID} value={type.ID}>
                          {type.DisplayName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                {DocumentTypeID === 1 &&
                  <Col xl={6} lg={12}>
                    <div className='input-with-history'>
                      <Form.Item
                        label={t("DocumentSeries")}
                        name="DocumentSeries"
                        style={{ width: "calc(100% - 32px)" }}
                        rules={[
                          {
                            required: true,
                            message: t("pleaseSelect"),
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          placeholder={t("DocumentSeries")}
                          allowClear
                          getPopupContainer={(trigger) => trigger.parentNode}
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {docSeries.map((series) => (
                            <Option key={series.code} value={series.code}>
                              {series.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item>
                        <Button
                          type='primary'
                          icon={<i className="fa fa-history" />}
                          onClick={() => dispatch(openModal({
                            visible: true,
                            id: docId,
                            tableId: 248,
                            inputName: 'DocumentSeries'
                          }))}
                        />
                      </Form.Item>
                    </div>
                  </Col>
                }

                {(DocumentTypeID === 2 || DocumentTypeID === 3) &&
                  <Col xl={6} lg={12}>
                    <Form.Item
                      label={t("DocumentSeries")}
                      name="DocumentSeries"
                      rules={[
                        {
                          required: true,
                          message: t("inputValidData"),
                        },
                      ]}
                    >
                      <Input
                        style={{ width: '100%' }}
                        placeholder={t("DocumentSeries")}
                        maxLength={DocumentTypeID === 2 ? 2 : 100}
                        addonAfter={
                          <Button
                            type='primary'
                            icon={<i className="fa fa-history" />}
                            onClick={() => dispatch(openModal({
                              visible: true,
                              id: docId,
                              tableId: 248,
                              inputName: 'DocumentSeries'
                            }))}
                          />
                        }
                      />
                    </Form.Item>
                  </Col>
                }
              </>
            )}
          </Row>

          <Row gutter={[15, 0]}>
            {!IsEmployee && (
              <>
                <Col xl={6} lg={12}>
                  <Form.Item
                    label={t("docNum")}
                    name="DocumentNumber"
                    style={{ width: "100%" }}
                    rules={[
                      {
                        required: true,
                        message: t("Please input valid"),
                      },
                    ]}
                  >
                    <Input
                      placeholder={t("docNum")}
                      addonAfter={
                        <Button
                          type='primary'
                          icon={<i className="fa fa-history" />}
                          onClick={() => dispatch(openModal({
                            visible: true,
                            id: docId,
                            tableId: 248,
                            inputName: 'DocumentNumber'
                          }))}
                        />
                      }
                    />
                  </Form.Item>
                </Col>
                <Col xl={6} lg={12}>
                  <Form.Item
                    label={t("Таб.№")}
                    name="Number"
                  >
                    <Input
                      style={{ width: "100%" }}
                      disabled
                      placeholder={t("Таб.№")}
                      addonAfter={
                        <Button
                          type='primary'
                          icon={<i className="fa fa-history" />}
                          onClick={() => dispatch(openModal({
                            visible: true,
                            id: docId,
                            tableId: 248,
                            inputName: 'Number'
                          }))}
                        />
                      }
                    />
                  </Form.Item>
                </Col>
                <Col xl={6} lg={12}>
                  <div className='input-with-history'>
                    <Form.Item
                      label={t("DateOfBirth")}
                      name="DateOfBirth"
                      style={{ width: "100%" }}
                      rules={[
                        {
                          required: true,
                          message: t("pleaseSelect"),
                        },
                      ]}
                    >
                      <DatePicker
                        format="DD.MM.YYYY"
                        style={{ width: '100%' }}
                        placeholder={t('DateOfBirth')}
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        icon={<i className="fa fa-history" />}
                        onClick={() => dispatch(openModal({
                          visible: true,
                          id: docId,
                          tableId: 248,
                          inputName: 'DateOfBirth'
                        }))}
                      />
                    </Form.Item>
                  </div>
                </Col>
                <Col xl={6} lg={12}>
                  <Form.Item
                    label={t("Address")}
                    name="Address"
                    style={{ width: "100%" }}
                    rules={[
                      {
                        required: true,
                        message: t("inputValidData"),
                      },
                    ]}
                  >
                    <Input
                      placeholder={t("Address")}
                    />
                  </Form.Item>
                </Col>

                <Col xl={6} lg={12}>
                  <Form.Item
                    label={t("phoneNumber")}
                    name="PhoneNumber"
                    style={{ width: "100%" }}
                    rules={[
                      {
                        required: true,
                        message: t("inputValidData"),
                        pattern: /^[\d]{12,12}$/,
                      },
                    ]}>
                    <Input
                      className={'addonInput'}
                      maxLength={12}
                      addonAfter={
                        <Button
                          type='primary'
                          icon={<i className="fa fa-history" />}
                          onClick={() => dispatch(openModal({
                            visible: true,
                            id: docId,
                            tableId: 248,
                            inputName: 'PhoneNumber'
                          }))}
                        />
                      }
                    />
                  </Form.Item>
                </Col>
                <Col xl={6} lg={12}>
                  <div className='input-with-history'>
                    <Form.Item
                      label={t("ChildrenGroupType")}
                      name="ChildrenGroupTypeID"
                      style={{ width: "calc(100% - 32px)" }}
                      rules={[
                        {
                          required: true,
                          message: t("pleaseSelect"),
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        placeholder={t("ChildrenGroupType")}
                        allowClear
                        getPopupContainer={(trigger) => trigger.parentNode}
                        onChange={handleChildrenGroupTypeID}
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {childrenGroupTypeList.map((type) => (
                          <Option key={type.ID} value={type.ID}>
                            {type.DisplayName}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        icon={<i className="fa fa-history" />}
                        onClick={() => dispatch(openModal({
                          visible: true,
                          id: docId,
                          tableId: 248,
                          inputName: 'ChildrenGroupTypeID'
                        }))}
                      />
                    </Form.Item>
                  </div>
                </Col>
                <Col xl={6} lg={12}>
                  <Form.Item
                    label={t("Group")}
                    name="DepartmentName"
                    style={{ width: "100%" }}
                    rules={[
                      {
                        required: false,
                        message: t("Please input valid"),
                      },
                    ]}>
                    <Input
                      placeholder={t("Group")}
                      className={'addonInput'}
                      disabled
                      addonAfter={
                        <Button
                          type="primary"
                          icon={<i className="fa fa-search" />}
                          onClick={() => setDepartmentsListModal(true)}
                        />
                      }
                    />
                  </Form.Item>
                </Col>
                <Col xl={6} md={8}>
                  <div className='input-with-history'>
                    <Form.Item
                      label={t("workScheduleType")}
                      name="WorkSheduleKindID"
                      style={{ width: "calc(100% - 32px)" }}
                      rules={[
                        {
                          required: true,
                          message: t("pleaseSelect"),
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        placeholder={t("workScheduleType")}
                        allowClear
                        getPopupContainer={(trigger) => trigger.parentNode}
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {workSheduleKindList.map((schedule) => (
                          <Option key={schedule.ID} value={schedule.ID}>
                            {schedule.DisplayName}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        icon={<i className="fa fa-history" />}
                        onClick={() => dispatch(openModal({
                          visible: true,
                          id: docId,
                          tableId: 248,
                          inputName: 'WorkSheduleKindID'
                        }))}
                      />
                    </Form.Item>
                  </div>
                </Col>

                <Col xl={6} lg={12}>
                  <div className='input-with-history'>
                    <Form.Item
                      label={t("ChildHoursType")}
                      name="ChildHoursTypeID"
                      style={{ width: "calc(100% - 32px)" }}
                      rules={[
                        {
                          required: true,
                          message: t("pleaseSelect"),
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        placeholder={t("ChildHoursType")}
                        allowClear
                        getPopupContainer={(trigger) => trigger.parentNode}
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {childHoursTypeList.map((schedule) => (
                          <Option key={schedule.ID} value={schedule.ID}>
                            {schedule.DisplayName}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        icon={<i className="fa fa-history" />}
                        onClick={() => dispatch(openModal({
                          visible: true,
                          id: docId,
                          tableId: 248,
                          inputName: 'ChildHoursTypeID'
                        }))}
                      />
                    </Form.Item>
                  </div>
                </Col>
                {(ChildrenGroupTypeID === 1 || ChildrenGroupTypeID === 2 || ChildrenGroupTypeID === 6 || ChildrenGroupTypeID === 7) && (
                  <Col xl={6} lg={12}>
                    <Form.Item
                      label="&zwnj;"
                      name="MoreThanOneChild"
                      valuePropName="checked"
                    >
                      <Checkbox
                      >
                        {t("MoreThanOneChild")}
                      </Checkbox>
                    </Form.Item>
                  </Col>
                )}
                {(ChildrenGroupTypeID === 8) && (
                  <Col xl={6} lg={12}>
                    <Form.Item
                      label="&zwnj;"
                      name="IsRent"
                      valuePropName="checked"
                    >
                      <Checkbox
                      >
                        {t("IsRent")}
                      </Checkbox>
                    </Form.Item>
                  </Col>
                )}
                {(ChildrenGroupTypeID !== 8) && (
                  <Col xl={6} lg={12}>
                    <Form.Item
                      label="&zwnj;"
                      name="NoPayment"
                      valuePropName="checked"
                    >
                      <Checkbox>
                        {t("NoPayment")}
                      </Checkbox>
                    </Form.Item>
                  </Col>
                )}

                <Col xl={6} lg={12}>
                  <div className='input-with-history'>
                    <Form.Item
                      label={t("dateOfAcceptance")}
                      name="DateOfReception"
                      style={{ width: "100%" }}
                      rules={[
                        {
                          required: true,
                          message: t("pleaseSelect"),
                        },
                      ]}
                    >
                      <DatePicker
                        style={{ width: "100%" }}
                        format="DD.MM.YYYY"
                        placeholder={t('dateOfAcceptance')}
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        icon={<i className="fa fa-history" />}
                        onClick={() => dispatch(openModal({
                          visible: true,
                          id: docId,
                          tableId: 248,
                          inputName: 'DateOfReception'
                        }))}
                      />
                    </Form.Item>
                  </div>
                </Col>
                <Col xl={6} lg={12}>
                  <div className='input-with-history'>
                    <Form.Item
                      label={t("dateOfLastDay")}
                      name="DateOfDismissal"
                      rules={[
                        {
                          required: true,
                          message: t("pleaseSelect"),
                        },
                      ]}>
                      <DatePicker
                        format="DD.MM.YYYY"
                        style={{ width: '100%' }}
                        placeholder={t('dateOfLastDay')}
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        icon={<i className="fa fa-history" />}
                        onClick={() => dispatch(openModal({
                          visible: true,
                          id: docId,
                          tableId: 248,
                          inputName: 'DateOfDismissal'
                        }))}
                      />
                    </Form.Item>
                  </div>
                </Col>
              </>
            )}
            <Col xl={12} lg={12}>
              <div className='input-with-history'>
                <Form.Item
                  style={{ width: "100%" }}
                  label={t("Comment")}
                  name="Comment"
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData"),
                    },
                  ]}
                >
                  <TextArea rows={1} />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    icon={<i className="fa fa-history" />}
                    onClick={() => dispatch(openModal({
                      visible: true,
                      id: docId,
                      tableId: 248,
                      inputName: 'Comment'
                    }))}
                  />
                </Form.Item>
              </div>
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
      </Spin >

      <CSSTransition
        mountOnEnter
        unmountOnExit
        in={departmentsListModal}
        timeout={300}
      >
        <DepartmentsListModal
          visible={departmentsListModal}
          onSelect={onSelect}
          onCancel={() => {
            setDepartmentsListModal(false);
          }}
        />
      </CSSTransition>
    </Card>
  )
}

export default UpdateChildren;