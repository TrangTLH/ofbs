import React, { useEffect, useState } from 'react';
import {
    Button, Modal, ModalHeader,
    ModalBody, ModalFooter, Row,
    Col, Container, Label, Input
} from 'reactstrap';
import { FaEye } from 'react-icons/fa';
import { api } from '../../config/axios';

import { formatDate, formatDateCheckRule, } from '../../common/formatDate';
import { formatCurrency } from '../../common/formatCurrency';
import OrderDetailDishItem from '../order/orderDetailDishItem';
import OrderDetailComboItem from '../order/orderDetailComboItem';
import OrderDetailServiceItem from '../order/orderDetailServiceItem';
import { Notify } from '../../common/notify';
import RuleOrder from '../common/ruleOrder';

let restaurantId = '';

export default function MyRestaurantOrderItem(props) {
    const order = props.order;
    let orderStatus = order.order_status;
    let currentUser = localStorage.getItem('currentUser');
    let displayOrderStatus = '';

    const [modal, setModal] = useState(false);
    const [modal1, setModal1] = useState(false);
    const [modal2, setModal2] = useState(false);
    const [modal3, setModal3] = useState(false);
    const [password, setPassword] = useState('');
    const [user, setUser] = useState('');
    const [orderDetailInfo, setOrderDetailInfo] = useState('');
    const [listOrderDetails, setListOrderDetails] = useState([]);

    if (orderStatus === 'pending') {
        displayOrderStatus = <b style={{ color: 'purple' }}>Đang chờ duyệt</b>
        orderStatus = 'Đang chờ duyệt';
    } else if (orderStatus === 'preparing') {
        displayOrderStatus = <b style={{ color: 'blue' }}>Chưa diễn ra</b>
        orderStatus = 'Chưa diễn ra';
    } else if (orderStatus === 'accomplished') {
        displayOrderStatus = <b style={{ color: 'green' }}>Đã hoàn thành</b>
        orderStatus = 'Đã hoàn thành';
    } else if (orderStatus === 'cancelled') {
        displayOrderStatus = <b style={{ color: 'red' }}>Đã hủy</b>
        orderStatus = 'Đã hủy';
    }

    useEffect(() => {
        restaurantId = localStorage.getItem('resId');
    })

    const toggle = () => {
        setModal(!modal);
        if (modal === false) {
            api.get(`/orders/orderDetail/infor?orderId=${order.order_id}&customerId=0&restaurantId=${restaurantId}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
                .then(res => {
                    setOrderDetailInfo(res.data[0]);
                    setListOrderDetails(res.data);
                    api.get(`/users/findByPhoneNumber/${order.customer_phone_number}`)
                        .then(res => {
                            setUser(res.data);
                        })
                })
        }
    }

    const toggle1 = () => { setModal1(!modal1) };

    const toggle2 = () => { setModal2(!modal2) };

    const toggle3 = () => { setModal3(!modal3) };

    const onChangePassword = (e) => {
        setPassword(e.target.value);
    }

    const outOfDateOrder = () => {
        api.get(`/users/findByPhoneNumber/${currentUser}`)
            .then(res => {
                const provider = res.data;
                api({
                    method: 'PATCH',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    url: `/orders/updateStatus?orderId=${order.order_id}&status=cancelled`
                }).then(res => {
                    api.post(`/notifications/insertNotification`,
                        {
                            "content": `Đơn hàng ${order.order_code} đã bị hủy`,
                            "customer": user,
                            "provider": null,
                            "forAdmin": false,
                            "type": "order",
                            "read": false
                        }
                    )
                        .then(res => {
                            api.get(`/users/findByRole?roleName=ROLE_ADMIN`)
                                .then(res => {
                                    const admin = res.data;
                                    // Trừ tiền admin - customer
                                    api.post(`/payment/save`,
                                        {
                                            "user": admin,
                                            "fromToUser": user,
                                            "balanceChange": parseFloat(-(orderDetailInfo.total_amount * 0.1)),
                                            "currentBalance": parseFloat(admin.balance) - (parseFloat(orderDetailInfo.total_amount * 0.1)),
                                            "description": "Hoàn tiền đơn hàng " + orderDetailInfo.order_code + " cho khách hàng",
                                            "paymentType": {
                                                "name": "refund"
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

                                    // Cộng ví customer
                                    api.post(`/payment/save`,
                                        {
                                            "user": user,
                                            "fromToUser": admin,
                                            "balanceChange": parseFloat((orderDetailInfo.total_amount * 0.1)),
                                            "currentBalance": parseFloat(provider.balance) + (parseFloat(orderDetailInfo.total_amount * 0.1)),
                                            "description": "Hoàn tiền đơn hàng " + orderDetailInfo.order_code,
                                            "paymentType": {
                                                "name": "refund"
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
                                                url: `users/updateBalance?balance=${parseFloat(user.balance) + parseFloat(paymentHistory.balanceChange)}&userId=${user.id}`
                                            }).then(res => {
                                                window.location.reload();
                                            })
                                        })
                                    })
                                })
                        })
                })
            })
    }

    const acceptOrder = () => {
        api.post('/users/login', {
            phoneLogin: currentUser,
            password: password
        }).then(res => {
            const provider = res.data.user;
            api({
                method: 'PATCH',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                url: `/orders/updateStatus?orderId=${order.order_id}&status=preparing`
            }).then(res => {
                api.post(`/notifications/insertNotification`,
                    {
                        "content": `Đơn hàng ${order.order_code} đã được chấp nhận`,
                        "customer": user,
                        "provider": null,
                        "forAdmin": false,
                        "type": "order",
                        "read": false
                    }
                )
                    .then(res => {
                        api.get(`/users/findByRole?roleName=ROLE_ADMIN`)
                            .then(res => {
                                const admin = res.data;
                                api.post(`/payment/save`,
                                    {
                                        "user": provider,
                                        "fromToUser": admin,
                                        "balanceChange": parseFloat(-orderDetailInfo.total_amount * 0.1),
                                        "currentBalance": parseFloat(provider.balance) - (parseFloat(orderDetailInfo.total_amount * 0.1)),
                                        "description": "Thanh toán cọc đơn hàng " + orderDetailInfo.order_code,
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
                                            url: `users/updateBalance?balance=${parseFloat(provider.balance) - parseFloat(orderDetailInfo.total_amount * 0.1)}&userId=${provider.id}`
                                        })
                                            .then(res => {
                                                api({
                                                    method: 'PATCH',
                                                    headers: {
                                                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                                                    },
                                                    url: `/orders/updateStatus?orderId=${localStorage.getItem("orderId")}&status=pending`
                                                }).then(res => {
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
                                        "fromToUser": provider,
                                        "balanceChange": parseFloat(orderDetailInfo.total_amount * 0.1),
                                        "currentBalance": parseFloat(admin.balance) + (parseFloat(orderDetailInfo.total_amount * 0.1)),
                                        "description": "Nhà hàng " + orderDetailInfo.restaurant_name + " thanh toán đơn hàng " + orderDetailInfo.order_code,
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
                                        }).then(() => {
                                            window.location.reload();
                                            Notify('Nhận đơn thành công', 'success', 'top-right');
                                        })
                                    })
                                })
                            })
                    })
            }).catch(err => {
                Notify('Nhận đơn không thành công', 'error', 'top-right');
            })
        }).catch(err => {
            Notify('Mật khẩu không đúng', 'error', 'top-right');
        })
    }

    const checkCancelOrder = (organizeDate, status) => {
        let percent = 0;
        const currentDate = new Date();
        let formatedDate = formatDateCheckRule(currentDate);

        if (status === 'pending') {
            percent = 0;
        } else if (status === 'preparing') {
            let day1 = new Date(organizeDate);
            let day2 = new Date(formatedDate);
            let different = Math.abs(day1 - day2);
            let day = different / (1000 * 3600 * 24);
            if (day >= 7) {
                percent = 0;
            } else if (day >= 5 && day < 7) {
                percent = 0.3;
            } else if (day >= 3 && day < 5) {
                percent = 0.5;
            } else if (day < 3) {
                percent = 1;
            }
        }
        return percent;
    }

    const cancelOrder = () => {
        const check = checkCancelOrder(formatDateCheckRule(orderDetailInfo.organize_date), orderDetailInfo.order_status);
        if (check === 0 && orderDetailInfo.order_status === 'pending') {
            outOfDateOrder();
        } else if (orderDetailInfo.order_status === 'preparing') {
            api.post('/users/login', {
                phoneLogin: currentUser,
                password: password
            }).then(res => {
                const provider = res.data.user;
                api({
                    method: 'PATCH',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    url: `/orders/updateStatus?orderId=${order.order_id}&status=cancelled`
                }).then(res => {
                    api.post(`/notifications/insertNotification`,
                        {
                            "content": `Đơn hàng ${order.order_code} đã bị hủy`,
                            "customer": user,
                            "provider": null,
                            "forAdmin": false,
                            "type": "order",
                            "read": false
                        }
                    )
                        .then(res => {
                            if (check === 1) {
                                api.get(`/users/findByRole?roleName=ROLE_ADMIN`)
                                    .then(res => {
                                        const admin = res.data;
                                        // Trừ tiền admin - customer
                                        api.post(`/payment/save`,
                                            {
                                                "user": admin,
                                                "fromToUser": user,
                                                "balanceChange": parseFloat(-(orderDetailInfo.total_amount * 0.1 * (0.9 + check))),
                                                "currentBalance": parseFloat(admin.balance) - (parseFloat(orderDetailInfo.total_amount * 0.1 * (0.9 + check))),
                                                "description": "Hoàn tiền đơn hàng " + orderDetailInfo.order_code + " cho khách hàng",
                                                "paymentType": {
                                                    "name": "refund"
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

                                        // Cộng ví customer
                                        api.post(`/payment/save`,
                                            {
                                                "user": user,
                                                "fromToUser": admin,
                                                "balanceChange": parseFloat((orderDetailInfo.total_amount * 0.1 * (0.9 + check))),
                                                "currentBalance": parseFloat(provider.balance) + (parseFloat(orderDetailInfo.total_amount * 0.1 * (0.9 + check))),
                                                "description": "Hoàn tiền đơn hàng " + orderDetailInfo.order_code,
                                                "paymentType": {
                                                    "name": "refund"
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
                                                    url: `users/updateBalance?balance=${parseFloat(user.balance) + parseFloat(paymentHistory.balanceChange)}&userId=${user.id}`
                                                }).then(res => {
                                                    window.location.reload();
                                                    Notify('Hủy đơn thành công', 'success', 'top-right');
                                                })
                                            })
                                        })
                                    })
                            } else {
                                api.get(`/users/findByRole?roleName=ROLE_ADMIN`)
                                    .then(res => {
                                        const admin = res.data;
                                        // Trừ tiền ví admin - customer
                                        api.post(`/payment/save`,
                                            {
                                                "user": admin,
                                                "fromToUser": user,
                                                "balanceChange": parseFloat(-(orderDetailInfo.total_amount * 0.1 * (1 + check))),
                                                "currentBalance": parseFloat(admin.balance) - (parseFloat(orderDetailInfo.total_amount * 0.1 * (1 + check))),
                                                "description": "Hoàn tiền đơn hàng " + orderDetailInfo.order_code + " cho khách hàng",
                                                "paymentType": {
                                                    "name": "refund"
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

                                        // Cộng ví customer
                                        api.post(`/payment/save`,
                                            {
                                                "user": user,
                                                "fromToUser": admin,
                                                "balanceChange": parseFloat((orderDetailInfo.total_amount * 0.1 * (1 + check))),
                                                "currentBalance": parseFloat(user.balance) + (parseFloat(orderDetailInfo.total_amount * 0.1 * (1 + check))),
                                                "description": "Hoàn tiền đơn hàng " + orderDetailInfo.order_code,
                                                "paymentType": {
                                                    "name": "refund"
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
                                                    url: `users/updateBalance?balance=${parseFloat(user.balance) + parseFloat(paymentHistory.balanceChange)}&userId=${user.id}`
                                                }).then(res => {
                                                    api.get(`/users/findByRole?roleName=ROLE_ADMIN`)
                                                        .then(res => {
                                                            const admin1 = res.data;
                                                            // Trừ tiền admin - provider
                                                            api({
                                                                method: 'post',
                                                                url: `/payment/save`,
                                                                headers: {
                                                                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                                                                }
                                                                ,
                                                                data: {
                                                                    "user": admin1,
                                                                    "fromToUser": provider,
                                                                    "balanceChange": parseFloat(-(orderDetailInfo.total_amount * 0.1 * (0.9 - check))),
                                                                    "currentBalance": parseFloat(admin1.balance) - (parseFloat(orderDetailInfo.total_amount * 0.1 * (0.9 - check))),
                                                                    "description": "Hoàn tiền đơn hàng " + orderDetailInfo.order_code + " cho nhà hàng",
                                                                    "paymentType": {
                                                                        "name": "refund"
                                                                    }
                                                                }
                                                            }).then(res => {
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
                                                                        url: `users/updateBalance?balance=${parseFloat(admin1.balance) + parseFloat(paymentHistory.balanceChange)}&userId=${admin1.id}`
                                                                    })
                                                                })
                                                            })

                                                            // Cộng ví provider
                                                            api({
                                                                method: 'post',
                                                                url: `/payment/save`,
                                                                headers: {
                                                                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                                                                }
                                                                ,
                                                                data: {
                                                                    "user": provider,
                                                                    "fromToUser": admin1,
                                                                    "balanceChange": parseFloat((orderDetailInfo.total_amount * 0.1 * (0.9 - check))),
                                                                    "currentBalance": parseFloat(provider.balance) + (parseFloat(orderDetailInfo.total_amount * 0.1 * (0.9 - check))),
                                                                    "description": "Hoàn tiền đơn hàng " + orderDetailInfo.order_code,
                                                                    "paymentType": {
                                                                        "name": "refund"
                                                                    }
                                                                }
                                                            }).then(res => {
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
                                                                        url: `users/updateBalance?balance=${parseFloat(provider.balance) + parseFloat(paymentHistory.balanceChange)}&userId=${provider.id}`
                                                                    }).then(res => {
                                                                        window.location.reload();
                                                                        Notify('Hủy đơn thành công', 'success', 'top-right');
                                                                    })
                                                                })
                                                            })
                                                        })
                                                })
                                            })
                                        })
                                    })
                            }
                        })
                }).catch(err => {
                    Notify('Hủy đơn không thành công', 'error', 'top-right');
                })
            }).catch(err => {
                Notify('Mật khẩu không đúng', 'error', 'top-right');
            })
        }
    }

    const completeOrder = () => {
        api.post('/users/login', {
            phoneLogin: currentUser,
            password: password
        }).then(res => {
            const provider = res.data.user;
            api({
                method: 'PATCH',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                url: `/orders/updateStatus?orderId=${order.order_id}&status=accomplished`
            }).then(res => {
                api.post(`/notifications/insertNotification`,
                    {
                        "content": `Đơn hàng ${order.order_code} đã hoàn thành`,
                        "customer": user,
                        "provider": null,
                        "forAdmin": false,
                        "type": "order",
                        "read": false
                    }
                )
                    .then(res => {
                        api.get(`/users/findByRole?roleName=ROLE_ADMIN`)
                            .then(res => {
                                const admin1 = res.data;
                                // Trừ tiền admin - provider
                                api({
                                    method: 'post',
                                    url: `/payment/save`,
                                    headers: {
                                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                                    }
                                    ,
                                    data: {
                                        "user": admin1,
                                        "fromToUser": provider,
                                        "balanceChange": parseFloat(-(orderDetailInfo.total_amount * 0.1 * (2 - 0.1))),
                                        "currentBalance": parseFloat(admin1.balance) - (parseFloat(orderDetailInfo.total_amount * 0.1 * (2 - 0.1))),
                                        "description": "Hoàn tiền đơn hàng " + orderDetailInfo.order_code + " cho nhà hàng",
                                        "paymentType": {
                                            "name": "refund"
                                        }
                                    }
                                }).then(res => {
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
                                            url: `users/updateBalance?balance=${parseFloat(admin1.balance) + parseFloat(paymentHistory.balanceChange)}&userId=${admin1.id}`
                                        })
                                    })
                                })

                                // Cộng ví provider
                                api({
                                    method: 'post',
                                    url: `/payment/save`,
                                    headers: {
                                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                                    }
                                    ,
                                    data: {
                                        "user": provider,
                                        "fromToUser": admin1,
                                        "balanceChange": parseFloat((orderDetailInfo.total_amount * 0.1 * (2 - 0.1))),
                                        "currentBalance": parseFloat(provider.balance) + (parseFloat(orderDetailInfo.total_amount * 0.1 * (2 - 0.1))),
                                        "description": "Hoàn tiền đơn hàng " + orderDetailInfo.order_code,
                                        "paymentType": {
                                            "name": "refund"
                                        }
                                    }
                                }).then(res => {
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
                                            url: `users/updateBalance?balance=${parseFloat(provider.balance) + parseFloat(paymentHistory.balanceChange)}&userId=${provider.id}`
                                        }).then(res => {

                                            window.location.reload();
                                            Notify('Đồng ý hoành thành đơn hàng thành công', 'success', 'top-right');
                                        })
                                    })
                                })
                            })
                    }).catch(err => {
                        Notify('Đồng ý hoành thành đơn hàng không thành công', 'error', 'top-right');
                    })
            });
        }).catch(err => {
            Notify('Mật khẩu không đúng', 'error', 'top-right');
        })
    }

    return (
        <tr>
            <td>{order.order_code}</td>
            <td>{formatCurrency(order.amount)}</td>
            <td>{formatDate(order.order_date)}</td>
            <td>{displayOrderStatus}</td>
            <td>
                <Button onClick={toggle} color="primary">
                    <FaEye className="icon-see-more" />Chi tiết
                </Button>
                <Modal isOpen={modal} toggle={toggle} className={`modal-order`}>
                    <ModalHeader toggle={toggle}>Chi tiết đơn hàng</ModalHeader>
                    <ModalBody>
                        {
                            orderDetailInfo && <Container>
                                <Row>
                                    <Col lg="6" md="12" sm="12" className="info-order">
                                        <h4>Thông tin đơn hàng</h4>
                                        <hr />
                                        <div className="od-info-code"><b>Mã số đơn hàng: </b>{orderDetailInfo.order_code}</div>
                                        <div className="od-info-name"><b>Tên khách hàng: </b>{user.name}</div>
                                        <div className="od-info-type"><b>Loại bàn: </b>{orderDetailInfo.table_type}</div>
                                        <div className="od-info-guest-number"><b>Số lượng khách: </b>{orderDetailInfo.number_of_guests}</div>
                                        <div className="od-info-order-date"><b>Thời gian đặt: </b>{formatDate(orderDetailInfo.order_date)}</div>
                                        <div className="od-info-organize-date">
                                            <b>Thời gian tổ chức: </b>{orderDetailInfo.time + ' ' + formatDate(orderDetailInfo.organize_date)}
                                        </div>
                                        {
                                            orderDetailInfo.organize_ward === null ? (<div className="od-info-organize-address">
                                                <b>Địa điểm tổ chức: </b>{orderDetailInfo.organize_address}
                                            </div>) : (
                                                (orderDetailInfo.order_status === 'preparing') ? (
                                                    <div className="order-date"><b>Địa điểm tổ chức: </b>{`
                                                    ${orderDetailInfo.organize_address}, ${orderDetailInfo.organize_ward}, ${orderDetailInfo.organize_district}, ${orderDetailInfo.organize_province}`}
                                                    </div>
                                                ) : (
                                                    <div className="order-date"><b>Địa điểm tổ chức: </b>{`
                                                ${orderDetailInfo.organize_ward}, ${orderDetailInfo.organize_district}, ${orderDetailInfo.organize_province}`}
                                                    </div>
                                                )
                                            )
                                        }
                                        {
                                            (orderDetailInfo.order_status === 'preparing') && (
                                                <div><b>Số điện thoại của khách hàng: </b>{orderDetailInfo.customer_phone_number}</div>
                                            )
                                        }
                                        <div className="od-info-note"><b>Ghi chú: </b>{orderDetailInfo.note}</div>
                                        <div className="od-info-status"><b>Trạng thái: </b>{displayOrderStatus}</div>
                                        <hr />
                                        <div className="info-order-amount">
                                            <h5>Tổng tiền: {formatCurrency(orderDetailInfo.total_amount)} VNĐ</h5>
                                            <h5 >Tiền đặt cọc (10%): {formatCurrency(orderDetailInfo.total_amount * 10 / 100)} VNĐ</h5>
                                            <Row className="info-order-btn">
                                                {
                                                    orderStatus === 'Đang chờ duyệt' && (
                                                        <Col lg="6" md="12" sm="6">
                                                            <Button color="success" style={{ width: '110px' }} onClick={() => {
                                                                toggle1();
                                                            }}>
                                                                Nhận đơn
                                                            </Button>
                                                            <Modal isOpen={modal1} toggle={toggle1} className={``}>
                                                                <ModalHeader toggle={toggle1}>Thông báo</ModalHeader>
                                                                <ModalBody>
                                                                    {
                                                                        new Date().getTime() <= new Date(orderDetailInfo.organize_date) ? <>
                                                                            <Label for="password"><b>Nhập mật khẩu của bạn: </b></Label>
                                                                            <Input
                                                                                type="password"
                                                                                id="password"
                                                                                placeholder="Nhập mật khẩu"
                                                                                value={password}
                                                                                onChange={onChangePassword}
                                                                            />
                                                                        </> : <>
                                                                            Đơn hàng đã quá hạn để nhận, chúng tôi đã chuyển đơn hàng này thành <b>"Đã hủy"</b>
                                                                        </>
                                                                    }
                                                                </ModalBody>
                                                                <ModalFooter>
                                                                    {
                                                                        new Date().getTime() <= new Date(orderDetailInfo.organize_date) &&
                                                                        <Button color="success" onClick={() => acceptOrder()}>Đồng ý</Button>
                                                                    }
                                                                    <Button color="secondary" onClick={() => {
                                                                        if (new Date().getTime() > new Date(orderDetailInfo.organize_date)) {
                                                                            outOfDateOrder();
                                                                        }
                                                                        toggle1();
                                                                    }}>Quay lại</Button>
                                                                </ModalFooter>
                                                            </Modal>
                                                        </Col>
                                                    )

                                                }
                                                {
                                                    (orderStatus === 'Chưa diễn ra')
                                                    && <Col lg="5" md="5" sm="5">
                                                        <Button color="success" style={{ width: '110px' }} onClick={toggle3}>Hoàn thành</Button>
                                                        <Modal isOpen={modal3} toggle={toggle3} className={``}>
                                                            <ModalHeader toggle={toggle3}>Thông báo</ModalHeader>
                                                            <ModalBody>
                                                                <Label for="password"><b>Nhập mật khẩu của bạn </b></Label>
                                                                <Input
                                                                    type="password"
                                                                    id="password"
                                                                    placeholder="Nhập mật khẩu"
                                                                    value={password}
                                                                    onChange={onChangePassword}
                                                                />
                                                            </ModalBody>
                                                            <ModalFooter>
                                                                <Button color="success" onClick={() => completeOrder()}>Đồng ý</Button>
                                                                <Button color="secondary" onClick={toggle3}>Quay lại</Button>
                                                            </ModalFooter>
                                                        </Modal>
                                                    </Col>
                                                }
                                                {
                                                    (orderStatus === 'Đang chờ duyệt' || orderStatus === 'Chưa diễn ra')
                                                    && <Col lg="5" md="5" sm="5">
                                                        <Button color="danger" style={{ width: '110px' }} onClick={toggle2}>Hủy đơn</Button>
                                                        <Modal isOpen={modal2} toggle={toggle2} className={``}>
                                                            <ModalHeader toggle={toggle2}>Thông báo</ModalHeader>
                                                            <ModalBody>
                                                                <RuleOrder />
                                                                <Label for="password"><b>Nhập mật khẩu của bạn: </b></Label>
                                                                <Input
                                                                    type="password"
                                                                    id="password"
                                                                    placeholder="Nhập mật khẩu"
                                                                    value={password}
                                                                    onChange={onChangePassword}
                                                                />
                                                            </ModalBody>
                                                            <ModalFooter>
                                                                <Button color="success" onClick={() => cancelOrder()}>Đồng ý</Button>
                                                                <Button color="secondary" onClick={toggle2}>Quay lại</Button>
                                                            </ModalFooter>
                                                        </Modal>
                                                    </Col>
                                                }

                                            </Row>
                                        </div>
                                    </Col>
                                    <Col lg="6" md="12" sm="12">
                                        <Row>
                                            <Col lg="12" md="12" sm="12"><OrderDetailDishItem listOrderDetails={listOrderDetails} /></Col>
                                            <Col lg="12" md="12" sm="12"><OrderDetailComboItem listOrderDetails={listOrderDetails} /></Col>
                                            <Col lg="12" md="12" sm="12"><OrderDetailServiceItem listOrderDetails={listOrderDetails} /></Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Container>
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={toggle}>Quay lại</Button>
                    </ModalFooter>
                </Modal>
            </td>
        </tr>
    )
}
