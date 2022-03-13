import React, { useState } from 'react';
import {
    Button, Modal, ModalHeader, ModalBody,
    ModalFooter,
} from 'reactstrap';
import { formatCurrency } from '../../common/formatCurrency';
import { formatDate } from '../../common/formatDate';
import { Notify } from '../../common/notify';
import { api } from '../../config/axios';

export default function HistoryItem(props) {
    const history = props.history;
    const typePayment = props.type;
    let type = history.payment_type;
    let status = history.status;
    let money = parseFloat(history.balance_change);

    const [modal, setModal] = useState(false);
    const [modal1, setModal1] = useState(false);
    const [modal2, setModal2] = useState(false);
    const [modal3, setModal3] = useState(false);

    const toggle = () => {
        setModal(!modal);
    }

    const toggle1 = () => {
        setModal1(!modal1);
    }

    const toggle2 = () => {
        setModal2(!modal2);
    }

    const toggle3 = () => {
        setModal3(!modal3);
    }

    if (type === 'refund') {
        type = 'Hoàn tiền';
    } else if (type === 'pay') {
        type = 'Chuyển tiền';
    } else if (type === 'charge') {
        type = 'Nạp tiền';
    } else if (type === 'withdrawal') {
        type = 'Rút tiền';
    }

    if (status === 'success') {
        status = <div style={{ color: 'green', fontWeight: '500' }}>Thành công</div>
    } else if (status === 'fail') {
        status = <div style={{ color: 'red', fontWeight: '500' }}>Thất bại</div>
    } else {
        status = <div style={{ color: 'purple', fontWeight: '500' }}>Đang xử lý</div>
    }

    if (money >= 0) {
        money = <div style={{ color: 'green', fontWeight: '500' }}>+{formatCurrency(money)}</div>
    } else {
        money = <div style={{ color: 'red', fontWeight: '500' }}>-{formatCurrency(money * (-1))}</div>
    }

    const updateStatus = (event) => {
        let content = '';
        let notify = '';
        let status = '';

        if (event === 'accept') {
            content = `Yêu cầu rút tiền của bạn đã được xử lý, vui lòng kiểm tra số tài khoản, 
            nếu chưa nhận được tiền trong vòng 24h vui lòng liên hệ lại với chúng tôi qua Messenger`;
            notify = `Xác nhận thành công`;
            status = 'success';
        } else if (event === 'deny') {
            content = `Yêu cầu rút tiền của bạn bị hủy do không đáp ứng yêu cầu của chúng tôi, vui lòng 
            liên hệ lại với chúng tôi qua Messenger để biết thêm thông tin`;
            notify = `Hủy thành công`;
            status = 'fail';
        }

        api.get(`/users/findByPhoneNumber/${history.phone_login}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => {
                const currentUser = res.data;
                api({
                    method: 'PATCH',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    url: `/payment/updateStatus?paymentId=${history.id}&status=${status}`
                }).then(res => {
                    if (event === 'accept') {
                        api({
                            method: 'PATCH',
                            headers: {
                                'Authorization': 'Bearer ' + localStorage.getItem('token')
                            },
                            url: `users/updateBalance?balance=${parseFloat(currentUser.balance) + parseFloat(history.balance_change)}&userId=${currentUser.id}`
                        })
                            .then(res => {
                                let customer = null;
                                let provider = null;

                                if (currentUser.role.name === 'ROLE_PROVIDER') {
                                    provider = currentUser;
                                } else if (currentUser.role.name === 'ROLE_CUSTOMER') {
                                    customer = currentUser;
                                }
                                api.post(`/notifications/insertNotification`,
                                    {
                                        "content": content,
                                        "customer": customer,
                                        "provider": provider,
                                        "forAdmin": false,
                                        "type": "report",
                                        "read": false
                                    }
                                ).then(res => {
                                    Notify(notify, 'success', 'top-right');
                                    props.receivedData('', '', '');
                                    toggle();
                                })
                            })
                    } else {
                        let customer = null;
                        let provider = null;

                        if (currentUser.role.name === 'ROLE_PROVIDER') {
                            provider = currentUser;
                        } else if (currentUser.role.name === 'ROLE_CUSTOMER') {
                            customer = currentUser;
                        }
                        api.post(`/notifications/insertNotification`,
                            {
                                "content": content,
                                "customer": customer,
                                "provider": provider,
                                "forAdmin": false,
                                "type": "report",
                                "read": false
                            }
                        ).then(res => {
                            Notify(notify, 'success', 'top-right');
                            props.receivedData('', '', '');
                            toggle1();
                        })
                    }
                })
            })
    }

    const updateStatusCharge = (event) => {
        let content = '';
        let notify = '';
        let status = '';

        if (event === 'accept') {
            content = `Yêu cầu nạp tiền của bạn đã được xử lý, vui lòng kiểm tra số tài khoản, 
            nếu chưa nhận được tiền trong vòng 24h vui lòng liên hệ lại với chúng tôi qua Messenger`;
            notify = `Xác nhận thành công`;
            status = 'success';
        } else if (event === 'deny') {
            content = `Yêu cầu nạp tiền của bạn bị hủy do không đáp ứng yêu cầu của chúng tôi, vui lòng 
            liên hệ lại với chúng tôi qua Messenger để biết thêm thông tin`;
            notify = `Hủy thành công`;
            status = 'fail';
        }

        api.get(`/users/findByPhoneNumber/${history.phone_login}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => {
                const currentUser = res.data;
                let customer = null;
                let provider = null;

                if (currentUser.role.name === 'ROLE_PROVIDER') {
                    provider = currentUser;
                } else if (currentUser.role.name === 'ROLE_CUSTOMER') {
                    customer = currentUser;
                }

                api({
                    method: 'PATCH',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    url: `/payment/updateStatus?paymentId=${history.id}&status=${status}`
                }).then(res => {
                    if (event === 'accept') {
                        api({
                            method: 'PATCH',
                            headers: {
                                'Authorization': 'Bearer ' + localStorage.getItem('token')
                            },
                            url: `users/updateBalance?balance=${parseFloat(currentUser.balance) + parseFloat(history.balance_change)}&userId=${currentUser.id}`
                        })
                            .then(res => {
                                api.post(`/notifications/insertNotification`,
                                    {
                                        "content": content,
                                        "customer": customer,
                                        "provider": provider,
                                        "forAdmin": false,
                                        "type": "report",
                                        "read": false
                                    }
                                ).then(res => {
                                    Notify(notify, 'success', 'top-right');
                                    props.receivedData('', '', '');
                                    toggle2();
                                })
                            })
                    } else {
                        api.post(`/notifications/insertNotification`,
                            {
                                "content": content,
                                "customer": customer,
                                "provider": provider,
                                "forAdmin": false,
                                "type": "report",
                                "read": false
                            }
                        ).then(res => {
                            Notify(notify, 'success', 'top-right');
                            props.receivedData('', '', '');
                            toggle3();
                        })
                    }
                })
            })
    }

    return (
        <tr>
            <td>{history.payment_code}</td>
            <td>{type}</td>
            <td>{money}</td>
            <td>{formatDate(history.date_of_change)}</td>
            <td>{history.description}</td>
            <td>{status}</td>
            {
                typePayment === 'withdrawal' && <td>
                    <Button
                        color="primary"
                        onClick={toggle}
                    >
                        Xác nhận
                    </Button>
                    <Modal isOpen={modal} toggle={toggle} className={``}>
                        <ModalHeader toggle={toggle}>Thông báo</ModalHeader>
                        <ModalBody>
                            Lưu thay đổi ?
                        </ModalBody>
                        <ModalFooter>
                            <Button color="success" onClick={() => updateStatus('accept')}>
                                Đồng ý
                            </Button>
                            <Button color="secondary" onClick={toggle}>Quay lại</Button>
                        </ModalFooter>
                    </Modal>
                </td>
            }
            {
                typePayment === 'withdrawal' && <td>
                    <Button
                        color="danger"
                        onClick={toggle1}
                    >
                        Hủy
                    </Button>
                    <Modal isOpen={modal1} toggle={toggle1} className={``}>
                        <ModalHeader toggle={toggle1}>Thông báo</ModalHeader>
                        <ModalBody>
                            Lưu thay đổi ?
                        </ModalBody>
                        <ModalFooter>
                            <Button color="success" onClick={() => updateStatus('deny')}>
                                Đồng ý
                            </Button>
                            <Button color="secondary" onClick={toggle1}>Quay lại</Button>
                        </ModalFooter>
                    </Modal>
                </td>
            }
            {
                typePayment === 'charge' && <td>
                    <Button
                        color="primary"
                        onClick={toggle2}
                    >
                        Xác nhận
                    </Button>
                    <Modal isOpen={modal2} toggle={toggle2} className={``}>
                        <ModalHeader toggle={toggle2}>Thông báo</ModalHeader>
                        <ModalBody>
                            Lưu thay đổi ?
                        </ModalBody>
                        <ModalFooter>
                            <Button color="success" onClick={() => updateStatusCharge('accept')}>
                                Đồng ý
                            </Button>
                            <Button color="secondary" onClick={toggle2}>Quay lại</Button>
                        </ModalFooter>
                    </Modal>
                </td>
            }
            {
                typePayment === 'charge' && <td>
                    <Button
                        color="danger"
                        onClick={toggle3}
                    >
                        Hủy
                    </Button>
                    <Modal isOpen={modal3} toggle={toggle3} className={``}>
                        <ModalHeader toggle={toggle3}>Thông báo</ModalHeader>
                        <ModalBody>
                            Lưu thay đổi ?
                        </ModalBody>
                        <ModalFooter>
                            <Button color="success" onClick={() => updateStatusCharge('deny')}>
                                Đồng ý
                            </Button>
                            <Button color="secondary" onClick={toggle3}>Quay lại</Button>
                        </ModalFooter>
                    </Modal>
                </td>
            }
        </tr>
    )
}
