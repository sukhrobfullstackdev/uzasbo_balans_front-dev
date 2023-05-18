import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import { Dropdown } from 'react-bootstrap';
import windowSize from 'react-window-size';
import { Typography } from 'antd';
import { withTranslation } from "react-i18next";


// import DEMO from "../../../../../store/constant";
// import * as actionTypes from "../../../../../store/actions";

const { Title, Text } = Typography;

class NavLeft extends Component {

  render() {
    // let iconFullScreen = ['feather'];
    // iconFullScreen = (this.props.isFullScreen) ? [...iconFullScreen, 'icon-minimize'] : [...iconFullScreen, 'icon-maximize'];

    // let navItemClass = ['nav-item'];
    // if (this.props.windowWidth <= 575) {
    //   navItemClass = [...navItemClass, 'd-none'];
    // }
    // let dropdownRightAlign = false;
    // if (this.props.rtlLayout) {
    //   dropdownRightAlign = true;
    // }
    const { t } = this.props;

    return (
      <>
        <ul className="navbar-nav mr-auto">
          <li>
            <Title level={4} style={{ marginBottom: '0' }}>{t("Organizaion")} {localStorage.getItem('userInfo') ? `${JSON.parse(localStorage.getItem('userInfo')).OrgInfo}(${JSON.parse(localStorage.getItem('userInfo')).OrgID})` : ''}</Title>
          </li>
          <li>
            <Text type="secondary">{t("User")} {localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).UserName : ''}</Text>
          </li>
          {/* <li>
            <a href={DEMO.BLANK_LINK} className="full-screen" onClick={this.props.onFullScreen}>
              <i className={iconFullScreen.join(' ')} />
            </a>
          </li> */}
          {/* <li className={navItemClass.join(' ')}>
                        <Dropdown alignRight={dropdownRightAlign}>
                            <Dropdown.Toggle variant={'link'} id="dropdown-basic">
                                Dropdown
                            </Dropdown.Toggle>
                            <ul>
                                <Dropdown.Menu>
                                    <li><a className="dropdown-item" href={DEMO.BLANK_LINK}>Action</a></li>
                                    <li><a className="dropdown-item" href={DEMO.BLANK_LINK}>Another action</a></li>
                                    <li><a className="dropdown-item" href={DEMO.BLANK_LINK}>Something else here</a></li>
                                </Dropdown.Menu>
                            </ul>
                        </Dropdown>
                    </li> */}
          {/* <li className="nav-item"><NavSearch/></li> */}

        </ul>
      </>
    );
  }
}

// const mapStateToProps = state => {
//   return {
//     isFullScreen: state.isFullScreen,
//     rtlLayout: state.rtlLayout
//   }
// };

// const mapDispatchToProps = dispatch => {
//   return {
//     onFullScreen: () => dispatch({ type: actionTypes.FULL_SCREEN }),
//   }
// };

export default withTranslation()(windowSize(NavLeft));
