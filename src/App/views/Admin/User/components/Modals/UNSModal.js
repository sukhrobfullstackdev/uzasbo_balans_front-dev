import React, { useState } from 'react';
import { Button, Col, Input, Modal, Row, Table } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { CSSTransition } from 'react-transition-group';

import { Notification } from '../../../../../../helpers/notifications';
import UserServices from '../../../../../../services/Admin/User/User.services';

const tablePagination = {
  pageSize: 20
};

const UserUNSModal = ({ id }) => {
  const { t } = useTranslation();

  const [isModalVisible, setIsModalVisible] = useState(false);
  // const [deleteLoading, setDeleteLoading] = useState(false);
  const [userUNSLoading, setUserUNSLoading] = useState(false);
  // const [userUNS, setUserUNS] = useState({});
  const [userUNSsModel, setUserUNSsModel] = useState([]);
  const [userUNSsModelFilter, setUserUNSsModelFilter] = useState([]);
  const [userUNSsModel1, setUserUNSsModel1] = useState([]);
  const [userUNSsModel1Filter, setUserUNSsModel1Filter] = useState([]);

  const [selectedButtonLeft, setSelectedButtonLeft] = useState(true);
  const [selectedButtonLeftLoading, setSelectedButtonLeftLoading] = useState(false);
  const [selectedModelsLeft, setSelectedModelsLeft] = useState([]);
  const [selectedRowKeysLeft, setRowKeysLeft] = useState([]);

  const [selectedButtonRight, setSelectedButtonRight] = useState(true);
  const [selectedButtonRightLoading, setSelectedButtonRightLoading] = useState(false);
  const [selectedModelsRight, setSelectedModelsRight] = useState([]);
  const [selectedRowKeysRight, setRowKeysRight] = useState([]);

  const UNSModalColumns = [
    {
      title: t('Code'),
      dataIndex: 'Code',
      width: 100,
      sorter: (a, b) => a.Code - b.Code,
    },
    {
      title: t('Name'),
      dataIndex: 'Name',
      sorter: (a, b) => a.Name.localeCompare(b.Name),
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const getUserUNS = (id) => {
    setUserUNSLoading(true);
    UserServices.getUNS(id)
      .then(response => {
        setUserUNSLoading(false);
        // setUserUNS(response.data);
        setUserUNSsModel(response.data.IncomeModel);
        setUserUNSsModelFilter(response.data.IncomeModel);
        setUserUNSsModel1(response.data.IncomeModel1);
        setUserUNSsModel1Filter(response.data.IncomeModel1);
      }).catch(error => {
        setUserUNSLoading(false);
        Notification('error', error);
      });
  }

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onSearchLeft = (event) => {
    const filteredModels = userUNSsModelFilter.filter(model => model.Code.toLowerCase().includes(event.target.value.toLowerCase()));
    setUserUNSsModel(filteredModels);
  };

  const onSearchRight = (event) => {
    const filteredModels = userUNSsModel1Filter.filter(model => model.Code.toLowerCase().includes(event.target.value.toLowerCase()));
    setUserUNSsModel1(filteredModels);
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

    UserServices.updateUNS({ ID: id, IncomeModel: checkedSelectedModelsLeft })
      .then(response => {
        getUserUNS(id);
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

    UserServices.updateUNS1({ ID: id, IncomeModel1: checkedSelectedModelsRight })
      .then(response => {
        getUserUNS(id);
        setSelectedButtonRight(true);
        setSelectedButtonRightLoading(false);
      }).catch(error => {
        Notification('error', error)
      });
  }

  return (
    <>
      
        <div onClick={() => { showModal(); getUserUNS(id) }} >
          <i className="feather icon-layout action-icon" />
          &nbsp;
          {t("UNS")}
        </div>
      
      <CSSTransition
        mountOnEnter
        unmountOnExit
        in={isModalVisible}
        timeout={300}
      >
        <Modal
          width={1000}
          title={t("UNS")}
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
                columns={UNSModalColumns}
                dataSource={userUNSsModel}
                loading={userUNSLoading}
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
                columns={UNSModalColumns}
                dataSource={userUNSsModel1}
                loading={userUNSLoading}
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
      </CSSTransition>
    </>
  )
}

export default UserUNSModal;