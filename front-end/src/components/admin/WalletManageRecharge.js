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
            Notify('Vui l??ng nh???p s??? ti???n ho???c s??? ti???n kh??ng h???p l???', 'error', 'top-right');
            return false;
        } else if (parseFloat(money) < 10000) {
            Notify('S??? ti???n t???i thi???u c?? th??? n???p ho???c r??t l?? 10000VN??', 'error', 'top-right');
            return false;
        } else if (!validateEmpty(phone.trim())) {
            Notify('S??? ??i???n tho???i kh??ng ???????c ????? tr???ng', 'error', 'top-right');
            return false;
        } else {
            return true;
        }
    }

    const recharge = () => {
        let des = '';
        if (nameCharge !== '') {
            des += '. T??n ng?????i n???p: ' + nameCharge;
        }

        if (phoneCharge !== '') {
            des += ', s??? ??i???n tho???i ng?????i n???p: ' + phoneCharge;
        }
        api.post(`/payment/save`,
            {
                "user": chargeUser,
                "fromToUser": chargeUser,
                "balanceChange": parseFloat(money),
                "currentBalance": parseFloat(chargeUser.balance) + parseFloat(money),
                "description": 'N???p ti???n v??o v?? FBS - Ti???n m???t' + des,
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
                            "content": `Ch??ng t??i ???? x??? l?? y??u c???u n???p ti???n v??o v?? c???a b???n, vui l??ng ki???m tra s??? d?? trong v??`,
                            "customer": customer,
                            "provider": provider,
                            "forAdmin": false,
                            "type": "report",
                            "read": false
                        }
                    ).then(res => {
                        Notify('N???p ti???n v??o v?? th??nh c??ng', 'success', 'top-right');
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
                    setUsername('Kh??ng c?? th??ng tin');
                }
            })
    }

    return (
        <Container className="admin-wallet">
            <h3 className="history-title">Qu???n l?? n???p ti???n</h3>
            <div className="admin-wallet-search" id="admin-wallet-search">
                <div>
                    <Input
                        type="text"
                        value={paymentCode}
                        onChange={onChangePaymentCode}
                        placeholder="M?? giao d???ch"
                    />
                </div>

                <div className="order-from">
                    <div><b>T??? </b></div>
                    <Input
                        type="date"
                        value={fromDate}
                        max={toDate}
                        onChange={onChangeFrom}
                    />
                </div>
                <div className="order-to">
                    <div><b>?????n </b></div>
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
                }}>X??? l?? n???p ti???n</Button>
                    <Modal isOpen={modal} toggle={toggle} className={``}>
                        <ModalHeader toggle={toggle}>N???p ti???n</ModalHeader>
                        <ModalBody>
                            <div>
                                <b>Nh???p s??? ti???n <span className="require-icon">*</span></b>
                                <Input
                                    className="mt-2"
                                    type="number"
                                    min={10000}
                                    placeholder="Nh???p s??? ti???n"
                                    value={money}
                                    onChange={onChangeMoney}
                                />
                            </div>
                            <div className="mt-3">
                                <b>S??? ??i???n tho???i (t??i kho???n) n???p ti???n <span className="require-icon">*</span></b>
                                <Input
                                    className="mt-2"
                                    type="text"
                                    placeholder="Nh???p s??? ??i???n tho???i. Vd: 012345678"
                                    value={phone}
                                    onChange={onChangePhone}
                                />
                            </div>
                            <div className="mt-2">
                                <Button color="primary" onClick={() => {
                                    check();
                                }}>
                                    Ki???m tra
                                </Button>
                                <span style={{ marginLeft: '10px', fontWeight: '500' }}>{userName}</span>
                            </div>
                            <div className="mt-3">
                                <b>T??n ng?????i n???p ti???n (n???u n???p h???)</b>
                                <Input
                                    className="mt-2"
                                    type="text"
                                    placeholder="T??n ng?????i n???p ti???n"
                                    value={nameCharge}
                                    onChange={onChangeNameCharge}
                                />
                            </div>
                            <div className="mt-3">
                                <b>S??? ??i???n tho???i ng?????i n???p ti???n (n???u n???p h???)</b>
                                <Input
                                    className="mt-2"
                                    type="text"
                                    placeholder="S??? ??i???n tho???i ng?????i n???p ti???n"
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
                                                Notify('S??? ??i???n tho???i kh??ng c?? trong h??? th???ng', 'error', 'top-right');
                                                setUsername('Kh??ng c?? th??ng tin');
                                            }
                                        })
                                }
                            }}>
                                N???p ti???n
                            </Button>
                            <Modal isOpen={modal1} toggle={toggle1} className={``}>
                                <ModalHeader toggle={toggle1}>N???p ti???n</ModalHeader>
                                <ModalBody>
                                    B???n c?? ch???c ch???n mu???n n???p ti???n ?
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="success" onClick={() => recharge()}>
                                        ?????ng ??
                                    </Button>
                                    <Button color="secondary" onClick={toggle1}>Quay l???i</Button>
                                </ModalFooter>
                            </Modal>
                            <Button color="secondary" onClick={toggle}>Quay l???i</Button>
                        </ModalFooter>
                    </Modal>
                </div>
            </div>
            <div className="table-responsive">
                <Table>
                    <thead>
                        <tr>
                            <th>M?? giao d???ch</th>
                            <th>Lo???i</th>
                            <th>S??? ti???n (VN??)</th>
                            <th>Th???i gian</th>
                            <th>Ghi ch??</th>
                            <th>Tr???ng th??i</th>
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
                            previousLabel={"Trang tr?????c"}
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
                    Kh??ng t??m th???y k???t qu??? n??o
                </div>
            }
        </Container>
    )
}
