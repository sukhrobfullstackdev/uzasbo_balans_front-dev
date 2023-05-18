import React, {  useState, useEffect } from 'react';
import { Table, Form, Space, Tooltip, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import Fade from "react-reveal/Fade";

// import classes from '../InventoryHoldingIntake.module.css';
import TableHeader2 from './TableHeader2';
import EditableCell from './EditableCell/EditableCell';

const UpdateTable2 = ({
    data, editTableData, allowTranslist2,
    mainForm
}) => {
    const { t } = useTranslation();
    const [editingKey, setEditingKey] = useState('');
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);


    const isEditing = (record) => record.ID === editingKey;
    const [updateTableForm] = Form.useForm();

    const edit = (record) => {
        updateTableForm.setFieldsValue({
            Price: '',
            Quantity: '',
            Sum: '',

        })
        setEditingKey(record.ID);
    };


    const columns = [
        {
            // title: t("id"),
            dataIndex: "ID",
            key: "ID",
            sorter: true,
            align: 'center',
            width: 80,
        },
        {
            // title: t("AllowedTransactionName"),
            dataIndex: "AllowedTransactionName",
            key: "AllowedTransactionName",
            width: 250,
            sorter: true,
        },
        {
            // title: t("SubAccDbCode"),
            dataIndex: "SubAccDbID",
            key: "SubAccDbID",
            width: 250,
            sorter: true,
            // editable: true,
        },
        {
            // title: t("SubAccCrCode"),
            dataIndex: "SubAccCrID",
            key: "SubAccCrID",
            width: 250,
            // editable: true,
        },
        {
            // title: t("ContractorName"),
            dataIndex: "InventoryNumber",
            key: "InventoryNumber",
            width: 250,
            // editable: true,
        },
        {
            // title: t("ContractName"),
            dataIndex: "InventoryHoldingName",
            key: "InventoryHoldingName",
            width: 250,
            // editable: true,
        },
        {
            dataIndex: "Price",
            key: "Price",
            editable: true,
            width: 120,
        },
        {
            // title: t("InventoryHoldingName"),
            dataIndex: "Quantity",
            key: "Quantity",
            width: 120,
            editable: true,
        },
        {
            // title: t("Sum"),
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
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <Tooltip title={t("Edit")}>
                        <span onClick={() => edit(record)}>
                            <i className="feather icon-edit action-icon" />
                        </span>
                    </Tooltip>

                ) : (
                    <Space size="middle" style={{ display: 'flex', justifyContent: 'center' }}>

                        <span onClick={() => handleDelete(record.key)}>
                            <i className="feather icon-trash-2 action-icon" />
                        </span>
                    </Space>
                );
            }

        },
    ];

    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        setDataSource(data);
        setLoading(false);
    }, [data])

    const handleDelete = (key) => {
        data.map(row => {
            if (row.key === key) {
                row.Status = 3;
            };
            return row;
        })
        const lastDataSource = data.filter((item) => item.Status !== 3);
        setDataSource(lastDataSource);
    };

    const addTableDataHandler = (enteredData) => {
        // console.log([enteredData, ...data]);
        setDataSource([enteredData, ...dataSource]);
        editTableData([enteredData, ...data]);
    };

    const handleSave = (row) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setDataSource(newData);
        editTableData(newData);
    };

    const components = {
        header: {
            row: () => <TableHeader2
                addData={addTableDataHandler}
                allowTranslist2={allowTranslist2}
                mainForm={mainForm}
            />
        },
        body: {
            // row: EditableRow,
            cell: EditableCell,
        },
    };
    const newColumns = columns.map((col) => {
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
                editableKey: isEditing(record),
                handleSave: handleSave,
                form
            }),
        };
    });


    return (
        <Spin spinning={loading} size='large'>
            <Fade>
                <Form
                    form={form}
                    component={false}
                >
                    <Table
                        // className={classes.editable}
                        components={components}
                        // rowClassName={() => 'editable-row'}
                        rowClassName="table-row"
                        className="main-table"
                        size='middle'
                        bordered
                        dataSource={dataSource}
                        columns={newColumns}
                        scroll={{
                            x: "max-content",
                            y: '50vh'
                        }}
                        pagination={false}
                    />
                </Form>
            </Fade>
        </Spin>
    );
}

export default React.memo(UpdateTable2);