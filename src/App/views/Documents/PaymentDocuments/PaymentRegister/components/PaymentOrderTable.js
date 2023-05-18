import React, { useState, useEffect } from 'react';
import { Table, Space } from 'antd';
import { useTranslation } from 'react-i18next';

const PaymentOrderTable = ({
    data, editTableData, setDisabledTables,
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
            title: t("DocumentID"),
            dataIndex: "DocumentID",
            key: "DocumentID",
            width: 120,
        },
        {
            title: t("Number"),
            dataIndex: "Number",
            key: "Number",
            width: 100,
            sorter: true,
        },
        {
            title: t("Date"),
            dataIndex: "Date",
            key: "Date",
            width: 100,
            sorter: true,
        },
        {
            title: t("Sum"),
            dataIndex: "Sum",
            key: "Sum",
            width: 120,
        },
        {
            title: t("itemOfExpense"),
            dataIndex: "ItemOfExpensesCode",
            key: "ItemOfExpensesCode",
            width: 100,
        },
        {
            title: t("PaymentDetails"),
            dataIndex: "PaymentDetails",
            key: "PaymentDetails",
            width: 250,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("OrganizationName"),
            dataIndex: "OrganizationName",
            key: "OrganizationName",
            width: 200,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: '',
            key: "action",
            align: "center",
            fixed: 'right',
            width: 40,
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

    return (
        <Table
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={filteredDataSource}
            columns={columns}
            scroll={{
                x: "max-content",
                y: '50vh'
            }}
            pagination={false}
        />
    );
}

export default React.memo(PaymentOrderTable);