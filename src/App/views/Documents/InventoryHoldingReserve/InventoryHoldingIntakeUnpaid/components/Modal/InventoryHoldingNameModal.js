import React, {  useCallback, useEffect, useState } from 'react'
import { Form, Modal, Table, Input, Row, Col, Button, Space } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import InventoryHoldingServices from '../../../../../../../services/References/Organizational/InventoryHolding/InventoryHolding.services'
import { Notification } from '../../../../../../../helpers/notifications';
import EditableCell from '../EditableCell/EditableCell';


const InventoryHoldingNameModal = (props) => {
    const { Endpoint, params } = props.params
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [tableLoading, setTableLoading] = useState(true);
    const [tableData, setTableData] = useState([]);
    const [rightData, setRightData] = useState([])
    const [rowData, setRowData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);

    const [selectedRowKeysLeft, setRowKeysLeft] = useState([]);
    const [selectedModulesLeft, setSelectedModulesLeft] = useState([]);
    const [selectedRowKeysRight, setRowKeysRight] = useState([]);

    const [Name, setName] = useState(null);
    const [TableParams, setTableParams] = useState({
        OrderType: null,
        SortColumn: null,
        PageNumber: 1,
        PageLimit: 10,
    });

    const column1 = [
        {
            title: t("id"),
            dataIndex: 'ID',
            width: 80,
            sorter: (a, b) => a.ID - b.ID,
        },
        {
            title: t("Name"),
            dataIndex: 'Name',
            width: 250,
            sorter: (a, b) => a.ID - b.ID,
        },
        {
            title: t("ItemOfExpense"),
            dataIndex: 'ItemOfExpense',
            width: 250,
            sorter: true,
            //   render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
        },
        {
            title: t("UnitsOfMeasure"),
            dataIndex: 'UnitsOfMeasure',
            width: 250,
            sorter: true,
            //   render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
        },
        {
            title: t("InventoryNumber"),
            dataIndex: 'InventoryNumber',
            width: 250,
            sorter: true,
            //   render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
        },
    ];

    const column2 = [
        {
            title: t("id"),
            dataIndex: "ID",
            key: "ID",
            sorter: true,
            align: 'center',
            // width: 80,
        },
        {
            title: t("InventoryHolding"),
            dataIndex: "Name",
            key: "Name",
            width: 200,
            sorter: true,
        },
        {
            title: t("price"),
            dataIndex: "Price",
            key: "Price",
            editable: true,
            width: 120,
        },
        {
            title: t("quantity"),
            dataIndex: "Quantity",
            key: "Quantity",
            width: 120,
            editable: true,
        },
        {
            title: t("Sum"),
            dataIndex: "Sum",
            key: "Sum",
            editable: true,
            width: 120,
        },
        {
            title: '',
            dataIndex: "",
            key: "",
            sorter: false,
            width: 50,
            render: (_, record) =>
                <Space size="middle" style={{ display: 'flex', justifyContent: 'center' }}>
                    <span
                        onClick={() => handleDelete(record.ID)}
                    >
                        <i className="feather icon-trash-2 action-icon" />
                    </span>
                </Space>
        },
    ];


    useEffect(() => {
        const fetchData = async () => {
            const [tableData] = await Promise.all([
                InventoryHoldingServices.getCommonList(
                    {
                        Name: Name,
                        ...params,
                        ...TableParams,
                    },
                    Endpoint
                ),
            ]);
            setTableData(tableData.data);
            setTableLoading(false);
        };

        fetchData().catch(err => {
            Notification('error', err);
            setTableLoading(false);
        });
    }, [Name, TableParams, Endpoint, params]);

    const onSearch = (event) => {
        setName(event);
    };

    const rowSelectionLeft = {
        selectedRowKeys: selectedRowKeysLeft,
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedModulesLeft(selectedRows);
            setRowKeysLeft(selectedRowKeys);
        },
    };

    const handleSubmitSelectedRowsRight = () => {
        const checkedSelectedModulesLeft = selectedModulesLeft.map(item => {
            item.Check = true;
            item.Status = 0;
            item.Price = 0;
            item.Quantity = 0;
            item.Sum = 0;

            return item;
        });
        setRightData(checkedSelectedModulesLeft);
    }

    const handleSubmitSelectedRowsLeft = () => {
    }

    const resetTableRight = () => {
        setRowKeysRight([]);
    };

    const handleDelete = useCallback((id) => {
        const newData = rightData.filter(data => data.ID !== id)
        setRightData(newData);
    }, [rightData]);

    const selectRow = () => {
        props.onSelect(selectedRows);

        if (rowData !== null) {
            props.onCancel();
        }
    };

    const onSelectChange = (selectedRowKeys, selectedRows) => {
        setSelectedRows(selectedRows);
    };

    const rowSelectionRight = {
        selectedRows,
        onChange: onSelectChange
    };

    const handleSave = (row) => {
        const newData = [...rightData];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setRightData(newData);
    };

    const components = {
        body: {
            cell: EditableCell,
        },
    };
    const newColumns = column2.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave: handleSave,
                form
            }),
        };
    });


    return (
        <Modal
            width={2000}
            title={t("InventoryHoldingName")}
            okText={t('add')}
            cancelText={t('close')}
            visible={props.visible}
            onCancel={props.onCancel}
            footer={[
                <Button key="back" onClick={props.onCancel}>
                    {t("close")}
                </Button>,
                <Button
                    // disabled={rowData}
                    type="primary"
                    onClick={selectRow}
                >
                    {t("add")}
                </Button>,
            ]}
        >
            <Row>
                <Col span={11}>
                    <Form
                        layout='vertical'
                        // className='table-filter-form'
                        form={form}
                    // onFinish={filterHandler}
                    >
                        <div className="main-table-filter-wrapper">

                            <Form.Item
                                label={t("Name")}
                                name="Name"
                            >
                                <Input.Search
                                    className="table-search"
                                    placeholder={t("search")}
                                    enterButton
                                    onSearch={onSearch}
                                />
                            </Form.Item>

                        </div>
                        <Table
                            bordered
                            size="middle"
                            // rowClassName={setRowClassName}
                            // className="main-table mt-4"
                            columns={column1}
                            dataSource={tableData?.rows}
                            loading={tableLoading}
                            rowKey={record => record.ID}
                            showSorterTooltip={false}
                            // onChange={handleTableChange}
                            pagination={{
                                total: tableData?.total,
                                showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
                            }}
                            scroll={{
                                x: "max-content",
                                y: "50vh",
                            }}
                            rowSelection={{
                                type: "checkbox",
                                ...rowSelectionLeft,
                            }}

                        />
                    </Form>
                </Col>

                <Col span={2} style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                    <Button
                        style={{ margin: "8px" }}
                        className="d-flex justify-content-center align-items-center"
                        type="primary" icon={<ArrowRightOutlined />}
                        onClick={() => {
                            handleSubmitSelectedRowsRight();
                        }}

                    />
                    <Button
                        style={{ margin: "8px" }}
                        className="d-flex justify-content-center align-items-center"
                        type="primary" icon={<ArrowLeftOutlined />}
                        onClick={() => {
                            handleSubmitSelectedRowsLeft();
                            resetTableRight();
                        }}
                    />
                </Col>

                <Col span={11}>
                    <Form
                        layout='vertical'
                        component={false}
                        form={form}
                    >
                        <Table
                            bordered
                            rowClassName="table-row"
                            className="main-table"
                            size="middle"
                            columns={newColumns}
                            dataSource={rightData.filter(item => item.Status !== 3)}
                            loading={tableLoading}
                            rowKey={record => record.ID === 0 ? record.key : record.ID}
                            showSorterTooltip={false}
                            components={components}
                            scroll={{
                                x: "max-content",
                                y: "50vh",
                            }}
                            rowSelection={{
                                type: "checkbox",
                                ...rowSelectionRight,
                            }}

                        />
                    </Form>
                </Col>
            </Row>
        </Modal >
    )
}

export default React.memo(InventoryHoldingNameModal);