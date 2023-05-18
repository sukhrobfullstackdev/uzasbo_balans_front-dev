import React, { useCallback, useEffect, useState } from 'react'
import { DatePicker, Dropdown, Form, Menu, Modal, Select, Space, Table, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import moment from "moment";
import { Link } from 'react-router-dom';

import { setListPagination, getListStartAction, setMainLoader } from '../_redux/getListSlice';
import { CheckCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Notification } from '../../../../../../helpers/notifications';
import { CSSTransition } from 'react-transition-group';
import RefreshSubAccModal from './RefreshSubAccModal';
import ProtocolModal from '../../../../../components/ProtocolModal';
import { fillCertKeys, fillPfxs, apiKey } from '../../../../../../helpers/eimzo'
import TreasuryMemOrderServices from '../../../../../../services/Documents/PaymentDocuments/TreasuryMemOrder/TreasuryMemOrder.services';

const { confirm } = Modal;
const { Option } = Select;
let keys = [];

const TableData = ({ tableData, total, match, reduxList, OrganizationsSettlementAccountID }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();
    const [eimzoForm] = Form.useForm();

    let loading = reduxList?.listBegin;
    let pagination = reduxList?.paginationData;
    let filter = reduxList?.filterData;

    const [dateOfAcception, setDateOfAcception] = useState(moment().format("DD.MM.YYYY"))
    const [refreshSubAccModal, setRefreshSubAccModal] = useState(false)
    const [refreshSubAccParams, setRefreshSubAccParams] = useState(null)
    const [protocolModal, setProtocolModal] = useState(false)
    const [protocolParams, setProtocolParams] = useState(null)

    const [tableLoading, setTableLoading] = useState(false);
    const [hash, setHash] = useState('');
    const [eimzoModalVisible, setEimzoModalVisible] = useState(false);
    const [rowId, setRowId] = useState(null);
    const [docId, setDocId] = useState(null);

    const columns = [
        {
            title: t("id"),
            dataIndex: "ID",
            key: "ID",
            sorter: true,
            width: 100
        },
        {
            title: t("Number"),
            dataIndex: "Number",
            key: "Number",
            sorter: true,
            width: 100,
        },
        {
            title: t("Date"),
            dataIndex: "Date",
            key: "Date",
            sorter: true,
            width: 100,
        },
        {
            title: t("FinanceYear"),
            dataIndex: "FinanceYear",
            key: "FinanceYear",
            sorter: true,
            width: 150,
        },
        {
            title: t("Sum"),
            dataIndex: "Sum",
            key: "Sum",
            width: 150,
            sorter: true,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
        },
        {
            title: t("PayerSettlement"),
            dataIndex: "PayerSettlement",
            key: "PayerSettlement",
            sorter: true,
            width: 180,
        },
        {
            title: t("PayeeINN"),
            dataIndex: "PayeeINN",
            key: "PayeeINN",
            sorter: true,
            width: 150,
        },
        {
            title: t("Payee"),
            dataIndex: "Payee",
            key: "Payee",
            sorter: true,
            width: 150,
        },
        {
            title: t("ContractorsSettlementAccount"),
            dataIndex: "ContractorsSettlementAccount",
            key: "ContractorsSettlementAccount",
            sorter: true,
            width: 150,
        },
        {
            title: t("SalaryTransaction"),
            dataIndex: "AllowedTransactionCode",
            key: "AllowedTransactionCode",
            sorter: true,
            width: 100,
        },
        {
            title: t("Db"),
            dataIndex: "SubAccDbCode",
            key: "SubAccDbCode",
            sorter: true,
            width: 60,
        },
        {
            title: t("Cr"),
            dataIndex: "SubAccCrCode",
            key: "SubAccCrCode",
            sorter: true,
            width: 60,
        },
        {
            title: t("Status"),
            dataIndex: "Status",
            key: "Status",
            sorter: true,
            width: 120,
        },
        {
            title: t("TreasStatus"),
            dataIndex: "TreasStatus",
            key: "TreasStatus",
            sorter: true,
            width: 100,
            render: (_, record) => (record.TreasStatus ?
                <>
                    {record.TreasStatusID === 11 ?
                        <Tag color='#f50'>
                            {record.TreasStatus}
                        </Tag> :
                        <Tag color='#87d068'>
                            {record.TreasStatus}
                        </Tag>}
                </> :
                <Tag color={'#999'}>
                </Tag>
            )
        },
        {
            title: t("DateOfAcception"),
            dataIndex: "DateOfAcception",
            key: "DateOfAcception",
            sorter: true,
            width: 150
        },
        {
            title: t("PaymentDetails"),
            dataIndex: "PaymentDetails",
            key: "PaymentDetails",
            sorter: true,
            width: 200,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("itemOfExpenseCode"),
            dataIndex: "ItemOfExpenseCode",
            key: "ItemOfExpenseCode",
            sorter: true,
            width: 150,
        },
        {
            title: t("actions"),
            key: "action",
            align: "center",
            fixed: 'right',
            width: 90,
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
                                        label: t('paymentTableRu'),
                                    },
                                    {
                                        key: '2',
                                        label: t('paymentTableUz'),
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
                                        <Link to={`${location.pathname}/edit/${record.ID}?OrganizationsSettlementAccountID=${OrganizationsSettlementAccountID}`}>
                                            <i className='feather icon-edit action-icon' aria-hidden="true" />&nbsp;
                                            {t('Edit')}
                                        </Link>
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
                                        <span onClick={() => cancelHandler(record.ID)}>
                                            <i className="feather icon-x-circle action-icon" />&nbsp;
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
                                    key: 'prepareToSend',
                                    label: (
                                        <span onClick={() => prepareToSendHandler(record.ID)}>
                                            <i className="feather icon-check-square action-icon" aria-hidden="true" />&nbsp;
                                            {t("prepareToSend")}
                                        </span>
                                    ),
                                },
                                {
                                    key: 'send',
                                    label: (
                                        <span onClick={() => showSendModal(record.ID)}>
                                            <i className="far fa-paper-plane action-icon" />&nbsp;
                                            {t("send")}
                                        </span>
                                    ),
                                },
                                {
                                    key: 'refreshSubAcc',
                                    label: (
                                        <span onClick={() => refreshSubAccHandler(record.ID)}>
                                            <i className="feather icon-refresh-cw action-icon" aria-hidden="true" />&nbsp;
                                            {t("refreshSubAcc")}
                                        </span>
                                    ),
                                },
                                {
                                    key: 'finYear',
                                    label: (
                                        <span onClick={() => changeFinYearHandler(record.ID)}>
                                            <i className="feather icon-calendar action-icon" aria-hidden="true" />&nbsp;
                                            {t("finYear")}
                                        </span>
                                    ),
                                },
                                {
                                    key: 'protocol',
                                    label: (
                                        <span onClick={() => openProtocolModalHandler(record.ID, 129)}>
                                            <i className="far fa-comment action-icon" />&nbsp;
                                            {t("protocol")}
                                        </span>
                                    ),
                                },
                                {
                                    key: 'delete',
                                    label: (
                                        <span onClick={() => deleteModalHandler(record.ID)}>
                                            <i className="feather icon-trash-2 action-icon" aria-hidden="true" />&nbsp;
                                            {t("Delete")}
                                        </span>
                                    ),
                                },
                            ]} />}
                        >
                            <i className='feather icon-list action-icon' aria-hidden="true" />
                        </Dropdown>
                    </Space>
                );
            },
        },

    ];

    function handleTableChange(pagination, filters, sorter, extra) {
        // console.log('params', pagination, filters, sorter, extra);
        const { field, order } = sorter;
        // console.log(field, order?.slice(0, -3));

        dispatch(
            setListPagination({
                OrderType: order?.slice(0, -3),
                SortColumn: field,
                PageNumber: pagination.current,
                PageLimit: pagination.pageSize,
            })
        );

    };

    const tableSummaryHandler = records => {
        let totalSum = 0;

        records.forEach(item => {
            totalSum += +item.Sum;
        });

        return (
            <Table.Summary.Row>
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
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
            </Table.Summary.Row>
        );
    }

    const printByType = (e, id) => {
        loading = true;
        TreasuryMemOrderServices.printType(id, e.key)
            .then((res) => {
                if (res.status === 200) {
                    loading = false;
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", "print.xlsx");
                    document.body.appendChild(link);
                    link.click();
                }
            })
            .catch((err) => {
                Notification('error', err);
                loading = false;
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

                TreasuryMemOrderServices.postSignedData(signData)
                    .then(res => {
                        if (res.status === 200) {
                            dispatch(setMainLoader(false));
                            setEimzoModalVisible(false);
                            // this.setState({ mainLoader: false, isEimzoModalVisible: false });
                            // this.eImzoForm.current.resetFields();
                            dispatch(getListStartAction({
                                ...filter,
                                ...pagination,
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

    const showSendModal = (id) => {
        confirm({
            title: t('send'),
            icon: <CheckCircleOutlined />,
            content: t('sendText'),
            okText: t('yes'),
            cancelText: t('cancel'),
            onOk: () => {
                setTableLoading(true);
                TreasuryMemOrderServices.Accept(id, dateOfAcception)
                    .then((res) => {
                        if (res.status === 200) {
                            setTableLoading(false);
                            setEimzoModalVisible(true);
                            setHash(res.data);
                        }
                    }).catch((err) => {
                        Notification('error', err);
                        setTableLoading(false)
                    })
            }
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
        setTableLoading(false);
        setEimzoModalVisible(false);
    };

    // E-imzo end

    const acceptHandler = (id) => {
        confirm({
            title: t('Accept'),
            icon: <CheckCircleOutlined />,
            content:
                <Space size="middle" style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <DatePicker
                        defaultValue={moment()}
                        style={{ width: "100%" }} format="DD.MM.YYYY"
                        onChange={(e) => setDateOfAcception(e)}
                    />
                </Space>,
            okText: t('yes'),
            cancelText: t('cancel'),
            onOk: () => {
                setTableLoading(true);
                TreasuryMemOrderServices.Accept(id, dateOfAcception)
                    .then((res) => {
                        if (res.status === 200) {
                            Notification('success', t('success-msg'));
                            setTableLoading(false);
                        }
                    }).catch((err) => {
                        Notification('error', err);
                        setTableLoading(false);
                    })
            }
        });
    };

    const cancelHandler = (id) => {
        confirm({
            title: t('Cancel'),
            icon: <InfoCircleOutlined />,
            content: t('cancelText'),
            okText: t('yes'),
            cancelText: t('cancel'),
            onOk: () => {
                setTableLoading(true);
                TreasuryMemOrderServices.cancel(id)
                    .then((res) => {
                        if (res.status === 200) {
                            Notification('success', t('success-msg'));
                            setTableLoading(false);
                        }
                    }).catch((err) => {
                        Notification('error', err);
                        setTableLoading(false);
                    })
            }
        });
    };

    const openProtocolModalHandler = (id, tableID) => {
        // console.log({ id, tableID });
        setProtocolModal(true)
        setProtocolParams({ id, tableID })
    };

    const prepareToSendHandler = (id) => {
        confirm({
            title: t('prepareToSend'),
            icon: <CheckCircleOutlined />,
            content: t('prepareToSendText'),
            okText: t('yes'),
            cancelText: t('cancel'),
            onOk: () => {
                setTableLoading(true);
                TreasuryMemOrderServices.prepareForSend(id)
                    .then((res) => {
                        if (res.status === 200) {
                            Notification('success', t('success-msg'));
                            setTableLoading(false);
                        }
                    }).catch((err) => {
                        Notification('error', err);
                        setTableLoading(false);
                    })
            }
        });
    };

    const refreshSubAccHandler = (id) => {
        setRefreshSubAccModal(true)
        setRefreshSubAccParams({ id: id })
    };

    const changeFinYearHandler = (id) => {
        confirm({
            title: t('finYear'),
            icon: <CheckCircleOutlined />,
            content: t('finYearText'),
            okText: t('yes'),
            cancelText: t('cancel'),
            onOk: () => {
                setTableLoading(true);
                TreasuryMemOrderServices.changeFinYear(id)
                    .then((res) => {
                        if (res.status === 200) {
                            Notification('success', t('success-msg'));
                            setTableLoading(false);
                        }
                    }).catch((err) => {
                        Notification('error', err);
                        setTableLoading(false);
                    })
            }
        });
    };

    const deleteModalHandler = (id) => {
        confirm({
            title: t('Delete'),
            icon: <ExclamationCircleOutlined />,
            content: t('delete'),
            okText: t('yes'),
            cancelText: t('cancel'),
            onOk: () => {
                setTableLoading(true);
                TreasuryMemOrderServices.delete(id)
                    .then((res) => {
                        if (res.status === 200) {
                            Notification('success', t('success-msg'));
                            setTableLoading(false);
                        }
                    }).catch((err) => {
                        Notification('error', err);
                        setTableLoading(false);
                    })
            }
        });
    };

    return (
        <>
            <Table
                bordered
                size="middle"
                columns={columns}
                dataSource={tableData}
                loading={loading || tableLoading}
                onChange={handleTableChange}
                rowKey={(record) => record.ID}
                rowClassName="table-row"
                className="main-table"
                showSorterTooltip={false}
                summary={records => tableSummaryHandler(records)}
                scroll={{
                    x: "max-content",
                    y: '50vh'
                }}
                pagination={{
                    ...pagination,
                    total: total,
                    showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
                }}
                onRow={(record) => {
                    return {
                        onDoubleClick: () => {
                            history.push(`${match.path}/edit/${record.ID}?OrganizationsSettlementAccountID=${OrganizationsSettlementAccountID}`);
                        },
                    };
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

            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={refreshSubAccModal}
                timeout={300}
            >
                <RefreshSubAccModal
                    visible={refreshSubAccModal}
                    params={refreshSubAccParams}
                    // onSelect={onSelect}
                    onCancel={() => {
                        setRefreshSubAccModal(false);
                    }}
                />
            </CSSTransition>

            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={protocolModal}
                timeout={300}
            >
                <ProtocolModal
                    visible={protocolModal}
                    params={protocolParams}
                    // onSelect={onSelect}
                    onCancel={() => {
                        setProtocolModal(false);
                    }}
                />
            </CSSTransition>
        </>
    )
}

export default TableData;