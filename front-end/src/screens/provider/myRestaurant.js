import React, { Component } from 'react';
import { Nav, NavItem, Container, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import { api } from '../../config/axios';

import TopMenu from '../../components/common/topMenu';
import Footer from '../../components/common/footer';
import MyRestaurantItem from '../../components/provider/myRestaurantItem';
import Messenger from '../../components/common/messenger';

let userId = '';

export default class myRestaurant extends Component {
    constructor(props) {
        super(props);

        this.state = {
            role: '',
            restaurantActive: [],
            restaurantInactive: [],
            restaurantPending: [],
            restaurantBanned: [],
            restaurantCancelled: []
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        userId = localStorage.getItem('userId');
        api.get(`/users/findByPhoneNumber/${localStorage.getItem('currentUser')}`)
            .then(res => {
                this.setState({ role: res.data.role.name })
            })

        api.get(`/restaurants/getRestaurantByProviderId?providerId=${userId}&statusId=1`)
            .then(res => {
                this.setState({ restaurantActive: res.data })
            })

        api.get(`/restaurants/getRestaurantByProviderId?providerId=${userId}&statusId=2`)
            .then(res => {
                this.setState({ restaurantInactive: res.data })
            })

        api.get(`/restaurants/getRestaurantByProviderId?providerId=${userId}&statusId=3`)
            .then(res => {
                this.setState({ restaurantPending: res.data })
            })

        api.get(`/restaurants/getRestaurantByProviderId?providerId=${userId}&statusId=4`)
            .then(res => {
                this.setState({ restaurantCancelled: res.data })
            })

        api.get(`/restaurants/getRestaurantByProviderId?providerId=${userId}&statusId=5`)
            .then(res => {
                this.setState({ restaurantBanned: res.data })
            })
    }

    render() {
        const { restaurantActive, restaurantInactive, restaurantPending,
            restaurantBanned, restaurantCancelled, role
        } = this.state;

        return (
            <div>
                <TopMenu />
                <Nav pills className="restaurant-detail-nav container">
                    <NavItem>
                        <Link to={`/users/profile`}>Hồ sơ</Link>
                    </NavItem>
                    <NavItem>
                        <Link to={`/users/profile/order`}>Đơn của tôi</Link>
                    </NavItem>
                    <NavItem className="active">
                        <Link to={`/users/profile/my-restaurant`}>Nhà hàng của tôi</Link>
                    </NavItem>
                    <NavItem>
                        <Link to={`/users/profile/wallet`}>Ví FBS</Link>
                    </NavItem>
                </Nav>
                {
                    role === 'ROLE_CUSTOMER' ?
                        <Container>
                            <h5 className="mt-4 mb-4">Bạn cần đăng ký nhà hàng để sử dụng chức năng này !</h5>
                        </Container> :
                        <Container>
                            <Row className="restaurant-row">
                                <h3 className="restaurant-row-title">
                                    Nhà hàng đang chờ duyệt <hr />
                                </h3>

                                {restaurantPending.length > 0 ? (
                                    restaurantPending.map((restaurant, index) => {
                                        return <Col lg="3" md="4" sm="12" key={index}>
                                            <MyRestaurantItem restaurant={restaurant} />
                                        </Col>
                                    })
                                ) : (
                                    <h5 className="restaurant-message">Không có nhà hàng nào đang chờ duyệt</h5>
                                )}
                            </Row>
                            <Row className="restaurant-row">
                                <h3 className="restaurant-row-title">
                                    Nhà hàng đang hoạt động <hr />
                                </h3>

                                {restaurantActive.length > 0 ? (
                                    restaurantActive.map((restaurant, index) => {
                                        return <Col lg="3" md="4" sm="12" key={index}>
                                            <MyRestaurantItem restaurant={restaurant} />
                                        </Col>
                                    })
                                ) : (
                                    <h5 className="restaurant-message">Không có nhà hàng nào đang hoạt động</h5>
                                )}
                            </Row>
                            <Row className="restaurant-row">
                                <h3 className="restaurant-row-title">
                                    Nhà hàng đã ngừng hoạt động
                                    <hr />
                                </h3>
                                {restaurantInactive.length > 0 ? (
                                    restaurantInactive.map((restaurant, index) => {
                                        return <Col lg="3" md="4" sm="12" key={index}>
                                            <MyRestaurantItem restaurant={restaurant} />
                                        </Col>
                                    })
                                ) : (
                                    <h5 className="restaurant-message">Không có nhà hàng nào ngừng hoạt động</h5>
                                )}
                            </Row>
                            <Row className="restaurant-row">
                                <h3 className="restaurant-row-title">
                                    Nhà hàng không được duyệt
                                    <hr />
                                </h3>
                                {restaurantCancelled.length > 0 ? (
                                    restaurantCancelled.map((restaurant, index) => {
                                        return <Col lg="3" md="4" sm="12" key={index}>
                                            <MyRestaurantItem restaurant={restaurant} />
                                        </Col>
                                    })
                                ) : (
                                    <h5 className="restaurant-message">Không có nhà hàng không được duyệt</h5>
                                )}
                            </Row>
                            <Row className="restaurant-row">
                                <h3 className="restaurant-row-title">
                                    Nhà hàng đã bị chặn
                                    <hr />
                                </h3>
                                {restaurantBanned.length > 0 ? (
                                    restaurantBanned.map((restaurant, index) => {
                                        return <Col lg="3" md="4" sm="12" key={index}>
                                            <MyRestaurantItem restaurant={restaurant} />
                                        </Col>
                                    })
                                ) : (
                                    <h5 className="restaurant-message">Không có nhà hàng nào bị chặn</h5>
                                )}
                            </Row>
                        </Container>
                }
                <Footer />
                <Messenger />
            </div>
        )
    }
}
