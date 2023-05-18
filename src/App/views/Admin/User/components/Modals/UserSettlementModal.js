import React, { useState } from 'react';
import { Button, Col, Input, Modal, Row, Table } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { CSSTransition } from 'react-transition-group';

import { Notification } from '../../../../../../helpers/notifications';
import UserServices from '../../../../../../services/Admin/User/User.services';

// const tablePagination = {
//   pageSize: 20
// };

const UserSettlementModal = ({ id }) => {
  const { t } = useTranslation();

  const [isModalVisible, setIsModalVisible] = useState(false);
  // const [deleteLoading, setDeleteLoading] = useState(false);
  const [userSettlementLoading, setUserSettlementLoading] = useState(false);
  // const [userSettlement, setUserSettlement] = useState({});
  const [userSettlementsModel, setUserSettlementsModel] = useState([]);
  const [userSettlementsModelFilter, setUserSettlementsModelFilter] = useState([]);
  const [userSettlementsModel1, setUserSettlementsModel1] = useState([]);
  const [userSettlementsModel1Filter, setUserSettlementsModel1Filter] = useState([]);

  const [selectedButtonLeft, setSelectedButtonLeft] = useState(true);
  const [selectedButtonLeftLoading, setSelectedButtonLeftLoading] = useState(false);
  const [selectedModelsLeft, setSelectedModelsLeft] = useState([]);
  const [selectedRowKeysLeft, setRowKeysLeft] = useState([]);

  const [selectedButtonRight, setSelectedButtonRight] = useState(true);
  const [selectedButtonRightLoading, setSelectedButtonRightLoading] = useState(false);
  const [selectedModelsRight, setSelectedModelsRight] = useState([]);
  const [selectedRowKeysRight, setRowKeysRight] = useState([]);

  const SettlementModalColumns = [
    {
      title: t('id'),
      dataIndex: 'ID',
      sorter: (a, b) => a.Name.localeCompare(b.ID),
    },
    {
      title: t('Code'),
      dataIndex: 'Code',
      width: 280,
      sorter: (a, b) => a.Code - b.Code,
    },
    
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const getUserSettlement = (id) => {
    setUserSettlementLoading(true);
    UserServices.getSettlement(id)
      .then(response => {
        setUserSettlementLoading(false);
        // setUserSettlement(response.data);
        setUserSettlementsModel(response.data.SettlementAccount);
        setUserSettlementsModelFilter(response.data.SettlementAccount);
        setUserSettlementsModel1(response.data.SettlementAccount1);
        setUserSettlementsModel1Filter(response.data.SettlementAccount1);
      }).catch(error => {
        setUserSettlementLoading(false);
        Notification('error', error);
      });
  }

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onSearchLeft = (event) => {
    const filteredModels = userSettlementsModelFilter.filter(model => model.Code.toLowerCase().includes(event.target.value.toLowerCase()));
    setUserSettlementsModel(filteredModels);
  };

  const onSearchRight = (event) => {
    const filteredModels = userSettlementsModel1Filter.filter(model => model.Code.toLowerCase().includes(event.target.value.toLowerCase()));
    setUserSettlementsModel1(filteredModels);
  };

  const resetTableLeft = () => {
    setRowKeysLeft([]);
  };

  const resetTableRight = () => {
    setRowKeysRight([]);
  };

  const rowSelectionLeft = {
    selectedRowKeys: selectedRowKeysLeft,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedModelsLeft(selectedRows);
      setRowKeysLeft(selectedRowKeys);
      if (selectedRows.length > 0) {
        setSelectedButtonLeft(false);
      } else {
        setSelectedButtonLeft(true);
      }
    },
    // getCheckboxProps: (record) => ({
    //   name: record.Name,
    // }),
  };

  const rowSelectionRight = {
    selectedRowKeys: selectedRowKeysRight,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedModelsRight(selectedRows);
      setRowKeysRight(selectedRowKeys);
      if (selectedRows.length > 0) {
        setSelectedButtonRight(false);
      } else {
        setSelectedButtonRight(true);
      }
    },
    // getCheckboxProps: (record) => ({
    //   name: record.Name,
    // }),
  };

  const handleSubmitSelectedRowsLeft = () => {
    setSelectedButtonLeftLoading(true);
    const checkedSelectedModelsLeft = selectedModelsLeft.map(item => {
      item.Check = true
      return item;
    });

    UserServices.updateSettlementAccount({ ID: id, SettlementAccount: checkedSelectedModelsLeft })
    console.log(checkedSelectedModelsLeft)
      .then(response => {
        getUserSettlement(id);
        setSelectedButtonLeft(true);
        setSelectedButtonLeftLoading(false);
      }).catch(error => {
        Notification('error', error)
      });
  }

  const handleSubmitSelectedRowsRight = () => {
    setSelectedButtonRightLoading(true);
    const checkedSelectedModelsRight = selectedModelsRight.map(item => {
      item.Check = true
      return item;
    });

    UserServices.updateSettlementAccount1({ ID: id, SettlementAccount1: checkedSelectedModelsRight })
      .then(response => {
        getUserSettlement(id);
        setSelectedButtonRight(true);
        setSelectedButtonRightLoading(false);
      }).catch(error => {
        Notification('error', error)
      });
  }

  return (
    <>
      
        <div onClick={() => { showModal(); getUserSettlement(id) }}>
          <i className="feather icon-list action-icon" />&nbsp;
          {t("Settlement")}
        </div>
      
        <Modal
          width={1000}
          title={t("Settlement")}
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={false}
        >
          <Row>
            <Col span={11}>
              <Input
                onChange={onSearchLeft}
                placeholder={t("Search")}
              />
              <Table
                bordered
                size="middle"
                rowClassName="table-row"
                className="main-table mt-4"
                columns={SettlementModalColumns}
                dataSource={userSettlementsModel}
                loading={userSettlementLoading}
                scroll={{ y: "40vh" }}
                rowKey={record => record.ID}
                rowSelection={{
                  type: "checkbox",
                  ...rowSelectionLeft,
                }}
                pagination={false}
                // pagination={{
                //   ...tablePagination,
                //   showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
                // }}
              />
            </Col>
            <Col span={2} style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
              <Button
                style={{ margin: "8px" }}
                disabled={selectedButtonLeft}
                loading={selectedButtonLeftLoading}
                className="d-flex justify-content-center align-items-center"
                type="primary"
                icon={<ArrowRightOutlined />}
                onClick={() => {
                  handleSubmitSelectedRowsLeft();
                  resetTableLeft();
                }}
              />
              <Button
                style={{ margin: "8px" }}
                disabled={selectedButtonRight}
                loading={selectedButtonRightLoading}
                className="d-flex justify-content-center align-items-center"
                type="primary" icon={<ArrowLeftOutlined />}
                onClick={() => {
                  handleSubmitSelectedRowsRight();
                  resetTableRight();
                }}
              />
            </Col>
            <Col span={11}>
              <Input
                onChange={onSearchRight}
                placeholder={t("Search")}
              />
              <Table
                bordered
                size="middle"
                rowClassName="table-row"
                className="main-table mt-4"
                columns={SettlementModalColumns}
                dataSource={userSettlementsModel1}
                loading={userSettlementLoading}
                scroll={{ y: "40vh" }}
                rowKey={record => record.ID}
                pagination={false}
                // pagination={{
                //   ...tablePagination,
                //   showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
                // }}
                rowSelection={{
                  type: "checkbox",
                  ...rowSelectionRight,
                }}
              />
            </Col>
          </Row>
        </Modal>
    </>
  )
}

export default UserSettlementModal;