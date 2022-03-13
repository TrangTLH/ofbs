/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { Container } from 'reactstrap';
import { Notify } from '../../common/notify';
import { api } from '../../config/axios';

export default function Success() {
    const [paymentHistoryId, setPaymentHistoryId] = useState('');
    const [paymentType, setPaymentType] = useState('');
    const [orderId, setOrderId] = useState('');

    useEffect(() => {
        setPaymentHistoryId(localStorage.getItem("paymentHistoryId"));
        setPaymentType(localStorage.getItem("paymentType"));
        setOrderId(localStorage.getItem("orderId"));

        api.get(`/users/findByPhoneNumber/${localStorage.getItem('currentUser')}`)
            .then(res => {
                const currentUser = res.data;
                if (paymentHistoryId !== null && paymentHistoryId !== undefined && paymentHistoryId !== '') {
                    api.get(`payment/getPaymentById?paymentId=${paymentHistoryId}`, {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        }
                    })
                        .then(res => {
                            const balanceChange = res.data.balanceChange;
                            api({
                                method: 'PATCH',
                                headers: {
                                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                                },
                                url: `/payment/updateStatus?paymentId=${paymentHistoryId}&status=success`
                            }).then(res => {
                                api({
                                    method: 'PATCH',
                                    headers: {
                                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                                    },
                                    url: `users/updateBalance?balance=${parseFloat(currentUser.balance) + parseFloat(balanceChange)}&userId=${currentUser.id}`
                                })
                                    .then(res => {
                                        Notify('Nạp tiền vào ví thành công', 'success', 'top-right');
                                        localStorage.removeItem("paymentHistoryId");
                                        localStorage.removeItem("paymentType");
                                    })
                            })
                        })
                } else if (orderId !== null && orderId !== undefined && orderId !== '') {
                    api({
                        method: 'PATCH',
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        },
                        url: `/orders/updateStatus?orderId=${orderId}&status=pending`
                    }).then(res => {
                        Notify('Thanh toán thành công', 'success', 'top-right');
                        localStorage.removeItem("orderId");
                    })
                }
            })

    }, [paymentHistoryId, orderId]);
    return (
        <div>
            <Container className="success">
                <div>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi !</div>
                <FaCheckCircle className="icon-success" />
                <h5>Thanh toán thành công</h5>
                <a href="/">Về trang chủ</a>
            </Container>
        </div>
    )
}
