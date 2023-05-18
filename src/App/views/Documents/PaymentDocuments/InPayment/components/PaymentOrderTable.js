import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Form, Space, InputNumber, Select } from 'antd';
import { useTranslation } from 'react-i18next';

import PaymentOrderTableHeader from './PaymentOrderTableHeader';

const { Option } = Select;

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
    // console.log(props);
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
    itemOfExpenseList,
    ...restProps
}) => {
    // console.log(dataIndex);
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

    if (editable && dataIndex === 'ItemOfExpensesID') {
        let childContent = itemOfExpenseList?.find(expense => expense.ID === record.ItemOfExpensesID);
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                    width: 'fit-content',
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Select
                    placeholder={t("Select from list")}
                    showSearch
                    ref={inputRef} onPressEnter={save} onBlur={save}
                    allowClear
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {itemOfExpenseList.map((taxItem) => (
                        <Option key={taxItem.ID} value={taxItem.ID}>
                            {taxItem.Code}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {childContent?.Code}
            </div>
        );
    };
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
                {record.Sum}
            </div>
        );
    };

    return <td {...restProps}>
        {childNode}
    </td>;
};

const PaymentOrderTable = ({
    data, editTableData, setDisabledTables, tableHeaders, itemOfExpenseList,
    mainForm, currrrr, lastcurrencycourse
}) => {
    const { t } = useTranslation();

    const columns = [
        {
            title: t("id"),
            dataIndex: "ID",
            key: "ID",
            sorter: true,
            width: 80,
        },
        {
            title: t("SubCountDb1Name"),
            dataIndex: "SubCountDb1Name",
            key: "SubCountDb1Name",
            width: 250,
            sorter: true,
        },
        {
            title: t("SubCountDb2Name"),
            dataIndex: "SubCountDb2Name",
            key: "SubCountDb2Name",
            width: 250,
            sorter: true,
            editable: true,
        },
        {
            title: t("SubCountDb3Name"),
            dataIndex: "SubCountDb3Name",
            key: "SubCountDb3Name",
            width: 250,
            editable: true,
        },
        {
            title: t("ItemOfExpensesID"),
            dataIndex: "ItemOfExpensesID",
            key: "ItemOfExpensesID",
            width: 250,
            editable: true,
        },
        {
            title: t("Sum"),
            dataIndex: "Sum",
            key: "Sum",
            width: 120,
            editable: true,
        },
        {
            title: t("CurrencySum"),
            dataIndex: "CurrencySum",
            key: "CurrencySum",
            render: (record, fullRecord) =>
                (fullRecord.TableIsCurrency === true && lastcurrencycourse > 0) ? (<div>{(fullRecord.Sum / lastcurrencycourse).toFixed(2)}</div>) : (<div>{record}</div>),
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
    const [filteredDataSource, setFilteredDataSource] = useState([]);

    useEffect(() => {
        setDataSource(data);
        let filteredData = data.filter(data => data.Status !== 3)
        setFilteredDataSource(filteredData);
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
        setFilteredDataSource(lastDataSource);
        if (lastDataSource.length === 0) {
            setDisabledTables(false);
        };
        editTableData(data);
    };

    const addTableDataHandler = (enteredData) => {
        // console.log([enteredData, ...dataSource]);   
        setDataSource([enteredData, ...dataSource]);
        setDisabledTables(true);
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
            row: () => <PaymentOrderTableHeader
                addData={addTableDataHandler}
                tableHeaders={tableHeaders}
                itemOfExpenseList={itemOfExpenseList}
                mainForm={mainForm}
                currrrr={currrrr}
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
                itemOfExpenseList: itemOfExpenseList
            }),
        };
    });
    return (
        <div>
            <Table
                bordered
                size='middle'
                rowClassName="table-row"
                className="main-table"
                dataSource={filteredDataSource}
                columns={newColumns}
                components={components}
                scroll={{
                    x: "max-content",
                    y: '50vh'
                }}
                pagination={false}
            />
        </div>
    );
}

export default React.memo(PaymentOrderTable);