/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Input, Table, Button, Container, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ReactPaginate from 'react-paginate';
import { FaSearch } from 'react-icons/fa';

import { api } from '../../config/axios';
import HistoryItem from '../wallet/historyItem';
import { Notify } from '../../common/notify';
import { validateEmpty } from '../../common/validate';

export default function WalletManageRecharge() {
    const [paymentCode, setPaymentCode] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [balance, setBalance] = useState(0);
    const [money, setMoney] = useState('');
    const [phone, setPhone] = useState('');
    const [nameCharge, setNameCharge] = useState('');
    const [phoneCharge, setPhoneCharge] = useState('');
    const [userName, setUsername] = useState('');
    const [chargeUser, setChargeUser] = useState('');

    const [offset, setOffset] = useState(0);
    const [perPage, setPerpage] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [history, setHistory] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [modal, setModal] = useState(false);
    const [modal1, setModal1] = useState(false);

    const toggle = () => {
        setModal(!modal);
    }

    const toggle1 = () => {
        setModal1(!modal1);
    }

    const onChangeFrom = (e) => {
        setFromDate(e.target.value);
    };

    const onChangeTo = (e) => {
        setToDate(e.target.value);
    };

    const onChangePaymentCode = (e) => {
        setPaymentCode(e.target.value);
    };

    const onChangeMoney = (e) => {
        setMoney(e.target.value);
    };

    const onChangePhone = (e) => {
        setPhone(e.target.value);
    };

    const onChangeNameCharge = (e) => {
        setNameCharge(e.target.value);
    };

    const onChangePhoneCharge = (e) => {
        setPhoneCharge(e.target.value);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        receivedData(paymentCode, fromDate, toDate);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, history.length])

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * perPage;

        setCurrentPage(selectedPage);
        setOffset(offset);
        // receivedData(0, '');
    };

    const search = () => {
        if (currentPage > 0) {
            setCurrentPage(0);
            setOffset(0);
        }
        receivedData(paymentCode, fromDate, toDate);
    }

    const receivedData = (paymentCode, fromDate, toDate) => {
        window.scrollTo(0, 0);
        let currentUser = localStorage.getItem("currentUser");
        if (currentUser === undefined || currentUser === null) {
            currentUser = localStorage.getItem("currentAdmin");
        }
        api.get(`/users/findByPhoneNumber/${currentUser}`)
            .then(res => {
                api.get(`/payment/history?userId=0&paymentCode=${paymentCode}&status=pending&fromDate=${fromDate}&toDate=${toDate}&paymentType=charge`, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                })
                    .then(res => {
                        const data = res.data;
                        const slice = data.slice(offset, offset + perPage)
                        const historyPaging = slice.map((history, index) => {
                            return <HistoryItem key={index} history={history} type='charge' receivedData={receivedData} />
                        })

                        setHistory(historyPaging);
                        setPageCount(Math.ceil(data.length / perPage));
                    })
            })
    }

    const validate = () => {
        if (!validateEmpty(money) || money === '0') {
            Notify('Vui lòng nhập số tiền hoặc số tiền không hợp lệ', 'error', 'top-right');
            return false;
        } else if (parseFloat(money) < 10000) {
            Notify('Số tiền tối thiểu có thể nạp hoặc rút là 10000VNĐ', 'error', 'top-right');
            return false;
        } else if (!validateEmpty(phone.trim())) {
            Notify('Số điện thoại không được để trống', 'error', 'top-right');
            return false;
        } else {
            return true;
        }
    }

    const recharge = () => {
        let des = '';
        if (nameCharge !== '') {
            des += '. Tên người nạp: ' + nameCharge;
        }

        if (phoneCharge !== '') {
            des += ', số điện thoại người nạp: ' + phoneCharge;
        }
        api.post(`/payment/save`,
            {
                "user": chargeUser,
                "fromToUser": chargeUser,
                "balanceChange": parseFloat(money),
                "currentBalance": parseFloat(chargeUser.balance) + parseFloat(money),
                "description": 'Nạp tiền vào ví FBS - Tiền mặt' + des,
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
            api({
                method: 'PATCH',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                url: `/payment/updateStatus?paymentId=${res.data.id}&status=success`
            }).then(res => {
                api({
                    method: 'PATCH',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    url: `users/updateBalance?balance=${parseFloat(chargeUser.balance) + parseFloat(money)}&userId=${chargeUser.id}`
                }).then(res => {
                    let customer = null;
                    let provider = null;

                    if (chargeUser.role.name === 'ROLE_PROVIDER') {
                        provider = chargeUser;
                    } else if (chargeUser.role.name === 'ROLE_CUSTOMER') {
                        customer = chargeUser;
                    }

                    api.post(`/notifications/insertNotification`,
                        {
                            "content": `Chúng tôi đã xử lý yêu cầu nạp tiền vào ví của bạn, vui lòng kiểm tra số dư trong ví`,
                            "customer": customer,
                            "provider": provider,
                            "forAdmin": false,
                            "type": "report",
                            "read": false
                        }
                    ).then(res => {
                        Notify('Nạp tiền vào ví thành công', 'success', 'top-right');
                        toggle1();
                        toggle();
                        setMoney('');
                        setPhone('');
                        setUsername('');
                    })
                })
            })
        })
    }

    const check = () => {
        let phoneFormat = '+84' + phone.substring(1, phone.length);
        api.get(`/users/findByPhoneNumber/${phoneFormat}`)
            .then(res => {
                if (res.data !== null && res.data !== '' && res.data !== undefined) {
                    setUsername(res.data.name);
                } else {
                    setUsername('Không có thông tin');
                }
            })
    }

    return (
        <Container className="admin-wallet">
            <h3 className="history-title">Quản lý nạp tiền</h3>
            <div className="admin-wallet-search" id="admin-wallet-search">
                <div>
                    <Input
                        type="text"
                        value={paymentCode}
                        onChange={onChangePaymentCode}
                        placeholder="Mã giao dịch"
                    />
                </div>

                <div className="order-from">
                    <div><b>Từ </b></div>
                    <Input
                        type="date"
                        value={fromDate}
                        max={toDate}
                        onChange={onChangeFrom}
                    />
                </div>
                <div className="order-to">
                    <div><b>Đến </b></div>
                    <Input
                        type="date"
                        value={toDate}
                        min={fromDate}
                        onChange={onChangeTo}
                    />
                </div>
                <div>
                    <Button color="primary" className="btn-search-wallet" onClick={() => search()}><FaSearch className="icon-search" /></Button>
                </div>
                <div><Button color="primary" onClick={() => {
                    toggle();
                }}>Xử lý nạp tiền</Button>
                    <Modal isOpen={modal} toggle={toggle} className={``}>
                        <ModalHeader toggle={toggle}>Nạp tiền</ModalHeader>
                        <ModalBody>
                            <div>
                                <b>Nhập số tiền <span className="require-icon">*</span></b>
                                <Input
                                    className="mt-2"
                                    type="number"
                                    min={10000}
                                    placeholder="Nhập số tiền"
                                    value={money}
                                    onChange={onChangeMoney}
                                />
                            </div>
                            <div className="mt-3">
                                <b>Số điện thoại (tài khoản) nạp tiền <span className="require-icon">*</span></b>
                                <Input
                                    className="mt-2"
                                    type="text"
                                    placeholder="Nhập số điện thoại. Vd: 012345678"
                                    value={phone}
                                    onChange={onChangePhone}
                                />
                            </div>
                            <div className="mt-2">
                                <Button color="primary" onClick={() => {
                                    check();
                                }}>
                                    Kiểm tra
                                </Button>
                                <span style={{ marginLeft: '10px', fontWeight: '500' }}>{userName}</span>
                            </div>
                            <div className="mt-3">
                                <b>Tên người nạp tiền (nếu nạp hộ)</b>
                                <Input
                                    className="mt-2"
                                    type="text"
                                    placeholder="Tên người nạp tiền"
                                    value={nameCharge}
                                    onChange={onChangeNameCharge}
                                />
                            </div>
                            <div className="mt-3">
                                <b>Số điện thoại người nạp tiền (nếu nạp hộ)</b>
                                <Input
                                    className="mt-2"
                                    type="text"
                                    placeholder="Số điện thoại người nạp tiền"
                                    value={phoneCharge}
                                    onChange={onChangePhoneCharge}
                                />
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="success" onClick={() => {
                                if (validate()) {
                                    let phoneFormat = '+84' + phone.substring(1, phone.length);
                                    api.get(`/users/findByPhoneNumber/${phoneFormat}`)
                                        .then(res => {
                                            if (res.data !== null && res.data !== '' && res.data !== undefined) {
                                                setBalance(res.data.balance);
                                                setChargeUser(res.data);
                                                setUsername(res.data.name);
                                                toggle1();
                                            } else {
                                                Notify('Số điện thoại không có trong hệ thống', 'error', 'top-right');
                                                setUsername('Không có thông tin');
                                            }
                                        })
                                }
                            }}>
                                Nạp tiền
                            </Button>
                            <Modal isOpen={modal1} toggle={toggle1} className={``}>
                                <ModalHeader toggle={toggle1}>Nạp tiền</ModalHeader>
                                <ModalBody>
                                    Bạn có chắc chắn muốn nạp tiền ?
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="success" onClick={() => recharge()}>
                                        Đồng ý
                                    </Button>
                                    <Button color="secondary" onClick={toggle1}>Quay lại</Button>
                                </ModalFooter>
                            </Modal>
                            <Button color="secondary" onClick={toggle}>Quay lại</Button>
                        </ModalFooter>
                    </Modal>
                </div>
            </div>
            <div className="table-responsive">
                <Table>
                    <thead>
                        <tr>
                            <th>Mã giao dịch</th>
                            <th>Loại</th>
                            <th>Số tiền (VNĐ)</th>
                            <th>Thời gian</th>
                            <th>Ghi chú</th>
                            <th>Trạng thái</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.length > 0 && history}
                    </tbody>
                </Table>
            </div>
            {
                (history && history.length > 0) ? <>
                    {
                        pageCount > 1 && <ReactPaginate
                            previousLabel={"Trang trước"}
                            nextLabel={"Trang sau"}
                            breakLabel={"..."}
                            breakClassName={"break-me"}
                            pageCount={pageCount}
                            marginPagesDisplayed={3}
                            pageRangeDisplayed={3}
                            onPageChange={handlePageClick}
                            containerClassName={"pagination"}
                            subContainerClassName={"pages pagination"}
                            activeClassName={"active"}
                        />
                    }
                </> : <div className="not-found">
                    Không tìm thấy kết quả nào
                </div>
            }
        </Container>
    )
}
