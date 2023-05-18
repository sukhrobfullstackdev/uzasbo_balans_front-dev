import React, { useEffect, useState } from 'react'
import { Bar, Column } from '@ant-design/plots';
import { Button, Select, Spin, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import classes from '../MainPage.module.css';
import { ArrowRightOutlined } from '@ant-design/icons';
import HelperServices from '../../../../services/Helper/helper.services';
import { Notification } from '../../../../helpers/notifications';
import { CSSTransition } from 'react-transition-group';
import OrgDetailsModal from './OrgDetailsModal';
import FormN2Apis from '../../../../services/Helper/formN2.services';

const { Option } = Select;



const RegionOrgInfo = ({
    data, StartDate, dateRange,
    EndDate, organizationData,
    OblastID, RegionID
}) => {
    const { t } = useTranslation();
    // let key = 'INN';
    // let uniqueData = [...new Map(data.map(item => [item[key], item])).values()];

    const barConfig = {
        isGroup: true,
        xField: 'TotalSum',
        yField: 'Region',
        color: ['#13d19b', '#1284f6'],
        seriesField: 'DocumentType',
        marginRatio: 0,
        fontSize: 14,
        height: 100,
        appendPadding: [0, 80, 0, 0],
        legend: {
            position: 'bottom-left',
            label: {
                formatter: (data) => {
                    return t('income')
                },
            }
        },
        xAxis: {
            label: {
                formatter: (data) => {
                    return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(data) + ' UZS'
                },
            },
        },
        yAxis: {
            label: null,
        },
        label: {
            position: 'right',
            offset: 4,
            formatter: (data) => {
                return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(data.TotalSum) + ' UZS'
            },
        },
        tooltip: {
            formatter: (data) => {
                return { name: data.type, value: new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(data.TotalSum) + ' UZS' };
            },
        },
        barStyle: {
            radius: [8, 8, 0, 0],
        },
    };
    const [columnData, setColumnData] = useState([]);
    const asyncFetch = () => {
        fetch('https://gw.alipayobjects.com/os/antfincdn/PC3daFYjNw/column-data.json')
            .then((response) => response.json())
            .then((json) => setColumnData(json))
            .catch((error) => {
                console.log('fetch data failed', error);
            });
    };
    useEffect(() => {
        asyncFetch();
    }, []);

    const columnConfig = {
        xField: 'name',
        yField: 'value',
        seriesField: 'type',
        isGroup: true,
        // height: 240,
        color: ['#13d19b', '#1284f6', '#26436d', 'tomato', '#f6db12'],
        columnStyle: {
            radius: [20, 20, 0, 0],
        },
        xAxis: {
            label: {
                formatter: (data) => {
                    if (data.startsWith('I-')) {
                        return data.substring(0, 9)
                    }
                    return data.substring(0, 10)
                },
            },
        },
        tooltip: {
            formatter: (data) => {
                return { name: data.type, value: new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(data.value) + ' UZS' };
            },
        },
    };

    useEffect(() => {
        setOrgData([])
        setFullOrgData([])
        setOrgData1([])
        setOrgData2([])
        setOrgData3([])
        setOrgData4([])
        setValue(null)
        setGetDashboardList([])
    }, [RegionID])

    const [orgData, setOrgData] = useState([]);
    const [orgFullData, setFullOrgData] = useState([]);
    const [orgData1, setOrgData1] = useState([]);
    const [orgData2, setOrgData2] = useState([]);
    const [orgData3, setOrgData3] = useState([]);
    const [orgData4, setOrgData4] = useState([]);
    const [value, setValue] = useState(null);
    const [getDashboardList, setGetDashboardList] = useState([]);
    const [loading, setLoading] = useState(false);

    const [orgDetailsModal, setOrgDetailsModal] = useState(false);
    const [orgDetailsData, setOrgDetailsData] = useState(null);

    const handleSelectOrganization = async (id) => {
        setLoading(true);
        const selectedOrg = organizationData.filter(org => org.ID === id)
        const [infoDashboardOrgGruop, getDashboardList] = await Promise.all([
            HelperServices.getInfoDashboardOrgGruop(dateRange ? {
                StartDate, EndDate,
                OblastID, RegionID,
                OrganizationID: selectedOrg[0].ID
            } : {
                Date: StartDate,
                OblastID, RegionID,
                OrganizationID: selectedOrg[0].ID
            }),
            FormN2Apis.getDashboardList(StartDate === moment().add(-1, 'days').format('DD.MM.YYYY').toString() ? {
                OrganizationID: id,
                StartDate: moment().format('01.01.YYYY').toString(), EndDate,
            } : {
                OrganizationID: id,
                StartDate, EndDate,
            })
        ])
        setLoading(false)

        let totalsum = 0;
        let totalsumout = 0;
        let fullName = '';
        infoDashboardOrgGruop.data.map(org => {
            if (org.DocumentType === 1) {
                totalsum += org.TotalSum;
                fullName = org.Region;
            } else if (org.DocumentType === 2) {
                totalsumout += org.TotalSum;
            }
            return null;
        })
        setOrgData([
            {
                Region: fullName,
                DocumentType: t('income'),
                TotalSum: totalsum,
            },
            {
                Region: fullName,
                DocumentType: t('expence'),
                TotalSum: totalsumout,
            }
        ])
        const expenseGroup1 = infoDashboardOrgGruop.data.filter(org => org.ExpenceGroup === 1)
        expenseGroup1.map(org => {
            org.ID = id;
            if (org.DocumentType === 1) {
                org.DocumentType = t('income');
            } else if (org.DocumentType === 2) {
                org.DocumentType = t('expence');
            }
            return null;
        })
        const expenseGroup2 = infoDashboardOrgGruop.data.filter(org => org.ExpenceGroup === 2)
        expenseGroup2.map(org => {
            org.ID = id;
            if (org.DocumentType === 1) {
                org.DocumentType = t('income');
            } else if (org.DocumentType === 2) {
                org.DocumentType = t('expence');
            }
            return null;
        })
        const expenseGroup3 = infoDashboardOrgGruop.data.filter(org => org.ExpenceGroup === 3)
        expenseGroup3.map(org => {
            org.ID = id;
            if (org.DocumentType === 1) {
                org.DocumentType = t('income');
            } else if (org.DocumentType === 2) {
                org.DocumentType = t('expence');
            }
            return null;
        })
        const expenseGroup4 = infoDashboardOrgGruop.data.filter(org => org.ExpenceGroup === 4)
        expenseGroup4.map(org => {
            org.ID = id;
            if (org.DocumentType === 1) {
                org.DocumentType = t('income');
            } else if (org.DocumentType === 2) {
                org.DocumentType = t('expence');
            }
            return null;
        })
        setOrgData1(expenseGroup1)
        setOrgData2(expenseGroup2)
        setOrgData3(expenseGroup3)
        setOrgData4(expenseGroup4)
        setFullOrgData(selectedOrg)
        // console.log(getDashboardList.data)
        let array = [];
        getDashboardList.data.rows.map(item => {
            // console.log(item);
            let object = [
                {
                    value: item.BudgetAmount,
                    name: item.ItemOfExpenseName,
                    type: t('BudgetAmount'),
                },
                {
                    value: item.CashExpenseAmount,
                    name: item.ItemOfExpenseName,
                    type: t('CashExpenseAmount')
                },
                {
                    value: item.AccountCashExpenseAmount,
                    name: item.ItemOfExpenseName,
                    type: t('AccountCashExpenseAmount')
                },
                {
                    value: item.DiffAmount,
                    name: item.ItemOfExpenseName,
                    type: t('DiffAmount')
                },
                {
                    value: item.RestAmount,
                    name: item.ItemOfExpenseName,
                    type: t('RestAmount')
                },
            ]
            array.push(...object)
            return null;
        })
        // console.log(array);
        setGetDashboardList(array)
    }

    const openExpenceModal = (ID, ExpenceGroup, title) => {
        // console.log(ID, ExpenceGroup);
        setLoading(true);
        HelperServices.getInfoDashboardOrgDetails({
            ID, Group: ExpenceGroup, StartDate, EndDate: EndDate ? EndDate : StartDate
        }).then(res => {
            if (res.status === 200) {
                // console.log(res.data);
                setOrgDetailsModal(true)
                setOrgDetailsData({ title: title, Table: res.data })
                setLoading(false);
            }
        })
            .catch(err => {
                Notification('error', err);
                setLoading(false);
            })
    }

    return (
        <div style={{ minHeight: 96 }}>
            <Select
                placeholder={t("Select from list")}
                style={{ width: '100%', marginBottom: 16 }}
                showSearch
                allowClear
                value={value}
                onChange={setValue}
                optionFilterProp="children"
                filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                onSelect={handleSelectOrganization}
            >
                {organizationData.map((item, index) => {
                    return (
                        <Option key={index} value={item.ID}>
                            {item.FullName}
                        </Option>
                    )
                })}
            </Select>
            <Spin spinning={loading} size={'large'} style={{ minHeight: 80 }}>
                {orgData.length > 0 &&
                    <div >
                        <div className={classes.orgInfo}>
                            {orgFullData[0]?.FullName.substring(0, orgFullData[0]?.FullName.length - 12)}
                        </div>
                        <div className={classes.orgInfo}>
                            <div className={classes.key}>{t("Director")}: </div><div className={classes.value}>{orgFullData[0]?.Director}</div>
                        </div>
                        <div className={classes.orgInfo}>
                            <div className={classes.key}>{t("Accounter")}: </div><div className={classes.value}>{orgFullData[0]?.Accounter}</div>
                        </div>
                        <div className={classes.orgInfo}>
                            <div className={classes.key}>{t("INN")}: </div><div className={classes.value}>{orgFullData[0]?.INN}</div>
                        </div>
                        <div className={classes.orgInfo}>
                            <div className={classes.key}>{t("ContactInfo")}: </div><div className={classes.value}>{orgFullData[0]?.ContactInfo}</div>
                        </div>
                        <div className={classes.orgInfo}>
                            <div className={classes.key}>{t("Adress")}: </div><div className={classes.value}>{orgFullData[0]?.Adress}</div>
                        </div>
                        <div>
                            <div
                                style={{
                                    marginTop: 16, marginLeft: 8, fontSize: 16,
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                                }}
                                className={classes.orgInfo}
                            >
                                <div>{t('income')}/{t('expence')}</div>
                                <Tooltip title={t("moreInfo")}>
                                    <Button
                                        onClick={() => openExpenceModal(orgFullData[0].ID, 0, `${t('income')}/${t('expence')}`)}
                                        size="small" shape="circle" type="primary"
                                        icon={<ArrowRightOutlined />}
                                    />
                                </Tooltip>
                            </div>
                            <Bar data={orgData} {...barConfig} />
                        </div>
                    </div>
                }
                {(orgData1.length > 0 || orgData2.length > 0 || orgData3.length > 0 || orgData4.length > 0) && (
                    <div
                        style={{ marginTop: 16, marginLeft: 8, fontSize: 16 }}
                        className={classes.orgInfo}
                    >
                        {t('including')}
                    </div>
                )}
                {orgData1.length > 0 &&
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ paddingBottom: 0 }} className={classes.orgInfo}>{t('expenseGroup1')}</div>
                            <Tooltip title={t("moreInfo")}>
                                <Button
                                    onClick={() => openExpenceModal(orgData1[0].ID, orgData1[0].ExpenceGroup, t('expenseGroup1'))}
                                    size="small" shape="circle" type="primary"
                                    icon={<ArrowRightOutlined />}
                                />
                            </Tooltip>
                        </div>
                        <Bar data={orgData1} {...barConfig} />
                    </div>
                }
                {orgData2.length > 0 &&
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ paddingBottom: 0 }} className={classes.orgInfo}>{t('expenseGroup2')}</div>
                            <Tooltip title={t("moreInfo")}>
                                <Button
                                    onClick={() => openExpenceModal(orgData2[0].ID, orgData2[0].ExpenceGroup, t('expenseGroup2'))}
                                    size="small" shape="circle" type="primary"
                                    icon={<ArrowRightOutlined />}
                                />
                            </Tooltip>
                        </div>
                        <Bar data={orgData2} {...barConfig} />
                    </div>
                }
                {orgData3.length > 0 &&
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ paddingBottom: 0 }} className={classes.orgInfo}>{t('expenseGroup3')}</div>
                            <Tooltip title={t("moreInfo")}>
                                <Button
                                    onClick={() => openExpenceModal(orgData3[0].ID, orgData3[0].ExpenceGroup, t('expenseGroup3'))}
                                    size="small" shape="circle" type="primary"
                                    icon={<ArrowRightOutlined />}
                                />
                            </Tooltip>
                        </div>
                        <Bar data={orgData3} {...barConfig} />
                    </div>
                }
                {orgData4.length > 0 &&
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ paddingBottom: 0 }} className={classes.orgInfo}>{t('expenseGroup4')}</div>
                            <Tooltip title={t("moreInfo")}>
                                <Button
                                    onClick={() => openExpenceModal(orgData4[0].ID, orgData4[0].ExpenceGroup, t('expenseGroup4'))}
                                    size="small" shape="circle" type="primary"
                                    icon={<ArrowRightOutlined />}
                                />
                            </Tooltip>
                        </div>
                        <Bar data={orgData4} {...barConfig} />
                    </div>
                }
                {getDashboardList.length > 0 &&
                    <div>
                        <div className={classes.orgInfo} style={{ fontSize: 16 }}>{t('formN2')}</div>
                        <Column data={getDashboardList} {...columnConfig} />
                    </div>
                }
            </Spin>
            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={orgDetailsModal}
                timeout={300}
            >
                <OrgDetailsModal
                    visible={orgDetailsModal}
                    data={orgDetailsData}
                    // onSelect={onSelectCommon}
                    onCancel={() => {
                        setOrgDetailsModal(false);
                    }}
                />
            </CSSTransition>
        </div>
    )
}

export default RegionOrgInfo