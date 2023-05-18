import React, { useState, useEffect, useCallback } from 'react'
import { Table, Tag, Space, Form, Modal, Select, Dropdown, Menu } from 'antd';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useHistory, Link } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Buffer } from 'buffer';
import { CSSTransition } from 'react-transition-group';

import { setListPagination, getListStartAction, setMainLoader } from '../_redux/getListSlice';
import ContractsApis from '../../../../../../services/References/Organizational/Contracts/Contracts';
import { Notification } from '../../../../../../helpers/notifications';
import '../../../../../../helpers/prototypeFunctions'
import { fillCertKeys, fillPfxs, apiKey } from '../../../../../../helpers/eimzo'
import ProtocolDrawer from '../../../../../components/ProtocolDrawer';
// import classes from "../PlasticCardSheetForMilitary.module.css";

const { confirm } = Modal;
const { Option } = Select;
let keys = [];

const GetListTable = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const [eimzoForm] = Form.useForm();
  const tableList = useSelector((state) => state.contractsList);
  const filterData = tableList?.filterData;
  const paginationData = tableList?.paginationData;
  const storeLoading = tableList.listBegin;
  const userListPagination = tableList.paginationData;
  const tableData = tableList.listSuccessData?.rows;
  const total = tableList.listSuccessData?.total;

  const [loading, setLoading] = useState(false);
  const [hash, setHash] = useState('');
  const [eimzoModalVisible, setEimzoModalVisible] = useState(false);
  const [protocolDrawerVisible, setProtocolDrawerVisible] = useState(false);
  const [rowId, setRowId] = useState(null);
  const [docId, setDocId] = useState(null);

  // const deleteRowHandler = id => {
  //   setLoading(true);
  //   ContractsApis.delete(id)
  //     .then(res => {
  //       if (res.status === 200) {
  //         dispatch(getListStartAction({
  //           ...filterData,
  //           ...paginationData,
  //         }));
  //         setLoading(false);
  //       }
  //     })
  //     .catch(err => {
  //       setLoading(false);
  //       Notification('error', err);
  //     })
  // }

  const acceptHandler = (id) => {
    setLoading(true);
    ContractsApis.Accept(id)
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
    ContractsApis.cancel(id)
      .then((res) => {
        if (res.status === 200) {
          Notification('warning', t('canceled'));
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

  // E-imzo
  const loadKeys = useCallback(() => {
    var items = [];
    fillCertKeys(items, () => {
      fillPfxs(items, () => {
        for (var itm in items) {
          var vo = items[itm]
          // var opt = document.createElement('option');
          var date = new Date(vo.validTo);

          var dd = String(date.getDate()).padStart(2, '0');
          var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
          var yyyy = date.getFullYear();

          date = dd + '.' + mm + '.' + yyyy;
          // opt.innerHTML = vo.TIN + " - " + vo.O + " - " + vo.CN + " - Срок до:" + date;
          // opt.value = JSON.stringify(vo);

          keys.push({ tin: vo.TIN, org: vo.O, name: vo.CN, date: date, validTo: vo.validTo, value: JSON.stringify(vo) });
        }
      });
    });
  }, [])

  useEffect(() => {
    window.CAPIWS.apikey(apiKey, (event, data) => {
      if (data.success) {
        loadKeys();
      } else {
        alert(data.reason);
      }
    }, (e) => {
      alert(e);
    })
  }, [loadKeys])

  function postLoadKey(id, vo, reload) {
    let buff = new Buffer(hash);
    window.CAPIWS.callFunction({
      plugin: "pkcs7",
      name: "create_pkcs7",
      arguments: [buff.toString('base64'), id, 'no']
    }, (event, data) => {
      // console.log(event, data);
      if (data.success) {
        //   document.eimzoForm.pkcs7.value = data.pkcs7_64;
        let signData = {
          ID: docId,
          DataHash: hash,
          SignedData: data.pkcs7_64
        }

        ContractsApis.postSignedData(signData)
          .then(res => {
            if (res.status === 200) {
              dispatch(setMainLoader(false));
              setEimzoModalVisible(false);
              // this.setState({ mainLoader: false, isEimzoModalVisible: false });
              // this.eImzoForm.current.resetFields();
              dispatch(getListStartAction({
                ...filterData,
                ...paginationData,
              }));
            }
          })
          .catch(err => {
            Notification('error', err);
          })
      } else {
        dispatch(setMainLoader(false));
        setEimzoModalVisible(false);
        // this.setState({ mainLoader: false, isEimzoModalVisible: false });
        // this.eImzoForm.current.resetFields();
        if (reload && (data.reason === "Ключ по идентификатору не найден")) {
          reload();
        } else {
          alert(data.reason);
        }
      }
    }, (e) => {
      alert(e);
    });
  };

  function loadPfxKey(vo) {
    window.CAPIWS.callFunction({
      plugin: "pfx",
      name: "load_key",
      arguments: [vo.disk, vo.path, vo.name, vo.alias]
    }, (event, data) => {
      if (data.success) {
        var id = data.keyId;
        window.sessionStorage.setItem(vo.serialNumber, id);
        postLoadKey(id, vo);
      } else {
        alert(data.reason);
      }
    }, (e) => {
      alert(e);
    });
  };

  function sign(hash) {
    // hashData = hash;
    // var itm = document.eimzoForm.key.value;
    var itm = eimzoForm.getFieldValue('eImzoKey');
    if (itm) {
      var vo = JSON.parse(itm);
      // console.log(vo);

      if (vo.type === "certkey") {
        window.CAPIWS.callFunction({
          plugin: "certkey",
          name: "load_key",
          arguments: [vo.disk, vo.path, vo.name, vo.serialNumber]
        }, (event, data) => {
          if (data.success) {
            var id = data.keyId;
            postLoadKey(id, vo);
          } else {
            alert(data.reason);
          }
        }, (e) => {
          alert(e);
        });
      } else if (vo.type === "pfx") {
        var id = window.sessionStorage.getItem(vo.serialNumber);
        if (id) {
          postLoadKey(id, vo, function () {
            loadPfxKey(vo);
          });
        } else {
          loadPfxKey(vo);
        }
      }
    }
  };

  const showAcceptModal = (id) => {
    setDocId(id);
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: t('Are you sure to send?'),
      okText: t('yes'),
      cancelText: t('cancel'),
      onOk: () => {
        setLoading(true);
        ContractsApis.getHash(id)
          .then(res => {
            if (res.status === 200) {
              setLoading(false);
              setEimzoModalVisible(true);
              setHash(res.data);
            }
          })
          .catch(err => {
            Notification('error', err);
            setLoading(false);
          })
      },
    });
  };

  const eimzoModalOkHandler = () => {
    eimzoForm.validateFields()
      .then(values => {
        sign(hash);
        setEimzoModalVisible(false);
        dispatch(setMainLoader(true));
        // props.setMainLoader(true);
      })
      .catch(err => err);
  };

  const eimzoModalCancelHandler = () => {
    setLoading(false);
    setEimzoModalVisible(false);
  };

  // E-imzo end

  const openProtocolModalHandler = (id) => {
    setProtocolDrawerVisible(true);
    setRowId(id);
  }

  // const deleteModalHandler = (id) => {
  //   Modal.confirm({
  //     title: t('delete') + id,
  //     icon: <ExclamationCircleOutlined />,
  //     okText: t('yes'),
  //     cancelText: t('cancel'),
  //     onOk: () => deleteRowHandler(id),
  //   });
  // }

  const printByType = (e, id) => {
    setLoading(true);
    ContractsApis.printType(id, e.key)
      .then((res) => {
        if (res.status === 200) {
          setLoading(false);
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "print.xlsx");
          document.body.appendChild(link);
          link.click();
          dispatch(getListStartAction({
            ...filterData,
            ...paginationData,
          }));
        }
      })
      .catch((err) => {
        Notification('error', err);
        setLoading(false);
      });
  };

  const columns = [
    {
      title: t("id"),
      dataIndex: "ID",
      sorter: true,
      width: 80,
      render: (_, record) => {
        if (record.StatusID === 2 || record.StatusID === 8) {
          return record.ID;
        }
        return <span style={{ color: 'red' }}>{record.ID}</span>
      }
    },
    {
      title: t("contractorName"),
      dataIndex: "ContractorName",
      sorter: true,
      width: 200,
      render: record => <div className="ellipsis-2">{record}</div>
    },
    {
      title: t("contractorINN"),
      dataIndex: "ContractorINN",
      sorter: true,
      width: 120
    },
    {
      title: t("contractorSett"),
      dataIndex: "ContractorSett",
      sorter: true,
      // width: 80,
    },
    {
      title: t("Status"),
      dataIndex: "Status",
      sorter: true,
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
      title: t("organizationsSett"),
      dataIndex: "OrganizationsSett",
      sorter: true,
      // width: 80,
    },
    {
      title: t("Sum"),
      dataIndex: "Sum",
      sorter: true,
      width: 150,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
    },
    {
      title: t("treasContractID"),
      dataIndex: "TreasContractID",
      sorter: true,
      width: 150,
    },
    {
      title: t("ticket"),
      dataIndex: "Ticket",
      sorter: true,
      width: 80,
    },
    {
      title: t("conType"),
      dataIndex: "ConType",
      sorter: true,
      width: 100,
    },
    {
      title: t("number"),
      dataIndex: "Code",
      sorter: true,
      width: 100,
      render: record => <div className='ellipsis-2'>{record}</div>
    },
    {
      title: t("dateOfContract"),
      dataIndex: "DateOfContract",
      sorter: true,
      width: 120,
    },
    {
      title: t("itemOfExpenseCode"),
      dataIndex: "ItemOfExpenseCode",
      sorter: true,
      width: 160,
    },
    {
      title: t("treasStatus"),
      dataIndex: "TreasStatus",
      sorter: true,
      width: 120
    },
    {
      title: t("Comment"),
      dataIndex: "Comment",
      key: "Comment",
      sorter: true,
      width: 200,
      render: record => <div className="ellipsis-2">{record}</div>
    },
    {
      title: t("actions"),
      key: "action",
      align: "center",
      fixed: 'right',
      render: (record) => {
        return (
          <Space size="middle">
            <Dropdown
              placement="bottom"
              overlay={<Menu
                onClick={(e) => printByType(e, record.ID)}
                items={[
                  {
                    key: '1',
                    label: (t('type1')),
                  },
                  {
                    key: '2',
                    label: (t('type2')),
                  },
                  {
                    key: '3',
                    label: (t('type3')),
                  },
                  {
                    key: '4',
                    label: (t('type4')),
                  },
                  {
                    key: '5',
                    label: t('paymentTableRu'),
                  },
                  {
                    key: '6',
                    label: t('paymentTableUz'),
                  },
                  {
                    key: '7',
                    label: t('payments'),
                  },
                ]}
              />}
            >
              <i className='feather icon-printer action-icon' aria-hidden="true" />
            </Dropdown>

            <Dropdown
              placement="bottom"
              overlay={<Menu items={[
                {
                  key: 'edit',
                  label: (
                    <Link to={`${location.pathname}/edit/${record.ID}`}>
                      <i className='feather icon-edit action-icon' aria-hidden="true" />&nbsp;
                      {t('Edit')}
                    </Link>
                  ),
                },
                {
                  key: 'send',
                  label: (
                    <span onClick={() => showAcceptModal(record.ID)}>
                      <i className="far fa-paper-plane action-icon" />&nbsp;
                      {t("send")}
                    </span>
                  ),
                },
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
                {
                  key: 'clone',
                  label: (
                    <Link to={`${location.pathname}/add?id=${record.ID}&IsClone=true`}>
                      <i className="far fa-clone action-icon" />&nbsp;
                      {t("clone")}
                    </Link>
                  ),
                },
                {
                  key: 'protocol',
                  label: (
                    <span onClick={() => openProtocolModalHandler(record.ID)}>
                      <i className="far fa-comment action-icon" />&nbsp;
                      {t("protocol")}
                    </span>
                  ),
                },
                // {
                //   key: 'delete',
                //   label: (
                //     <span onClick={() => deleteModalHandler(record.ID)}>
                //       <i className="feather icon-trash-2 action-icon" aria-hidden="true" />&nbsp;
                //       {t("Delete")}
                //     </span>
                //   ),
                // },
              ]} />}
            >
              <i className='feather icon-list action-icon' aria-hidden="true" />
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  const handleTableChange = (pagination, _, sorter,) => {
    const { field, order } = sorter;
    dispatch(setListPagination({
      OrderType: order?.slice(0, -3),
      SortColumn: field,
      PageNumber: pagination.current,
      PageLimit: pagination.pageSize,
    })
    );
  }

  const tableSummaryHandler = records => {
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
        </Table.Summary.Row>
      </Table.Summary>
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

      <CSSTransition
        mountOnEnter
        unmountOnExit
        in={eimzoModalVisible}
        timeout={300}
      >
        <Modal
          title={t("send")}
          visible={eimzoModalVisible}
          onOk={eimzoModalOkHandler}
          onCancel={eimzoModalCancelHandler}
        >
          <Form
            form={eimzoForm}
            layout='vertical'
          >
            <Form.Item
              label={t('eImzoKey')}
              name="eImzoKey"
              rules={[
                {
                  required: true,
                  message: t('Please input your eImzoKey!'),
                },
              ]}
            >
              <Select
                allowClear
                showSearch
                placeholder={t('eImzoKey')}
                optionFilterProp="children"
                filterOption={(input, option) => option.children[0].props.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {keys.map((item, index) => {
                  return (
                    <Option key={+item.tin + index} value={item.value} className='e-imzo-keys'>
                      <span>{item.tin}&nbsp;-&nbsp;</span>
                      <span>{item.org}&nbsp;-&nbsp;</span>
                      <span>{item.name}&nbsp;-&nbsp;</span>
                      {new Date().getTime() < new Date(item.validTo).getTime() ?
                        <span>{item.date}</span> :
                        <span style={{ color: 'red' }}>{item.date}</span>
                      }
                    </Option>
                  )
                }
                )}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </CSSTransition>

      <ProtocolDrawer
        visible={protocolDrawerVisible}
        onCancel={useCallback(() => setProtocolDrawerVisible(false), [])}
        id={rowId}
        tableId={173}
      />
    </>
  )
}

export default React.memo(GetListTable);