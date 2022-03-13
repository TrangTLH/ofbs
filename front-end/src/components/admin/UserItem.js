import React, { useState } from 'react';
import {
    Button, Modal, ModalHeader, ModalBody,
    ModalFooter,
    Row,
    Col,
    CardImg,
    Container,
    Table
} from 'reactstrap';

import imageUser from '../../images/default-avatar-user.png';
import { api, url } from '../../config/axios';
import { formatDate } from '../../common/formatDate';
import RestaurantPendingItem from './RestaurantItem';

export default function UserItem(props) {
    const user = props.user;
    const count = props.count;
    let currentPage = props.currentPage;
    let role = user.role.name;
    let status = user.status.name;
    let image = '';

    const [usereDetail, setUserDetail] = useState('');
    const [modal, setModal] = useState(false);
    const [modal1, setModal1] = useState(false);
    const [modal2, setModal2] = useState(false);
    const [modal3, setModal3] = useState(false);
    const [restaurants, setRestaurants] = useState([]);

    const toggle = () => {
        setModal(!modal);

        if (!modal) {
            viewDetailUser(user.id);
        }
    }

    const toggle1 = () => {
        setModal1(!modal1);
    }

    const toggle2 = () => {
        setModal2(!modal2);
    }

    const toggle3 = () => {
        setModal3(!modal3);

        if (!modal3) {
            viewDetailUser(user.id);
            api.get(`/restaurants/getRestaurantByProviderId?providerId=${user.id}&statusId=0`)
                .then(res => {
                    setRestaurants(res.data);
                })
        }
    }

    if (role === 'ROLE_PROVIDER') {
        role = 'Nhà cung cấp';
    } else if (role === 'ROLE_CUSTOMER') {
        role = 'Khách hàng';
    }

    if (status === 'active') {
        status = 'Đang hoạt động';
    } else if (status === 'inactive') {
        status = 'Ngừng hoạt động';
    } else if (status === 'banned') {
        status = 'Đã bị chặn';
    }

    if (usereDetail.image_id === '' || usereDetail.image_id === null) {
        image = <CardImg id="user-image" className="user-profile-image" top src={imageUser} />
    } else {
        image = <CardImg id="user-image" className="user-profile-image" top src={url + '/images/' + usereDetail.image_id} />
    }

    const viewDetailUser = (userId) => {
        api.get(`/users/profile/?userId=${userId}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => {
                setUserDetail(res.data);
            })
    }

    const banUser = (userId) => {
        api({
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            url: `/users/updateUserStatus?userId=${userId}&status=banned`
        }).then(res => {
            props.receivedData();
        })
    }

    const unbanUser = (userId) => {
        api({
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            url: `/users/updateUserStatus?userId=${userId}&status=active`
        }).then(res => {
            props.receivedData();
        })
    }

    return (
        <tr>
            <td>
                {
                    (currentPage === 0 ? count : count + 10 * currentPage)
                }
            </td>
            <td>{user.name}</td>
            <td>{user.phoneNumber}</td>
            <td>{role}</td>
            <td>{status}</td>
            <td>
                <Button color="primary" onClick={() => {
                    if (role === 'Khách hàng') {
                        toggle();
                    } else if (role === 'Nhà cung cấp') {
                        toggle3();
                    }
                }}>Chi tiết</Button>
                {
                    role === 'Khách hàng' && <Modal isOpen={modal} toggle={toggle} className={`admin-user-modal`}>
                        <ModalHeader toggle={toggle}>Chi tiết người dùng</ModalHeader>
                        <ModalBody>
                            <Container>
                                {
                                    usereDetail !== '' && <Row className="admin-user-row">
                                        <Col lg="6" md="6" sm="12">
                                            {image}
                                        </Col>
                                        <Col lg="6" md="6" sm="12" className="admin-user-info">
                                            <div><span>Tên người dùng: </span>{usereDetail.user_name}</div>
                                            <div><span>Số điện thoại: </span>{usereDetail.phone_number}</div>
                                            <div><span>Ngày sinh: </span>{formatDate(usereDetail.date_of_birth)}</div>
                                            <div><span>Email: </span>{usereDetail.email}</div>
                                            <div><span>Địa chỉ: </span>{usereDetail.address}</div>
                                        </Col>
                                    </Row>
                                }
                            </Container>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={toggle}>Quay lại</Button>
                        </ModalFooter>
                    </Modal>
                }
                {
                    role === 'Nhà cung cấp' && <Modal isOpen={modal3} toggle={toggle3} className={`admin-provider-modal`}>
                        <ModalHeader toggle={toggle3}>Chi tiết người dùng</ModalHeader>
                        <ModalBody>
                            <Container>
                                {
                                    usereDetail !== '' && <>
                                        <Row>
                                            <Col lg="4" md="12" sm="12">
                                                <Row className="admin-user-row">
                                                    <Col lg="12" md="12" sm="12">
                                                        {image}
                                                    </Col>
                                                    <Col lg="12" md="12" sm="12" className="admin-user-info mt-4">
                                                        <div><span>Tên người dùng: </span>{usereDetail.user_name}</div>
                                                        <div><span>Số điện thoại: </span>{usereDetail.phone_number}</div>
                                                        <div><span>Ngày sinh: </span>{formatDate(usereDetail.date_of_birth)}</div>
                                                        <div><span>Email: </span>{usereDetail.email}</div>
                                                        <div><span>Địa chỉ: </span>{usereDetail.address}</div>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col lg="8" md="12" sm="12">
                                                <div style={{
                                                    textAlign: 'center', 
                                                    width: '100%',
                                                    fontSize: '1.1rem',
                                                    fontWeight: '500',
                                                    marginBottom: '10px'
                                                }}>
                                                    Danh sách các nhà hàng sở hữu
                                                </div>
                                                <Table className="restaurant-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Tên nhà hàng</th>
                                                            <th>Địa chỉ</th>
                                                            <th>Trạng thái</th>
                                                            <th></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            restaurants.map((restaurant, index) => {
                                                                return <RestaurantPendingItem key={index} restaurant={restaurant} count={index + 1} myRes={true} />
                                                            })
                                                        }
                                                    </tbody>
                                                </Table>
                                            </Col>
                                        </Row>
                                    </>
                                }
                            </Container>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={toggle3}>Quay lại</Button>
                        </ModalFooter>
                    </Modal>
                }
            </td>
            {
                user.status.name === 'banned' && <td>
                    <Button style={{ width: '90%' }} color="success" onClick={toggle1}>
                        Bỏ Chặn
                    </Button>
                    <Modal isOpen={modal1} toggle={toggle1} className={``}>
                        <ModalHeader toggle={toggle1}>Thông báo</ModalHeader>
                        <ModalBody>
                            Lưu thay đổi ?
                        </ModalBody>
                        <ModalFooter>
                            <Button color="success" onClick={() => unbanUser(user.id)}>
                                Đồng ý
                            </Button>
                            <Button color="secondary" onClick={toggle1}>Quay lại</Button>
                        </ModalFooter>
                    </Modal>
                </td>
            }
            {
                user.status.name === 'active' && <td>
                    <Button style={{ width: '90%' }} color="danger" onClick={toggle2}>
                        Chặn
                    </Button>
                    <Modal isOpen={modal2} toggle={toggle2} className={``}>
                        <ModalHeader toggle={toggle2}>Thông báo</ModalHeader>
                        <ModalBody>
                            Lưu thay đổi ?
                        </ModalBody>
                        <ModalFooter>
                            <Button color="success" onClick={() => banUser(user.id)}>
                                Đồng ý
                            </Button>
                            <Button color="secondary" onClick={toggle2}>Quay lại</Button>
                        </ModalFooter>
                    </Modal>
                </td>
            }
        </tr>
    )
}
