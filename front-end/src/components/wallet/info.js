/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Input, Table, Button, Container } from 'reactstrap';
import ReactPaginate from 'react-paginate';
import { FaSearch } from 'react-icons/fa';

import { api } from '../../config/axios';
import HistoryItem from './historyItem';
import { formatCurrency } from '../../common/formatCurrency';
import Messenger from '../common/messenger';

export default function Info() {
    const [status, setStatus] = useState('');
    const [paymentCode, setPaymentCode] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [balance, setBalance] = useState(0);

    const [offset, setOffset] = useState(0);
    const [perPage, setPerpage] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [history, setHistory] = useState([]);
    const [pageCount, setPageCount] = useState(0);

    const onChangeStatus = (e) => {
        setStatus(e.target.value);
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

    useEffect(() => {
        window.scrollTo(0, 0);
        receivedData(status, paymentCode, fromDate, toDate);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage])

    const search = () => {
        if (currentPage > 0) {
            setCurrentPage(0);
            setOffset(0);
        }
        receivedData(status, paymentCode, fromDate, toDate);
    }

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * perPage;

        setCurrentPage(selectedPage);
        setOffset(offset);
        // receivedData(0, '');
    };

    const receivedData = (status, paymentCode, fromDate, toDate) => {
        window.scrollTo(0, 0);
        let currentUser = localStorage.getItem("currentUser");
        if (currentUser === undefined || currentUser === null) {
            currentUser = localStorage.getItem("currentAdmin");
        }
        api.get(`/users/findByPhoneNumber/${currentUser}`)
            .then(res => {
                const currentUser = res.data;
                setBalance(currentUser.balance);
                api.get(`/payment/history?userId=${currentUser.id}&paymentCode=${paymentCode}&status=${status}&fromDate=${fromDate}&toDate=${toDate}&paymentType=`, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                })
                    .then(res => {
                        const data = res.data;
                        const slice = data.slice(offset, offset + perPage)
                        const historyPaging = slice.map((history, index) => {
                            return <HistoryItem key={index} history={history} isWithdrawal={false} />
                        })

                        setHistory(historyPaging);
                        setPageCount(Math.ceil(data.length / perPage));
                    })
            })
    }

    return (
        <Container className="wallet-info">
            <hr />
            <div className="balance">S??? d?? t??i kho???n: {formatCurrency(balance)} VN??</div>
            <hr />
            <div className="history">
                <h3 className="history-title">L???ch s??? giao d???ch</h3>
                <div className="wallet-search" id="wallet-search">
                    <div>
                        <Input
                            type="text"
                            value={paymentCode}
                            onChange={onChangePaymentCode}
                            placeholder="M?? giao d???ch"
                        />
                    </div>

                    <div>
                        <Input
                            type="select"
                            name="status"
                            id="status"
                            onChange={onChangeStatus}
                            value={status}
                        >
                            <option value="">T???t c???</option>
                            <option value="success">Th??nh c??ng</option>
                            <option value="pending">??ang x??? l??</option>
                            <option value="fail">Th???t b???i</option>
                        </Input>
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
                        <Button color="primary" className="btn-search-wallet" onClick={search}><FaSearch className="icon-search" /></Button>
                    </div>
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
            <Messenger />
        </Container>
    )
}
