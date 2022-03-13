import React, { useState } from 'react';
import {
    Button, Card, CardImg, CardBody,
    CardTitle, CardText, Modal, ModalHeader,
    ModalBody, ModalFooter, Row, Col
} from 'reactstrap';
import { useCart } from 'react-use-cart';
import { formatCurrency } from '../../common/formatCurrency';
import { api, url } from '../../config/axios';
import { Notify } from '../../common/notify';
import { FaInfoCircle } from 'react-icons/fa';

export default function ServiceItem(props) {
    const { addItem, items } = useCart();

    const user = localStorage.getItem('currentUser');
    const service = props.service;
    const index = props.index;
    let serviceDish = service.status_name;

    const [modal, setModal] = useState(false);
    const [serviceModal, setServiceModal] = useState();
    const [imageId, setImageId] = useState('');

    if (serviceDish === 'active') {
        serviceDish = 'Đang kinh doanh';
    } else if (serviceDish === 'inactive') {
        serviceDish = 'Ngừng kinh doanh';
    } else {
        serviceDish = 'Đã bị gỡ';
    }

    const toggle = () => {
        setImageId(service.image_service_id);
        setModal(!modal);

        if (modal === false) {
            api.get(`/services/getServiceById?serviceId=${service.id}`)
                .then(res => {
                    setServiceModal(res.data);
                })
        }
    }

    const checkAddItem = (service) => {
        if (items === undefined || items === null || items.length === 0
            || items[0].restaurant_id === service.restaurant_id) {
            if (user !== undefined && user !== null && user !== '') {
                addItem(service);
            } else {
                Notify('Vui lòng đăng nhập để thực hiện chức năng này', 'error', 'top-right');
            }
        } else {
            Notify('Bạn phải hoàn tất thanh toán của nhà hàng khác trước khi thêm vào giỏ hàng', 'error', 'top-right');
        }
    }

    return (
        <div>
            <Card key={index} className="item">
                <CardImg className="service-img" top width="150px" height="200px" src={url + `/images/${service.image_service_id}`} alt="Dịch vụ" />
                <CardBody className="service-content">
                    <CardTitle tag="h5">{service.service_name}</CardTitle>
                    <CardText className="service-price">{formatCurrency(service.price) + ' VNĐ'}</CardText>
                    <Button color="success" onClick={() => checkAddItem(service)}>
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
                    <Modal isOpen={modal} toggle={toggle} className={`modal-service-detail`}>
                        <ModalHeader toggle={toggle}>Chi tiết dịch vụ</ModalHeader>
                        <ModalBody>
                            <Row>
                                {
                                    imageId && (<Col>
                                        <CardImg id="user-image" className="service-image" top src={url + `/images/${imageId}`} alt="dịch vụ" />
                                    </Col>
                                    )
                                }
                                {
                                    serviceModal && <Col className="info">
                                        <div>
                                            <b>Tên dịch vụ:</b>{' ' + serviceModal.name}
                                        </div>

                                        <div>
                                            <b>Loại hình:</b>{' ' + serviceModal.serviceCategory.name}
                                        </div>

                                        <div>
                                            <b>Trạng thái:</b>{' ' + serviceDish}
                                        </div>

                                        <div>
                                            <b>Giá dịch vụ:</b>{' ' + formatCurrency(serviceModal.price) + ' VNĐ'}
                                        </div>

                                        <div>
                                            <b>Mô tả:</b>{' ' + serviceModal.description}
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
