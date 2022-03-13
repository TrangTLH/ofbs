import React from 'react';
import { formatDateForNotify } from '../../common/formatDate';
import { Link } from 'react-router-dom';
import { api } from '../../config/axios';

export default function NotificationItem(props) {
    const notification = props.notification;
    let type = notification.type;
    let color = '';
    let link = '';

    if (type === 'restaurant') {
        color = '#a473ff';
        link = '/users/profile/my-restaurant';
    } else if (type === 'report') {
        color = '#ffc107';
        link = '';
    } else if (type === 'order') {
        color = 'var(--color-primary)';
        if (notification.provider_id !== null) {
            link = '/users/profile/my-restaurant';
        } else if (notification.customer_id !== null) {
            link = '/users/profile/order';
        }
    } else if (type === 'wallet') {
        color = '#a473ff';
        link = '/users/profile/wallet';
    }

    const read = () => {
        api.get(`/notifications/getNotificationById?id=${notification.id}`)
            .then(res => {
                const notification = res.data;
                api.post(`/notifications/insertNotification`, {
                    "id": notification.id,
                    "content": notification.content,
                    "customer": notification.customer,
                    "provider": notification.provider,
                    "forAdmin": notification.forAdmin,
                    "type": notification.type,
                    "read": true
                });
            }).then(() => {
                props.loadData();
            })
    }

    return (
        <Link
            className="notify-content"
            to={`${link}`}
            style={{
                borderLeft: `5px solid ${color}`
            }}
            onClick={read}
        >
            <div className="notify-message">
                {notification.content}
            </div>
            <div className="notify-time">
                {formatDateForNotify(notification.date)}
            </div>
        </Link>
    )
}
