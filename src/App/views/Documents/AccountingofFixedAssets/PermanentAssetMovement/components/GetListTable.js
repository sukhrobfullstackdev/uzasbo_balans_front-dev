import React, { useState,  useCallback } from 'react'
import { Table, Tag, Space,  Modal, Dropdown, Menu, Tooltip } from 'antd';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useHistory, Link } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
// import { Buffer } from 'buffer';
// import { CSSTransition } from 'react-transition-group';

import { setListPagination, getListStartAction } from '../_redux/getListSlice';
import PermanentAssetMovementServices from '../../../../../../services/Documents/AccountingofFixedAssets/PermanentAssetMovement/PermanentAssetMovement.services';
import { Notification } from '../../../../../../helpers/notifications';
import '../../../../../../helpers/prototypeFunctions'
// import { fillCertKeys, fillPfxs, apiKey } from '../../../../../../helpers/eimzo'
import ProtocolDrawer from '../../../../../components/ProtocolDrawer';
// import classes from "../PlasticCardSheetForMilitary.module.css";

// const { confirm } = Modal;


const GetListTable = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const tableList = useSelector((state) => state.PermanentAssetMovementList);
  const filterData = tableList?.filterData;
  const paginationData = tableList?.paginationData;
  const storeLoading = tableList.listBegin;
  const userListPagination = tableList.paginationData;
  const tableData = tableList.listSuccessData?.rows;
  const total = tableList.listSuccessData?.total;

  const [loading, setLoading] = useState(false);
  // const [hash, setHash] = useState('');
  // const [eimzoModalVisible, setEimzoModalVisible] = useState(false);
  const [protocolDrawerVisible, setProtocolDrawerVisible] = useState(false);
  //const [rowId, setRowId] = useState(null);
  // const [docId, setDocId] = useState(null);

  const deleteRowHandler = id => {
    setLoading(true);
    PermanentAssetMovementServices.delete(id)
      .then(res => {
        if (res.status === 200) {
          dispatch(getListStartAction({
            ...filterData,
            ...paginationData,
          }));
          setLoading(false);
        }
      })
      .catch(err => {
        setLoading(false);
        Notification('error', err);
      })
  }

  const acceptHandler = (id) => {
    setLoading(true);
    PermanentAssetMovementServices.Accept(id)
      .then((res) => {
        if (res.status === 200) {
          Notification('success', t('accepted'));
          dispatch(getListStartAction({
            ...filterData,
            ...paginationData,
          }));
          setLoading(false);
        }
      })
      .catch((err) => {
        Notification('error', err);
        setLoading(false);
      });
  };

  const declineHandler = (id) => {
    setLoading(true);
    PermanentAssetMovementServices.cancel(id)
      .then((res) => {
        if (res.status === 200) {
          Notification('warning', t('notAccepted'));
          dispatch(getListStartAction({
            ...filterData,
            ...paginationData,
          }));
          setLoading(false);
        }
      })
      .catch((err) => {
        Notification('error', err);
        setLoading(false);
      });
  };

  const tableSummaryHandler =  useCallback(records => {
    let totalSum = 0;

    records.forEach(item => {
      totalSum += +item.Sum;
    });

    return (
      <Table.Summary fixed>
      <Table.Summary.Row>
        <Table.Summary.Cell></Table.Summary.Cell>
        <Table.Summary.Cell></Table.Summary.Cell>
        <Table.Summary.Cell></Table.Summary.Cell>
        <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(totalSum)}</Table.Summary.Cell>
        <Table.Summary.Cell></Table.Summary.Cell>
        <Table.Summary.Cell></Table.Summary.Cell>        
        <Table.Summary.Cell></Table.Summary.Cell>
        <Table.Summary.Cell></Table.Summary.Cell>
        <Table.Summary.Cell></Table.Summary.Cell>
        <Table.Summary.Cell></Table.Summary.Cell>        
        <Table.Summary.Cell></Table.Summary.Cell>
        <Table.Summary.Cell></Table.Summary.Cell>
        <Table.Summary.Cell></Table.Summary.Cell>
        {/* <Table.Summary.Cell></Table.Summary.Cell>
        <Table.Summary.Cell></Table.Summary.Cell>
        <Table.Summary.Cell></Table.Summary.Cell>
        <Table.Summary.Cell></Table.Summary.Cell>
        <Table.Summary.Cell></Table.Summary.Cell>
        <Table.Summary.Cell></Table.Summary.Cell>
        <Table.Summary.Cell></Table.Summary.Cell> */}
      </Table.Summary.Row>
      </Table.Summary >
    );
  },[])


  const printHandler = (id) => {
    setLoading(true);
    PermanentAssetMovementServices.printById(id)
      .then(res => {
        if (res.status === 200) {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "UZAsbo_Children.xlsx");
          document.body.appendChild(link);
          link.click();

          setLoading(false);
        }
      })
      .catch(err => {
        Notification('error', err);
        setLoading(false);
      })
};


  const deleteModalHandler = (id) => {
    Modal.confirm({
      title: t('delete') + id,
      icon: <ExclamationCircleOutlined />,
      okText: t('yes'),
      cancelText: t('cancel'),
      onOk: () => deleteRowHandler(id),
    });
  }

  const columns = [
    {
      title: t("id"),
      dataIndex: "ID",
      sorter: true,
      width: 90,
      render: (_, record) => {
        if (record.StatusID === 2 || record.StatusID === 8) {
          return record.ID;
        }
        return <span style={{ color: 'red' }}>{record.ID}</span>
      }
    },
    {
      title: t("Number"),
      dataIndex: "Number",
      sorter: true,
      width: 80, 
    },
    {
      title: t("Date"),
      dataIndex: "Date",
      sorter: true,
      width: 90,    
    },
    {
      title: t("Sum"),
      dataIndex: "Sum",
      sorter: true,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
      width: 120,
      align: "right"
    },
    {
      title: t("DepartmentDbName"),
      dataIndex: "DepartmentDbName",
      sorter: true,
      width: 160,
    },
    {
      title: t("ResponsiblePersonDbName"),
      dataIndex: "ResponsiblePersonDbName",
      sorter: true,
      width: 185,
    },
    {
      title: t("DepartmentCrName"),
      dataIndex: "DepartmentCrName",
      sorter: true,
      width: 170,
    },
    {
      title: t("ResponsiblePersonCrName"),
      dataIndex: "ResponsiblePersonCrName",
      sorter: true,
      width: 180,
    },
   
    
    {
      title: t("MovementDetails"),
      dataIndex: "MovementDetails",
      sorter: true,
      width: 150,
    },
    {
      title: t("ErrorMessage"),
      dataIndex: "ErrorMessage",
      sorter: true,
      width: 90,
    },    
    {
      title: t("Status"),
      dataIndex: "Status",
      sorter: true,
      width: 150,
      render: (_, record) => {
        if (record.StatusID === 2 || record.StatusID === 9) {
          return (
            <Tag color='#87d068'>
              {record.Status}
            </Tag>
          );
        }
        return (
          <Tag color='#f50'>
            {record.Status}
          </Tag>
        );
      }
    },
    {
      title: t("actions"),
      key: "action",
      align: "center",
      fixed: 'right',
      render: (record) => {
        return (
          <Space size="middle">
            <Tooltip title={t("Edit")}>
              <span onClick={() => {
                history.push(`${location.pathname}/edit/${record.ID}`);
              }}>
                <i className="feather icon-edit action-icon" />
              </span>
            </Tooltip>
            <Dropdown
              overlay={<Menu items={[
               
                {
                  key: 'accept',
                  label: (
                    <span onClick={() => acceptHandler(record.ID)}>
                      <i className="far fa-check-circle action-icon" />&nbsp;
                      {t("Accept")}
                    </span>
                  ),
                },
                {
                  key: 'notAccept',
                  label: (
                    <span onClick={() => declineHandler(record.ID)}>
                      <i className="far fa-check-circle action-icon" />&nbsp;
                      {t("NotAccept")}
                    </span>
                  ),
                },
                // {
                //   key: 'clone',
                //   label: (
                //     <Link to={`${location.pathname}/add?id=${record.ID}&IsClone=true`}>
                //       <i className="far fa-clone action-icon" />&nbsp;
                //       {t("clone")}
                //     </Link>
                //   ),
                // },
                {
                  key: 'delete',
                  label: (
                    <span onClick={() => deleteModalHandler(record.ID)}>
                      <i className="feather icon-trash-2 action-icon" aria-hidden="true" />&nbsp;
                      {t("Delete")}
                    </span>
                  ),
                },
                {
                  key: 'Print',
                  label: (
                    <span onClick={() => printHandler(record.ID)}>
                      <i className="feather icon-printer action-icon" aria-hidden="true" />&nbsp;
                      {t("Print")}
                    </span>
                  ),
                },
                ]}/>    }
            >
              <i className='feather icon-list action-icon' aria-hidden="true" />
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  const handleTableChange = (pagination, filters, sorter, extra) => {
    const { field, order } = sorter;
    dispatch(
      setListPagination({
        OrderType: order?.slice(0, -3),
        SortColumn: field,
        PageNumber: pagination.current,
        PageLimit: pagination.pageSize,
      })
    );
  }

  const onTableRow = (record) => {
    return {
      onDoubleClick: () => {
        history.push(`${location.pathname}/edit/${record.ID}`);
      },
    };
  }

  return (
    <>
      <Table
        bordered
        size="middle"
        rowClassName="table-row"
        className="main-table"
        columns={columns}
        dataSource={tableData}
        loading={storeLoading || loading}
        onChange={handleTableChange}
        rowKey={(record) => record.ID}
        showSorterTooltip={false}
        onRow={(record) => onTableRow(record)}
        summary={records => tableSummaryHandler(records)}
        scroll={{
          x: "max-content",
          y: '50vh'
        }}
        pagination={{
          pageSize: Math.ceil(tableData?.length / 10) * 10,
          total: total,
          current: userListPagination.PageNumber,
          showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
        }}
      />

      <ProtocolDrawer
        visible={protocolDrawerVisible}
        onCancel={useCallback(() => setProtocolDrawerVisible(false), [])}
       // id={rowId}
        tableId={173}
      />
    </>
  )
}

export default React.memo(GetListTable);