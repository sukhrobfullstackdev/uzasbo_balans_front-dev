import React, { useState, useRef, useEffect } from 'react';
import { Tooltip, Button, Space, Spin, Breadcrumb, Card, Row, Col, Typography, Statistic } from "antd";
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { Bar } from '@ant-design/plots';

import MainCard from '../../components/MainCard';
import classes from './MainPage.module.css'
import HelperServices from '../../../services/Helper/helper.services';
import HelperApis from "./../../../services/Helper/helperApis";
import { Notification } from '../../../helpers/notifications';
import regions from '../../../helpers/map';
import RegionOrgInfo from './components/RegionOrgInfo';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { ArrowFromBottomIcon, ArrowToBottomIcon, BuildingIcon, MoneyIcon } from './components/SvgIcons';

const { Text } = Typography;
const barConfig = {
    isGroup: true,
    xField: 'value',
    yField: 'label',
    color: ['#13d19b', '#1284f6'],
    seriesField: 'type',
    marginRatio: 0,
    height: 120,
    fontSize: 14,
    appendPadding: [0, 80, 0, 0],
    legend: {
        position: 'bottom-left',
    },
    xAxis: {
        label: {
            formatter: (data) => {
                return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(data) + ' UZS'
            },
        },
    },
    label: {
        position: 'right',
        offset: 4,
        formatter: (data) => {
            return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(data.value) + ' UZS'
        },
    },
    tooltip: {
        formatter: (data) => {
            return { name: data.type, value: new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(data.value) + ' UZS' };
        },
    },
    barStyle: {
        radius: [8, 8, 0, 0],
    },
};

