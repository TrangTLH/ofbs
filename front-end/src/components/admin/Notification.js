import React, { useEffect, useState } from 'react';
import { FaBell } from "react-icons/fa";
import {
    NavItem
} from "reactstrap";

import NotificationItem from '../admin/NotificationItem';
import { api } from '../../config/axios';

export default function Notification() {

    const [notifications, setNotifications] = useState([]);
    const [isDisplay, setIsDisplay] = useState(false);

    useEffect(() => {
        loadData();
    }, [])

    const loadData = () => {
        api.get(`/notifications/getNotifications?customerId=0&providerId=0&isAdmin=1`)
            .then(res => {
                setNotifications(res.data);
            })
    }

    const displayNotify = () => {
        setIsDisplay(!isDisplay);
        if (!isDisplay) {
            loadData();
            document.getElementById('admin-notification').style.display = "flex";
        } else {
            document.getElementById('admin-notification').style.display = "none";
        }
    }

    return (
        <NavItem className="admin-icon-bell">
            <FaBell onClick={displayNotify} />
            {
                notifications.length > 0 &&
                <span className="admin-icon-bell-dot"></span>
            }
            <div className="admin-notification" id="admin-notification">
                <h5 className="admin-notification-title">Thông báo</h5>
                <hr />
                <div className="admin-notification-list">
                    {
                        notifications.length > 0 ? (notifications.map((notification, index) => {
                            return <NotificationItem key={index} notification={notification} />
                        })) : (
                            <h5>Không có thông báo nào </h5>
                        )
                    }
                </div>
            </div>
        </NavItem>
    )
}
