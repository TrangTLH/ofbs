/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Input, Table, Button, Container } from 'reactstrap';
import ReactPaginate from 'react-paginate';
import { FaSearch } from 'react-icons/fa';

import { api } from '../../config/axios';
import HistoryItem from '../wallet/historyItem';

export default function WalletManageWithdrawal() {
    const [paymentCode, setPaymentCode] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [balance, setBalance] = useState(0);

    const [offset, setOffset] = useState(0);
    const [perPage, setPerpage] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [history, setHistory] = useState([]);
    const [pageCount, setPageCount] = useState(0);

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
                const currentUser = res.data;
                setBalance(currentUser.balance);
                api.get(`/payment/history?userId=0&paymentCode=${paymentCode}&status=pending&fromDate=${fromDate}&toDate=${toDate}&paymentType=withdrawal`, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                })
                    .then(res => {
                        const data = res.data;
                        const slice = data.slice(offset, offset + perPage)
                        const historyPaging = slice.map((history, index) => {
                            return <HistoryItem key={index} history={history} type='withdrawal' receivedData={receivedData} />
                        })

                        setHistory(historyPaging);
                        setPageCount(Math.ceil(data.length / perPage));
                    })
            })
    }

    return (
        <Container className="admin-wallet">
            <div className="history">
                <h3 className="history-title">Quản lý rút tiền</h3>
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
            </div>
        </Container>
    )
}
