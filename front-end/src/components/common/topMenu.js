/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
    Collapse, Modal, ModalHeader, ModalBody, ModalFooter,
    Navbar, NavbarToggler, NavbarBrand, Nav, NavItem,
    CardImg, Button
} from "reactstrap";

import { Link, Redirect } from "react-router-dom";
import image from '../../images/logo_header-removebg-preview.png';
import userImage from '../../images/default-avatar-user.png';
import { api, url } from '../../config/axios';
import { FaBell, FaSearch } from "react-icons/fa";

import NotificationItem from "./notificationItem";

const TopMenu = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDisplay, setIsDisplay] = useState(false);
    const [currentUser, setCurrentUser] = useState();
    const [avatar, setAvatar] = useState();
    const [notifications, setNotifications] = useState([]);
    const [isLogout, setIsLogout] = useState(false);
    const [modal1, setModal1] = useState(false);

    const toggle1 = () => setModal1(!modal1);

    const toggle = () => setIsOpen(!isOpen);

    useEffect(() => {
        loadData();
    }, [])

    const loadData = () => {
        api.get(`/users/findByPhoneNumber/${localStorage.getItem('currentUser')}`)
            .then(res => {
                let user = res.data;
                setCurrentUser(user);
                if (user !== null && user !== undefined && user !== '') {
                    localStorage.setItem('userId', user.id);
                    if (user.role.name === 'ROLE_PROVIDER') {
                        api.get(`/notifications/getNotifications?customerId=${user.id}&providerId=${user.id}&isAdmin=0`)
                            .then(res => {
                                setNotifications(res.data);
                            })
                    }
                }

                api.get(`/users/profile/?userId=${user.id}`, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(res => {
                    if (res.data.image_id === '') {
                        setAvatar(<CardImg className="user-top-menu-image" top src={userImage} />);
                    } else {
                        setAvatar(<CardImg className="user-top-menu-image" top src={url + '/images/' + res.data.image_id} />)
                    }
                })
            });
    }

    const logout = (e) => {
        e.preventDefault();
        localStorage.removeItem('userId');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        localStorage.removeItem('resId');
        localStorage.removeItem('react-use-cart');
        localStorage.clear();
        setIsLogout(true);
    }

    const displayNotify = () => {
        setIsDisplay(!isDisplay);
        if (!isDisplay) {
            loadData();
            document.getElementById('notification').style.display = "flex";
        } else {
            document.getElementById('notification').style.display = "none";
        }
    }

    const displaySearch = (type) => {
        if (type === 'searchRes') {
            let element = document.getElementById('result-search');
            let element1 = document.getElementById('search-content');

            if (element !== undefined && element !== null) {
                if (element.style.display === "none") {
                    element.style.display = "flex";
                    if (element1 !== undefined && element1 !== null) {
                        element1.style.marginTop = '270px';
                    }
                } else {
                    if (element1 !== undefined && element1 !== null) {
                        element1.style.marginTop = '80px';
                    }
                    element.style.display = "none";
                }
            }
        } else if (type === 'searchResMenu') {
            let element = document.getElementById('menu-search');

            if (element !== undefined && element !== null) {
                if (element.style.display === "none" || element.style.display === "") {
                    element.style.display = "flex";
                } else {
                    element.style.display = "none";
                }
            }
        } else if (type === 'searchResService') {
            let element = document.getElementById('service-search');

            if (element !== undefined && element !== null) {
                if (element.style.display === "none" || element.style.display === "") {
                    element.style.display = "flex";
                } else {
                    element.style.display = "none";
                }
            }
        } else if (type === 'searchWallet') {
            let element = document.getElementById('wallet-search');

            if (element !== undefined && element !== null) {
                if (element.style.display === "none" || element.style.display === "") {
                    element.style.display = "flex";
                } else {
                    element.style.display = "none";
                }
            }
        }
    }

    return (
        <div>
            <Navbar dark className="top-menu" expand="xl">
                <NavbarBrand className="logo">
                    <Link to="/"> <CardImg src={image} alt="Logo" />
                    </Link>
                </NavbarBrand>
                <div className="option">
                    {
                        props.searchRes && <div className="icon-search-top" onClick={() => displaySearch('searchRes')}>
                            <FaSearch />
                        </div>
                    }

                    {
                        props.searchResMenu && <div className="icon-search-top" onClick={() => displaySearch('searchResMenu')}>
                            <FaSearch />
                        </div>
                    }

                    {
                        props.searchResService && <div className="icon-search-top" onClick={() => displaySearch('searchResService')}>
                            <FaSearch />
                        </div>
                    }

                    {
                        props.searchWallet && <div className="icon-search-top" onClick={() => displaySearch('searchWallet')}>
                            <FaSearch />
                        </div>
                    }
                    <NavbarToggler onClick={toggle} color="success" />
                </div>
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="mr-auto nav" navbar>
                        <div className="nav-section">
                            <NavItem>
                                <Link className="link" to="/">Trang chủ</Link>
                            </NavItem>
                            <NavItem>
                                <Link className="link" to="/promotion">Ưu đãi hôm nay</Link>
                            </NavItem>
                            {
                                currentUser &&
                                <NavItem>
                                    <Link className="link" to="/provider-register">Đăng ký nhà hàng</Link>
                                </NavItem>
                            }
                        </div>
                        {currentUser ? (
                            <div className="authen">
                                <NavItem className="icon-bell">
                                    <FaBell onClick={displayNotify} />
                                    {
                                        notifications.length > 0 &&
                                        <span className="icon-bell-dot"></span>
                                    }
                                    <div className="notification" id="notification">
                                        <h5 className="notification-title">Thông báo</h5>
                                        <hr />
                                        <div className="notification-list">
                                            {
                                                notifications.length > 0 ? (notifications.map((notification, index) => {
                                                    return <NotificationItem key={index} notification={notification} loadData={loadData} />
                                                })) : (
                                                    <h5>Không có thông báo nào </h5>
                                                )
                                            }
                                        </div>
                                    </div>
                                </NavItem>
                                <NavItem>
                                    <Link
                                        className="link"
                                        onClick={() => {
                                            localStorage.setItem('userId', '');
                                            localStorage.setItem('userId', currentUser.id);
                                        }}
                                        to={{
                                            pathname: `/users/profile`,
                                            state: { userId: localStorage.getItem('userId') }
                                        }}
                                    >
                                        {avatar}
                                        {currentUser.name}
                                    </Link>
                                </NavItem>
                                <NavItem>
                                    <Button className="link" color="transparent" onClick={toggle1}>Đăng xuất</Button>
                                    <Modal isOpen={modal1} toggle={toggle1} className={``}>
                                        <ModalHeader toggle={toggle1}>Thông báo</ModalHeader>
                                        <ModalBody>
                                            Bạn có chắc chắn muốn đăng xuất ?
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button className="btn btn-success" onClick={logout} to="/">Đồng ý</Button>
                                            <Button color="secondary" onClick={toggle1}>Quay lại</Button>
                                        </ModalFooter>
                                    </Modal>
                                </NavItem>
                            </div>
                        ) : (
                            <div className="authen">
                                <NavItem>
                                    <Link className="link" to="/login">Đăng nhập</Link>
                                </NavItem>
                                <NavItem>
                                    <Link className="link" to="/register">Đăng ký</Link>
                                </NavItem>
                            </div>)}
                    </Nav>
                </Collapse>
            </Navbar>
            {
                isLogout && <Redirect to={{
                    pathname: "/login"
                }} />
            }
        </div>
    );
};

export default TopMenu;
