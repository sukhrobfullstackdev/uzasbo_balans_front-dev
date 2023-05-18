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

const UserOrgModal = ({ id }) => {
  const { t } = useTranslation();

  const [isModalVisible, setIsModalVisible] = useState(false);
  // const [deleteLoading, setDeleteLoading] = useState(false);
  const [userOrgLoading, setUserOrgLoading] = useState(false);
  // const [userOrg, setUserOrg] = useState({});
  const [userOrgsModel, setUserOrgsModel] = useState([]);
  const [userOrgsModelFilter, setUserOrgsModelFilter] = useState([]);
  const [userOrgsModel1, setUserOrgsModel1] = useState([]);
  const [userOrgsModel1Filter, setUserOrgsModel1Filter] = useState([]);

  const [selectedButtonLeft, setSelectedButtonLeft] = useState(true);
  const [selectedButtonLeftLoading, setSelectedButtonLeftLoading] = useState(false);
  const [selectedModelsLeft, setSelectedModelsLeft] = useState([]);
  const [selectedRowKeysLeft, setRowKeysLeft] = useState([]);

  const [selectedButtonRight, setSelectedButtonRight] = useState(true);
  const [selectedButtonRightLoading, setSelectedButtonRightLoading] = useState(false);
  const [selectedModelsRight, setSelectedModelsRight] = useState([]);
  const [selectedRowKeysRight, setRowKeysRight] = useState([]);

  const OrgModalColumns = [
    {
      title: t('Code'),
      dataIndex: 'Code',
      // width: 80,
      sorter: (a, b) => a.Code - b.Code,
    },
    {
      title: t('INN'),
      dataIndex: 'INN',
      sorter: (a, b) => a.INN.localeCompare(b.INN),
    },
    {
      title: t('name'),
      dataIndex: 'Name',
      sorter: (a, b) => a.Name.localeCompare(b.Name),
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const getUserOrg = (id) => {
    setUserOrgLoading(true);
    UserServices.getOrg(id)
      .then(response => {
        setUserOrgLoading(false);
        // setUserOrg(response.data);
        setUserOrgsModel(response.data.Org);
        setUserOrgsModelFilter(response.data.Org);
        setUserOrgsModel1(response.data.Org1);
        setUserOrgsModel1Filter(response.data.Org1);
      }).catch(error => {
        setUserOrgLoading(false);
        Notification('error', error);
      });
  }

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onSearchLeft = (event) => {
    const filteredModels = userOrgsModelFilter.filter(model => model.INN.toLowerCase().includes(event.target.value.toLowerCase()));
    setUserOrgsModel(filteredModels);
  };

  const onSearchRight = (event) => {
    const filteredModels = userOrgsModel1Filter.filter(model => model.INN.toLowerCase().includes(event.target.value.toLowerCase()));
    setUserOrgsModel1(filteredModels);
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

    UserServices.updateOrg({ ID: id, Org: checkedSelectedModelsLeft })
      .then(response => {
        getUserOrg(id);
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

    UserServices.updateOrg1({ ID: id, Org1: checkedSelectedModelsRight })
      .then(response => {
        getUserOrg(id);
        setSelectedButtonRight(true);
        setSelectedButtonRightLoading(false);
      }).catch(error => {
        Notification('error', error)
      });
  }

  return (
    <>
     
        <div onClick={() => { showModal(); getUserOrg(id) }}>
          <i className="feather icon-edit-2 action-icon" />
          &nbsp;
          {t("Org")}
        </div>
      
        <Modal
          width={1000}
          title={t("Org")}
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
                columns={OrgModalColumns}
                dataSource={userOrgsModel}
                loading={userOrgLoading}
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
                columns={OrgModalColumns}
                dataSource={userOrgsModel1}
                loading={userOrgLoading}
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

export default UserOrgModal;