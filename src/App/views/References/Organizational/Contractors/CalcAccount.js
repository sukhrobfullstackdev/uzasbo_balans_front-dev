import React, { useEffect, useState, useCallback } from 'react';
import { Table, Form, Input, Button, Tooltip, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import Fade from "react-reveal/Fade";
import { CSSTransition } from 'react-transition-group';
import { useHistory } from 'react-router-dom';

import Card from "../../../../components/MainCard";
import CommonApis from '../../../../../services/common/commonApis';
import { Notification } from '../../../../../helpers/notifications';
import { initialMainTablePagination } from '../../../../../helpers/helpers';
import AccountModal from '../../../../components/References/AccountModal';

const CalcAccount = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [form] = Form.useForm();
  const docId = props.match.params.id;
  const adminRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('UserView');

  const [tableLoading, setTableLoading] = useState(true);
  const [accountModalVisible, setAccountModalVisible] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [pagination, setPagination] = useState(initialMainTablePagination);
  const [filterData, setFilterData] = useState({});
  const [profileId, setProfileId] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const [tableDt] = await Promise.all([
        CommonApis.getProfileList('Contractor', {
          ...initialMainTablePagination,
          ContractorID: docId
        }),
      ]);
      setTableData(tableDt.data.rows);
      setPagination(prevState => ({ ...prevState, total: tableDt.data.total }))
    };

    fetchData()
      .catch(err => Notification('error', err))
      .finally(() => setTableLoading(false));
  }, [docId]);

  const getTableData = useCallback((payload) => {
    payload.ContractorID = docId;
    setPagination(prevState => ({ ...prevState, ...payload }));
    setTableLoading(true);
    CommonApis.getProfileList('Contractor', payload)
      .then(res => {
        setTableData(res.data.rows);
        setPagination(prevState => ({ ...prevState, total: res.data.total }));
      })
      .catch(err => Notification('error', err))
      .finally(() => setTableLoading(false))
  }, [docId])

  const columns = [
    {
      title: t("id"),
      dataIndex: 'ID',
      width: 80,
      sorter: true
    },
    {
      title: t("name"),
      dataIndex: 'Name',
      width: 80,
      sorter: true
    },
    {
      title: t("Code"),
      dataIndex: 'SettlementAccount',
      width: 200,
      sorter: true,
    },
    {
      title: t("BankCode"),
      dataIndex: 'Code',
      width: 80,
      sorter: true,
    },
    ...adminRole ? [
      {
        title: t("actions"),
        key: "action",
        align: "center",
        width: 80,
        render: (record) => {
          return (
            <Space size="middle">
              <Tooltip title={t("Edit")}>
                <span onClick={() => {
                  setProfileId(record.ID);
                  setAccountModalVisible(true);
                }}>
                  <i className="feather icon-edit action-icon" />
                </span>
              </Tooltip>
            </Space>
          );
        },
      },
    ] : []
  ];

  const tableChangeHandler = (pagination, _, sorter) => {
    const { field, order } = sorter;
    getTableData({
      ...filterData,
      OrderType: order?.slice(0, -3),
      SortColumn: field,
      PageNumber: pagination.current,
      PageLimit: pagination.pageSize,
    })
  }

  const filterHandler = useCallback((values) => {
    setFilterData({
      Name: values?.Name?.trim(),
      SettlementAccount: values?.SettlementAccount?.trim()
    })
    getTableData({
      ...initialMainTablePagination,
      Name: values?.Name?.trim(),
      SettlementAccount: values?.SettlementAccount?.trim()
    });
  }, [getTableData])

  const addSettAccHandler = useCallback(() => {
    setAccountModalVisible(false);
    getTableData(initialMainTablePagination);
  }, [getTableData])

  return (
    <Card title={t("Contractors")}>
      <Fade>
        <Form
          layout='vertical'
          form={form}
          onFinish={filterHandler}
        >
          <div className="main-table-filter-wrapper">
            <Form.Item
              label={t('name')}
              name='Name'
            >
              <Input
                placeholder={t("name")}
              />
            </Form.Item>
            <Form.Item
              label={t("Code")}
              name='SettlementAccount'
            >
              <Input
                placeholder={t("Code")}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                <i className="feather icon-refresh-ccw" />
              </Button>
            </Form.Item>
            <Form.Item>
              <Tooltip title={t("add-new")}>
                <Button
                  type="primary"
                  onClick={() => {
                    setAccountModalVisible(true);
                    setProfileId(0);
                  }}
                >
                  <i className="feather icon-plus" aria-hidden="true" />
                </Button>
              </Tooltip>
            </Form.Item>
          </div>
        </Form>
        <Table
          bordered
          size="middle"
          className="main-table"
          rowClassName="table-row"
          columns={columns}
          dataSource={tableData}
          loading={tableLoading}
          rowKey={record => record.ID}
          showSorterTooltip={false}
          onChange={tableChangeHandler}
          pagination={{
            pageSize: Math.ceil(tableData?.length / 10) * 10,
            total: pagination.total,
            current: pagination.pageNumber,
            showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
          }}
          scroll={{
            x: "max-content",
            y: "50vh",
          }}
        />
        <Space size='middle' className='btns-wrapper'>
          <Button
            type="danger"
            onClick={() => history.goBack()}
          >
            {t("back")}
          </Button>
        </Space>
      </Fade>
      <CSSTransition
        mountOnEnter
        unmountOnExit
        in={accountModalVisible}
        timeout={300}
      >
        <AccountModal
          visible={accountModalVisible}
          onCancel={() => setAccountModalVisible(false)}
          onSave={addSettAccHandler}
          contractorId={docId}
          profileId={profileId}
          adminRole={adminRole}
        />
      </CSSTransition>
    </Card>
  )
}

export default CalcAccount;