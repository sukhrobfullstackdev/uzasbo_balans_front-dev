import React, { useEffect, useState } from 'react'
import { Button, Col, DatePicker, Form, Input, Row, Select, Space, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

import Card from "../../../../components/MainCard";
import { CSSTransition } from 'react-transition-group';
import TableDataHistoryModal from '../../../../components/HistoryModal';
import { Notification } from '../../../../../helpers/notifications';
import TableSubAccModal from './components/TableSubAccModal';
import PermanentAssetServices from "./../../../../../services/References/Organizational/PremanetAsset/PremanetAsset.services";
import HelperServices from '../../../../../services/Helper/helper.services';
import HelperApis from '../../../../../services/Helper/helperApis';

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const { Option } = Select;
const { TextArea } = Input;

const UpdatePermanentAsset = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [mainForm] = Form.useForm();
  const docId = props.match.params.id ? props.match.params.id : 0;

  const [loader, setLoader] = useState(true);
  const [tableListModal, setTableListModal] = useState(false);
  const [tableSubAccModal, setSubAccModal] = useState(false);
  const [subAccId, setSubAccId] = useState(null);
  const [ageingSubAcc, setAgeingSubAcc] = useState(null);
  const [retireAgeingSubAccId, setRetireAgeingSubAccId] = useState(null);
  const [retireReappSubAccId, setRetireReappSubAccId] = useState(null);
  const [permanentAsset, setPermanentAsset] = useState([]);
  const [unitsOfMeasure, setUnitsOfMeasure] = useState([]);
  const [PAGroup, setPAGroup] = useState([]);
  const [PASubGroup, setPASubGroup] = useState([]);
  const [historyParams, setHistoryParams] = useState([]);
  const [subAccParams, setSubAccParams] = useState([]);
  const [itemOfExpensList, setItemOfExpenseList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [permanentAsset, unitsOfMeasure, itemOfExpensLs] = await Promise.all([
        PermanentAssetServices.getById(docId),
        HelperServices.getUnitsOfMeasureList(),
        HelperApis.getHelperData('GetItemOfExpenseForPermanentAsset')
      ]);

      setPermanentAsset(permanentAsset.data);
      setUnitsOfMeasure(unitsOfMeasure.data);
      setSubAccId(permanentAsset.data.SubAccID);
      setRetireAgeingSubAccId(permanentAsset.data.RetireAgeingSubAccID);
      setRetireReappSubAccId(permanentAsset.data.RetireReappSubAccID);
      setAgeingSubAcc(permanentAsset.data.AgeingSubAcc);
      setItemOfExpenseList(itemOfExpensLs.data);

      if (docId) {
        const paGr = await HelperServices.getPAGroupList(permanentAsset.data.SAcc.AccID);
        const paSubGr = await HelperServices.getPASubGroupList(permanentAsset.data.SubAccID);
        setPAGroup(paGr.data)
        setPASubGroup(paSubGr.data)
      }

      mainForm.setFieldsValue({
        ...permanentAsset.data,
        DeliveryDate: permanentAsset.data.DeliveryDate ? moment(permanentAsset.data.DeliveryDate, 'DD.MM.YYYY') : null,
        UnitsOfMeasureID: permanentAsset.data.UnitsOfMeasureID !== 0 ? permanentAsset.data.UnitsOfMeasureID : null,
        PAGroupID: permanentAsset.data.PAGroupID !== 0 ? permanentAsset.data.PAGroupID : null,
      });
    };

    fetchData()
      .catch(err => Notification('error', err))
      .finally(() => setLoader(false));
  }, [docId, mainForm]);

  const openTableListModal = (params) => {
    setHistoryParams(params);
    setTableListModal(true);
  };

  const openSubAccModal = (params) => {
    setSubAccParams(params);
    setSubAccModal(true);
  };

  const onSelect = async (data) => {
    setLoader(true);
    mainForm.setFieldsValue({ [`${data.Name}`]: data.Code });

    if (data.Name === 'SubAccCode') {
      setSubAccId(data.ID);
      try {
        const paGr = await HelperServices.getPAGroupList(data.ID);
        const paSubGr = await HelperServices.getPASubGroupList(data.ID);
        setPAGroup(paGr.data);
        setPASubGroup(paSubGr.data);
        setLoader(false);
      } catch (err) {
        Notification('error', err);
        setLoader(false)
      }
    } else if (data.name === 'AgeingSubAcc') {
      setAgeingSubAcc(data.ID);
    } else if (data.name === 'RetireAgeingSubAccCode') {
      setRetireAgeingSubAccId(data.ID);
    } else {
      setRetireReappSubAccId(data.ID);
    }
    setLoader(false);
  };

  const onMainFormFinish = (values) => {
    setLoader(true);
    const data = { ...values }
    data.ID = docId;
    data.SubAccID = subAccId;
    data.AgeingSubAccID = ageingSubAcc;
    data.RetireAgeingSubAccID = retireAgeingSubAccId;
    data.RetireReappSubAccID = retireReappSubAccId;
    data.DeliveryDate = data.DeliveryDate.format('DD.MM.YYYY');

    PermanentAssetServices.update(data)
      .then(() => {
        history.push(`/PermanentAsset`);
        Notification('success', docId === 0 ? t('success-msg') : t('edited'));
      })
      .catch((err) => Notification('error', err))
      .finally(() => setLoader(false))
  };

  return (
    <Card title={t("PermanentAsset")}>
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
                label={t("Name")}
                name="Name"
                style={{ width: "100%" }}
                rules={[
                  {
                    required: true,
                    message: t("Please input valid"),
                  },
                ]}>
                <Input
                  style={{ color: 'black' }}
                />
              </Form.Item>
            </Col>
            <Col xl={6} lg={12}>
              <Form.Item
                label={t("InventoryNumber")}
                name="InventoryNumber"
                style={{ width: "100%" }}
                rules={[
                  {
                    required: false,
                    message: t("Please input valid"),
                  },
                ]}>
                <Input
                  style={{ color: 'black' }}
                />
              </Form.Item>
            </Col>
            <Col xl={6} lg={12}>
              <div className='input-with-history'>
                <Form.Item
                  label={t("DeliveryDate")}
                  name="DeliveryDate"
                  style={{ width: "100%" }}
                  rules={[
                    {
                      required: true,
                      message: t("Please input valid"),
                    },
                  ]}
                >
                  <DatePicker format="DD.MM.YYYY" style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    icon={<i className="fa fa-history" />}
                    onClick={() => openTableListModal({
                      DataID: permanentAsset.ID,
                      TableID: 180, //PermanentAsset
                      ColumnName: 'DeliveryDate',
                    })}
                  />
                </Form.Item>
              </div>
            </Col>
            <Col xl={6} lg={12}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Form.Item
                  label={t("UnitsOfMeasure")}
                  name="UnitsOfMeasureID"
                  style={{ width: "calc(100% - 28px)" }}
                  rules={[
                    {
                      required: false,
                      message: t("Please input valid"),
                    },
                  ]}>
                  <Select
                    showSearch
                    allowClear
                    className={'addonInput'}
                    placeholder={t("UnitsOfMeasure")}
                    getPopupContainer={(trigger) => trigger.parentNode}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {unitsOfMeasure.map((measure) => (
                      <Option key={measure.ID} value={measure.ID}>
                        {measure.Code}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Button
                  type="primary"
                  icon={<i className="fa fa-history" style={{ color: 'white', margin: '0 6px', fontSize: '14px' }} />}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '16px', width: "28px" }}
                  onClick={() => openTableListModal({
                    DataID: permanentAsset.ID,
                    TableID: 180, //PermanentAsset
                    ColumnName: 'UnitsOfMeasureID',
                  })}
                />
              </div>
            </Col>
            
            <Col xl={6} lg={12}>
              <Form.Item
                label={t("SubAccCode")}
                name="SubAccCode"
                style={{ width: "100%" }}
                rules={[
                  {
                    required: true,
                    message: t("inputValidData"),
                  },
                ]}
              >
                <Input
                  placeholder={t("SubAccCode")}
                  className={'addonInput'}
                  disabled
                  addonBefore={
                    <div
                      onClick={() => openSubAccModal({
                        AccID: 1, //constant
                        Name: "SubAccCode",
                      })}
                    >
                      <i className="fa fa-search" style={{ color: 'white', margin: '0 6px' }} />
                    </div>
                  }
                  addonAfter={
                    <div
                      onClick={() => openTableListModal({
                        DataID: permanentAsset.ID,
                        TableID: 180, //PermanentAsset
                        ColumnName: 'SubAccCode',
                      })}
                    >
                      <i className="fa fa-history" style={{ color: 'white', margin: '0 6px' }} />
                    </div>
                  }
                />
              </Form.Item>
            </Col>
            <Col xl={6} lg={12}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Form.Item
                  label={t("Group")}
                  name="PAGroupID"
                  style={{ width: "calc(100% - 28px)" }}
                  rules={[
                    {
                      required: false,
                      message: t("Please input valid"),
                    },
                  ]}>
                  <Select
                    showSearch
                    allowClear
                    className={'addonInput'}
                    placeholder={t("Group")}
                    getPopupContainer={(trigger) => trigger.parentNode}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {PAGroup.map((PAGroup) => (
                      <Option key={PAGroup.ID} value={PAGroup.ID}>
                        {PAGroup.Name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Button
                  type="primary"
                  icon={<i className="fa fa-history" style={{ color: 'white', margin: '0 6px', fontSize: '14px' }} />}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '16px', width: "28px" }}
                  onClick={() => openTableListModal({
                    DataID: permanentAsset.ID,
                    TableID: 180, //PermanentAsset
                    ColumnName: 'PAGroupID',
                  })}
                />
              </div>
            </Col>
            <Col xl={6} lg={12}>
              <Form.Item
                label={t("AgeingSubAcc")}
                name="AgeingSubAcc"
                style={{ width: "100%" }}
                rules={[
                  {
                    required: true,
                    message: t("Please input valid"),
                  },
                ]}
              >
                <Input
                  placeholder={t("AgeingSubAcc")}
                  className={'addonInput'}
                  disabled
                  addonBefore={
                    <div
                      onClick={() => openSubAccModal({
                        AccID: 2, //constant
                        Name: "AgeingSubAcc",
                      })}
                    >
                      <i className="fa fa-search" style={{ color: 'white', margin: '0 6px' }} />
                    </div>
                  }
                  addonAfter={
                    <div
                      onClick={() => openTableListModal({
                        DataID: permanentAsset.ID,
                        TableID: 180, //PermanentAsset
                        ColumnName: 'AgeingSubAcc',
                      })}
                    >
                      <i className="fa fa-history" style={{ color: 'white', margin: '0 6px' }} />
                    </div>
                  }
                />
              </Form.Item>
            </Col>
            <Col xl={6} lg={12}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Form.Item
                  label={t("SubGroup")}
                  name="PASubGroupID"
                  style={{ width: "calc(100% - 28px)" }}
                  rules={[
                    {
                      required: false,
                      message: t("Please input valid"),
                    },
                  ]}>
                  <Select
                    showSearch
                    allowClear
                    className={'addonInput'}
                    placeholder={t("SubGroup")}
                    getPopupContainer={(trigger) => trigger.parentNode}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {PASubGroup.map((PASubGroup) => (
                      <Option key={PASubGroup.ID} value={PASubGroup.ID}>
                        {PASubGroup.Name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Button
                  type="primary"
                  icon={<i className="fa fa-history" style={{ color: 'white', margin: '0 6px', fontSize: '14px' }} />}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '16px', width: "28px" }}
                  onClick={() => openTableListModal({
                    DataID: permanentAsset.ID,
                    TableID: 180, //PermanentAsset
                    ColumnName: 'PASubGroupID',
                  })}
                />
              </div>
            </Col>
            
            <Col xl={6} lg={12}>
              <Form.Item
                label={t("RetireAgeingSubAccCode")}
                name="RetireAgeingSubAccCode"
                style={{ width: "100%" }}
                rules={[
                  {
                    required: true,
                    message: t("Please input valid"),
                  },
                ]}
              >
                <Input
                  placeholder={t("RetireAgeingSubAccCode")}
                  className={'addonInput'}
                  disabled
                  addonBefore={
                    <div
                      onClick={() => openSubAccModal({
                        AccID: 3, //constant
                        Name: "RetireAgeingSubAccCode",
                      })}
                    >
                      <i className="fa fa-search" style={{ color: 'white', margin: '0 6px' }} />
                    </div>
                  }
                  addonAfter={
                    <div
                      onClick={() => openTableListModal({
                        DataID: permanentAsset.ID,
                        TableID: 180, //PermanentAsset
                        ColumnName: 'RetireAgeingSubAccCode',
                      })}
                    >
                      <i className="fa fa-history" style={{ color: 'white', margin: '0 6px' }} />
                    </div>
                  }
                />
              </Form.Item>
            </Col>
            <Col xl={6} lg={12}>
              <Form.Item
                label={t("AgeingRate")}
                name="AgeingRate"
                style={{ width: "100%" }}
                rules={[
                  {
                    required: true,
                    message: t("Please input valid"),
                  },
                ]}>
                <Input
                  className={'addonInput'}
                  addonAfter={
                    <div
                      onClick={() => openTableListModal({
                        DataID: permanentAsset.ID,
                        TableID: 180, //PermanentAsset
                        ColumnName: 'AgeingRate',
                      })}
                    >
                      <i className="fa fa-history" style={{ color: 'white', margin: '0 6px' }} />
                    </div>
                  }
                />
              </Form.Item>
            </Col>
            <Col xl={6} lg={12}>
              <Form.Item
                label={t("RetireReappSubAccCode")}
                name="RetireReappSubAccCode"
                style={{ width: "100%" }}
                rules={[
                  {
                    required: true,
                    message: t("Please input valid"),
                  },
                ]}
              >
                <Input
                  placeholder={t("RetireReappSubAccCode")}
                  className={'addonInput'}
                  disabled
                  addonBefore={
                    <div
                      onClick={() => openSubAccModal({
                        AccID: 4, //constant,
                        Name: "RetireReappSubAccCode",
                      })}
                    >
                      <i className="fa fa-search" style={{ color: 'white', margin: '0 6px' }} />
                    </div>
                  }
                  addonAfter={
                    <div
                      onClick={() => openTableListModal({
                        DataID: permanentAsset.ID,
                        TableID: 180, //PermanentAsset
                        ColumnName: 'RetireReappSubAccCode',
                      })}
                    >
                      <i className="fa fa-history" style={{ color: 'white', margin: '0 6px' }} />
                    </div>
                  }
                />
              </Form.Item>
            </Col>
            <Col xl={6} lg={12}>
              <Form.Item
                label={t("ItemOfExpenseForPermanentAsset")}
                name="RetireAgeingItemOfExpenseID"
                style={{ width: "100%" }}
                rules={[
                  {
                    required: true,
                    message: t("pleaseSelect"),
                  },
                ]}>
                <Select
                  showSearch
                  allowClear
                  className={'addonInput'}
                  placeholder={t("ItemOfExpenseForPermanentAsset")}
                  getPopupContainer={(trigger) => trigger.parentNode}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {itemOfExpensList.map((item) => (
                    <Option key={item.ID} value={item.ID}>
                      {item.Code}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            
            <Col xl={8} md={16}>
              <Form.Item
                label={t("Comment")}
                name="Comment"
                style={{ width: "100%" }}
                rules={[
                  {
                    required: true,
                    message: t("Please input valid"),
                  },
                ]}>
                <TextArea
                  placeholder={t("Comment")}
                />
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

      <CSSTransition
        mountOnEnter
        unmountOnExit
        in={tableListModal}
        timeout={300}
      >
        <TableDataHistoryModal
          visible={tableListModal}
          params={historyParams}
          onCancel={() => {
            setTableListModal(false);
          }}
        />
      </CSSTransition>
      <CSSTransition
        mountOnEnter
        unmountOnExit
        in={tableSubAccModal}
        timeout={300}
      >
        <TableSubAccModal
          visible={tableSubAccModal}
          params={subAccParams}
          onSelect={onSelect}
          onCancel={() => {
            setSubAccModal(false);
          }}
        />
      </CSSTransition>
    </Card>
  )
}

export default React.memo(UpdatePermanentAsset);