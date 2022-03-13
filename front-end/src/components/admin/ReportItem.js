import { api } from '../../config/axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Button, Modal, ModalHeader, ModalBody,
    ModalFooter,
} from 'reactstrap';

import { formatDateForNotify } from '../../common/formatDate';
import { Notify } from '../../common/notify';

export default function ReportItem(props) {
    const count = props.count;
    const report = props.report;

    const [modal, setModal] = useState(false);

    const toggle = () => {
        setModal(!modal);
    }

    const complete = () => {
        api.post(`/notifications/insertNotification`,
            {
                "content": `Chúng tôi đã xử lý báo cáo của bạn về nhà hàng ${report.restaurant.restaurantName}`,
                "customer": report.user,
                "provider": null,
                "forAdmin": false,
                "type": "report",
                "read": false
            }
        )
            .then(res => {
                api({
                    method: 'PATCH',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    url: `/feedbacks/updateStatusFeedback?feedbackId=${report.id}`
                }).then(res => {
                    props.getData();
                    Notify('Xử lý báo cáo thành công', 'success', 'top-right');
                    toggle();
                })
            })
    }

    return (
        <tr>
            <td>{count}</td>
            <td>{report.feedbackContent}</td>
            <td>{formatDateForNotify(report.feedback_date)}</td>
            <td>
                <Link to={{
                    pathname: `/admin/restaurant/detail`,
                    state: {
                        restaurantId: report.restaurant.id
                    }
                }}
                    className="btn btn-primary"
                >
                    Đi đến nhà hàng
                </Link>
            </td>
            <td>
                <Button color="success" onClick={toggle}>Đã xử lý</Button>
                <Modal isOpen={modal} toggle={toggle} className={``}>
                    <ModalHeader toggle={toggle}>Thông báo</ModalHeader>
                    <ModalBody>
                        Lưu thay đổi ?
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={() => complete()}>
                            Đồng ý
                        </Button>
                        <Button color="secondary" onClick={toggle}>Quay lại</Button>
                    </ModalFooter>
                </Modal>
            </td>
        </tr>
    )
}
