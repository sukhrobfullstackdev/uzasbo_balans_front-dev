import { Button, Col, Form, Input, Row, Select, Space, Spin, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';

import Card from "../../../../components/MainCard";
import { CSSTransition } from 'react-transition-group';
import { useHistory } from 'react-router-dom';
import StaffTableHeader from './components/TableHeader';
import EditableCell from './components/EditableCell';
import ContractorsServices from '../../../../../services/References/Organizational/Contractors/Contractors.services';
import HelperServices from '../../../../../services/Helper/helper.services';
import { Notification } from '../../../../../helpers/notifications';
import TableDataHistoryModal from '../../../../components/HistoryModal';

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const { Option } = Select;

const UpdateContractors = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [mainForm] = Form.useForm();

  const [loader, setLoader] = useState(true);
  const [contractor, setContractor] = useState([]);
  const [contractorTables, setContractorTables] = useState([]);
  const [OKEDList, setOKEDList] = useState([]);
  const [tableListModal, setTableListModal] = useState(false);
  const [historyParams, setHistoryParams] = useState([]);

  const [bankList, setBankList] = useState([]);
  const [oblastList, setOblastList] = useState([]);
  const [districtList, setDistrictList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [contractor, OKEDList, bankList, oblastList] = await Promise.all([
        ContractorsServices.getById(props.match.params.id ? props.match.params.id : 0),
        HelperServices.GetOKEDList(),
        HelperServices.GetBankList(),
        HelperServices.getOblastList(),

      ]);

      setContractor(contractor.data);
      setContractorTables(contractor.data.Tables);
      setOKEDList(OKEDList.data);
      setBankList(bankList.data);
      setOblastList(oblastList.data);

      if (props.match.params.id) {
        HelperServices.getDistrictList(contractor.data.OblastID)
          .then(response => {
            setDistrictList(response.data)
          })
          .catch((err) => Notification('error', err));
      }

      mainForm.setFieldsValue({
        ...contractor.data,
      });
      setLoader(false);
    };

    fetchData().catch(err => {
      Notification('error', err);
      setLoader(false);
    });
  }, [props.match.params.id, mainForm]);

  const openTableListModal = (params) => {
    setHistoryParams(params);
    setTableListModal(true);
  };

  const onMainFormFinish = (values) => {
    setLoader(true);
    ContractorsServices.update({
      ...contractor, ...values,
      Tables: contractorTables
    })
      .then((res) => {
        if (res.status === 200) {
          setLoader(false);
          history.push(`/Contractors`);
          props.match.params.id === 0 ? Notification('success', t('success-msg')) : Notification('success', t('edited'));
        }
      })
      .catch((err) => {
        Notification('error', err);
        setLoader(false);
      });
  };

  const addTableDataHandler = (data) => {
    setContractorTables([...contractorTables, data]);
  };

  const regionChangeHandler = (id) => {
    mainForm.setFieldsValue({ RegionID: null });
    HelperServices.getDistrictList(id)
      .then(response => {
        setDistrictList(response.data)
      })
      .catch((err) => Notification('error', err));
  };

  const columns = [
    {
      title: t("Name"),
      dataIndex: "Name",
      key: "Name",
      sorter: true,
      width: 300,
      render: record => <div className="ellipsis-2">{record}</div>
    },
    {
      title: t("Code"),
      dataIndex: "Code",
      key: "Code",
      width: 150,
      sorter: true,
    },
    {
      title: t("BankID"),
      dataIndex: "BankID",
      key: "BankID",
      sorter: true,
      width: 150,
    },
    {
      title: '',
      dataIndex: "",
      key: "",
      sorter: false,
      width: 50,
    },
  ];

  return (
    <Card title={t("Contractors")}>
      <Spin spinning={loader} size='large'>
        <Form
          {...layout}
          form={mainForm}
          id="mainForm"
          onFinish={onMainFormFinish}
        >
          <Row gutter={[15, 0]}>
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
                ]}>
                <Input
                  className={'addonInput'}
                  addonAfter={
                    <div
                      onClick={() => openTableListModal({
                        DataID: contractor.ID,
                        TableID: 174, //contractor
                        ColumnName: 'Name',
                      })}
                    >
                      <i className="fa fa-history" style={{ color: 'white', margin: '0 6px' }} />
                    </div>
                  }
                />
              </Form.Item>
            </Col>
            <Col xl={4} md={8}>
              <Form.Item
                label={t("inn")}
                name="INN"
                style={{ width: "100%" }}
                rules={[
                  {
                    required: true,
                    pattern: /^[\d]{9}$/,
                    message: t("Please input valid"),
                  },
                ]}>
                <Input
                  placeholder={t('inn')} maxLength={9}
                  className={'addonInput'}
                  addonAfter={
                    <div
                      onClick={() => openTableListModal({
                        DataID: contractor.ID,
                        TableID: 174, //contractor
                        ColumnName: 'INN',
                      })}
                    >
                      <i className="fa fa-history" style={{ color: 'white', margin: '0 6px' }} />
                    </div>
                  }
                />
              </Form.Item>
            </Col>
            <Col xl={4} md={8}>
              <Form.Item
                label={t("OblastID")}
                name="OblastID"
                style={{ width: "100%" }}
                rules={[
                  {
                    required: false,
                    message: t("Please input valid"),
                  },
                ]}>
                <Select
                  allowClear
                  placeholder={t("OblastID")}
                  getPopupContainer={(trigger) => trigger.parentNode}
                  onChange={regionChangeHandler}
                >
                  {oblastList.map((oblast) => (
                    <Option key={oblast.ID} value={oblast.ID}>
                      {oblast.Name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xl={4} md={8}>
              <Form.Item
                label={t("RegionID")}
                name="RegionID"
                style={{ width: "100%" }}
                rules={[
                  {
                    required: false,
                    message: t("Please input valid"),
                  },
                ]}>
                <Select
                  allowClear
                  placeholder={t("RegionID")}
                  getPopupContainer={(trigger) => trigger.parentNode}
                >
                  {districtList.map((district) => (
                    <Option key={district.ID} value={district.ID}>
                      {district.Name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xl={4} md={8}>
              <Form.Item
                label={t("Address")}
                name="Address"
                style={{ width: "100%" }}
                rules={[
                  {
                    required: false,
                    message: t("Please input valid"),
                  },
                ]}>
                <Input
                  style={{ color: 'black' }} />
              </Form.Item>
            </Col>
            <Col xl={8} md={16}>
              <Form.Item
                label={t("oked")}
                name="OKONHID"
                rules={[
                  {
                    required: false,
                    message: t("Please select status"),
                  },
                ]}
              >
                <Select
                  placeholder={t("Select from list")}
                  allowClear
                  getPopupContainer={(trigger) => trigger.parentNode}
                >
                  {OKEDList.map((oked) => (
                    <Option key={oked.ID} value={oked.ID}>
                      {oked.Name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xl={4} md={8}>
              <Form.Item
                label={t("phone-num")}
                name="PhoneNumber"
                style={{ width: "100%" }}
                rules={[
                  {
                    required: false,
                    message: t("Please input valid"),
                  },
                ]}>
                <Input
                  style={{ color: 'black' }} />
              </Form.Item>
            </Col>
            <Col xl={4} md={8}>
              <Form.Item
                label={t("ZipCode")}
                name="ZipCode"
                style={{ width: "100%" }}
                rules={[
                  {
                    required: false,
                    message: t("Please input valid"),
                  },
                ]}>
                <Input
                  style={{ color: 'black' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Form
          component={false}
        >
          <div style={{ textAlign: 'center' }}>
            <h5>{t("SettlementAccounts")}</h5>
          </div>
          <Table
            size='middle'
            pagination={false}
            className="main-table"
            rowKey={(record) => record.ID === 0 ? record.key : record.ID}
            columns={columns}
            dataSource={contractorTables}
            loading={loader}
            scroll={{
              x: "max-content",
              y: '90vh'
            }}
            components={{
              header: {
                row: () => <StaffTableHeader
                  bankList={bankList}
                  addData={addTableDataHandler}
                />
              },
              body: {
                cell: EditableCell
              }
            }}
          />
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
          getOrganizationName={tableListModal}
        />
      </CSSTransition>
    </Card>
  )
}

export default React.memo(UpdateContractors);