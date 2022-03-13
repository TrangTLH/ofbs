/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import {
    Button, Col, Input, Row, Container,
    FormGroup, Label, Modal, ModalHeader,
    ModalBody, ModalFooter
} from 'reactstrap';
import { PayPalButton } from "react-paypal-button-v2";
import { Notify } from '../../common/notify';
import { api } from '../../config/axios';
import Spinner from '../common/spinner';
import Messenger from '../common/messenger';

export default function Recharge() {
    const [money, setMoney] = useState('');
    // const [otp, setOtp] = useState('');
    const [active, setActive] = useState(1);
    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const toggle = () => setModal(!modal);

    const onChangeMoney = (e) => {
        setMoney(e.target.value)
    }

    const showContent = (type) => {
        if (type === 1) {
            document.getElementById('bank-info').style.display = 'flex';
            document.getElementById('recharge-btn').style.display = 'block';
            document.getElementById('paypal-btn').style.display = 'none';
            document.getElementById('input-money').readOnly = false;
        } else if (type === 2) {
            document.getElementById('bank-info').style.display = 'none';
            // document.getElementById('recharge-btn').style.display = 'none';
            // document.getElementById('paypal-btn').style.display = 'block';
        }
    }


    const paypalChechout = () => {
        let description = '';
        if (active === 1) {
            description = 'Nạp tiền vào ví FBS - Chuyển khoản qua ngân hàng';
            api.get(`/users/findByPhoneNumber/${localStorage.getItem("currentUser")}`)
                .then(res => {
                    const currentUser = res.data;
                    api.post(`/payment/save`,
                        {
                            "user": currentUser,
                            "fromToUser": currentUser,
                            "balanceChange": parseFloat(money),
                            "currentBalance": parseFloat(currentUser.balance) + parseFloat(money),
                            "description": description,
                            "paymentType": {
                                "name": "charge"
                            }
                        },
                        {
                            headers: {
                                'Authorization': 'Bearer ' + localStorage.getItem('token')
                            }
                        }
                    ).then(res => {
                        setMoney('');
                        Notify('Yêu cầu nạp tiền của bạn đã được gửi lên hệ thống, chúng tôi sẽ xem xét và xử lý sớm nhất',
                            'success', 'top-right'
                        );
                        toggle();
                    })
                })
        }
        // else {
        //     description = 'Nạp tiền vào ví FBS - Ví Paypal';
        //     api.get(`/users/findByPhoneNumber/${localStorage.getItem("currentUser")}`)
        //         .then(res => {
        //             const currentUser = res.data;
        //             api.post(`/payment/save`,
        //                 {
        //                     "user": currentUser,
        //                     "fromToUser": currentUser,
        //                     "balanceChange": money,
        //                     "currentBalance": parseFloat(currentUser.balance) + parseFloat(money),
        //                     "description": description,
        //                     "paymentType": {
        //                         "name": "charge"
        //                     }
        //                 },
        //                 {
        //                     headers: {
        //                         'Authorization': 'Bearer ' + localStorage.getItem('token')
        //                     }
        //                 }
        //             ).then(res => {
        //                 localStorage.setItem("paymentHistoryId", res.data.id);
        //                 localStorage.setItem("paymentType", res.data.paymentType.name);

        //                 api({
        //                     method: 'POST',
        //                     url: `/payment/pay?price=${money / 23000}&description=${'Nạp tiền vào ví FBS'}`,
        //                     headers: {
        //                         'Authorization': 'Bearer ' + localStorage.getItem('token')
        //                     }
        //                 })
        //                     .then(res => {
        //                         setLoading(false);
        //                         window.location.replace(res.data);
        //                     }).catch(err => {
        //                         console.log(err);
        //                     });
        //             })
        //         })
        // }
    }

    const paypal = (status) => {
        api.get(`/users/findByPhoneNumber/${localStorage.getItem("currentUser")}`)
            .then(res => {
                const currentUser = res.data;
                api.post(`/payment/save`,
                    {
                        "user": currentUser,
                        "fromToUser": currentUser,
                        "balanceChange": money,
                        "currentBalance": parseFloat(currentUser.balance) + parseFloat(money),
                        "description": 'Nạp tiền vào ví FBS - Ví Paypal',
                        "paymentType": {
                            "name": "charge"
                        }
                    },
                    {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        }
                    }
                ).then(res => {
                    const balanceChange = res.data.balanceChange;
                    api({
                        method: 'PATCH',
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        },
                        url: `/payment/updateStatus?paymentId=${res.data.id}&status=${status}`
                    }).then(res => {
                        if (status === 'success') {
                            api({
                                method: 'PATCH',
                                headers: {
                                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                                },
                                url: `users/updateBalance?balance=${parseFloat(currentUser.balance) + parseFloat(balanceChange)}&userId=${currentUser.id}`
                            }).then(() => {
                                Notify('Nạp tiền vào ví thành công', 'success', 'top-right');
                                setMoney('');
                            })
                        } else if (status === 'fail') {
                            Notify('Nạp tiền vào ví không thành công', 'error', 'top-right');
                            setMoney('');
                        }
                    })
                })
            })
    }

    return (
        <Container className="wallet-recharge">
            <Row>
                <Col lg="6" md="12" sm="12">
                    <FormGroup tag="fieldset" className="recharge">
                        <div className="recharge-title">Chọn phương thức nạp tiền</div>
                        <hr />
                        <FormGroup check>
                            <Label check>
                                <Input
                                    type="radio"
                                    name="radio1"
                                    checked={active === 1}
                                    onClick={() => {
                                        setActive(1);
                                        showContent(1);
                                    }}
                                />{' '}
                                <span className="type-recharge">Nạp tiền bằng chuyển khoản qua ngân hàng</span>
                                <ul id="bank-info">
                                    <li><span className="bank-info-title">Ngân hàng:</span> Tien Phong Bank (TPBank)</li>
                                    <li><span className="bank-info-title">Số tài khoản:</span> 02923354901</li>
                                    <li><span className="bank-info-title">Tên chủ tài khoản:</span> Nguyễn Quang Huy</li>
                                    <li><span className="bank-info-title">Số điện thoại:</span> 0368020200</li>
                                    <li><span className="bank-info-title">Nội dung chuyển tiền (vui lòng ghi theo mẫu):</span>
                                        <i> Tên tài khoản FBS + số điện thoại đăng ký FBS + nạp tiền ví FBS. </i>
                                        Ví dụ: Nguyen Quang Huy 0368020200 nap tien vi FBS.
                                    </li>
                                </ul>
                            </Label>
                        </FormGroup>
                        <FormGroup check>
                            <Label check>
                                <Input
                                    type="radio"
                                    name="radio1"
                                    checked={active === 2}
                                    onClick={() => {
                                        setActive(2);
                                        showContent(2);
                                    }}
                                />{' '}
                                <span className="type-recharge">Nạp tiền bằng ví Paypal</span>
                            </Label>
                        </FormGroup>
                    </FormGroup>
                </Col>
                <Col lg="6" md="12" sm="12" className="form-recharge">
                    <div>Nhập số tiền muốn nạp (VNĐ)</div>
                    <Input
                        id="input-money"
                        type="number"
                        value={money}
                        onChange={onChangeMoney}
                        min={10000}
                        placeholder="Nhập số tiền muốn nạp"
                    />

                    <div id="paypal-btn" style={{ zIndex: '1', display: 'none' }}>
                        <PayPalButton
                            options={{
                                clientId: "AQaSaF02zb7zZbXZIlDArwaUY4L2RTY7NfZwoils6_dfoKGDO10lpJPe3zhe-X6qKVHCASPiOp4rIkNS",
                                currency: "USD"
                            }}
                            amount={parseFloat(money / 23000).toFixed(2)}
                            onSuccess={(details, data) => {
                                paypal('success');
                                document.getElementById('recharge-btn').style.display = 'block';
                                document.getElementById('paypal-btn').style.display = 'none';
                                document.getElementById('input-money').readOnly = false;
                            }}
                            onCancel={() => {
                                paypal('fail');
                                document.getElementById('recharge-btn').style.display = 'block';
                                document.getElementById('paypal-btn').style.display = 'none';
                                document.getElementById('input-money').readOnly = false;
                            }}
                        />
                    </div>

                    <Button id="recharge-btn" color="success" onClick={() => {
                        if (parseFloat(money) > 0 && money !== '') {
                            if (parseFloat(money) >= 10000) {
                                if (active === 1) {
                                    toggle();
                                } else {
                                    document.getElementById('recharge-btn').style.display = 'none';
                                    document.getElementById('input-money').readOnly = true;
                                    if (document.getElementById('paypal-btn')) {
                                        document.getElementById('paypal-btn').style.display = 'block';
                                    }
                                }
                            } else {
                                Notify('Số tiền tối thiểu có thể nạp hoặc rút là 10000VNĐ', 'error', 'top-right');
                            }
                        } else {
                            Notify('Vui lòng nhập số tiền cần nạp', 'error', 'top-right');
                        }
                    }}>Nạp tiền</Button>
                    <Modal isOpen={modal} toggle={toggle} className={``}>
                        <ModalHeader toggle={toggle}>Thông báo</ModalHeader>
                        <ModalBody>
                            Bạn có chắc muốn nạp tiền ?
                            {loading && <div className="mt-3">
                                <Spinner type="puffloader" />
                            </div>
                            }
                        </ModalBody>
                        <ModalFooter>
                            <Button color="success" onClick={paypalChechout}>Đồng ý</Button>{' '}
                            <Button color="secondary" onClick={toggle}>Quay lại</Button>
                        </ModalFooter>
                    </Modal>
                </Col>
            </Row>
            <Messenger />
        </Container>
    )
}
