import React, { Component } from 'react';
import {
    Container, Input, Label, Button,
    Row, Col, Modal, ModalHeader, ModalBody,
    ModalFooter, Form, CardImg
} from 'reactstrap';
import subVn from "sub-vn";
import { Link, Redirect } from 'react-router-dom';
import ImageUploading from "react-images-uploading";
import { api, url } from '../../config/axios';

import TopMenu from '../../components/common/topMenu';
import Footer from '../../components/common/footer';
import { Notify } from '../../common/notify';
import { validateCapacity, validateDescription, validateECapacity, validateEmpty, validatePhoneNumber, validateUsername } from '../../common/validate';
import Messenger from '../../components/common/messenger';

export default class registerPromotion extends Component {
    constructor(props) {
        super(props);

        this.state = {
            provinces: subVn.getProvinces(),
            districts: subVn.getDistrictsByProvinceCode('01'),
            types: [],
            images: [],
            listCheck: [],
            user: {},
            modal: false,
            modal1: false,
            redirect: false,

            restaurantName: '',
            restaurantType: {
                id: 1,
                name: 'Tổ chức lưu động'
            },
            provinceName: 'Thành phố Hà Nội',
            provinceCode: '',
            districtName: 'Quận Ba Đình',
            restaurantAddress: '',
            restaurantPhone: '',
            restaurantSize: '',
            restaurantBusinessCode: '',
            restaurantDescription: '',
            userId: ''
        }

        this.onProvinceClick = this.onProvinceClick.bind(this);
        this.onDistrictClick = this.onDistrictClick.bind(this);
        this.onChangeRestaurantName = this.onChangeRestaurantName.bind(this);
        this.onChangeRestaurantType = this.onChangeRestaurantType.bind(this);
        this.onChangeRestaurantAddress = this.onChangeRestaurantAddress.bind(this);
        this.onChangeRestaurantPhone = this.onChangeRestaurantPhone.bind(this);
        this.onChangeRestaurantSize = this.onChangeRestaurantSize.bind(this);
        this.onChangeRestaurantBusinessCode = this.onChangeRestaurantBusinessCode.bind(this);
        this.onChangeRestaurantDescription = this.onChangeRestaurantDescription.bind(this);
        this.onSubmitRegister = this.onSubmitRegister.bind(this);
        this.toggle = this.toggle.bind(this);
        this.toggle1 = this.toggle1.bind(this);
        this.onChange = this.onChange.bind(this);
        this.updateImage = this.updateImage.bind(this);
        this.validate = this.validate.bind(this);
        this.checkRequire = this.checkRequire.bind(this);
        this.checkCodeExist = this.checkCodeExist.bind(this);
        this.validatePhoneExist = this.validatePhoneExist.bind(this);
    }

    onChangeRestaurantName(e) {
        this.setState({ restaurantName: e.target.value });
    }

    onChangeRestaurantType(e) {
        let index = e.nativeEvent.target.selectedIndex;
        let name = e.nativeEvent.target[index].text;
        this.setState({
            restaurantType: {
                id: e.target.value,
                name: name
            }
        });
    }

    onProvinceClick(event) {
        event.preventDefault();
        let provinceCode = event.target.value;
        this.setState({
            districts: subVn.getDistrictsByProvinceCode(provinceCode)
        });
        let index = event.nativeEvent.target.selectedIndex;
        let provinceName = event.nativeEvent.target[index].text;
        this.setState({ provinceCode: provinceCode })
        this.setState({ provinceName: provinceName })
    }

    onDistrictClick(event) {
        event.preventDefault();
        let index = event.nativeEvent.target.selectedIndex;
        let districtName = event.nativeEvent.target[index].text;
        this.setState(this.setState({ districtName: districtName }));
    }

    onChangeRestaurantAddress(e) {
        this.setState({ restaurantAddress: e.target.value });
    }


    onChangeRestaurantPhone(e) {
        this.setState({ restaurantPhone: e.target.value });
    }

    onChangeRestaurantSize(e) {
        this.setState({ restaurantSize: e.target.value });
    }

    onChangeRestaurantBusinessCode(e) {
        this.setState({ restaurantBusinessCode: e.target.value });
    }

