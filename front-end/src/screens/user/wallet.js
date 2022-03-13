import React, { useState } from 'react';
import {
    Nav, NavItem, Container, Row, NavLink
} from 'reactstrap';
import { Link } from 'react-router-dom';

import TopMenu from '../../components/common/topMenu';
import Footer from '../../components/common/footer';
import { onChangeTabWallet } from '../../common/changeLink';
import Info from '../../components/wallet/info';
import ReCharge from '../../components/wallet/recharge';
import Withdrawal from '../../components/wallet/withdrawal';

export default function Wallet() {
    const [tab, setTab] = useState(1);

    const onChangeTab = (tab) => {
        onChangeTabWallet(tab);
        setTab(tab);
    }

    return (
        <div>
            {
                tab === 1 ? <TopMenu searchWallet /> : <TopMenu />
            }

            <Nav pills className="restaurant-detail-nav container">
                <NavItem >
                    <Link to={`/users/profile`}>Hồ sơ</Link>
                </NavItem>
                <NavItem>
                    <Link to={`/users/profile/order`}>Đơn của tôi</Link>
                </NavItem>
                <NavItem>
                    <Link to={`/users/profile/my-restaurant`}>Nhà hàng của tôi</Link>
                </NavItem>
                <NavItem className="active">
                    <Link to={`/users/profile/wallet`}>Ví FBS</Link>
                </NavItem>
            </Nav>
            <Container>
                <Nav pills className="order-nav-status">
                    <NavItem onClick={() => onChangeTab(1)}>
                        <NavLink active id="1">Thông tin</NavLink>
                    </NavItem>
                    <NavItem onClick={() => onChangeTab(2)}>
                        <NavLink id="2">Nạp tiền</NavLink>
                    </NavItem>
                    <NavItem onClick={() => onChangeTab(3)}>
                        <NavLink id="3">Rút tiền</NavLink>
                    </NavItem>
                </Nav>
                {
                    tab === 1 && <Row className="wallet-row">
                        <Info />
                    </Row>
                }
                {
                    tab === 2 && <Row className="wallet-row">
                        <ReCharge />
                    </Row>
                }
                {
                    tab === 3 && <Row className="wallet-row">
                        <Withdrawal />
                    </Row>
                }
            </Container>
            <Footer />
        </div>
    )
}
