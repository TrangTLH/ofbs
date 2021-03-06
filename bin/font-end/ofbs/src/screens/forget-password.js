import axios from 'axios';
import React, { Component } from 'react'
import {
    Form, FormGroup, Label, Input, Toast,
    ToastBody, ToastHeader, Alert
} from 'reactstrap';

import firebase from "../config/firebase";

import userPath from '../services/UserPath';
import TopMenu from '../components/topMenu';

export default class forgetPassword extends Component {
    constructor() {
        super();

        this.state = {
            phoneNumber: "",
            password: "",
            rePassword: ""
        }

        this.onchangePhoneNumber = this.onchangePhoneNumber.bind(this);
        this.onchangePassword = this.onchangePassword.bind(this);
        this.onchangeRePassword = this.onchangeRePassword.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
        this.validateConfirmPassword = this.validateConfirmPassword.bind(this);
    }

    onchangePhoneNumber(e) {
        this.setState({
            phoneNumber: e.target.value
        });
    }

    onchangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    onchangeRePassword(e) {
        this.setState({
            rePassword: e.target.value
        });
    }

    updatePassword() {
        console.log(this.state.userId);
        userPath.patch('/update/' + this.state.userId, {
            "password": this.state.password
        })
    }

    handleClick(e) {
        e.preventDefault();

        let { password } = this.state;
        let phoneNumber = this.state.phoneNumber;
        phoneNumber = '+84' + phoneNumber.substring(1, phoneNumber.length);
        axios.get('http://localhost:8080/users/findByPhoneNumber/' + phoneNumber)
            .then(res => {
                if (res.data !== null && res.data !== '') {
                    document.getElementById('error-form1').style.display = "none";
                    document.getElementById('error-form2').style.display = "none";
                    if (this.validateConfirmPassword() === true) {
                        document.getElementById('error-form1').style.display = "none";
                        document.getElementById('error-form2').style.display = "none";

                        let recapcha = new firebase.auth.RecaptchaVerifier("recaptcha");
                        firebase.auth().signInWithPhoneNumber(phoneNumber, recapcha)
                            .then(function (e) {
                                let code = prompt("Nh???p m?? OTP", "");
                                if (code == null) return;
                                e.confirm(code)
                                    .then(function (result) {
                                        axios.patch('http://localhost:8080/users/update/' + res.data.id, {
                                            "password": password
                                        })
                                        document.getElementById('toast-message-success').style.display = "block";
                                        window.setTimeout(() =>
                                            document.getElementById('toast-message-success').style.display = "none"
                                            , 5000
                                        );
                                        recapcha.clear();
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                        document.getElementById('toast-message-error').style.display = "block";
                                        window.setTimeout(() =>
                                            document.getElementById('toast-message-error').style.display = "none"
                                            , 5000
                                        );
                                        recapcha.clear();
                                    });
                            }).catch((error) => {
                                console.log(error)
                            });
                    } else {
                        document.getElementById('error-form2').style.display = "block";
                    }
                } else {
                    document.getElementById('error-form1').style.display = "block";
                }
            });
    }

    validateConfirmPassword() {
        const { password, rePassword } = this.state;

        if (password !== rePassword) {
            return false;
        } else {
            return true;
        }
    }

    render() {
        let { phoneNumber, password, rePassword } = this.state;

        return (
            <div className="container">
                <TopMenu />
                <Form inline className="form-forget-password" onSubmit={this.handleClick}>
                    <div className="title-foget-password">Qu??n m???t kh???u</div>
                    <FormGroup>
                        <Label for="phone-number" hidden>S??? ??i???n tho???i:  </Label>
                        <div className="phone-number-input">
                            <span className="prefix-phone-input">(+84)</span>
                            <Input
                                className="input-phone-number"
                                type="text"
                                name="phoneNumber"
                                id="phone-number"
                                placeholder="S??? ??i???n tho???i"
                                value={phoneNumber}
                                onChange={this.onchangePhoneNumber}
                                required="required"
                            />
                        </div>
                    </FormGroup>
                    {' '}
                    <FormGroup>
                        <Label for="new-password" hidden>M???t kh???u m???i:</Label>
                        <Input
                            type="password"
                            name="newPassword"
                            id="new-password"
                            placeholder="M???t kh???u m???i"
                            value={password}
                            onChange={this.onchangePassword}
                            required="required"
                        />
                    </FormGroup>
                    {' '}
                    <FormGroup>
                        <Label for="re-new-password" hidden>Nh???p l???i m???t kh???u m???i:</Label>
                        <Input
                            type="password"
                            name="reNewPassword"
                            id="re-new-password"
                            placeholder="Nh???p l???i m???t kh???u m???i"
                            value={rePassword}
                            onChange={this.onchangeRePassword}
                            required="required"
                        // onBlur={this.onBlurRePassword(password, rePassword)}
                        />
                    </FormGroup>
                    {' '}
                    <div id="recaptcha"></div>
                    <Alert color="danger" id="error-form1" className="error-form">
                        S??? ??i???n tho???i kh??ng ????ng !
                    </Alert>
                    <Alert color="danger" id="error-form2" className="error-form">
                        M???t kh???u kh??ng tr??ng !
                    </Alert>
                    <Input type="submit" value="G???i m?? OTP" className="btn-register btn btn-success btn-forget-password" />
                </Form>
                <div className="p-3 bg-success my-2 rounded" id="toast-message-success">
                    <Toast>
                        <ToastHeader>
                            Th??nh c??ng
                        </ToastHeader>
                        <ToastBody>
                            B???n ???? ?????i m???t kh???u th??nh c??ng
                        </ToastBody>
                    </Toast>
                </div>
                <div className="p-3 bg-danger my-2 rounded" id="toast-message-error">
                    <Toast>
                        <ToastHeader>
                            Th???t b???i
                        </ToastHeader>
                        <ToastBody>
                            B???n ?????i m???t kh???u kh??ng th??nh c??ng
                        </ToastBody>
                    </Toast>
                </div>
            </div>
        )
    }
}
