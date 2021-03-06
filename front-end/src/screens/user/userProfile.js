import React, { Component } from 'react';
import { api, url } from '../../config/axios';
import {
    Nav, NavItem, Container, Form,
    Row, Col, CardImg, Button, Modal,
    ModalHeader, ModalBody, ModalFooter,
    Input, Label, Alert
} from 'reactstrap';
import { Link } from 'react-router-dom';
import ImageUploading from "react-images-uploading";

import TopMenu from '../../components/common/topMenu';
import Footer from '../../components/common/footer';

import imageUser from '../../images/default-avatar-user.png';
import { formatDate, formatDateCheckRule } from '../../common/formatDate';
import { Notify } from '../../common/notify';
import { validateEmail, validateEmpty, validatePassword, validatePhoneNumber, validateUsername } from '../../common/validate';
import Messenger from '../../components/common/messenger';

let userId = '';
export default class userProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: Object,
            userImage: '',
            modal: false,
            modalChange: false,
            nestedModal: false,
            nestedModalChange: false,
            closeAll: false,
            closeAllChange: false,
            username: '',
            oldPassword: '',
            newPassword: '',
            reNewPassword: '',
            phone: '',
            email: '',
            address: '',
            gender: '',
            dob: '',
            images: []
        }

        this.toggle = this.toggle.bind(this);
        this.toggleChange = this.toggleChange.bind(this);
        this.toggleNested = this.toggleNested.bind(this);
        this.toggleNestedChange = this.toggleNestedChange.bind(this);
        this.toggleAll = this.toggleAll.bind(this);
        this.toggleAllChange = this.toggleAllChange.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeOldPassword = this.onChangeOldPassword.bind(this);
        this.onChangeNewPassword = this.onChangeNewPassword.bind(this);
        this.onChangeReNewPassword = this.onChangeReNewPassword.bind(this);
        this.onChangeAddress = this.onChangeAddress.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePhonenumber = this.onChangePhonenumber.bind(this);
        this.onChangeGender = this.onChangeGender.bind(this);
        this.onChangeDob = this.onChangeDob.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onSubmitChangePassword = this.onSubmitChangePassword.bind(this);
        this.validateConfirmPassword = this.validateConfirmPassword.bind(this);
        this.onChange = this.onChange.bind(this);
        this.updateImage = this.updateImage.bind(this);
        this.validate = this.validate.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        userId = localStorage.getItem('userId');
        api.get(`/users/profile/?userId=${userId}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => {
                let phone = res.data.phone_number;
                phone = '0' + phone.substring(3, phone.length);

                this.setState({
                    user: res.data,
                    username: res.data.user_name,
                    phone: phone,
                    email: res.data.email,
                    address: res.data.address,
                    gender: res.data.gender,
                    dob: res.data.date_of_birth
                });
                if (res.data.image_id === null) {
                    this.setState({ userImage: '' });
                } else {
                    this.setState({ userImage: res.data.image_id })
                }
            })
    }

    validate() {
        const { username, phone, email, address, dob } = this.state;
        const currentDate = new Date();
        let formatedCurrentDate = formatDateCheckRule(currentDate);
        let formatedDob = formatDateCheckRule(dob);

        let day1 = new Date(formatedCurrentDate);
        let day2 = new Date(formatedDob);

        let different = day1 - day2;
        let check = different / (1000 * 3600 * 24);

        if (!validateEmpty(username.trim())) {
            Notify('Vui l??ng nh???p t??n ?????y ?????', 'error', 'top-right');
            return false;
        } if (!validateUsername(username)) {
            Notify('T??n c???a b???n qu?? d??i (nh??? h??n 100 k?? t???)', 'error', 'top-right');
            return false;
        } else if (phone === '') {
            Notify('Vui l??ng nh???p s??? ??i???n tho???i', 'error', 'top-right');
            return false;
        } else if (!validatePhoneNumber(phone)) {
            Notify('S??? ??i???n tho???i sai ?????nh d???ng', 'error', 'top-right');
            return false;
        } else if (email !== '' && !validateUsername(email)) {
            Notify('Email c???a b???n qu?? d??i (nh??? h??n 100 k?? t???)', 'error', 'top-right');
            return false;
        } else if (email !== '' && !validateEmail(email)) {
            Notify('Email sai ?????nh d???ng', 'error', 'top-right');
            return false;
        } else if (address !== '' && !validateUsername(address)) {
            Notify('?????a ch??? qu?? d??i (nh??? h??n 100 k?? t???)', 'error', 'top-right');
            return false;
        } else if (check <= 0) {
            Notify('Ng??y sinh ph???i nh??? h??n n??y hi???n t???i', 'error', 'top-right');
            return false;
        } else {
            return true;
        }
    }

    toggle() {
        this.setState({ modal: !this.state.modal })
        this.setState({ nestedModal: this.state.modal })
    }

    toggleNested() {
        this.setState({ nestedModal: !this.state.nestedModal, closeAll: false })
    }

    toggleAll() {
        this.onSubmit();
        this.setState({ nestedModal: !this.state.nestedModal, closeAll: true })
    }

    toggleChange() {
        this.setState({ modalChange: !this.state.modalChange })
    }

    toggleNestedChange() {
        this.setState({ nestedModalChange: !this.state.nestedModalChange, closeAllChange: false })
    }

    toggleAllChange() {
        this.setState({ nestedModalChange: !this.state.nestedModalChange, closeAllChange: true })
    }

    onChangeUsername(e) {
        this.setState({ username: e.target.value })
    }

    onChangeOldPassword(e) {
        this.setState({ oldPassword: e.target.value })
    }

    onChangeNewPassword(e) {
        this.setState({ newPassword: e.target.value })
    }

    onChangeReNewPassword(e) {
        this.setState({ reNewPassword: e.target.value })
    }

    onChangeEmail(e) {
        this.setState({ email: e.target.value })
    }

    onChangePhonenumber(e) {
        this.setState({ phone: e.target.value })
    }

    onChangeAddress(e) {
        this.setState({ address: e.target.value })
    }

    onChangeGender(e) {
        e.preventDefault();
        this.setState({ gender: e.target.value });
    }

    onChangeDob(e) {
        e.preventDefault();
        this.setState({ dob: e.target.value });
    }

    onSubmit() {
        let { address, email, phone, username,
            gender, dob
        } = this.state;
        let phoneSubmit = phone;
        phoneSubmit = '+84' + phoneSubmit.substring(1, phoneSubmit.length);


        api.patch(`/users/profile/update?userId=${userId}`, {
            "address": address,
            "email": email,
            "phoneNumber": phoneSubmit,
            "name": username.trim(),
            "gender": gender,
            "dateOfBirth": dob
        }, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            api.get(`/users/profile/?userId=${userId}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
                .then(res => {
                    let phone = res.data.phone_number;
                    phone = '0' + phone.substring(3, phone.length);

                    this.setState({
                        user: res.data,
                        username: res.data.user_name,
                        phone: phone,
                        email: res.data.email,
                        address: res.data.address,
                        gender: res.data.gender,
                        dob: res.data.date_of_birth
                    });
                    if (res.data.image_id === null) {
                        this.setState({ userImage: '' });
                    }
                    this.toggleNested();
                    this.toggle();
                    Notify('B???n ???? l??u th??nh c??ng', 'success', 'top-right');
                }).catch(() => {
                    Notify('C???p nh???t kh??ng th??nh c??ng', 'error', 'top-right');
                })
        })
    }

    validateConfirmPassword() {
        const { oldPassword, newPassword, reNewPassword } = this.state;
        let phoneNumber = localStorage.getItem("currentUser");

        if (validatePassword(newPassword)) {
            api.post(`/users/login`, {
                phoneLogin: phoneNumber,
                password: oldPassword
            }).then(res => {
                if (newPassword === reNewPassword) {
                    this.onSubmitChangePassword();
                    this.setState({
                        oldPassword: '',
                        newPassword: '',
                        reNewPassword: ''
                    })
                } else {
                    Notify('M???t kh???u kh??ng kh???p', 'error', 'top-right');
                }
            }).catch(err => {
                Notify('M???t kh???u c?? kh??ng ????ng', 'error', 'top-right');
            })
        } else {
            Notify('Vui l??ng nh???p m???t kh???u t??? 3-32 k?? t??? v?? kh??ng bao g???m kho???ng tr???ng', 'error', 'top-right')
        }
    }

    onSubmitChangePassword() {
        api.patch('/users/update/' + userId, {
            "password": this.state.newPassword
        }, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(() => {
            Notify('?????i m???t kh???u th??nh c??ng', 'success', 'top-right');
            this.toggleChange();
        }).catch(() => {
            Notify('?????i m???t kh???u kh??ng th??nh c??ng', 'success', 'top-right');
        })
    }

    onChange = (imageList, addUpdateIndex) => {
        this.setState({ images: imageList });
    };

    displayImage() {
        document.getElementById("user-image").style.display = "block";
    }

    updateImage() {
        let formData = new FormData();
        let imageId = this.state.userImage;
        formData.append('file', this.state.images[0].file);
        document.getElementById('error-form4').style.display = "none";

        if (imageId === null || imageId === '') {
            api.post(url + `/images/upload?userId=${userId}&dishId=0&serviceId=0&comboId=0&restaurantId=0&promotionId=0&typeId=1`,
                formData, {
            }).then(res => {
                window.location.reload();
            }).catch(err => {
                document.getElementById('error-form4').style.display = "block";
            })
        } else {
            api.post(url + `/images/update?imageId=${imageId}`,
                formData, {
            }).then(res => {
                window.location.reload();
            }).catch(err => {
                document.getElementById('error-form4').style.display = "block";
            })
        }
    }

    render() {
        const { user, userImage, modal, nestedModal, closeAll,
            username, oldPassword, newPassword, reNewPassword,
            email, phone, address, gender, dob, modalChange, images
        } = this.state;

        let phoneNumber = '';
        if (user.phone_number !== null && user.phone_number !== undefined) {
            phoneNumber = user.phone_number;
            phoneNumber = '0' + phoneNumber.substring(3, phoneNumber.length);
        }
        let image;
        if (userImage === '') {
            image = <CardImg id="user-image" className="user-profile-image" top src={imageUser} />
        } else {
            image = <CardImg id="user-image" className="user-profile-image" top src={url + '/images/' + user.image_id} />
        }

        return (
            <div>
                <TopMenu />
                <Nav pills className="restaurant-detail-nav container">
                    <NavItem className="active">
                        <Link to={`/users/profile`}>H??? s??</Link>
                    </NavItem>
                    <NavItem>
                        <Link to={`/users/profile/order`}>????n c???a t??i</Link>
                    </NavItem>
                    <NavItem>
                        <Link to={`/users/profile/my-restaurant`}>Nh?? h??ng c???a t??i</Link>
                    </NavItem>
                    <NavItem>
                        <Link to={`/users/profile/wallet`}>V?? FBS</Link>
                    </NavItem>
                </Nav>
                <div>
                    <Modal isOpen={modal} toggle={this.toggle} className="">
                        <ModalHeader toggle={this.toggle}>Ch???nh s???a</ModalHeader>
                        <ModalBody>
                            <Form id="myForm" noValidate={false} onSubmit={(e) => {
                                e.preventDefault();
                                if (this.validate()) {
                                    this.toggleNested();
                                }
                            }}>
                                <Label for="username"><b>T??n ng?????i d??ng <span className="require-icon">*</span></b></Label>
                                <Input
                                    type="text"
                                    name="username"
                                    id="username"
                                    onChange={this.onChangeUsername}
                                    value={username}
                                    required="required"
                                />

                                <Label for="phonenumber"><b>S??? ??i???n tho???i <span className="require-icon">*</span></b></Label>
                                <Input
                                    type="tel"
                                    name="phonenumber"
                                    id="phonenumber"
                                    onChange={this.onChangePhonenumber}
                                    value={phone}
                                    required="required"
                                />

                                <Label for="email"><b>Email</b></Label>
                                <Input
                                    type="email"
                                    name="email"
                                    id="email"
                                    onChange={this.onChangeEmail}
                                    value={email}
                                />

                                <Label for="address"><b>?????a ch???</b></Label>
                                <Input
                                    type="text"
                                    name="address"
                                    onChange={this.onChangeAddress}
                                    value={address}
                                />

                                <Label for="gender"><b>Gi???i t??nh</b></Label>
                                <Input
                                    type="select"
                                    name="gender"
                                    id="gender"
                                    onChange={this.onChangeGender}
                                    value={gender}
                                >
                                    <option value={true}>Nam</option>
                                    <option value={false}>N???</option>
                                    {/* <option value="">Kh??c</option> */}
                                </Input>

                                <Label for="dateOfBirth"><b>Ng??y sinh </b></Label>
                                <Input
                                    type="date"
                                    name="date"
                                    id="dateOfBirth"
                                    value={dob}
                                    onChange={this.onChangeDob}
                                />
                                <Input type="submit" value="L??u l???i" className="btn btn-success btn-save" />
                            </Form>
                        </ModalBody>
                        <ModalFooter>
                            {/* <Button color="success" 
                                type="submit"
                            >
                                L??u l???i
                            </Button> */}
                            <Button color="secondary" onClick={this.toggle}>Quay l???i</Button>
                            <Modal isOpen={nestedModal} toggle={this.toggleNested} onClosed={closeAll ? this.toggle : undefined}>
                                <ModalHeader>Th??ng b??o</ModalHeader>
                                <ModalBody>L??u thay ?????i ?</ModalBody>
                                <ModalFooter>
                                    <Button color="success" type="submit" form="myForm" onClick={this.onSubmit}>?????ng ??</Button>
                                    <Button color="secondary" onClick={this.toggleNested}>Quay l???i</Button>{' '}
                                </ModalFooter>
                            </Modal>
                        </ModalFooter>
                    </Modal>
                </div>
                <Container>
                    <Row className="user-profile">
                        <Col lg="6" md="6" sm="12" className="user-section-1">
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
                                        {image}
                                        {imageList.map((image, index) => (
                                            // eslint-disable-next-line no-sequences
                                            (document.getElementById("user-image").style.display = "none"),
                                            (
                                                <div key={index} className="image-item">
                                                    <CardImg className="user-profile-image" top src={image.data_url} />
                                                    <Alert color="danger" id="error-form4" className="error-form">
                                                        Kh??ng th??? t???i ???nh l??n, vui l??ng ch???n m???t ???nh kh??c !
                                                    </Alert>
                                                    <div className="image-item__btn-wrapper">
                                                        <Button color="success" onClick={() => this.updateImage()}>L??u</Button>
                                                        <Button onClick={() => {
                                                            onImageRemove(index); this.displayImage();
                                                        }}
                                                        >
                                                            H???y
                                                        </Button>
                                                    </div>
                                                </div>
                                            )
                                        )
                                        )}

                                        <div className="btn-change-image" onClick={onImageUpdate}>Thay ?????i ???nh</div>
                                    </div>
                                )}
                            </ImageUploading>
                            <div className="username">{user.user_name}</div>
                            <div className="user-phone-number">{user.phone_number}</div>
                        </Col>
                        <Col lg="6" md="6" sm="12" className="user-section-2">
                            <Row>
                                <div className="user-username">
                                    <div>T??n ng?????i d??ng:</div>
                                    <div>{user.user_name}</div>
                                </div>
                                <div className="user-phone-number">
                                    <div>S??? ??i???n tho???i:</div>
                                    <div>{phoneNumber}</div>
                                </div>
                                <div className="user-email">
                                    <div>Email:</div>
                                    <div>{user.email}</div>
                                </div>
                                <div className="user-address">
                                    <div>?????a ch???:</div>
                                    <div>{user.address}</div>
                                </div>
                                <div className="user-gender">
                                    <div>Gi???i t??nh: </div>
                                    {user.gender ? (<div>Nam</div>) : (<div>N???</div>)}
                                </div>
                                <div className="user-dob">
                                    <div>Ng??y sinh:</div>
                                    <div>{formatDate(user.date_of_birth)}</div>
                                </div>
                                <Button className="btn-edit" color="success" onClick={this.toggle}>Ch???nh s???a</Button>
                                <Button className="btn-user-change-password" color="success" onClick={this.toggleChange}>Thay ?????i m???t kh???u</Button>
                                <Modal isOpen={modalChange} toggle={this.toggleChange} className="">
                                    <ModalHeader toggle={this.toggleChange}>Thay ?????i m???t kh???u</ModalHeader>
                                    <ModalBody>
                                        <Form onSubmit={(event) => {
                                            event.preventDefault();
                                            this.validateConfirmPassword();
                                        }}>
                                            <Label for="oldPassword"><b>M???t kh???u c?? <span className="require-icon">*</span></b></Label>
                                            <Input
                                                type="password"
                                                name="oldPassword"
                                                id="oldPassword"
                                                placeholder="Nh???p m???t kh???u c??"
                                                onChange={this.onChangeOldPassword}
                                                value={oldPassword}
                                                required="required"
                                            />
                                            <Label for="newPassword"><b>M???t kh???u m???i <span className="require-icon">*</span></b></Label>
                                            <Input
                                                type="password"
                                                name="newPassword"
                                                id="newPassword"
                                                placeholder="Nh???p m???t kh???u m???i"
                                                onChange={this.onChangeNewPassword}
                                                value={newPassword}
                                                required="required"
                                            />
                                            <Label for="reNewPassword"><b>Nh???p l???i m???t kh???u m???i <span className="require-icon">*</span></b></Label>
                                            <Input
                                                type="password"
                                                name="reNewPassword"
                                                id="reNewPassword"
                                                placeholder="Nh???p l???i m???t kh???u m???i"
                                                onChange={this.onChangeReNewPassword}
                                                value={reNewPassword}
                                                required="required"
                                            />
                                            <Input type="submit" value="L??u" className="btn btn-success btn-save" />
                                        </Form>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="secondary" onClick={this.toggleChange}>Quay l???i</Button>
                                        {/* <Button color="success" onClick={this.validateConfirmPassword}>L??u l???i</Button> */}
                                        {/* <Modal isOpen={nestedModalChange} toggle={this.toggleNestedChange} onClosed={closeAllChange ? this.toggleChange : undefined}>
                                            <ModalHeader>Th??ng b??o</ModalHeader>
                                            <ModalBody>L??u thay ?????i ?</ModalBody>
                                            <ModalFooter>
                                                <Button color="secondary" onClick={this.toggleNestedChange}>H???y</Button>{' '}
                                                <Button color="success" onClick={this.onSubmitChangePassword}>L??u</Button>
                                            </ModalFooter>
                                        </Modal> */}
                                    </ModalFooter>
                                </Modal>
                            </Row>
                        </Col>
                    </Row>
                </Container>
                <Footer />
                <Messenger />
            </div>
        )
    }
}
