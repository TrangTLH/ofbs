/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useCart } from 'react-use-cart';
import {
    Button, Modal, Badge, Input, Form,
    ModalHeader, ModalBody, ModalFooter,
    Label, FormGroup, Row, Col, Container
} from 'reactstrap';
import { FaShoppingCart } from 'react-icons/fa'
import { PayPalButton } from "react-paypal-button-v2";
import { api } from '../../config/axios';

import CartDishItem from './cartDishItem';
import CartComboItem from './cartComboItem';
import CartServiceItem from './cartServiceItem';
import { formatDateForInput } from '../../common/formatDate';
import { formatCurrency } from '../../common/formatCurrency';
import { Notify } from '../../common/notify';
import { validateCapacity, validateEmpty, validateItemCart, validateUsername } from '../../common/validate';
import OrderDetailDishItem from '../order/orderDetailDishItem';
import OrderDetailComboItem from '../order/orderDetailComboItem';
import OrderDetailServiceItem from '../order/orderDetailServiceItem';
import subVn from 'sub-vn';
import Spinner from '../common/spinner';


export default function Cart(props) {
    const [modal, setModal] = useState(false);
    const [modal1, setModal1] = useState(false);
    const [active, setActive] = useState(0);
    const [display, setDisplay] = useState(1);
    const [loading, setLoading] = useState(false);

    const [modalConfirm, setModalComfirm] = useState(false);
    const [typeTable, setTypeTable] = useState(6);
    const [customerQuantity, setCustomerQuantity] = useState(1);
    const [period, setPeriod] = useState('Trưa');
    const [time, setTime] = useState('');
    const [note, setNote] = useState('');
    const [organizeAddress, setOrganizeAddress] = useState('');
    const [resAddress, setresAddress] = useState('');
    const [provinceCode, setProvinceCode] = useState('');
    const [districtCode, setDistrictCode] = useState('');
    const [provinceName, setProvinceName] = useState('Thành phố Hà Nội');
    const [districtName, setDistrictName] = useState('Quận Ba Đình');
    const [wardName, setwardName] = useState('Phường Phúc Xá');
    const [provinces, setProvinces] = useState(subVn.getProvinces());
    const [districts, setDistricts] = useState(subVn.getDistrictsByProvinceCode('01'));
    const [wards, setWards] = useState(subVn.getWardsByDistrictCode('001'));

    const toggle = () => {
        setModal(!modal);
        if (!modal) {
            let customerQuantity = '';
            if (metadata !== undefined) {
                customerQuantity = metadata.customerQuantity;
            } else {
                customerQuantity = 1;
            }
            updateCartMetadata({
                customerQuantity: customerQuantity
            })
        }
    }
    const toggle1 = () => {
        setModal1(!modal1);
        setActive(0);
    }
    const toggleConfirm = () => {
        setModalComfirm(!modalConfirm);
        if (!modalConfirm) {
            const restaurantId = props.restaurantId;
            api.get(`/restaurants/getRestaurantById?restaurantId=${restaurantId}`)
                .then(res => {
                    const restaurant = res.data;
                    setresAddress(`${restaurant.restaurantName}, ${restaurant.address}, ${restaurant.district}, ${restaurant.province}`);
                })
        }
    }
    let maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);

    const {
        isEmpty,
        items,
        totalUniqueItems,
        cartTotal,
        updateCartMetadata,
        metadata,
        emptyCart
    } = useCart();

    const onchangeTypeTable = (e) => {
        e.preventDefault();
        setTypeTable(e.target.value);
        updateCartMetadata({
            type: parseInt(e.target.value),
            customerQuantity: parseInt(e.target.value)
        })
    }

    const calNumTable = (numCustomer, typeTable) => {
        let numTable = Math.ceil(numCustomer / typeTable);
        if (numTable < 1) {
            return 1;
        } else if (numTable >= 1) {
            return numTable;
        }
    }

    const onChangeCustomerQuantity = (e) => {
        e.preventDefault();
        setCustomerQuantity(e.target.value);
        updateCartMetadata({
            customerQuantity: parseInt(e.target.value)
        })
    }

    const onchangePeriod = (e) => {
        e.preventDefault();
        setPeriod(e.target.value);
        updateCartMetadata({
            period: e.target.value
        })
    }

    const onChangeTime = (e) => {
        e.preventDefault();
        setTime(e.target.value);
        updateCartMetadata({
            time: e.target.value
        })
    }

    const onChangeNote = (e) => {
        e.preventDefault();
        setNote(e.target.value);
        updateCartMetadata({
            note: e.target.value
        })
    }

    const onChangeOrganizeAddress = (e) => {
        e.preventDefault();
        setOrganizeAddress(e.target.value);
        updateCartMetadata({
            organizeAddress: e.target.value
        })
    }

    const onProvinceClick = (event) => {
        event.preventDefault();
        let provinceCode = event.target.value;
        let index = event.nativeEvent.target.selectedIndex;
        let provinceName = event.nativeEvent.target[index].text;

        setDistricts(subVn.getDistrictsByProvinceCode(provinceCode));
        setWards(subVn.getWardsByProvinceCode(provinceCode));
        setProvinceCode(provinceCode);
        setProvinceName(provinceName);
        setDistrictName((subVn.getDistrictsByProvinceCode(provinceCode))[0].name)
        setwardName((subVn.getWardsByProvinceCode(provinceCode))[0].name);
    }

    const onDistrictClick = (event) => {
        event.preventDefault();
        let districtCode = event.target.value;
        let index = event.nativeEvent.target.selectedIndex;
        let districtName = event.nativeEvent.target[index].text;

        setWards(subVn.getWardsByDistrictCode(districtCode))
        setDistrictName(districtName);
        setDistrictCode(districtCode);
        setwardName((subVn.getWardsByDistrictCode(districtCode))[0].name);
    }

    const onWardClick = (event) => {
        event.preventDefault();
        let index = event.nativeEvent.target.selectedIndex;
        let wardName = event.nativeEvent.target[index].text;
        setwardName(wardName);
    }

    const validateCart = () => {
        let count = 0;

        items.forEach(item => {
            if (!validateItemCart(item.quantity)) {
                count = count + 1;
            }
        })

        if (!validateCapacity(customerQuantity)) {
            Notify('Số lượng khách quá lớn', 'error', 'top-right');
            return false;
        } else if (count > 0) {
            Notify('Số lượng quá lớn', 'error', 'top-right');
            return false;
        } else if (display === 1 && !validateEmpty(organizeAddress.trim())) {
            Notify('Vui lòng nhập địa chỉ cụ thể', 'error', 'top-right');
            return false;
        } else if (display === 1 && !validateUsername(organizeAddress.trim())) {
            Notify('Tên địa chỉ quá dài (nhỏ hơn 100 ký tự)', 'error', 'top-right');
            return false;
        } else {
            return true;
        }
    }

    const payment = () => {
        api({
            method: 'POST',
            url: `/payment/pay?price=${cartTotal * 0.1 / 23000}&description=${'Thanh toán đơn hàng FBS'}`,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => {
                window.location.replace(res.data);
            }).catch(err => {
            });
    }

    const onSubmitCart = () => {
        let currentUser;
        const restaurantId = props.restaurantId;
        let address = '';
        let province = '';
        let district = '';
        let ward = '';
        setLoading(true);

        if (display === 1) {
            address = organizeAddress;
            province = provinceName;
            district = districtName;
            ward = wardName;
        } else if (display === 2) {
            address = resAddress;
            province = null;
            district = null;
            ward = null;
        }

        let arr = [];

        let object = {
            "quantity": 0,
            "dishId": 0,
            "comboId": 0,
            "serviceId": 0,
            "customerId": 0,
            "restaurantId": 0
        }

        api.get(`/users/findByPhoneNumber/${localStorage.getItem('currentUser')}`)
            .then(res => {
                currentUser = res.data;
                api.post(`/orders/insertOrder`, {
                    "time": period,
                    "organizeDate": time,
                    "customerId": parseInt(currentUser.id),
                    "restaurantId": parseInt(restaurantId),
                    "tableType": parseInt(typeTable),
                    "numberOfGuests": customerQuantity,
                    "note": note,
                    "organizeAddress": address,
                    "organizeProvince": province,
                    "organizeDistrict": district,
                    "organizeWard": ward
                }, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(res => {
                    const orderCode = res.data.orderCode;
                    items.forEach(item => {
                        if (item.dish_name) {
                            object = {};
                            object.quantity = item.quantity;
                            object.dishId = item.id;
                            object.comboId = 0;
                            object.serviceId = 0;
                            object.customerId = parseInt(currentUser.id);
                            object.restaurantId = parseInt(restaurantId);

                            arr.push(object);
                        }

                        else if (item.combo_name) {
                            object = {};
                            object.quantity = item.quantity;
                            object.dishId = 0;
                            object.comboId = item.id;
                            object.serviceId = 0;
                            object.customerId = parseInt(currentUser.id);
                            object.restaurantId = parseInt(restaurantId);

                            arr.push(object);
                        }

                        else if (item.service_name) {
                            object = {};
                            object.quantity = item.quantity;
                            object.dishId = 0;
                            object.comboId = 0;
                            object.serviceId = item.id;
                            object.customerId = parseInt(currentUser.id);
                            object.restaurantId = parseInt(restaurantId);

                            arr.push(object);
                        }
                    })

                    let json = JSON.stringify(arr);
                    const config = {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        }
                    }

                    api.get(`/orders/getOrderIdBeforeInsert?customerId=${parseInt(currentUser.id)}&restaurantId=${parseInt(restaurantId)}`, config)
                        .then(res => {
                            localStorage.setItem("orderId", res.data);
                            api.post(`/orders/insertOrderDetail`, json, config)
                                .then(res => {
                                    api({
                                        method: 'PATCH',
                                        headers: {
                                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                                        },
                                        url: `/orders/setStatus?customerId=${currentUser.id}&restaurantId=${restaurantId}`
                                    }).then(res => {
                                        updateCartMetadata({
                                            customerQuantity: 1,
                                            period: "",
                                            type: 0
                                        })

                                        api.get(`/restaurants/getRestaurantById?restaurantId=${restaurantId}`)
                                            .then(res => {
                                                const restaurant = res.data;
                                                api.post(`/notifications/insertNotification`,
                                                    {
                                                        "content": `Có đơn hàng mới của ${restaurant.restaurantName}`,
                                                        "customer": null,
                                                        "provider": restaurant.provider,
                                                        "forAdmin": false,
                                                        "type": "order",
                                                        "read": false
                                                    }
                                                ).then(res => {
                                                    if (active === 0) {
                                                        if (parseFloat(currentUser.balance) >= parseFloat(cartTotal * 0.1)) {
                                                            emptyCart();
                                                            setModalComfirm(!modalConfirm);
                                                            api.get(`/users/findByRole?roleName=ROLE_ADMIN`)
                                                                .then(res => {
                                                                    const admin = res.data;
                                                                    api.post(`/payment/save`,
                                                                        {
                                                                            "user": currentUser,
                                                                            "fromToUser": admin,
                                                                            "balanceChange": parseFloat(-cartTotal * 0.1),
                                                                            "currentBalance": parseFloat(currentUser.balance) - (parseFloat(cartTotal * 0.1)),
                                                                            "description": "Thanh toán cọc đơn hàng " + orderCode,
                                                                            "paymentType": {
                                                                                "name": "pay"
                                                                            }
                                                                        },
                                                                        {
                                                                            headers: {
                                                                                'Authorization': 'Bearer ' + localStorage.getItem('token')
                                                                            }
                                                                        }
                                                                    ).then(res => {
                                                                        const paymentHistory = res.data;
                                                                        api({
                                                                            method: 'PATCH',
                                                                            headers: {
                                                                                'Authorization': 'Bearer ' + localStorage.getItem('token')
                                                                            },
                                                                            url: `/payment/updateStatus?paymentId=${paymentHistory.id}&status=success`
                                                                        }).then(res => {
                                                                            api({
                                                                                method: 'PATCH',
                                                                                headers: {
                                                                                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                                                                                },
                                                                                url: `users/updateBalance?balance=${parseFloat(currentUser.balance) - parseFloat(cartTotal * 0.1)}&userId=${currentUser.id}`
                                                                            })
                                                                                .then(res => {
                                                                                    api({
                                                                                        method: 'PATCH',
                                                                                        headers: {
                                                                                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                                                                                        },
                                                                                        url: `/orders/updateStatus?orderId=${localStorage.getItem("orderId")}&status=pending`
                                                                                    }).then(res => {
                                                                                        setLoading(false);
                                                                                        localStorage.removeItem("orderId");
                                                                                        Notify('Thanh toán đơn hàng thành công', 'success', 'top-right');
                                                                                        toggle();
                                                                                        toggle1();
                                                                                    })
                                                                                })
                                                                        })
                                                                    })

                                                                    api.post(`/payment/save`,
                                                                        {
                                                                            "user": admin,
                                                                            "fromToUser": currentUser,
                                                                            "balanceChange": parseFloat(cartTotal * 0.1),
                                                                            "currentBalance": parseFloat(admin.balance) + (parseFloat(cartTotal * 0.1)),
                                                                            "description": "Khách hàng thanh toán cọc đơn hàng " + orderCode,
                                                                            "paymentType": {
                                                                                "name": "pay"
                                                                            }
                                                                        },
                                                                        {
                                                                            headers: {
                                                                                'Authorization': 'Bearer ' + localStorage.getItem('token')
                                                                            }
                                                                        }
                                                                    ).then(res => {
                                                                        const paymentHistory = res.data;
                                                                        api({
                                                                            method: 'PATCH',
                                                                            headers: {
                                                                                'Authorization': 'Bearer ' + localStorage.getItem('token')
                                                                            },
                                                                            url: `/payment/updateStatus?paymentId=${paymentHistory.id}&status=success`
                                                                        }).then(() => {
                                                                            api({
                                                                                method: 'PATCH',
                                                                                headers: {
                                                                                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                                                                                },
                                                                                url: `users/updateBalance?balance=${parseFloat(admin.balance) + parseFloat(paymentHistory.balanceChange)}&userId=${admin.id}`
                                                                            })
                                                                        })
                                                                    })
                                                                })
                                                        } else {
                                                            setLoading(false);
                                                            toggle1();
                                                            toggleConfirm();
                                                            Notify('Số tiền trong ví của bạn không đủ', 'error', 'top-right');
                                                        }
                                                    } else if (active === 1) {
                                                        // api({
                                                        //     method: 'POST',
                                                        //     url: `/payment/pay?price=${cartTotal * 0.1 / 23000}&description=${'Thanh toán đơn hàng FBS'}`,
                                                        //     headers: {
                                                        //         'Authorization': 'Bearer ' + localStorage.getItem('token')
                                                        //     }
                                                        // })
                                                        //     .then(res => {                                                        
                                                        api({
                                                            method: 'PATCH',
                                                            headers: {
                                                                'Authorization': 'Bearer ' + localStorage.getItem('token')
                                                            },
                                                            url: `/orders/updateStatus?orderId=${localStorage.getItem("orderId")}&status=pending`
                                                        }).then(res => {
                                                            Notify('Thanh toán đơn hàng thành công', 'success', 'top-right');
                                                            setLoading(false);
                                                            // emptyCart();
                                                            // toggle();
                                                            // toggle1();
                                                        })
                                                    }
                                                })
                                            })
                                    })
                                })
                        })
                })
            })
    }

    if (isEmpty) {
        return (
            <div>
                <Button onClick={toggle} className="cart-display" color="primary" outline>
                    <FaShoppingCart />
                    <Badge className="cart-total-item">
                        {totalUniqueItems}
                    </Badge>
                </Button>

                <Modal isOpen={modal} toggle={toggle} className="">
                    <ModalHeader toggle={toggle}>Giỏ hàng</ModalHeader>
                    <ModalBody>
                        <h3>Giỏ hàng trống !</h3>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={toggle}>Quay lại</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }

    return (
        <div>
            <Button onClick={toggle} className="cart-display" color="primary" outline>
                <FaShoppingCart />
                <Badge className="cart-total-item">
                    {totalUniqueItems}
                </Badge>
            </Button>

            <div>
                <Modal isOpen={modal} toggle={toggle} className="cart-modal">
                    <ModalHeader toggle={toggle}>Giỏ hàng</ModalHeader>
                    <ModalBody>
                        <Modal isOpen={modal1} toggle={toggle1} className={`info-cart-modal`}>
                            <ModalHeader toggle={toggle1}>Thông báo</ModalHeader>
                            <ModalBody>
                                <Container>
                                    <Row>
                                        <Col lg="6" md="12" sm="12">
                                            <Row>
                                                <Col lg="12" md="12" sm="12"><OrderDetailDishItem listOrderDetails={items} /></Col>
                                                <Col className="mt-4" lg="12" md="12" sm="12"><OrderDetailComboItem listOrderDetails={items} /></Col>
                                                <Col className="mt-4" lg="12" md="12" sm="12"><OrderDetailServiceItem listOrderDetails={items} /></Col>
                                            </Row>
                                        </Col>
                                        <Col lg="6" md="12" sm="12">
                                            <div>
                                                <b>Vui lòng kiểm tra lại đơn hàng trước khi thực hiện thanh toán.<br /><br /></b>
                                                <span className="od-dish-item-total">Tổng tiền đơn hàng: {formatCurrency(cartTotal)} VNĐ</span><br /><br />
                                                Số tiền phải thanh toán là <b>{formatCurrency(cartTotal * 0.1) + ' VNĐ'}</b>.
                                                Bạn phải thanh toán cọc <b>10%</b> tổng tiền của đơn hàng.
                                            </div>
                                            <hr />
                                            <div>
                                                <FormGroup tag="fieldset">
                                                    <h6>Chọn phương thức thanh toán</h6>
                                                    <FormGroup check>
                                                        <Label check>
                                                            <Input
                                                                type="radio"
                                                                name="radio1"
                                                                checked={active === 0}
                                                                onClick={() => {
                                                                    setActive(0);
                                                                    document.getElementById('paypal-btn').style.display = 'none';
                                                                    document.getElementById('checkout-btn').style.display = 'block';
                                                                }}
                                                            />{' '}
                                                            Thanh toán bằng ví FBS
                                                        </Label>
                                                    </FormGroup>
                                                    <FormGroup check>
                                                        <Label check>
                                                            <Input
                                                                type="radio"
                                                                name="radio1"
                                                                checked={active === 1}
                                                                onClick={() => {
                                                                    setActive(1);
                                                                    document.getElementById('paypal-btn').style.display = 'block';
                                                                    document.getElementById('checkout-btn').style.display = 'none';
                                                                }}
                                                            />{' '}
                                                            Thanh toán bằng ví Paypal
                                                        </Label>
                                                    </FormGroup>
                                                </FormGroup>
                                            </div>
                                            <div id="paypal-btn" style={{ zIndex: '1', display: 'none' }}>
                                                <PayPalButton
                                                    options={{
                                                        clientId: "AQaSaF02zb7zZbXZIlDArwaUY4L2RTY7NfZwoils6_dfoKGDO10lpJPe3zhe-X6qKVHCASPiOp4rIkNS",
                                                        currency: "USD"
                                                    }}
                                                    amount={parseFloat(cartTotal * 0.1 / 23000).toFixed(2)}
                                                    onSuccess={(details, data) => {
                                                        onSubmitCart();
                                                        setLoading(false);
                                                        emptyCart();
                                                        toggle();
                                                        toggle1();
                                                    }}
                                                    onCancel={() => {
                                                        Notify('Thanh toán đơn hàng không thành công', 'error', 'top-right');
                                                        emptyCart();
                                                        // setModalComfirm(!modalConfirm);
                                                        toggle();
                                                        toggle1();
                                                    }}
                                                />
                                            </div>
                                            <Button id="checkout-btn" style={{ width: '100%' }} color="success" onClick={toggleConfirm}>Thanh toán</Button>{' '}
                                            <Modal isOpen={modalConfirm} toggle={toggleConfirm} className="">
                                                <ModalHeader toggle={toggleConfirm}>Thông báo</ModalHeader>
                                                <ModalBody>
                                                    Bạn có chắc chắn thanh toán đơn hàng này ?
                                                    {loading && <div className="mt-3">
                                                        <Spinner type="puffloader" />
                                                    </div>
                                                    }
                                                </ModalBody>
                                                <ModalFooter>
                                                    {
                                                        !loading && <>
                                                            <Button id="btn-option" color="success" onClick={() => {
                                                                onSubmitCart();
                                                            }}>Đồng ý
                                                            </Button>
                                                            <Button id="btn-option" color="secondary" onClick={toggleConfirm}>
                                                                Quay lại
                                                            </Button>
                                                        </>
                                                    }
                                                </ModalFooter>
                                            </Modal>
                                        </Col>
                                    </Row>
                                </Container>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="secondary" onClick={toggle1}>Quay lại</Button>
                            </ModalFooter>
                        </Modal>
                        <Form
                            onSubmit={(event) => {
                                event.preventDefault();
                                if (validateCart()) {
                                    toggle1();
                                }
                            }}
                        >
                            <Row>
                                <Col className="cart-option" lg="6" md="12" sm="12">
                                    <h4>Tùy chọn</h4>
                                    <div className="cart-other-option">
                                        <div>
                                            <Label for="type"><b>Loại bàn <span className="require-icon">*</span></b></Label>
                                            <Input
                                                type="select"
                                                name="type"
                                                id="type"
                                                onChange={onchangeTypeTable}
                                                value={metadata.type}
                                                required="required"
                                            >
                                                <option value={6}>Bàn 6</option>
                                                <option value={8}>Bàn 8</option>
                                            </Input>
                                        </div>

                                        <div>
                                            <Label for="period"><b>Buổi <span className="require-icon">*</span></b></Label>
                                            <Input
                                                type="select"
                                                name="period"
                                                id="period"
                                                onChange={onchangePeriod}
                                                value={metadata.period}
                                                required="required"
                                            >
                                                <option value={'Trưa'}>Trưa</option>
                                                <option value={'Tối'}>Tối</option>
                                            </Input>
                                        </div>
                                    </div>

                                    <div className="cart-other-option">
                                        <div>
                                            <Label for="customer-quantity"><b>Số lượng khách <span className="require-icon">*</span></b></Label>
                                            <Input
                                                type="number"
                                                name="customer-quantity"
                                                id="customer-quantity"
                                                min={1}
                                                onChange={onChangeCustomerQuantity}
                                                value={customerQuantity}
                                                required="required"
                                            />
                                        </div>

                                        <div>
                                            <Label for="choose-date"><b>Chọn ngày <span className="require-icon">*</span></b></Label>
                                            <Input
                                                type="date"
                                                name="choose-date"
                                                id="choose-date"
                                                min={formatDateForInput(new Date())}
                                                max={formatDateForInput(maxDate)}
                                                onChange={onChangeTime}
                                                value={time}
                                                required="required"
                                            />
                                        </div>
                                    </div>
                                    <Row tag="fieldset" className="restaurant">
                                        <Col check>
                                            <Label check>
                                                <Input
                                                    type="radio"
                                                    name="radio1"
                                                    checked={display === 1}
                                                    onClick={() => {
                                                        setDisplay(1);
                                                    }}
                                                />{' '}
                                                <span className="type-restaurant">Tổ chức tại nhà</span>
                                            </Label>
                                        </Col>
                                        <Col check>
                                            <Label check>
                                                <Input
                                                    type="radio"
                                                    name="radio1"
                                                    checked={display === 2}
                                                    onClick={() => {
                                                        setDisplay(2);
                                                    }}
                                                />{' '}
                                                <span className="type-restaurant">Tổ chức tại nhà hàng</span>
                                            </Label>
                                        </Col>
                                    </Row>

                                    {
                                        display === 1 && <div id="cart-address">
                                            <Row className="content-row-2">
                                                <Col lg="6" md="6" sm="12">
                                                    <Label for="citySelect"><b>Chọn tỉnh/ thành phố <span className="require-icon">*</span></b></Label>
                                                    <Input
                                                        type="select"
                                                        name="citySelect"
                                                        id="citySelect"
                                                        value={provinceCode}
                                                        onChange={onProvinceClick}
                                                    >
                                                        {provinces.map((province) => {
                                                            return (
                                                                <option key={province.code} value={province.code}>
                                                                    {province.name}
                                                                </option>
                                                            );
                                                        })}
                                                    </Input>
                                                </Col>

                                                <Col lg="6" md="6" sm="12">
                                                    <Label for="districtSelect"><b>Chọn quận/ huyện <span className="require-icon">*</span></b></Label>
                                                    <Input
                                                        type="select"
                                                        name="districtSelect"
                                                        id="districtSelect"
                                                        onChange={onDistrictClick}
                                                    >
                                                        {districts.map((district) => {
                                                            return (
                                                                <option key={district.code} value={district.code}>
                                                                    {district.name}
                                                                </option>
                                                            );
                                                        })}
                                                    </Input>
                                                </Col>
                                            </Row>
                                            <Row className="content-row-2">
                                                <Col lg="6" md="6" sm="12">
                                                    <Label for="districtSelect"><b>Chọn xã/ phường <span className="require-icon">*</span></b></Label>
                                                    <Input
                                                        type="select"
                                                        name="wardsSelect"
                                                        id="wardsSelect"
                                                        onChange={onWardClick}
                                                    >
                                                        {wards.map((ward) => {
                                                            return (
                                                                <option key={ward.code} value={ward.code}>
                                                                    {ward.name}
                                                                </option>
                                                            );
                                                        })}
                                                    </Input>
                                                </Col>
                                                <Col lg="6" md="6" sm="12">
                                                    <Label><b>Địa chỉ cụ thể <span className="require-icon">*</span></b></Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Địa chỉ cụ thể"
                                                        required="required"
                                                        onChange={onChangeOrganizeAddress}
                                                        value={metadata.organizeAddress}
                                                    />
                                                </Col>
                                            </Row>
                                        </div>
                                    }
                                    <Label for="note"><b>Ghi chú </b></Label>
                                    <Input
                                        type="textarea"
                                        name="note"
                                        id="note"
                                        placeholder="Yêu cầu cụ thể (nếu có)"
                                        onChange={onChangeNote}
                                        value={metadata.note}
                                    />
                                </Col>
                                {/* <hr></hr> */}
                                <Col lg="6" md="12" sm="12">
                                    <h5>Số lượng bàn: {calNumTable(customerQuantity, typeTable)}</h5>
                                    <h4>Món ăn</h4>
                                    {
                                        items.map((item, index) => {
                                            return <CartDishItem key={index} dish={item} calNumTable={calNumTable(customerQuantity, typeTable)} />
                                        })
                                    }
                                    <hr></hr>
                                    <h4>Combo món ăn</h4>
                                    {items.map((item, index) => {
                                        return <CartComboItem key={index} combo={item} calNumTable={calNumTable(customerQuantity, typeTable)} />
                                    })}
                                    <hr></hr>
                                    <h4>Dịch vụ</h4>
                                    {items.map((item, index) => {
                                        return <CartServiceItem key={index} service={item} />
                                    })}
                                    <hr></hr>
                                    <div className="cart-total-price">
                                        Tổng tiền: {formatCurrency(cartTotal) + "  VNĐ "}
                                        {
                                            display === 2 && <i id="appendix">(Chưa bao gồm phí thuê địa điểm tổ chức)</i>
                                        }
                                    </div>
                                    <Input type="submit" value="Đặt hàng" className="btn btn-success btn-save" />
                                </Col>
                            </Row>
                        </Form>
                    </ModalBody>
                    <ModalFooter className="cart-footer">
                        <div>
                            {/* <Button onClick={toggleConfirm} color="success">Thanh toán</Button>{' '} */}
                            <Button color="secondary" onClick={toggle}>Quay lại</Button>
                        </div>
                    </ModalFooter>
                </Modal>
            </div>
        </div >
    )
}
