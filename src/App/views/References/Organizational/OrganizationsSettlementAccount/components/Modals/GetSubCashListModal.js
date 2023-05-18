import React, { useEffect, useState, useCallback } from "react";
import { Form, Modal, Table, Input, Button} from "antd";
import { useTranslation } from "react-i18next";
import Fade from "react-reveal/Fade";

import helperApis from "../../../../../../../services/Helper/helperApis";
import { Notification } from '../../../../../../../helpers/notifications';
import { initialMainTablePagination } from "../../../../../../../helpers/helpers";

const GetCashListModal = (props) => {
  const { t } = useTranslation();
  const [filterForm] = Form.useForm();

  const [subCashList, setSubCashList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(initialMainTablePagination);
  const [filterData, setFilterData] = useState({});
  const [rowData, setRowData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const [subCash] = await Promise.all([
        helperApis.getHelperData('GetSubCashList', initialMainTablePagination),
      ]);
      setSubCashList(subCash.data.rows);
      setPagination(prevState => ({ ...prevState, total: subCash.data.total }))
    };

    fetchData().catch(err => {
      Notification('error', err);
    })
      .finally(() => setLoading(false));
  }, []);

  const getTableData = useCallback((payload) => {
    setPagination(prevState => ({ ...prevState, ...payload }));
    setLoading(true);
    helperApis.getHelperData('GetSubCashList', payload)
      .then(res => {
        setSubCashList(res.data.rows);
        setPagination(prevState => ({ ...prevState, total: res.data.total }));
      })
      .catch(err => Notification('error', err))
      .finally(() => setLoading(false))
  }, [])

  const filterHandler = useCallback(() => {
    const values = filterForm.getFieldsValue();
    setFilterData({
      Code: values?.Code?.trim()
    })
    getTableData({
      ...initialMainTablePagination,
      Code: values?.Code?.trim()
    });
  }, [getTableData, filterForm])

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

  const columns = [
    {
      title: t("id"),
      dataIndex: "ID",
      key: "ID",
      sorter: true,
      width: 100,
    },
    {
      title: t("Code"),
      dataIndex: "Code",
      key: "Code",
      sorter: true,
      // width: 180,
      render: record => <div className="ellipsis-2">{record}</div>
    },
  ];

  const setRowClassName = (record) => {
    return record.ID === rowData.id ? 'table-row clicked-row' : 'table-row';
  }

  return (
    <Modal
      visible={props.visible}
      title={t("CashSubAcc")}
      okText={t("select")}
      cancelText={t("cancel")}
      onCancel={props.onCancel}
      width={900}
      footer={[
        <Button
          type='primary'
          key='confirm'
          onClick={() => props.onSelect(rowData)}
        >
          {t('select')}
        </Button>,
        <Button
          type='danger'
          key='clear'
          onClick={() => props.onCancel()}
        >
          {t('close')}
        </Button>
      ]}
    >
      <Fade>
        <Form
          layout='vertical'
          className='table-filter-form'
          form={filterForm}
        >
          <div className="main-table-filter-wrapper">
            <Form.Item
              label={t("Code")}
              name="Code"
            >
              <Input.Search
                placeholder={t("Code")}
                enterButton
                onSearch={filterHandler}
              />
            </Form.Item>
          </div>

          <Table
            bordered
            size="middle"
            rowClassName={setRowClassName}
            className="main-table"
            columns={columns}
            dataSource={subCashList}
            loading={loading}
            onChange={tableChangeHandler}
            rowKey={(record) => record.ID}
            showSorterTooltip={false}
            scroll={{
              x: "max-content",
              y: '50vh'
            }}
            pagination={{
              pageSize: Math.ceil(subCashList?.length / 10) * 10,
              total: pagination.total,
              current: pagination.pageNumber,
              showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
            }}
            onRow={(record) => {
              return {
                onDoubleClick: () => {
                  props.onSelect({ id: record.ID, code: record.Codeactual });
                },
                onClick: () => {
                  setRowData({ id: record.ID, code: record.Codeactual });
                },
              };
            }}
          />
        </Form>
      </Fade>
    </Modal>
  );

}
export default GetCashListModal;
