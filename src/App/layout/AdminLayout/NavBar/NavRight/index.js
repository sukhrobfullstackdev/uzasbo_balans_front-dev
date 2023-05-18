import React, { Component } from 'react';
// import { Dropdown } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import i18next from 'i18next';
import { Select, Avatar, Dropdown, Menu, Switch, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import UserServices from '../../../../../services/user/user.services';
import { Notification } from "../../../../../helpers/notifications";

// import ChatList from './ChatList';
// import DEMO from "../../../../../store/constant";
// import CommonServices from "../../../../../services/common/common.services";

// import Avatar1 from '../../../../../assets/images/user/avatar-1.jpg';
// import Avatar2 from '../../../../../assets/images/user/avatar-2.jpg';
// import Avatar3 from '../../../../../assets/images/user/avatar-3.jpg';

const { Option } = Select;

class NavRight extends Component {
  state = {
    listOpen: false,
    signout: false,
    loading: false
  };

  signout = () => {
    this.setState({ loading: true })
    UserServices.logout()
      .then(res => res)
      .catch(err => err)
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    window.location.href = '/auth';
  }

  langChange = (lang) => {
    // let comingLang = lang;
    // if (lang === 'uzCyrl') {
    //   comingLang = 'uz-cyrl'
    // } else if (lang === 'uzLat') {
    //   comingLang = 'uz-lat'
    // }
    i18next.changeLanguage(lang)
      .catch(err => Notification('error', err))
    // CommonServices.postLang({ lang: comingLang }) 
  }

  themeChangeHandler = (e) => {
    if (e) {
      localStorage.setItem('theme', 'dark');
      document.querySelector('body').classList.add('datta-dark')
    } else {
      localStorage.removeItem('theme');
      document.querySelector('body').classList.remove('datta-dark')
    }
  }

  render() {
    const { t } = this.props;
    let initialLang = localStorage.i18nextLng;
    const { loading } = this.state;

    //  const antIcon = () => {
    //     (
    //       <LoadingOutlined
    //         style={{
    //           fontSize: 24,
    //         }}
    //         spin
    //       />
    //     )
    //   };

    const menu = (
      <Menu
        items={[
          {
            label: (
              <span onClick={() => this.signout()}>
                <i className="feather icon-log-out" />
                &nbsp;
                {t("Logout")}
              </span>
            ),
            key: "1"
          }
        ]}
      />
    );

    return (
      <>
        <ul className="navbar-nav xl-auto ml-0 mt-3 mb-3">
          <li>
            <Select
              suffixIcon={<i className="icon feather icon-globe" />}
              defaultValue={initialLang}
              style={{ width: 120 }}
              onChange={this.langChange}
              getPopupContainer={trigger => trigger.parentNode}
            >
              <Option value="uzLat">O'zbek</Option>
              <Option value="uzCyrl">Ўзбек</Option>
              <Option value="ru">Русский</Option>
              <Option value="en">English</Option>
            </Select>
          </li>
          <li>
            <Switch
              checkedChildren={<i className="far fa-sun" />}
              unCheckedChildren={<i className="far fa-moon" />}
              size='large'
              onChange={this.themeChangeHandler}
              defaultChecked={localStorage.getItem('theme') ? true : false} />
          </li>
          <li>
            {loading && <span><Spin indicator={<LoadingOutlined/>}/></span>}
            {!loading && <Dropdown overlay={menu}>

              <Avatar icon={<i className="icon feather icon-user" />} style={{ cursor: 'pointer' }} />
            </Dropdown>}
          </li>
          {/* <li>
            <Dropdown alignRight={!this.props.rtlLayout}>
              <Dropdown.Toggle variant={'link'} id="dropdown-basic">
                <i className="icon feather icon-bell" />
              </Dropdown.Toggle>
              <Dropdown.Menu alignRight className="notification">
                <div className="noti-head">
                  <h6 className="d-inline-block m-b-0">Notifications</h6>
                  <div className="float-right">
                    <a href={DEMO.BLANK_LINK} className="m-r-10">mark as read</a>
                    <a href={DEMO.BLANK_LINK}>clear all</a>
                  </div>
                </div>
                <ul className="noti-body">
                  <li className="n-title">
                    <p className="m-b-0">NEW</p>
                  </li>
                  <li className="notification">
                    <div className="media">
                      <img className="img-radius" src={Avatar1} alt="Generic placeholder" />
                      <div className="media-body">
                        <p><strong>John Doe</strong><span className="n-time text-muted"><i
                          className="icon feather icon-clock m-r-10" />30 min</span></p>
                        <p>New ticket Added</p>
                      </div>
                    </div>
                  </li>
                  <li className="n-title">
                    <p className="m-b-0">EARLIER</p>
                  </li>
                  <li className="notification">
                    <div className="media">
                      <img className="img-radius" src={Avatar2} alt="Generic placeholder" />
                      <div className="media-body">
                        <p><strong>Joseph William</strong><span className="n-time text-muted"><i
                          className="icon feather icon-clock m-r-10" />30 min</span></p>
                        <p>Prchace New Theme and make payment</p>
                      </div>
                    </div>
                  </li>
                  <li className="notification">
                    <div className="media">
                      <img className="img-radius" src={Avatar3} alt="Generic placeholder" />
                      <div className="media-body">
                        <p><strong>Sara Soudein</strong><span className="n-time text-muted"><i
                          className="icon feather icon-clock m-r-10" />30 min</span></p>
                        <p>currently login</p>
                      </div>
                    </div>
                  </li>
                </ul>
                <div className="noti-footer">
                  <a href={DEMO.BLANK_LINK}>show all</a>
                </div>
              </Dropdown.Menu>
            </Dropdown>
          </li> */}
          {/* <li className={this.props.rtlLayout ? 'm-r-15' : 'm-l-15'}>
            <a href={DEMO.BLANK_LINK} className="displayChatbox" onClick={() => { this.setState({ listOpen: true }); }}><i className="icon feather icon-mail" /></a>
          </li> */}
          {/* <li>
             <Dropdown alignRight={!this.props.rtlLayout} className="drp-user">
              <Dropdown.Toggle variant={'link'} id="dropdown-basic">
                <Avatar icon={<i className="icon feather icon-user" />} />
              </Dropdown.Toggle>
              <Dropdown.Menu alignRight className="profile-notification">
                <div className="pro-head">
                  <img src={Avatar1} className="img-radius" alt="User Profile" />
                  <span>John Doe</span>
                  <a
                    href={DEMO.BLANK_LINK}
                    className="dud-logout"
                    title="Logout"
                    onClick={(e) => this.signout(e)}>
                    <i className="feather icon-log-out" />
                  </a>
                </div>
                <ul className="pro-body">
                  <li><Link to='/change-pwd' className="dropdown-item"><i className="feather icon-settings" />{t('change-pwd')}</Link></li>
                  <li><a href={DEMO.BLANK_LINK} className="dropdown-item"><i className="feather icon-user" /> Profile</a></li>
                  <li><a href={DEMO.BLANK_LINK} className="dropdown-item"><i className="feather icon-mail" /> My Messages</a></li>
                  <li><a href={DEMO.BLANK_LINK} className="dropdown-item"><i className="feather icon-lock" /> Lock Screen</a></li>
                </ul>
              </Dropdown.Menu>
            </Dropdown> 
        </li> */}
        </ul>
        {/* <ChatList listOpen={this.state.listOpen} closed={() => { this.setState({ listOpen: false }); }} /> */}
      </>
    );
  }
}

export default withTranslation()(withRouter(NavRight));
