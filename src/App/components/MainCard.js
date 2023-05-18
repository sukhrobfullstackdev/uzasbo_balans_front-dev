import React, { useState } from 'react';
import { Card, Collapse } from 'react-bootstrap';
import windowSize from 'react-window-size';
import { Typography, DatePicker, Button, Form, Checkbox, } from 'antd';
import { useTranslation } from "react-i18next";
import moment from "moment";
import { ExchangeIcon } from '../views/MainPage/components/SvgIcons';

const { Title, Text } = Typography;

const MainCard = (props) => {
    //console.log(props);
    const [mainForm] = Form.useForm();
    const { t } = useTranslation();

    const [fullCard, setFullCard] = useState(false);
    const [collapseCard, setCollapseCard] = useState(false);
    const [loadCard, setLoadCard] = useState(false);
    const [cardRemove, setCardRemove] = useState(false);

    const cardReloadHandler = () => {
        setLoadCard(true);
        setInterval(() => {
            setLoadCard(false);
        }, 3000);
    };

    const cardRemoveHandler = () => {
        setCardRemove(true);
    };

    const onChange = (e) => {
        props.setDateRange(e.target.checked)
    };

    let fullScreenStyle, loader, cardHeaderRight, cardHeader;
    let card = '';
    let cardClass = [];

    if (props.isOption) {
        // this.props.spinning
        cardHeaderRight = (

            <div className="card-header-right">
                {/* {t('search')}: &nbsp; */}
                <Form
                    form={mainForm}
                    id='mainForm'
                    initialValues={{
                        Date: moment().subtract(1, "days"),
                        StartDate: moment().subtract(1, "days"),
                        EndDate: moment(),
                    }}
                    onFinish={props.datechangeHandler}
                >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Form.Item>
                            <Checkbox onChange={onChange}>{t('dateRange')}</Checkbox>
                        </Form.Item>
                        {props.dateRange ? (
                            <>
                                <Form.Item
                                    // label={t('StartDate')}
                                    name="StartDate"
                                >
                                    <DatePicker
                                        id="dashboard_start_date"
                                        format="DD.MM.YYYY"
                                        // onChange={props.datechangeHandler}
                                        // defaultValue={moment().subtract(1, "days")}
                                        placeholder={t("StartDate")}
                                    // style={{ marginRight: 20, marginBottom: 10 }}
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <ExchangeIcon />
                                </Form.Item>
                                <Form.Item
                                    // label={t('EndDate')}
                                    name="EndDate"
                                >
                                    <DatePicker
                                        id="dashboard_end_date"
                                        format="DD.MM.YYYY"
                                        // onChange={props.datechangeHandler}
                                        // defaultValue={moment()}
                                        placeholder={t("EndDate")}
                                    // style={{ marginRight: 20, marginBottom: 10 }}
                                    />
                                </Form.Item>
                            </>
                        ) : (
                            <>
                                <Form.Item
                                    // label={t('StartDate')}
                                    name="Date"
                                >
                                    <DatePicker
                                        id="dashboard_start_date"
                                        format="DD.MM.YYYY"
                                        // onChange={props.datechangeHandler}
                                        // defaultValue={moment().subtract(1, "days")}
                                        placeholder={t("StartDate")}
                                    // style={{ marginRight: 20, marginBottom: 10 }}
                                    />
                                </Form.Item>
                            </>
                        )}
                        <Form.Item>
                            <Button type="primary" htmlType="submit" icon={<i className="feather icon-refresh-ccw" />} />
                        </Form.Item>
                    </div>
                </Form>
                {/* <Text
                    // mark
                    strong
                    underline
                    className='highlighted-text'
                    type="primary"
                    style={{ height: 25, margin: 15, marginLeft: 0 }}
                >
                    {<ArrowDownOutlined style={{ color: "Green", fontSize: '28px' }} />}{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(props.totalSum)}
                </Text>

                <Text
                    // mark
                    strong
                    underline
                    className='highlighted-text'
                    type="primary"
                    style={{ height: 35, marginTop: 50 }}
                >
                    {<ArrowUpOutlined style={{ color: "red", fontSize: '28px' }} />}{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(props.totalSumOut)}
                </Text> */}

                {/* <h1>Hello</h1> */}
                {/* <Dropdown alignRight={true} className="btn-group card-option">
            <Dropdown.Toggle id="dropdown-basic" className="btn-icon">
              <i className="feather icon-more-horizontal" />
            </Dropdown.Toggle>
            <Dropdown.Menu as='ul' className="list-unstyled card-option">
              <Dropdown.Item as='li' className="dropdown-item" onClick={() => { this.setState(prevState => { return { fullCard: !prevState.fullCard } }) }}>
                <i className={this.state.fullCard ? 'feather icon-minimize' : 'feather icon-maximize'} />
                <a href={DEMO.BLANK_LINK}> {this.state.fullCard ? 'Restore' : 'Maximize'} </a>
              </Dropdown.Item>
              <Dropdown.Item as='li' className="dropdown-item" onClick={() => { this.setState(prevState => { return { collapseCard: !prevState.collapseCard } }) }}>
                <i className={this.state.collapseCard ? 'feather icon-plus' : 'feather icon-minus'} />
                <a href={DEMO.BLANK_LINK}> {this.state.collapseCard ? 'Expand' : 'Collapse'} </a>
              </Dropdown.Item>
              <Dropdown.Item as='li' className="dropdown-item" onClick={this.cardReloadHandler}>
                <i className='feather icon-refresh-cw' />
                <a href={DEMO.BLANK_LINK}> Reload </a>
              </Dropdown.Item>
              <Dropdown.Item as='li' className="dropdown-item" onClick={this.cardRemoveHandler}>
                <i className='feather icon-trash' />
                <a href={DEMO.BLANK_LINK}> Remove </a>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown> */}
            </div>
        );
    }

    cardHeader = (
        <Card.Header style={{ display: 'flex' }}>
            <Title level={5}>{props.title}</Title>
            {/* <Card.Title as='h5'>{cardHeaderRight}</Card.Title> */}
            {cardHeaderRight}

        </Card.Header>
    );

    if (fullCard) {
        cardClass = [...cardClass, 'full-card'];
        fullScreenStyle = { position: 'fixed', top: 0, left: 0, right: 0, width: props.windowWidth, height: props.windowHeight };
    }

    if (loadCard) {
        cardClass = [...cardClass, 'card-load'];
        loader = (
            <div className="card-loader">
                <i className="pct-loader1 anim-rotate" />
            </div>
        );
    }

    if (cardRemove) {
        cardClass = [...cardClass, 'd-none'];
    }

    if (props.cardClass) {
        cardClass = [...cardClass, props.cardClass];
    }

    card = (
        <Card className={cardClass.join(' ')} style={fullScreenStyle}>
            {cardHeader}
            <Collapse in={!collapseCard}>
                <div>
                    <Card.Body>
                        {props.children}
                    </Card.Body>
                </div>
            </Collapse>
            {loader}
        </Card>
    );

    return (
        <>
            {card}
        </>
    );
}

export default windowSize(MainCard);
