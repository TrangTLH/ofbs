/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { FaExclamationCircle } from 'react-icons/fa';
import { Container } from 'reactstrap';
import { Notify } from '../../common/notify';
import { api } from '../../config/axios';

export default function Cancel() {
    const [paymentHistoryId, setPaymentHistoryId] = useState('');
    const [paymentType, setPaymentType] = useState('');
    const [orderId, setOrderId] = useState('');

    useEffect(() => {
        setPaymentHistoryId(localStorage.getItem("paymentHistoryId"));
        setPaymentType(localStorage.getItem("paymentType"));
        setOrderId(localStorage.getItem("orderId"));

        if (paymentHistoryId !== null && paymentHistoryId !== undefined && paymentHistoryId !== '') {
            api({
                method: 'PATCH',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                url: `/payment/updateStatus?paymentId=${paymentHistoryId}&status=fail`
            }).then(res => {
                localStorage.removeItem("paymentHistoryId");
                localStorage.removeItem("paymentType");
            })
        } else if (orderId !== null && orderId !== undefined && orderId !== '') {
            api({
                method: 'PATCH',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                url: `/orders/updateStatus?orderId=${orderId}&status=cancelled`
            }).then(res => {
                localStorage.removeItem("orderId");
            })
        }
    }, [paymentHistoryId, orderId]);

    return (
        <div>
            <Container className="cancel">
                <div>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi !</div>
                <FaExclamationCircle className="icon-cancel" />
                <h5>Đã hủy thanh toán</h5>
                <a href="/">Về trang chủ</a>
            </Container>
        </div>
    )
}
