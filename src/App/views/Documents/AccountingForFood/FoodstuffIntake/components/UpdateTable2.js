import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Form, Space, InputNumber, Select } from 'antd';
import { useTranslation } from 'react-i18next';

import classes from '../FoodstuffIntake.module.css';
import TableHeader2 from './TableHeader2';

const { Option } = Select;

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    const { t } = useTranslation();

    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            let status = 0;
            if (record.Status === 0) {
                status = 2;
            } else if (record.Status === 1) {
                status = 1;
            }
            toggleEdit();
            handleSave({ ...record, ...values, Status: status });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable && (dataIndex === 'Sum')) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <InputNumber
                    style={{ width: '100%' }} ref={inputRef}
                    onPressEnter={save} onBlur={save}
                    placeholder={t('Sum')}
                />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    };

    if (editable && (dataIndex === 'Quantity')) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <InputNumber
                    style={{ width: '100%' }} ref={inputRef}
                    onPressEnter={save} onBlur={save}
                    placeholder={t('IntakeDetails')}
                />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    };

    if (editable && (dataIndex === 'Price')) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <InputNumber
                    style={{ width: '100%' }} ref={inputRef}
                    onPressEnter={save} onBlur={save}
                    placeholder={t('IntakeDetails')}
                />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    };

    return <td {...restProps}>
        {childNode}
    </td>;
};

const UpdateTable2 = ({
    data, editTableData, allowTranslist2,
    mainForm, lastcurrencycourse
}) => {
    const { t } = useTranslation();

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
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Space size="middle" style={{ display: 'flex', justifyContent: 'center' }}>
                        <span onClick={() => handleDelete(record.key)}>
                            <i className="feather icon-trash-2 action-icon" />
                        </span>
                    </Space>
                ) : null,
        },
    ];

    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        setDataSource(data);
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
        console.log(enteredData);  
        setDataSource([...enteredData, ...dataSource]);
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
            row: EditableRow,
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
                handleSave: handleSave,
            }),
        };
    });


    return (
        <div>
            <Table
                className={classes.editable}
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataSource}
                columns={newColumns}
                scroll={{
                    x: "max-content",
                    y: '50vh'
                }}
                pagination={false}
            />
        </div>
    );
}

export default React.memo(UpdateTable2);