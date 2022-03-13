import React, { useState } from 'react';
import {
    Button, Modal, ModalHeader,
    ModalBody, ModalFooter,
    CardImg, Row, Col, Table
} from 'reactstrap';
import { FaEye } from 'react-icons/fa';
import { api, url } from '../../config/axios';

import DishComboItem from '../restaurant/dishComboItem';
import { Notify } from '../../common/notify';
import { formatCurrency } from '../../common/formatCurrency';

export default function RestaurantComboItem(props) {
    const combo = props.combo;
    let comboStatus = combo.status_name;
    let count = props.count;
    let currentPage = props.currentPage;

    if (comboStatus === 'active') {
        comboStatus = 'Đang kinh doanh';
    } else if (comboStatus === 'inactive') {
        comboStatus = 'Ngừng kinh doanh';
    } else {
        comboStatus = 'Đã bị gỡ';
    }

    const [modal, setModal] = useState(false);
    const [modal1, setModal1] = useState(false);
    const [comboModal, setComboModal] = useState();
    const [dishModal, setDishModal] = useState();
    const [imageId, setImageId] = useState('');

    const toggle = () => {
        setImageId(combo.image_combo_id);
        setModal(!modal);

        if (modal === false) {
            api.get(`/combos/getComboById?comboId=${combo.combo_id}`)
                .then(res => {
                    setComboModal(res.data);
                });

            api.get(`/dishes/getDishesByComboId?comboId=${combo.combo_id}`)
                .then(res => {
                    setDishModal(res.data);
                });
        }
    }

    const toggle1 = () => {
        setModal1(!modal1);
    }

    const ban = () => {
        api.get(`/restaurants/getRestaurantById?restaurantId=${combo.restaurant_id}`)
            .then(res => {
                const restaurant = res.data;
                api({
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    url: `/combos/updateStatus?comboId=${combo.combo_id}`
                });
                api.post(`/notifications/insertNotification`,
                    {
                        "content": `Dịch vụ ${combo.combo_name} của nhà hàng ${restaurant.restaurantName} đã bị gỡ do vi phạm chính sách của FBS`,
                        "customer": null,
                        "provider": restaurant.provider,
                        "forAdmin": false,
                        "type": "report",
                        "read": false
                    }
                ).then(res => {
                    toggle();
                    toggle1();
                    Notify('Gỡ combo thành công', 'success', 'top-right');
                    props.receivedData();
                }).catch(res => {
                    Notify('Gỡ combo không thành công', 'error', 'top-right');
                })
            })
    }

    return (
        <tr>
            <td>
                {
                    (currentPage === 0 ? count : count + 10 * currentPage)
                }
            </td>
            <td>{combo.combo_name}</td>
            <td>{formatCurrency(combo.combo_price)}</td>
            <td>{comboStatus}</td>
            <td>
                <Button onClick={toggle} color="primary">
                    <FaEye className="icon-see-more" />Xem thêm
                </Button>
            </td>
            <Modal isOpen={modal} toggle={toggle} className={`admin-modal-combo`}>
                <ModalHeader toggle={toggle}>Chi tiết Combo</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col lg="6" md="6" sm="12">
                            {
                                imageId && (
                                    <CardImg id="user-image" className="dish-profile-image" top src={url + `/images/${imageId}`} alt="dịch vụ" />
                                )
                            }
                            {
                                comboModal && <div className="info">
                                    <div>
                                        <b>Tên combo:</b>{' ' + comboModal.name}
                                    </div>

                                    <div>
                                        <b>Trạng thái:</b>{' ' + comboStatus}
                                    </div>

                                    <div>
                                        <b>Giá combo:</b>{' ' + formatCurrency(comboModal.price) + ' VNĐ'}
                                    </div>

                                    <div>
                                        <b>Mô tả:</b>{' ' + comboModal.description}
                                    </div>
                                </div>
                            }
                        </Col>
                        <Col lg="6" md="6" sm="12">
                            <h5 className="title-dish-combo">Các món ăn trong combo</h5>
                            <hr />
                            <Table>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Tên món</th>
                                        <th>Loại món ăn</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        dishModal && (
                                            dishModal.map((dish, index) => {
                                                return <DishComboItem key={index} dish={dish} combo={combo} count={index + 1} isAdmin={true} />
                                            })
                                        )
                                    }
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    {
                        comboStatus !== 'Đã bị gỡ' && <Button color="danger" onClick={toggle1}>Gỡ</Button>
                    }
                    <Modal isOpen={modal1} toggle={toggle1} className={``}>
                        <ModalHeader toggle={toggle1}>Thông báo</ModalHeader>
                        <ModalBody>
                            Bạn có chắc chắn muốn gỡ combo món ăn này ?
                        </ModalBody>
                        <ModalFooter>
                            <Button color="success" onClick={ban}>Đồng ý</Button>
                            <Button color="secondary" onClick={toggle1}>Quay lại</Button>
                        </ModalFooter>
                    </Modal>
                    <Button color="secondary" onClick={toggle}>Quay lại</Button>
                </ModalFooter>
            </Modal>
        </tr>
    )
}