    onChangeRestaurantDescription(e) {
        this.setState({ restaurantDescription: e.target.value });
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        api.get(`/restaurants/providerTypes`)
            .then(res => {
                this.setState({ types: res.data })
            })

        api.get(`/users/findByPhoneNumber/${localStorage.getItem("currentUser")}`)
            .then(res => {
                this.setState({ user: res.data })
            })

        api.get(`/restaurants?type=0&province=&district=&restaurantName=`)
            .then(res => {
                this.setState({ listCheck: res.data });
            });
    }

    checkSpace(text) {
        let textValidate = text.trim();
        textValidate = textValidate.replace(/\s\s+/g, '');
        if (textValidate === '') {
            return false;
        } else {
            return true;
        }
    }

    checkRequire() {
        const { images, restaurantAddress, restaurantBusinessCode,
            restaurantDescription, restaurantName, restaurantPhone, restaurantSize,
        } = this.state;
        let checkbox = '';
        checkbox = document.getElementById('cb-accept');

        if (checkbox !== '' && checkbox !== undefined) {
            if (!validateEmpty(restaurantName.trim()) || !this.checkSpace(restaurantName.trim())) {
                Notify('Tên nhà hàng không được để trống', 'error', 'top-right');
                return false;
            } else if (!validateEmpty(restaurantAddress.trim()) || !this.checkSpace(restaurantAddress.trim())) {
                Notify('Địa chỉ không được để trống', 'error', 'top-right');
                return false;
            } else if (!validateEmpty(restaurantPhone.trim())) {
                Notify('Số điện thoại không được để trống', 'error', 'top-right');
                return false;
            } else if (!validateEmpty(restaurantSize) || restaurantSize === '0') {
                Notify('Vui lòng nhập sức chứa hoặc sức chứa không hợp lệ', 'error', 'top-right');
                return false;
            } else if (!validateEmpty(restaurantBusinessCode.trim())) {
                Notify('Mã giấy phép kinh doanh không được để trống', 'error', 'top-right');
                return false;
            } else if (!validateEmpty(restaurantDescription.trim()) || !this.checkSpace(restaurantDescription.trim())) {
                Notify('Mô tả không được để trống', 'error', 'top-right');
                return false;
            } else if (images.length === 0) {
                Notify('Vui lòng thêm giấy chứng nhận an toàn thực phẩm của nhà hàng', 'error', 'top-right');
                return false;
            } else if (checkbox.checked === false) {
                Notify('Vui lòng chấp nhận điều khoản của FBS', 'error', 'top-right');
                return false;
            } else {
                return true;
            }
        }
    }

    checkCodeExist() {
        let list = this.state.listCheck;
        let count = 0;

        list.forEach(restaurant => {
            if (restaurant.business_license_id === this.state.restaurantBusinessCode) {
                count = count + 1;
            }
        });

        if (count === 0) {
            return true;
        } else {
            return false;
        }
    }

    validatePhoneExist() {
        let userId = '';
        let check = true;

        api.get(`/restaurants/getProviderIdByPhoneNumber/${this.state.restaurantPhone}`)
            .then(res => {
                userId = res.data;
                if (userId !== this.state.user.id) {
                    Notify('Số điện thoại đã tồn tại', 'error', 'top-right');
                    check = false;
                }
            })

        return check;
    }

    validate() {
        const { restaurantAddress, restaurantBusinessCode, restaurantName,
            restaurantSize, restaurantDescription
        } = this.state;

        if (this.checkRequire()) {
            if (this.checkCodeExist() === true) {
                if (!validateUsername(restaurantName)) {
                    Notify('Tên nhà hàng quá dài (nhỏ hơn 100 ký tự)', 'error', 'top-right');
                    return false;
                } else if (!validateUsername(restaurantAddress)) {
                    Notify('Tên địa chỉ quá dài (nhỏ hơn 100 ký tự)', 'error', 'top-right');
                    return false;
                } else if (!validateCapacity(restaurantSize)) {
                    Notify('Sức chứa quá lớn', 'error', 'top-right');
                    return false;
                } else if (!validateECapacity(restaurantSize)) {
                    Notify('Sức chứa sai định dạng', 'error', 'top-right');
                    return false;
                } else if (!validateUsername(restaurantBusinessCode)) {
                    Notify('Mã giấy phép kinh doanh quá dài', 'error', 'top-right');
                    return false;
                } else if (!validateDescription(restaurantDescription)) {
                    Notify('Mô tả phải nhỏ hơn 2000 ký tự', 'error', 'top-right');
                    return false;
                } else {
                    return true;
                }
            } else {
                Notify('Mã giấy phép kinh doanh đã tồn tại', 'error', 'top-right');
                return false;
            }
        }
    }

