import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Form, Space, InputNumber, DatePicker } from 'antd';
import { useTranslation } from 'react-i18next';
import moment from "moment";

import classes from '../StudentContract.module.css';
import StudentContractForFillTableHeader from './StudentContractForFillTableHeader';

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
    ;
    if (editable && (dataIndex === 'ContractNumber')) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: false,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Input
                    style={{ width: '100%' }} ref={inputRef}
                    onPressEnter={save} onBlur={save}
                    placeholder={t('ContractNumber')}
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
    if (editable && dataIndex === 'ContractDate') {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                // name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <DatePicker
                    style={{ width: '100%' }} ref={inputRef}
                    format="DD.MM.YYYY" className='datepicker'
                    defaultValue={moment(record.ContractDate, "DD.MM.YYYY")}
                    // onChange={onChangeDate}
                    placeholder={t('ContractDate')}
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

    return <td {...restProps}>
        {childNode}
    </td>;
};

const StudentContractForFillTable = ({ data, editTableData, setDisabledTables }) => {
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
            title: t("Student"),
            dataIndex: "StudentName",
            key: "StudentName",
            width: 250,
            sorter: true,
        },
        {
            title: t("ContractNumber"),
            dataIndex: "ContractNumber",
            key: "ContractNumber",
            width: 120,
            sorter: true,
            editable: true,
        },
        {
            title: t("ContractDate"),
            dataIndex: "ContractDate",
            key: "ContractDate",
            width: 120,
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
            title: t("StudentCode"),
            dataIndex: "StudentCode",
            key: "StudentCode",
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
        // console.log([...data, enteredData]);
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
            row: () => <StudentContractForFillTableHeader
                addData={addTableDataHandler}
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
                dataSource={filteredDataSource}
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

export default React.memo(StudentContractForFillTable);