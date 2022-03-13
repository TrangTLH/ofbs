import React, { useState } from 'react';
import {
    Container, Nav, NavItem, NavLink,
    Row
} from 'reactstrap';
import { FaBars, FaSearch } from 'react-icons/fa';
import SlideBar from '../../components/admin/SlideBar';
import { Link } from 'react-router-dom';

import Notification from '../../components/admin/Notification';
import { onChangeAdminTabWallet } from '../../common/changeLink';
import WalletManageRecharge from '../../components/admin/WalletManageRecharge';
import WalletManageWithdrawal from '../../components/admin/WalletManageWithdrawal';
import Info from '../../components/wallet/info';

export default function Wallet() {
    const [toggled, setToggled] = useState(false);

    const handleToggleSidebar = (value) => {
        setToggled(value);
    };

    const Logout = () => {
        localStorage.clear();
    }

    const [tab, setTab] = useState(1);

    const onChangeTab = (tab) => {
        onChangeAdminTabWallet(tab);
        setTab(tab);
    }

    return (
        <div className={`admin ${toggled ? 'toggled' : ''}`}>
            <SlideBar
                toggled={toggled}
                handleToggleSidebar={handleToggleSidebar}
                inComponent="wallet"
            />

            <div className="main">
                <div className="navbar-top">
                    <div className="btn-toggle" onClick={() => handleToggleSidebar(true)}>
                        <FaBars />
                    </div>
                    <div className="admin-nav-number-user"></div>
                    <div className="admin-nav-infor"><div
                        className="admin-icon-search"
                        onClick={() => {
                            let element = document.getElementById('admin-wallet-search');
                            let element1 = document.getElementById('admin-wallet-content');
                            let element2 = document.getElementById('wallet-search');

                            if (element !== undefined && element !== null) {
                                if (element.style.display === "none" || element.style.display === "") {
                                    element.style.display = "flex";
                                    if (element1 !== undefined && element1 !== null) {
                                        if (tab === 2) {
                                            element1.style.marginTop = '210px';
                                        } else if (tab === 3) {
                                            element1.style.marginTop = '165px';
                                        } else if (tab === 1) {
                                            element1.style.marginTop = '100px';
                                        }
                                    }
                                } else {
                                    element.style.display = "none";
                                    if (element1 !== undefined && element1 !== null) {
                                        element1.style.marginTop = '100px';
                                    }
                                }
                            } else if (element2 !== undefined && element2 !== null) {
                                if (element2.style.display === "none" || element2.style.display === "") {
                                    element2.style.display = "flex";
                                } else {
                                    element2.style.display = "none";
                                }
                            }
                        }
                        }
                    >
                        <FaSearch />
                    </div>
                        <Notification />
                        <Link className="btn btn-primary" to='/login' onClick={Logout}>Đăng xuất</Link>
                    </div>
                </div>
                <Container className="admin-wallet-content" id="admin-wallet-content">
                    <Nav pills className="order-nav-status">
                        <NavItem onClick={() => onChangeTab(1)}>
                            <NavLink active id="1">Lịch sử giao dịch</NavLink>
                        </NavItem>
                        <NavItem onClick={() => onChangeTab(2)}>
                            <NavLink id="2">Quản lý nạp tiền</NavLink>
                        </NavItem>
                        <NavItem onClick={() => onChangeTab(3)}>
                            <NavLink id="3">Quản lý rút tiền</NavLink>
                        </NavItem>
                    </Nav>
                    {
                        tab === 1 && <Row className="wallet-row">
                            <Info />
                        </Row>
                    }
                    {
                        tab === 2 && <Row className="wallet-row">
                            <WalletManageRecharge />
                        </Row>
                    }
                    {
                        tab === 3 && <Row className="wallet-row">
                            <WalletManageWithdrawal />
                        </Row>
                    }
                </Container>
            </div>
        </div>
    )
}
