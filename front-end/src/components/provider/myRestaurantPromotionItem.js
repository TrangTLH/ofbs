import React, { useState } from 'react';
import {
    Button, Modal, ModalHeader, Form,
    ModalBody, ModalFooter, Label, Input,
    CardImg, Alert
} from 'reactstrap';
import { FaEdit } from 'react-icons/fa';
import { api, url } from '../../config/axios';
import ImageUploading from "react-images-uploading";

import { formatDate, formatDateForInput } from '../../common/formatDate';
import { Notify } from '../../common/notify';
import { validateDescription, validateEmpty, validatePromotionPercentage, validateUsername } from '../../common/validate';

export default function MyRestaurantPromotionItem(props) {
    const promotion = props.promotion;
    const restaurantId = props.restaurantId;
    let count = props.count;
    let statusPromotion = promotion.promotion_status;
    const promotionName = promotion.promotion_name;

    const [modal, setModal] = useState(false);
    const [promotionModal, setPromotionModal] = useState();

    const [name, setName] = useState('');
    const [discount, setDiscount] = useState(0);
    const [description, setDescription] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [status, setStatus] = useState('');

    const [imageId, setImageId] = useState('');
    const [images, setImages] = useState([]);

    const onChangeName = (e) => { setName(e.target.value) };
    const onChangeDiscount = (e) => { setDiscount(e.target.value) };
    const onChangeStart = (e) => { setStart(e.target.value) };
    const onChangeEnd = (e) => { setEnd(e.target.value); };
    const onChangeStatus = (e) => { setStatus(e.target.value); };
    const onChangeDescription = (e) => { setDescription(e.target.value) };
    const onChange = (imageList, addUpdateIndex) => {
        setImages(imageList);
    };

    if (statusPromotion === 'active') {
        statusPromotion = 'Đang diễn ra';
    } else if (statusPromotion === 'inactive') {
        statusPromotion = 'Đã kết thúc';
    } else if (statusPromotion === 'coming') {
        statusPromotion = 'Sắp diễn ra';
    }

    let yearEnd = (new Date(start)).getFullYear();
    let monthEnd = (new Date(start)).getMonth() + 1;
    let dayEnd = (new Date(start)).getDate() + 1;

    let minEnd = formatDateForInput(`${yearEnd}-${monthEnd}-${dayEnd}`);

    const toggle = () => {
        setImageId(promotion.image_id);
        setModal(!modal);

        if (modal === false) {
            api.get(`/promotions/getPromotionById?promotionId=${promotion.promotion_id}`)
                .then(res => {
                    let promotion = res.data;
                    let statusPromotion = promotion.status.name;

                    if (statusPromotion === 'active') {
                        statusPromotion = 'Đang diễn ra';
                    } else if (statusPromotion === 'inactive') {
                        statusPromotion = 'Đã kết thúc';
                    } else if (statusPromotion === 'coming') {
                        statusPromotion = 'Sắp diễn ra';
                    }

                    setPromotionModal(res.data);
                    setName(promotion.name);
                    setDiscount(promotion.discountPercentage);
                    setDescription(promotion.description);
                    setStart(formatDateForInput(promotion.startDate));
                    setEnd(formatDateForInput(promotion.endDate));
                    setStatus(statusPromotion);
                })
        }
    }

    const validate = () => {
        if (!validateEmpty(name.trim())) {
            Notify('Vui lòng nhập tên khuyến mãi', 'error', 'top-right');
            return false;
        } else if (!validateUsername(name)) {
            Notify('Tên khuyến mãi phải ít hơn 100 ký tự', 'error', 'top-right');
            return false;
        } else if (!validatePromotionPercentage(discount)) {
            Notify('Phần trăm khuyến mãi phải ít hơn 3 ký tự', 'error', 'top-right');
            return false;
        } if (!validateEmpty(description.trim())) {
            Notify('Mô tả không được để trống', 'error', 'top-right');
            return false;
        } else if (!validateDescription(description)) {
            Notify('Mô tả khuyến mãi phải ít hơn 2000 ký tự', 'error', 'top-right');
            return false;
        } else {
            return true;
        }
    }

    const updatePromotion = () => {
        if (validate()) {
            api.get(`/restaurants/getRestaurantById?restaurantId=${restaurantId}`)
                .then(res => {
                    let restaurant = res.data;
                    updateImage();

                    api.get(`/promotions/getPromotionsByRestaurantId?restaurantId=${restaurantId}&isActive=0`)
                        .then(res => {
                            let count = 0;
                            res.data.forEach(promotion => {
                                if (name === promotion.promotion_name) {
                                    count = count + 1;
                                }
                            });
                            if (promotionName === name) {
                                count = 0;
                            }
                            if (count === 0) {
                                api.post(`/promotions/save`,
                                    {
                                        "id": promotion.promotion_id,
                                        "name": name,
                                        "restaurant": restaurant,
                                        "description": description,
                                        "discountPercentage": discount,
                                        "startDate": start,
                                        "endDate": end,
                                        "status": { id: 1, name: "active" }
                                    }, {
                                    headers: {
                                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                                    }
                                }).then(res => {
                                    toggle();
                                    window.location.reload();
                                    Notify("Cập nhật khuyến mãi thành công", "success", "top-right");
                                })
                            } else {
                                Notify("Khuyến mãi này đã tồn tại", "error", "top-right");
                            }
                        })
                })
        }
    }

    const updateImage = () => {
        let formData = new FormData();
        if (images.length > 0) {
            formData.append('file', images[0].file);
            document.getElementById('error-form4').style.display = "none";

            if (imageId === null || imageId === '') {
                api.post(url + `/images/upload?userId=0&dishId=0&serviceId=0&comboId=0&restaurantId=0&promotionId=${promotion.promotion_id}&typeId=1`,
                    formData, {
                }).then(res => {
                    // window.location.reload();
                }).catch(err => {
                    Notify('Tải ảnh lên không thành công', 'error', 'top-right');
                })
            } else {
                api.post(url + `/images/update?imageId=${imageId}`,
                    formData, {
                }).then(res => {
                    // window.location.reload();
                }).catch(err => {
                    Notify('Tải ảnh lên không thành công', 'error', 'top-right');
                })
            }
        }
    }

    return (
        <tr>
            <td>{count}</td>
            <td>{promotion.promotion_name}</td>
            <td>{formatDate(promotion.start_date)}</td>
            <td>{formatDate(promotion.end_date)}</td>
            <td>{statusPromotion}</td>
            <td>
                <Button color="primary" onClick={toggle}>
                    <FaEdit className="icon-edit" />Sửa
                </Button>
            </td>
            <Modal isOpen={modal} toggle={toggle} className={``}>
                <ModalHeader toggle={toggle}>Cập nhật khuyến mãi</ModalHeader>
                <ModalBody>
                    <Form onSubmit={(event) => {
                        event.preventDefault();
                        updatePromotion();
                    }}>
                        {
                            imageId && (
                                <div>
                                    <ImageUploading
                                        value={images}
                                        onChange={onChange}
                                        dataURLKey="data_url"
                                        acceptType={['jpg', 'jpeg', 'gif', 'png']}
                                    >
                                        {({
                                            imageList,
                                            onImageUpdate,
                                            onImageRemove,
                                        }) => (
                                            <div className="upload__image-wrapper">
                                                <CardImg id="user-image" className="promotion-profile-image" top src={url + `/images/${imageId}`} alt="khuyến mãi" />
                                                {imageList.map((image, index) => (
                                                    // eslint-disable-next-line no-sequences
                                                    (document.getElementById("user-image").style.display = "none"),
                                                    (
                                                        <div key={index} className="image-item">
                                                            <CardImg className="dish-profile-image" top src={image.data_url} />
                                                            <Alert color="danger" id="error-form4" className="error-form">
                                                                Không thể tải ảnh lên, vui lòng chọn một ảnh khác !
                                                            </Alert>
                                                        </div>
                                                    )
                                                )
                                                )}

                                                <div className="btn-change-image" onClick={onImageUpdate}>Thay đổi ảnh</div>
                                            </div>
                                        )}
                                    </ImageUploading>
                                </div>
                            )

                        }
                        {
                            promotionModal && <div>
                                <Label for="name"><b>Tên khuyến mãi <span className="require-icon">*</span></b></Label>
                                <Input
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder="Nhập tên khuyến mãi"
                                    onChange={onChangeName}
                                    value={name}
                                    required="required"
                                />

                                <Label for="discount"><b>Phần trăm khuyến mãi (%) <span className="require-icon">*</span></b></Label>
                                <Input
                                    type="number"
                                    name="discount"
                                    id="discount"
                                    min={1}
                                    max={100}
                                    placeholder="Nhập phần trăm khuyến mãi"
                                    onChange={onChangeDiscount}
                                    value={discount}
                                    required="required"
                                />

                                <Label for="start"><b>Ngày bắt đầu <span className="require-icon">*</span></b></Label>
                                <Input
                                    type="date"
                                    name="start"
                                    id="start"
                                    min={formatDateForInput(new Date())}
                                    placeholder="Nhập ngày bắt đầu"
                                    onChange={onChangeStart}
                                    value={start}
                                    required="required"
                                />

                                <Label for="end"><b>Ngày kết thúc <span className="require-icon">*</span></b></Label>
                                <Input
                                    type="date"
                                    name="end"
                                    id="end"
                                    min={minEnd}
                                    placeholder="Nhập ngày kết thúc"
                                    onChange={onChangeEnd}
                                    value={end}
                                    required="required"
                                />

                                <Label for="status"><b>Trạng thái <span className="require-icon">*</span></b></Label>
                                <Input
                                    type="text"
                                    name="status"
                                    id="status"
                                    onChange={onChangeStatus}
                                    disabled
                                    value={status}
                                />

                                <Label for="description"><b>Mô tả <span className="require-icon">*</span></b></Label>
                                <Input
                                    type="textarea"
                                    name="description"
                                    id="description"
                                    placeholder="Mô tả khuyến mãi"
                                    onChange={onChangeDescription}
                                    value={description}
                                    required="required"
                                />
                            </div>
                        }
                        <Input type="submit" value="Lưu" className="btn btn-success btn-save" />
                    </Form>
                </ModalBody>
                <ModalFooter>
                    {/* <Button color="success" onClick={() => updatePromotion()}>Lưu</Button>{' '} */}
                    <Button color="secondary" onClick={toggle}>Quay lại</Button>
                </ModalFooter>
            </Modal>
        </tr>
    )
}