const Map = () => {
    const { t } = useTranslation();

    const districtRef = useRef();
    const [map, setMap] = useState(regions);
    const [loading, setLoading] = useState(false);
    const [region, setRegion] = useState(false);
    const [regionName, setRegionName] = useState(null);
    const [districtName, setDistrictName] = useState(null);
    const [districtData, setDistrictData] = useState([]);
    const [orgData, setOrgData] = useState([]);
    const [organizationData, setOrganizationData] = useState([]);
    const [totalSum, setTotalSum] = useState(0);
    const [OblastID, setOblastID] = useState(null);
    const [RegionID, setRegionID] = useState(null);
    const [totalSumOut, setTotalSumOut] = useState(0);
    const [dateRange, setDateRange] = useState(false);
    const [orgCount, setOrgCount] = useState(0);
    const [budgetOrgCount, setBudgetOrgCount] = useState(0);
    const [orgSalary, setOrgSalary] = useState(0);
    const [loadingOrgSalary, setLoadingOrgSalary] = useState(false);

    let StartDate = document.querySelector('#dashboard_start_date')?.title || moment().add(-1, 'days').format('DD.MM.YYYY').toString();
    let EndDate = document.querySelector('#dashboard_end_date')?.title || moment().format('DD.MM.YYYY').toString();
    // let yesterday = dashboardDate?.title || moment().add(-1, 'days').format('DD.MM.YYYY').toString();

    const [oblastData, setOblastData] = useState([]);

    async function fetchData() {
        try {
            setLoading(true)
            const regionMap = await HelperServices.getRegionMap(
                dateRange ? { StartDate, EndDate } : { Date: StartDate });
            let totalsum = 0;
            let totalsumout = 0;
            regionMap.data.map(sum => {
                if (sum.DocumentType === 1) {
                    totalsum += sum.TotalSum;
                } else if (sum.DocumentType === 2) {
                    totalsumout += sum.TotalSum;
                }
                return null;
            })
            setTotalSum(totalsum)
            setTotalSumOut(totalsumout)

            setOblastData(
                [
                    {
                        label: 'UZS',
                        type: t('income'),
                        value: totalsum,
                    },
                    {
                        label: 'UZS',
                        type: t('expence'),
                        value: totalsumout,
                    }
                ]
            )
            setLoading(false)

        } catch (err) {
            Notification('error', err);
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, []);

    useEffect(() => {
        async function fetchOrgCount() {
            try {
                // setLoading(true)
                const orgCount = await HelperServices.getInfoDashboardOrganizationCount({ OblastID, RegionID })
                setBudgetOrgCount(orgCount.data[0].TotalCount)
                setOrgCount(orgCount.data[1].TotalCount)
                // setLoading(false)
            } catch (err) {
                Notification('error', err);
                // setLoading(false)
            }
        }

        fetchOrgCount()
    }, [OblastID, RegionID]);
    useEffect(() => {
        async function fetchOrgCount() {
            try {
                setLoadingOrgSalary(true)
                const orgSalary = await HelperServices.getInfoDashboardTotalSum({ StartDate, OblastID, RegionID })
                setOrgSalary(orgSalary.data[0].TotalSum)
                setLoadingOrgSalary(false)
            } catch (err) {
                Notification('error', err);
                setLoadingOrgSalary(false)
            }
        }

        fetchOrgCount()
    }, [StartDate, OblastID, RegionID]);

    const mapClickHandler = (districts, regionName, id) => {
        // console.log(districts, regionName, id);
        if (districts) {
            setOblastID(id)
            setRegionName(regionName);
        } else if (id === 601) {
            setDistrictName(null)
        } else {
            setLoading(true);
            setDistrictName(regionName)
            setRegionID(id)
            HelperServices.getInfoDasboardOrg(
                dateRange ? {
                    StartDate, EndDate,
                    OblastID: OblastID,
                    RegionID: id,
                } : {
                    Date: StartDate,
                    OblastID: OblastID,
                    RegionID: id,
                })
                .then(res => {
                    let totalsum = 0;
                    let totalsumout = 0;
                    res.data.map(sum => {
                        if (sum.DocumentType === 1) {
                            sum.type = t('income')
                            totalsum += sum.TotalSum;
                        } else if (sum.DocumentType === 2) {
                            sum.type = t('expence')
                            totalsumout += sum.TotalSum;
                        }
                        return null;
                    })
                    setOrgData(res.data)
                    setTotalSum(totalsum)
                    setTotalSumOut(totalsumout)

                    setOblastData(
                        [
                            {
                                label: 'UZS',
                                type: t('income'),
                                value: totalsum,
                            },
                            {
                                label: 'UZS',
                                type: t('expence'),
                                value: totalsumout,
                            }
                        ]
                    )
                })
                .catch(err => {
                    Notification('error', err)
                });
            HelperServices.getInfoDashboardOrganization(
                {
                    OblastID: OblastID,
                    RegionID: id,
                })
                .then(res => {
                    setOrganizationData(res.data)
                    setLoading(false)
                })
                .catch(err => {
                    Notification('error', err)
                    setLoading(false)
                });
        };

        if (districts) {
            setLoading(true);
            HelperServices.getDistrictMap(
                dateRange ? { OblastID: id, StartDate, EndDate } : { OblastID: id, Date: StartDate }
            )
                .then(res => {
                    let totalsum = 0;
                    let totalsumout = 0;
                    res.data.map(sum => {
                        if (sum.DocumentType === 1) {
                            totalsum += sum.TotalSum;
                        } else if (sum.DocumentType === 2) {
                            totalsumout += sum.TotalSum;
                        }
                        return null;
                    })
                    setDistrictData(res.data)
                    setTotalSum(totalsum)
                    setTotalSumOut(totalsumout)

                    setOblastData(
                        [
                            {
                                label: 'UZS',
                                type: t('income'),
                                value: totalsum,
                            },
                            {
                                label: 'UZS',
                                type: t('expence'),
                                value: totalsumout,
                            }
                        ]
                    )
                    setLoading(false)
                })
                .catch(err => {
                    Notification('error', err)
                    setLoading(false)
                });

            setMap(districts);
            setRegion(true);
        }
    }

    const backBtnHandler = () => {
        setOblastID(null)
        for (let path of document.querySelector('#map').children) {
            path.style = null;
        }
        setMap(regions);
        setRegion(false);
        setRegionName(null);
        setDistrictName(null);
        fetchData();
    }

    const datechangeHandler = (data) => {
        // console.log(data);
        let slug = OblastID ? 'GetInfoDasboardRegion' : 'GetInfoDashboardOblast';
        let fullSlug = '';
        if (data.Date) {
            fullSlug = slug.concat("Date");
        }
        setLoading(true)
        HelperApis.getHelperData(
            fullSlug,
            {
                Date: data.Date?.format('DD.MM.YYYY'),
                StartDate: data.StartDate?.format('DD.MM.YYYY'),
                EndDate: data.EndDate?.format('DD.MM.YYYY'),
                OblastID,
            })
            .then(res => {
                let totalsum = 0;
                let totalsumout = 0;
                res.data.map(sum => {
                    if (sum.DocumentType === 1) {
                        totalsum += sum.TotalSum;
                    } else if (sum.DocumentType === 2) {
                        totalsumout += sum.TotalSum;
                    }
                    return null;
                })
                setTotalSum(totalsum)
                setTotalSumOut(totalsumout)

                setOblastData(
                    [
                        {
                            label: 'UZS',
                            type: t('income'),
                            value: totalsum,
                        },
                        {
                            label: 'UZS',
                            type: t('expence'),
                            value: totalsumout,
                        }
                    ]
                )
                if (OblastID) {
                    setDistrictData(res.data)
                }
                for (let path of document.querySelector('#map').children) {
                    path.style = null;
                }
                setDistrictName(null);
                setLoading(false)
            })
            .catch(err => {
                Notification('error', err)
                setLoading(false)
            });
    }

    const CustomBreadcrumb = (data) => {
        return (
            <Breadcrumb>
                <Breadcrumb.Item
                    onClick={() => {
                        backBtnHandler();
                        setOblastID(null);
                        setRegionID(null);
                    }}
                    style={{ cursor: 'pointer' }}
                >
                    {t("O'ZBEKISTON RESPUBLIKASI")}
                </Breadcrumb.Item>
                {regionName && <Breadcrumb.Item
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                        // console.log(OblastID);
                        setLoading(true);
                        setRegionID(null);
                        setDistrictName(null);
                        HelperServices.getDistrictMap(
                            dateRange ? { OblastID, StartDate, EndDate } : { OblastID, Date: StartDate }
                        )
                            .then(res => {
                                let totalsum = 0;
                                let totalsumout = 0;
                                res.data.map(sum => {
                                    if (sum.DocumentType === 1) {
                                        totalsum += sum.TotalSum;
                                    } else if (sum.DocumentType === 2) {
                                        totalsumout += sum.TotalSum;
                                    }
                                    return null;
                                })
                                setDistrictData(res.data)
                                setTotalSum(totalsum)
                                setTotalSumOut(totalsumout)

                                setOblastData(
                                    [
                                        {
                                            label: 'UZS',
                                            type: t('income'),
                                            value: totalsum,
                                        },
                                        {
                                            label: 'UZS',
                                            type: t('expence'),
                                            value: totalsumout,
                                        }
                                    ]
                                )
                                setLoading(false)
                            })
                            .catch(err => {
                                Notification('error', err)
                                setLoading(false)
                            });

                        for (let path of document.querySelector('#map').children) {
                            path.style = null;
                        }
                        setRegion(true);
                    }}
                >
                    {regionName}
                </Breadcrumb.Item>}
                {districtName && <Breadcrumb.Item>{districtName}</Breadcrumb.Item>}
            </Breadcrumb>
        )
    }

    return (
        <MainCard
            title={t('Map')}
            isOption
            totalSum={totalSum}
            totalSumOut={totalSumOut}
            datechangeHandler={datechangeHandler}
            dateRange={dateRange}
            setDateRange={setDateRange}
        >
            <Space style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <CustomBreadcrumb />
                <div style={{ display: 'inline' }}>
                    <Text
                        // mark
                        strong
                        className='highlighted-text'
                        type="primary"
                        style={{ height: 25, margin: 15, marginLeft: 0 }}
                    >
                        {<ArrowToBottomIcon fill='limegreen' />}&nbsp;
                        {new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
                            .format(totalSum)}
                        <span style={{ color: 'limegreen' }}>UZS</span>
                    </Text>

                    <Text
                        // mark
                        strong
                        className='highlighted-text'
                        type="primary"
                        style={{ height: 35, marginTop: 50 }}
                    >
                        {<ArrowFromBottomIcon fill='dodgerblue' />}&nbsp;
                        {new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
                            .format(totalSumOut)}
                        <span style={{ color: 'dodgerblue' }}>UZS</span>
                    </Text>
                    {region &&
                        <Button
                            style={{ marginLeft: 32 }}
                            icon={<i className="feather icon-globe action-icon" />}
                            onClick={() => {
                                backBtnHandler();
                                setOblastID(null);
                                setRegionID(null);
                            }}
                        >
                            {t("back")}
                        </Button>}
                </div>
            </Space>
            <Spin spinning={loading} size={'large'}>
                <Row gutter={[15, 0]}>
                    <Col lg={districtName ? 12 : 24} md={24}>
                        <div
                            style={{
                                position: 'absolute', top: 0, left: 0, zIndex: 99, width: 168,
                                boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                                padding: '16px', textAlign: 'center', backgroundColor: 'white'
                            }}
                        >
                            <Statistic
                                valueStyle={{ color: 'dodgerblue' }}
                                title={t("totalOrganizations")}
                                value={orgCount}
                                prefix={<BuildingIcon />}
                            />
                        </div>
                        <div
                            style={{
                                position: 'absolute', top: 104, left: 0, zIndex: 99, width: 168,
                                boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                                padding: '16px', textAlign: 'center', backgroundColor: 'white'
                            }}
                        >
                            <Statistic
                                valueStyle={{ color: 'dodgerblue' }}
                                title={t("totalBudgetOrganizations")}
                                value={budgetOrgCount}
                                prefix={<BuildingIcon />}
                            />
                        </div>
                        <div
                            style={{
                                position: 'absolute', bottom: 10, left: 0, zIndex: 99, width: 280,
                                boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                                padding: '16px', textAlign: 'center', backgroundColor: 'white'
                            }}
                        >
                            <Spin spinning={loadingOrgSalary}>
                                <Statistic
                                    valueStyle={{ color: 'dodgerblue', fontSize: '20px' }}
                                    title={t("Salary and equivalent payments")}
                                    value={orgSalary}
                                    prefix={<MoneyIcon />}
                                    suffix=" UZS"
                                    groupSeparator={' '}
                                />
                            </Spin>
                        </div>
                        <div className={classes['svg-wrapper']}  >
                            <svg
                                id='map'
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                x="0px"
                                y="0px"
                                viewBox={region ? '0 0 800 800' : "0 0 792.5 516.9"}
                                // viewBox="0 0 792.5 516.9"
                                xmlSpace="preserve"
                                className={classes[`${region ? 'region-svg-map' : 'svg-map'}`]}
                            >
                                {map.map((item) => {
                                    return (
                                        <Tooltip title={t(item.title)} key={item.id}>
                                            <path
                                                onClick={(e) => {
                                                    const currentData = districtData.filter(district => {
                                                        return district.RegionID === +item.id
                                                    })
                                                    let totalsum = 0;
                                                    let totalsumout = 0;
                                                    currentData.map(sum => {
                                                        if (sum.DocumentType === 1) {
                                                            totalsum += sum.TotalSum;
                                                        } else if (sum.DocumentType === 2) {
                                                            totalsumout += sum.TotalSum;
                                                        }
                                                        return null;
                                                    })
                                                    if (totalsum > 0 && totalsumout > 0) {
                                                        setTotalSum(totalsum)
                                                        setTotalSumOut(totalsumout)

                                                        setOblastData(
                                                            [
                                                                {
                                                                    label: 'UZS',
                                                                    type: t('income'),
                                                                    value: totalsum,
                                                                },
                                                                {
                                                                    label: 'UZS',
                                                                    type: t('expence'),
                                                                    value: totalsumout,
                                                                }
                                                            ]
                                                        )
                                                    }
                                                    // console.log(item);

                                                    // if (item){

                                                    // }

                                                    if (item.districts) {
                                                        setOblastID(item.id)
                                                        setRegionName(currentData[0]?.Region);
                                                    } else setDistrictName(currentData[0]?.Region);

                                                    mapClickHandler(item.districts, item.title, parseInt(item.id));
                                                    for (let path of document.querySelector('#map').children) {
                                                        path.style = null;
                                                    }
                                                    if (!item.districts) {
                                                        districtRef.current.style = 'fill: #3f4d67';
                                                    }
                                                }}
                                                d={item.d}
                                                id={item.id}
                                                className={classes['region']}
                                                ref={districtRef}
                                            // fill={item.fill}
                                            ></path>
                                        </Tooltip>
                                    )
                                })}
                            </svg>
                        </div>
                    </Col>
                    {districtName &&
                        <Col md={24} xl={12} lg={12}>
                            <Card title={`${districtName}`} className={classes['right-card']}>
                                <RegionOrgInfo
                                    data={orgData} organizationData={organizationData}
                                    dateRange={dateRange}
                                    OblastID={OblastID} RegionID={RegionID}
                                    StartDate={StartDate} EndDate={EndDate}
                                />
                            </Card>

                        </Col>
                    }
                </Row>
                <div className={classes['bar-wrapper']}>
                    <CustomBreadcrumb />
                    <Bar data={oblastData ? oblastData : []} {...barConfig} />
                </div>
            </Spin>
        </MainCard >
    );
};

export default Map;