    isAuthentication() {
        const currentUser = localStorage.getItem("currentUser");
        if (currentUser !== null && currentUser !== undefined) {
            return true
        } else {
            return false;
        }
    }

    onSubmitRegister(e) {
        const { districtName, provinceName, restaurantAddress, user, restaurantBusinessCode,
            restaurantDescription, restaurantName, restaurantPhone, restaurantSize, restaurantType
        } = this.state;
        e.preventDefault();
        api.post(`/restaurants/registerRestaurant`,
            {
                "provider": user,
                "province": provinceName,
                "district": districtName,
                "address": restaurantAddress,
                "phoneNumber": restaurantPhone,
                "bussinessLicenseId": restaurantBusinessCode,
                "restaurantName": restaurantName,
                "description": restaurantDescription,
                "size": parseInt(restaurantSize),
                "providerType": restaurantType
            }, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }
        ).then(res => {
            api.post(`/notifications/insertNotification`,
                {
                    "content": `Có nhà hàng ${restaurantName} mới đăng ký`,
                    "customer": null,
                    "provider": null,
                    "forAdmin": true,
                    "type": "restaurant",
                    "read": false
                }
            );

            this.updateImage(res.data.id);
            this.toggle();
            this.toggle1();
            Notify('Đăng ký nhà hàng thành công', 'success', 'top-right');
            this.setState({ redirect: true });
        })
    }

    toggle() {
        this.setState({ modal: !this.state.modal })
    }

    toggle1() {
        this.setState({ modal1: !this.state.modal1 })
    }

    onChange = (imageList, addUpdateIndex) => {
        this.setState({ images: imageList });
    };

    updateImage(restaurantId) {
        // document.getElementById('error-form4').style.display = "none";
        api.delete(url + `/images/deleteCertificate?restaurantId=${restaurantId}`)
            .then(res => {
                let formData = new FormData();
                formData.append('file', this.state.images[0].file);
                api.post(url + `/images/upload?userId=0&dishId=0&serviceId=0&comboId=0&restaurantId=${restaurantId}&promotionId=0&typeId=3`,
                    formData, {
                }).then(res => {
                    // window.location.reload();
                }).catch(err => {
                    Notify('Không thể tải ảnh lên, vui lòng chọn một ảnh khác', 'error', 'top-right');
                    // Notify('Tải ảnh lên không thành công', 'error', 'top-right');
                })
            })
    }

    render() {
        const { provinces, districts, types, provinceCode, restaurantAddress,
            restaurantBusinessCode, restaurantDescription, restaurantName, restaurantPhone,
            restaurantSize, restaurantType, modal, modal1, images, redirect
        } = this.state;

        if (redirect === true) {
            return <Redirect to="/users/profile/my-restaurant" />;
        } else
            return (
                <div>
                    <TopMenu />
                    <Container className="register-provider-content">
                        <div className="form-register-restaurant">
                            <h2 className="rp-content-title">Đăng ký nhà hàng</h2>
                            <Form id="register-restaurant">
                                <Row className="content-row-1">
                                    <Col lg="8" className="input-restaurant-name">
                                        <Label for="restaurant-name"><b>Tên nhà hàng <span className="require-icon">*</span></b></Label>
                                        <Input
                                            type="text"
                                            name="restaurant-name"
                                            id="restaurant-name"
                                            placeholder="Nhập tên nhà hàng"
                                            onChange={this.onChangeRestaurantName}
                                            value={restaurantName}
                                        />
                                    </Col>

                                    <Col lg="4" className="input-restaurant-type">
                                        <Input
                                            type="select"
                                            name="type"
                                            id="type"
                                            onChange={this.onChangeRestaurantType}
                                            value={restaurantType.id}
                                        >
                                            {types.map((type) => {
                                                return (
                                                    <option key={type.id} value={type.id}>
                                                        {type.name}
                                                    </option>
                                                );
                                            })}
                                        </Input>
                                    </Col>
                                </Row>

                                <Row className="content-row-2">
                                    <Col>
                                        <Label for="citySelect"><b>Chọn tỉnh/ thành phố <span className="require-icon">*</span></b></Label>
                                        <Input
                                            type="select"
                                            name="citySelect"
                                            id="citySelect"
                                            value={provinceCode}
                                            onChange={this.onProvinceClick}
                                        >
                                            {/* <option value={''}>Tỉnh/ Thành phố</option> */}
                                            {provinces.map((province) => {
                                                return (
                                                    <option key={province.code} value={province.code}>
                                                        {province.name}
                                                    </option>
                                                );
                                            })}
                                        </Input>
                                    </Col>

                                    <Col>
                                        <Label for="districtSelect"><b>Chọn quận/ huyện <span className="require-icon">*</span></b></Label>
                                        <Input
                                            type="select"
                                            name="districtSelect"
                                            id="districtSelect"
                                            // value={localStorage.getItem("districtIndex")}
                                            onChange={this.onDistrictClick}
                                        >
                                            {/* <option value={''}>Quận/ Huyện</option> */}
                                            {districts.map((district) => {
                                                return (
                                                    <option key={district.code} value={district.code}>
                                                        {district.name}
                                                    </option>
                                                );
                                            })}
                                        </Input>
                                    </Col>
                                </Row>

                                <Row className="content-row-3">
                                    <Col>
                                        <Label for="restaurant-address"><b>Địa chỉ <span className="require-icon">*</span></b></Label>
                                        <Input
                                            type="text"
                                            name="restaurant-address"
                                            id="restaurant-address"
                                            placeholder="Nhập địa chỉ của nhà hàng"
                                            onChange={this.onChangeRestaurantAddress}
                                            value={restaurantAddress}
                                        />
                                    </Col>
                                </Row>

                                <Row className="content-row-4">
                                    <Col>
                                        <Label for="restaurant-phoneNumber"><b>Số điện thoại <span className="require-icon">*</span></b></Label>
                                        <Input
                                            type="tel"
                                            name="restaurant-phoneNumber"
                                            id="restaurant-phoneNumber"
                                            placeholder="Nhập số điện thoại của nhà hàng"
                                            onChange={this.onChangeRestaurantPhone}
                                            value={restaurantPhone}
                                        />
                                    </Col>
                                    <Col>
                                        <Label for="restaurant-size"><b>Sức chứa <span className="require-icon">*</span></b></Label>
                                        <Input
                                            type="number"
                                            name="restaurant-size"
                                            id="restaurant-size"
                                            min={1}
                                            placeholder="Nhập sức chứa của nhà hàng"
                                            onChange={this.onChangeRestaurantSize}
                                            value={restaurantSize}
                                        />
                                    </Col>
                                </Row>

                                <Row className="content-row-5">
                                    <Col>
                                        <Label for="restaurant-code-legal"><b>Mã giấy phép kinh doanh <span className="require-icon">*</span></b></Label>
                                        <Input
                                            type="text"
                                            name="restaurant-code-legal"
                                            id="restaurant-code-legal"
                                            placeholder="Nhập mã giấy phép kinh doanh của nhà hàng"
                                            onChange={this.onChangeRestaurantBusinessCode}
                                            value={restaurantBusinessCode}
                                        />
                                    </Col>
                                    <Col>
                                        <Label for="restaurant-description"><b>Mô tả <span className="require-icon">*</span></b></Label>
                                        <Input
                                            type="textarea"
                                            name="restaurant-description"
                                            id="restaurant-description"
                                            placeholder="Mô tả về nhà hàng"
                                            onChange={this.onChangeRestaurantDescription}
                                            value={restaurantDescription}
                                        />
                                    </Col>
                                </Row>

                                <Row className="content-row-6">
                                    <Col>
                                        <Label className="business-title"><b>Giấy chứng nhận vệ sinh an toàn thực phẩm <span className="require-icon">*</span></b></Label>
                                        <ImageUploading
                                            value={images}
                                            onChange={this.onChange}
                                            dataURLKey="data_url"
                                            acceptType={['jpg', 'jpeg', 'gif', 'png']}
                                        >
                                            {({
                                                imageList,
                                                onImageUpdate,
                                                onImageRemove,
                                            }) => (
                                                <div className="upload__image-wrapper">
                                                    {imageList.map((image, index) => (
                                                        (
                                                            <div key={index} className="image-item">
                                                                <CardImg className="business-image" top src={image.data_url} />
                                                            </div>
                                                        )
                                                    )
                                                    )}

                                                    <div className="btn-change-image" onClick={onImageUpdate}>Chọn hoặc đổi ảnh</div>
                                                </div>
                                            )}
                                        </ImageUploading>
                                    </Col>
                                </Row>

                                <Row className="content-row-7">
                                    <Col>
                                        <Input className="cb-accept" type="checkbox" id="cb-accept" />
                                        <b>Tôi đồng ý với các</b>
                                        {/* <Link className="link-rule" to={``}>điều khoản</Link> */}
                                        <a target="_blank" className="link-rule" href="https://drive.google.com/file/d/1cDyuko1YEeiRQ5ui5D-rBMZrjkRsUcpE/view?usp=sharing" rel="noreferrer">điều khoản</a>
                                    </Col>
                                </Row>
                            </Form>
                            <Button onClick={() => {
                                let userId = '';
                                let isAuthen = this.isAuthentication();
                                if (isAuthen) {
                                    if (this.validate()) {
                                        if (!validatePhoneNumber(restaurantPhone)) {
                                            Notify('Số điện thoại sai định dạng', 'error', 'top-right');
                                            return false;
                                        } else {
                                            api.get(`/restaurants/getProviderIdByPhoneNumber/${this.state.restaurantPhone}`)
                                                .then(res => {
                                                    userId = res.data;

                                                    if (userId !== this.state.user.id) {
                                                        Notify('Số điện thoại đã tồn tại', 'error', 'top-right');
                                                    } else {
                                                        this.toggle();
                                                    }

                                                }).catch(() => {
                                                    this.toggle();
                                                })
                                        }
                                    }
                                } else {
                                    Notify('Bạn phải đăng nhập để thực hiện chức năng này', 'error', 'top-right');
                                }
                            }
                            } className="btn-register-restaurant" color="success">Đăng ký</Button>
                            <Modal isOpen={modal} toggle={this.toggle} className={``}>
                                <ModalHeader toggle={this.toggle}>Thông báo</ModalHeader>
                                <ModalBody>
                                    <div style={{ color: 'blue' }}>
                                        Sau khi hoàn tất đăng ký nhà hàng mới, để được hệ thống kiểm duyệt đưa vào hoạt động,
                                        bạn phải thêm đầy đủ các thông tin của nhà hàng:
                                        <ul>
                                            <li>Ảnh đại diện của nhà hàng</li>
                                            <li>Ảnh chi tiết của nhà hàng</li>
                                            <li>Thực đơn món ăn, combo món ăn, dịch vụ của nhà hàng</li>
                                        </ul>
                                    </div>
                                    Bạn có chắc chắn đăng ký ?
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="success" onClick={this.onSubmitRegister}>Đồng ý</Button>{' '}
                                    <Button color="secondary" onClick={this.toggle}>Quay lại</Button>
                                </ModalFooter>
                            </Modal>
                            <Modal isOpen={modal1} toggle={this.toggle1} className={``}>
                                <ModalHeader toggle={this.toggle1}>Thông báo</ModalHeader>
                                <ModalBody>
                                    Đăng ký thành công !
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="success">
                                        <Link className="link-redirect" to={`/users/profile/my-restaurant`}>Ok</Link>
                                    </Button>{' '}
                                </ModalFooter>
                            </Modal>
                        </div>
                    </Container>
                    <Footer />
                    <Messenger />
                </div >
            )
    }
}
