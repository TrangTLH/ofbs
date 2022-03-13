import React, { useState } from 'react';
import SlideBar from '../../components/admin/SlideBar';
import { FaBars } from 'react-icons/fa';
import {
    Container, Nav, NavItem, NavLink,
    Row
} from 'reactstrap';
import { Link } from 'react-router-dom';

import Notification from '../../components/admin/Notification';
import { onChangeAdminTabRestaurant } from '../../common/changeLink';
import RestaurantView from '../../components/admin/RestaurantView';
import RestaurantPending from '../../components/admin/RestaurantPending';

function Restaurant() {
    const [toggled, setToggled] = useState(false);
    const handleToggleSidebar = (value) => {
        setToggled(value);
    };

    const [tab, setTab] = useState(1);

    const onChangeTab = (tab) => {
        onChangeAdminTabRestaurant(tab);
        setTab(tab);
    }

    const Logout = () => {
        localStorage.clear();
    }

    return (
        <div className={`admin ${toggled ? 'toggled' : ''}`}>
            <SlideBar
                toggled={toggled}
                handleToggleSidebar={handleToggleSidebar}
                inComponent="restaurant"
            />

            <div className="main">
                <div className="navbar-top">
                    <div className="btn-toggle" onClick={() => handleToggleSidebar(true)}>
                        <FaBars />
                    </div>
                    <div className="admin-nav-number-user"></div>
                    <div className="admin-nav-infor">
                        <Notification />
                        <Link className="btn btn-primary" to='/login' onClick={Logout}>Đăng xuất</Link>
                    </div>
                </div>
                <Container className="admin-res-content">
                    <Nav pills className="order-nav-status">
                        <NavItem onClick={() => onChangeTab(1)}>
                            <NavLink active id="1">Các nhà hàng đang chờ duyệt</NavLink>
                        </NavItem>
                        <NavItem onClick={() => onChangeTab(2)}>
                            <NavLink id="2">Các nhà hàng trong hệ thống</NavLink>
                        </NavItem>
                    </Nav>
                    {
                        tab === 2 && <Row className="wallet-row">
                            <RestaurantView isPending={false}/>
                        </Row>
                    }
                    {
                        tab === 1 && <Row className="wallet-row">
                            <RestaurantPending isPending={true}/>
                        </Row>
                    }
                </Container>
            </div>
        </div>
    )
}

export default Restaurant;