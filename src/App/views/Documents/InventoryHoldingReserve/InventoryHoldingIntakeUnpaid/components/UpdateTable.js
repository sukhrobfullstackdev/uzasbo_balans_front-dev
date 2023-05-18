import React, {  useState, useEffect, } from 'react';
import { Table, Form, Space, Spin } from 'antd';
// import { useTranslation } from 'react-i18next';
import Fade from "react-reveal/Fade";

import EditableCell from './EditableCell/EditableCell';

import TableHeader from './TableHeader';


const UpdateTable = ({
    data, editTableData, allowTranslist,
    mainForm, lastcurrencycourse
}) => {
    // const { t } = useTranslation();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);

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
            dataIndex: "SubAccDbCode",
            key: "SubAccDbCode",
            width: 250,
            sorter: true,
            // editable: true,
        },
        {
            // title: t("SubAccCrCode"),
            dataIndex: "SubAccCrCode",
            key: "SubAccCrCode",
            width: 250,
            // editable: true,
        },
        {
            // title: t("ContractorName"),
            dataIndex: "ContractorName",
            key: "ContractorName",
            width: 250,
            // editable: true,
        },
        {
            // title: t("ContractName"),
            dataIndex: "ContractName",
            key: "ContractName",
            width: 250,
            // editable: true,
        },
        {
            // title: t("Sum"),
            dataIndex: "Sum",
            key: "Sum",
            editable: true,
            render: (record, fullRecord) =>
                (fullRecord.TableIsCurrency === true && lastcurrencycourse > 0) ? (<div>{(fullRecord.Sum / lastcurrencycourse).toFixed(2)}</div>) : (<div>{record}</div>),
            width: 120,
        },
        {
            // title: t("InventoryHoldingName"),
            dataIndex: "IntakeDetails",
            key: "IntakeDetails",
            width: 120,
            editable: true,
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
                        {/* <span
                            onClick={toggleEdit}
                        >
                            <i className={`feather icon-edit action-icon`} />
                        </span> */}
                        <span onClick={() => handleDelete(record.key)}>
                            <i className="feather icon-trash-2 action-icon" />
                        </span>
                    </Space>
                ) : null,
        },
    ];

    const [dataSource, setDataSource] = useState([]);
    // const [filteredDataSource, setFilteredDataSource] = useState([]);

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
        // setFilteredDataSource(lastDataSource);
        // if (lastDataSource.length === 0) {
        //     setDisabledTables(false);
        // };
        // editTableData(data);
    };

    const addTableDataHandler = (enteredData) => {
        setDataSource([enteredData, ...dataSource]);
        // setDisabledTables(true);
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
            row: () => <TableHeader
                addData={addTableDataHandler}
                allowTranslist={allowTranslist}
                mainForm={mainForm}
            />
        },
        body: {
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
                components={components}
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

export default React.memo(UpdateTable);