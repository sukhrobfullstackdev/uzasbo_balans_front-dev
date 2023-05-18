import { Button, Modal, Table } from 'antd';
import React from 'react'
import { useTranslation } from 'react-i18next';

const OrgDetailsModal = (props) => {
    const { t } = useTranslation();

    const columns = [
        {
            title: t("date"),
            dataIndex: 'Date',
            key: 'Date',
            width: 100,
            sorter: (a, b) => a.Date - b.Date,
        },
        {
            title: t("Sum"),
            dataIndex: 'Sum',
            key: 'Sum',
            width: 120,
            sorter: (a, b) => a.Sum - b.Sum,
            render: record =>  new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
        },
        {
            title: t("PayerName"),
            dataIndex: 'PayerName',
            key: 'PayerName',
            width: 150,
            // sorter: (a, b) => a.PayerName.localeCompare(b.PayerName),
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("PayeeName"),
            dataIndex: 'PayeeName',
            key: 'PayeeName',
            width: 150,
            // sorter: (a, b) => a.PayeeName.localeCompare(b.PayeeName),
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("ItemOfExpense"),
            dataIndex: 'ItemOfExpense',
            key: 'ItemOfExpense',
            width: 150,
            // sorter: (a, b) => a.ItemOfExpense.localeCompare(b.ItemOfExpense),
        },
        {
            title: t("PaymentDetails"),
            dataIndex: 'PaymentDetails',
            key: 'PaymentDetails',
            width: 200,
            // sorter: (a, b) => a.PaymentDetails.localeCompare(b.PaymentDetails),
            render: record => <div className="ellipsis-2">{record}</div>
        },
    ];
    return (
        <Modal
            width={1190}
            title={props.data?.title}
            visible={props.visible}
            onCancel={props.onCancel}
            footer={[
                <Button key="back" onClick={props.onCancel}>
                    {t("close")}
                </Button>,
                // <Button
                //     disabled={!rowData}
                //     type="primary"
                //     onClick={selectRow}
                // >
                //     {t("select")}
                // </Button>,
            ]}
        >
            <Table
                bordered
                size="middle"
                rowClassName={'table-row'}
                className="main-table mt-4"
                columns={columns}
                dataSource={props.data?.Table}
                loading={false}
                // onChange={handleTableChange}
                rowKey={Math.random()}
                showSorterTooltip={false}
                pagination={false}
                scroll={{
                    x: "max-content",
                    y: "50vh",
                }}
                onRow={(record) => {
                    return {
                        onDoubleClick: () => {
                            // props.onSelect({
                            //     ID: record.ID, NameValue: record.Name, TypeValue: record.ReqRecCashTypeID,
                            //     id: props.params.ID, Name: props.params.Name, Type: props.params.Type,
                            // });
                            // props.onCancel();
                        },
                        onClick: () => {
                            // setRowData({
                            //     ID: record.ID, NameValue: record.Name, TypeValue: record.ReqRecCashTypeID,
                            //     id: props.params.ID, Name: props.params.Name, Type: props.params.Type,
                            // });
                        },
                    };
                }}
            />
        </Modal>
    )
}

export default OrgDetailsModal