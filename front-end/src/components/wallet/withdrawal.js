import React, { useState } from 'react';
import {
    Button, Col, Container, Input, Row,
    FormGroup, Label, Modal, ModalHeader,
    ModalBody, ModalFooter
} from 'reactstrap';
import { Notify } from '../../common/notify';
import { api } from '../../config/axios';
import Messenger from '../common/messenger';

export default function Withdrawal() {
    const [money, setMoney] = useState('');
    const [active, setActive] = useState(0);
    const [modal, setModal] = useState(false);
    const [content, setContent] = useState('');

    const onChangeContent = (e) => {
        setContent(e.target.value)
    }

    const toggle = () => setModal(!modal);

    const onChangeMoney = (e) => {
        setMoney(e.target.value)
    }

    const showContent = (type) => {
        if (type === 0) {
            document.getElementById('address1').style.display = 'flex';
            document.getElementById('bank-info1').style.display = 'none';
        } else if (type === 1) {
            document.getElementById('bank-info1').style.display = 'flex';
            document.getElementById('address1').style.display = 'none';
        }
    }

    const checkWithdrawalPending = () => {
        let currentUser = localStorage.getItem("currentUser");
        api.get(`/users/findByPhoneNumber/${currentUser}`)
            .then(res => {
                const currentUser = res.data;
                api.get(`/payment/history?userId=${currentUser.id}&paymentCode=&status=pending&fromDate=&toDate=&paymentType=withdrawal`, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                })
                    .then(res => {
                        if (res.data.length === 0) {

                        }
                    })
            });
    }

    const withdrawal = () => {
        let description = '';

        let currentUser = localStorage.getItem("currentUser");
        api.get(`/users/findByPhoneNumber/${currentUser}`)
            .then(res => {
                const currentUser = res.data;
                api.get(`/payment/history?userId=${currentUser.id}&paymentCode=&status=pending&fromDate=&toDate=&paymentType=withdrawal`, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                })
                    .then(res => {
                        if (res.data.length === 0) {
                            if (active === 0) {
                                description = 'R??t ti???n v?? FBS - Ti???n m???t';
                                api.get(`/users/findByPhoneNumber/${localStorage.getItem("currentUser")}`)
                                    .then(res => {
                                        const currentUser = res.data;
                                        if (parseFloat(currentUser.balance) >= money) {
                                            api.post(`/payment/save`,
                                                {
                                                    "user": currentUser,
                                                    "fromToUser": currentUser,
                                                    "balanceChange": parseFloat(money * -1),
                                                    "currentBalance": parseFloat(currentUser.balance) - parseFloat(money),
                                                    "description": description,
                                                    "paymentType": {
                                                        "name": "withdrawal"
                                                    }
                                                },
                                                {
                                                    headers: {
                                                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                                                    }
                                                }
                                            ).then(res => {
                                                Notify('Y??u c???u r??t ti???n c???a b???n ???? ???????c g???i l??n h??? th???ng, ch??ng t??i s??? xem x??t v?? x??? l?? s???m nh???t',
                                                    'success', 'top-right'
                                                );
                                                setMoney('');
                                                toggle();
                                            })
                                        } else {
                                            Notify('S??? d?? trong v?? c???a b???n kh??ng ?????', 'error', 'top-right');
                                        }
                                    })
                            } else if (active === 1) {
                                description = 'R??t ti???n v?? FBS - Chuy???n kho???n ng??n h??ng. Th??ng tin t??i kho???n: ' + content;
                                api.get(`/users/findByPhoneNumber/${localStorage.getItem("currentUser")}`)
                                    .then(res => {
                                        const currentUser = res.data;
                                        if (parseFloat(currentUser.balance) >= money) {
                                            api.post(`/payment/save`,
                                                {
                                                    "user": currentUser,
                                                    "fromToUser": currentUser,
                                                    "balanceChange": parseFloat(money * -1),
                                                    "currentBalance": parseFloat(currentUser.balance) - parseFloat(money),
                                                    "description": description,
                                                    "paymentType": {
                                                        "name": "withdrawal"
                                                    }
                                                },
                                                {
                                                    headers: {
                                                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                                                    }
                                                }
                                            ).then(res => {
                                                Notify('Y??u c???u r??t ti???n c???a b???n ???? ???????c g???i l??n h??? th???ng, ch??ng t??i s??? xem x??t v?? x??? l?? s???m nh???t',
                                                    'success', 'top-right'
                                                );
                                                toggle();
                                            })
                                        } else {
                                            Notify('S??? d?? trong v?? c???a b???n kh??ng ?????', 'error', 'top-right');
                                        }
                                    })
                            }
                        } else {
                            toggle();
                            setMoney('');
                            Notify('Y??u c???u r??t ti???n tr?????c ???? c???a b???n ch??a ???????c x??? l??', 'error', 'top-right');
                        }
                    })
            });
    }

    return (
        <Container className="wallet-recharge">
            <Row >
                <Col lg="6" md="12" sm="12">
                    <FormGroup tag="fieldset" className="recharge">
                        <div className="recharge-title">Ch???n ph????ng th???c r??t ti???n</div>
                        <FormGroup check>
                            <Label check>
                                <Input
                                    type="radio"
                                    name="radio1"
                                    checked={active === 0}
                                    onClick={() => {
                                        setActive(0);
                                        showContent(0);
                                    }}
                                />{' '}
                                <span className="type-recharge">R??t ti???n b???ng ti???n m???t</span>
                            </Label>
                            <ul id="address1">
                                <li><span className="bank-info-title">?????a ch???:</span> Khu c??ng ngh??? cao H??a L???c ??? Km29, ??CT08, Th???ch Ho??, Th???ch Th???t, H?? N???i</li>
                                <li><span className="bank-info-title">S??? ??i???n tho???i:</span> 0368020200</li>
                            </ul>
                        </FormGroup>
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
                                <span className="type-recharge">R??t ti???n b???ng chuy???n kho???n qua ng??n h??ng</span>
                                <ul id="bank-info1">
                                    <li><span className="bank-info-title">Vui l??ng ghi th??ng tin t??i kho???n ng??n h??ng theo m???u:</span>
                                        <i> T??n ng??n h??ng + T??n ch??? t??i kho???n ng??n h??ng + S??? s??? t??i kho???n ng??n h??ng + S??? ??i???n tho???i + R??t ti???n v?? FBS. </i><br />
                                    </li>
                                    <li><span className="bank-info-title">V?? d???: </span>TP Bank, Nguyen Quang Huy, 02923354901, 0368020200, rut tien vi FBS.</li>
                                    <div className="description-withdrawal">
                                        <Input
                                            className="content"
                                            type="textarea"
                                            value={content}
                                            onChange={onChangeContent}
                                            placeholder="Nh???p th??ng tin t??i kho???n ng??n h??ng"
                                        />
                                    </div>
                                </ul>
                            </Label>
                        </FormGroup>
                    </FormGroup>
                </Col>
                <Col lg="6" md="12" sm="12" className="form-recharge">
                    <div>Nh???p s??? ti???n mu???n r??t (VN??)</div>
                    <Input
                        type="number"
                        value={money}
                        onChange={onChangeMoney}
                        min={10000}
                        placeholder="Nh???p s??? ti???n mu???n r??t"
                    />
                    <Button color="success" onClick={() => {
                        if (parseFloat(money) > 0 && money !== '') {
                            if (parseFloat(money) >= 10000) {
                                if (content.trim() !== '') {
                                    toggle();
                                } else if (active === 1) {
                                    Notify('Vui l??ng nh???p th??ng tin t??i kho???n ng??n h??ng c???a b???n', 'error', 'top-right');
                                } else {
                                    toggle();
                                }
                            } else {
                                Notify('S??? ti???n t???i thi???u c?? th??? n???p ho???c r??t l?? 10000VN??', 'error', 'top-right');
                            }
                        } else {
                            Notify('Vui l??ng nh???p s??? ti???n c???n r??t', 'error', 'top-right');
                        }
                    }}>R??t ti???n</Button>
                    <Modal isOpen={modal} toggle={toggle} className={``}>
                        <ModalHeader toggle={toggle}>Th??ng b??o</ModalHeader>
                        <ModalBody>
                            B???n c?? ch???c mu???n r??t ti???n ?
                        </ModalBody>
                        <ModalFooter>
                            <Button color="success" onClick={withdrawal}>?????ng ??</Button>{' '}
                            <Button color="secondary" onClick={toggle}>Quay l???i</Button>
                        </ModalFooter>
                    </Modal>
                </Col>
            </Row>
            <Messenger />
        </Container>
    )
}
