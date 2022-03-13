import React, { useEffect, useState } from 'react'
import {
    Button, Card, CardImg, ModalHeader,
    ModalBody, ModalFooter, Modal, Row, Col, Table,
} from 'reactstrap';
import { useCart } from 'react-use-cart';
import { api, url } from '../../config/axios';
import { formatCurrency } from '../../common/formatCurrency';
import { Notify } from '../../common/notify';
import { FaInfoCircle } from 'react-icons/fa';
import DishComboItem from './dishComboItem';

export default function ComboItem(props) {
    const { addItem, items } = useCart();
    const user = localStorage.getItem('currentUser');
    const combo = props.combo;
    let comboStatus = combo.status_name;
    const comboId = props.comboId;

    const [dishes, setDishes] = useState([]);
    const [modal, setModal] = useState(false);
    const [imageId, setImageId] = useState('');
    const [dishModal, setDishModal] = useState();
    const [comboModal, setComboModal] = useState();

    if (comboStatus === 'active') {
        comboStatus = 'Đang kinh doanh';
    } else if (comboStatus === 'inactive') {
        comboStatus = 'Ngừng kinh doanh';
    } else {
        comboStatus = 'Đã bị gỡ';
    }

    const toggle = () => {
        setImageId(combo.image_dish_id);
        setModal(!modal);

        if (modal === false) {
            api.get(`/combos/getComboById?comboId=${combo.id}`)
                .then(res => {
                    setComboModal(res.data);
                });

            api.get(`/dishes/getDishesByComboId?comboId=${combo.id}`)
                .then(res => {
                    setDishModal(res.data);
                });
        }
    }

    const checkAddItem = (combo) => {
        if (items === undefined || items === null || items.length === 0
            || items[0].restaurant_id === combo.restaurant_id) {
            if (user !== undefined && user !== null && user !== '') {
                addItem(combo);
            } else {
                Notify('Vui lòng đăng nhập để thực hiện chức năng này', 'error', 'top-right');
            }
        } else {
            Notify('Bạn phải hoàn tất thanh toán của nhà hàng khác trước khi thêm vào giỏ hàng', 'error', 'top-right');
        }
    }

    useEffect(() => {
        api.get(`/dishes/getDishesByComboId?comboId=${comboId}`)
            .then(res => {
                setDishes(res.data);
            })
    }, [comboId])

    return <Card className="combo-card">
        <div className="combo-name">{combo.combo_name}</div>
        <CardImg className="combo-image" top width="100%" src={url + '/images/' + combo.image_dish_id} />
        <hr />
        <div className="combo-list">
            {
                dishes.map((dish, index) => {
                    return <div key={index} className="dish-item">
                        {dish.dish_name}
                    </div>
                })
            }
        </div>
        <hr />
        <div className="combo-price">{"Giá combo:  " + formatCurrency(combo.price) + ' VNĐ'}</div>
        <div className="combo-btn">
            <Button
                color="success"
                onClick={() => checkAddItem(combo)}
            >
                Đặt ngay
            </Button>
            <div
                onClick={toggle}
            >
                <FaInfoCircle
                    style={{
                        marginLeft: '20px',
                        fontSize: '1.5rem',
                        color: '#198754'
                    }} />
            </div>
        </div>
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
                <Button color="secondary" onClick={toggle}>Quay lại</Button>
            </ModalFooter>
        </Modal>
    </Card>
}
