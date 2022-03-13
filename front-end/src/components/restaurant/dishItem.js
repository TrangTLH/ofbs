import React, { useState } from 'react';
import {
    Button, Card, CardImg, CardBody,
    CardTitle, CardText, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col
} from 'reactstrap';
import { useCart } from 'react-use-cart';
import { formatCurrency } from '../../common/formatCurrency';
import { api, url } from '../../config/axios';
import { Notify } from '../../common/notify';
import { FaInfoCircle } from 'react-icons/fa';

export default function Dish(props) {
    const { addItem, items } = useCart();
    const dish = props.dish;
    let statusDish = dish.status_name;
    const user = localStorage.getItem('currentUser');

    const [modal, setModal] = useState(false);
    const [dishModal, setDishModal] = useState();

    if (statusDish === 'active') {
        statusDish = 'Đang kinh doanh';
    } else if (statusDish === 'inactive') {
        statusDish = 'Ngừng kinh doanh';
    } else {
        statusDish = 'Đã bị gỡ';
    }

    const toggle = () => {
        setModal(!modal);

        if (modal === false) {
            api.get(`/dishes/getDishesById?dishId=${dish.id}`)
                .then(res => {
                    setDishModal(res.data);
                })
        }
    }

    const checkAddItem = (dish) => {
        if (items === undefined || items === null || items.length === 0
            || items[0].restaurant_id === dish.restaurant_id) {
            if (user !== undefined && user !== null && user !== '') {
                addItem(dish);
            } else {
                Notify('Vui lòng đăng nhập để thực hiện chức năng này', 'error', 'top-right');
            }
        } else {
            Notify('Bạn phải hoàn tất thanh toán của nhà hàng khác trước khi thêm vào giỏ hàng', 'error', 'top-right');
        }
    }

    return (
        <div>
            <Card key={dish.id} className="item">
                <CardImg className="dish-img" top width="150px" height="200px" src={url + '/images/' + dish.image_dish_id} alt="Nhà hàng" />
                <CardBody className="dish-content">
                    <CardTitle tag="h5">{dish.dish_name}</CardTitle>
                    <CardText className="dish-price">{formatCurrency(dish.price) + ' VNĐ'}</CardText>
                    <Button color="success" onClick={() => checkAddItem(dish)}>
                        Thêm vào giỏ
                    </Button>
                    <span
                        onClick={toggle}
                    >
                        <FaInfoCircle
                            style={{
                                marginLeft: '20px',
                                fontSize: '1.5rem',
                                color: '#198754'
                            }} />
                    </span>
                    <Modal isOpen={modal} toggle={toggle} className={`modal-dish-detail`}>
                        <ModalHeader toggle={toggle}>Chi tiết món ăn</ModalHeader>
                        <ModalBody>
                            <Row>
                                {
                                    dish.image_dish_id && (
                                        <Col lg="6" md="6" sm="12">
                                            <CardImg id="user-image" className="dish-image" top src={url + `/images/${dish.image_dish_id}`} alt="món ăn" />
                                        </Col>
                                    )
                                }
                                {
                                    dishModal && <Col lg="6" md="6" sm="12" className="info">
                                        <div>
                                            <b>Tên món ăn:</b>{' ' + dishModal.name}
                                        </div>

                                        <div>
                                            <b>Loại hình:</b>{' ' + dishModal.menuCategory.name}
                                        </div>

                                        <div>
                                            <b>Trạng thái:</b>{' ' + statusDish}
                                        </div>

                                        <div>
                                            <b>Giá món ăn:</b>{' ' + formatCurrency(dishModal.price) + ' VNĐ'}
                                        </div>

                                        <div>
                                            <b>Mô tả:</b>{' ' + dishModal.description}
                                        </div>
                                    </Col>
                                }
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={toggle}>Quay lại</Button>
                        </ModalFooter>
                    </Modal>
                </CardBody>
            </Card>
        </div>
    )
}
