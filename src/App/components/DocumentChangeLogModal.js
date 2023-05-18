import { Button, Input, Modal, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import HelperServices from '../../services/Helper/helper.services';

const DocumentChangeLogModal = (props) => {
    console.log(props.params);
    const { t } = useTranslation();

    const columns = [
        {
            title: t("id"),
            dataIndex: 'ID',
            width: 100,
            sorter: (a, b) => a.ID - b.ID,
        },
        {
            title: t("StatusName"),
            dataIndex: 'statusname',
            width: 250,
            sorter: (a, b) => a.statusname.localeCompare(b.statusname),
        },
        {
            title: t("DateOfCreated"),
            dataIndex: 'DateOfCreated',
            width: 250,
            sorter: (a, b) => a.DateOfCreated.localeCompare(b.DateOfCreated),
        },
        {
            title: t("UserName"),
            dataIndex: 'UserName',
            width: 250,
            sorter: (a, b) => a.UserName.localeCompare(b.UserName),
        },
        {
            title: t("UserInfo"),
            dataIndex: 'UserInfo',
            width: 250,
            sorter: (a, b) => a.UserInfo.localeCompare(b.UserInfo),
        },
        {
            title: t("OrganizationInfo"),
            dataIndex: 'OrganizationInfo',
            width: 250,
            sorter: (a, b) => a.OrganizationInfo.localeCompare(b.OrganizationInfo),
        },
        {
            title: t("Comment"),
            dataIndex: 'Comment',
            width: 250,
            sorter: (a, b) => a.Comment.localeCompare(b.Comment),
        }
    ];

    const [tableLoading, setTableLoading] = useState(true);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const [tableData] = await Promise.all([
                HelperServices.GetDocumentChangeLog(props.params),
            ]);
            setTableData(tableData.data);
            setTableLoading(false);
        };

        fetchData().catch(err => {
            Notification('error', err);
            setTableLoading(false);
        });
    }, [props.params]);

    const [selectedTableData, setSelectedTableData] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const rowSelection = {
        selectedRowKeys: selectedTableData,
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedTableData(selectedRows);
            setSelectedRowKeys(selectedRowKeys);
        },
    };

    return (
        <Modal
            width={1190}
            title={t("DocumentChangeLog")}
            visible={props.visible}
            onCancel={props.onCancel}
            footer={[
                <Button key="back" onClick={props.onCancel}>
                  {t("close")}
                </Button>,
              ]}
        >
            {/* <Input
                placeholder="Search..." 
            /> */}
            <Table
                bordered
                size="middle"
                rowClassName="table-row"
                className="main-table mt-4"
                columns={columns}
                dataSource={tableData}
                loading={tableLoading}
                rowKey={record => record.ID}
                showSorterTooltip={false}
                pagination={false}
                scroll={{
                    x: "max-content",
                    y: "50vh",
                  }}
                // rowSelection={{
                //     type: "checkbox",
                //     ...rowSelection,
                // }}
            />
        </Modal>
    )
}

export default DocumentChangeLogModal;