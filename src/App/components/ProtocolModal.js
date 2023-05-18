import { Button, Input, Modal, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import HelperServices from '../../services/Helper/helper.services';

const ProtocolModal = (props) => {
    const { t } = useTranslation();

    const columns = [
        {
            title: t("id"),
            dataIndex: 'ID',
            width: 100,
            sorter: (a, b) => a.ID - b.ID,
        },
        {
            title: t("Status"),
            dataIndex: 'Status',
            width: 250,
            sorter: (a, b) => a.Status.localeCompare(b.Status),
        },
        {
            title: t("Description"),
            dataIndex: 'Description',
            width: 250,
            sorter: (a, b) => a.Description.localeCompare(b.Description),
        },
        {
            title: t("CreatedTime"),
            dataIndex: 'CreatedTime',
            width: 250,
            sorter: (a, b) => a.CreatedTime.localeCompare(b.CreatedTime),
        },
    ];

    const [tableLoading, setTableLoading] = useState(true);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const [tableData] = await Promise.all([
                HelperServices.GetFileLog(props.params.id, props.params.tableId),
            ]);
            setTableData(tableData.data);
            setTableLoading(false);
        };

        fetchData().catch(err => {
            Notification('error', err);
            setTableLoading(false);
        });
    }, [props.params]);

    return (
        <Modal
            width={768}
            title={t("ProtocolHistory")}
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
                dataSource={tableData.rows}
                loading={tableLoading}
                rowKey={record => record.ID}
                showSorterTooltip={false}
                pagination={false}
                scroll={{
                    x: "max-content",
                    y: "50vh",
                  }}
            />
        </Modal>
    )
}

export default ProtocolModal;