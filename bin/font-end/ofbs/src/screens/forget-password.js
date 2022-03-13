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
                                let code = prompt("Nhập mã OTP", "");
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
                    <div className="title-foget-password">Quên mật khẩu</div>
                    <FormGroup>
                        <Label for="phone-number" hidden>Số điện thoại:  </Label>
                        <div className="phone-number-input">
                            <span className="prefix-phone-input">(+84)</span>
                            <Input
                                className="input-phone-number"
                                type="text"
                                name="phoneNumber"
                                id="phone-number"
                                placeholder="Số điện thoại"
                                value={phoneNumber}
                                onChange={this.onchangePhoneNumber}
                                required="required"
                            />
                        </div>
                    </FormGroup>
                    {' '}
                    <FormGroup>
                        <Label for="new-password" hidden>Mật khẩu mới:</Label>
                        <Input
                            type="password"
                            name="newPassword"
                            id="new-password"
                            placeholder="Mật khẩu mới"
                            value={password}
                            onChange={this.onchangePassword}
                            required="required"
                        />
                    </FormGroup>
                    {' '}
                    <FormGroup>
                        <Label for="re-new-password" hidden>Nhập lại mật khẩu mới:</Label>
                        <Input
                            type="password"
                            name="reNewPassword"
                            id="re-new-password"
                            placeholder="Nhập lại mật khẩu mới"
                            value={rePassword}
                            onChange={this.onchangeRePassword}
                            required="required"
                        // onBlur={this.onBlurRePassword(password, rePassword)}
                        />
                    </FormGroup>
                    {' '}
                    <div id="recaptcha"></div>
                    <Alert color="danger" id="error-form1" className="error-form">
                        Số điện thoại không đúng !
                    </Alert>
                    <Alert color="danger" id="error-form2" className="error-form">
                        Mật khẩu không trùng !
                    </Alert>
                    <Input type="submit" value="Gửi mã OTP" className="btn-register btn btn-success btn-forget-password" />
                </Form>
                <div className="p-3 bg-success my-2 rounded" id="toast-message-success">
                    <Toast>
                        <ToastHeader>
                            Thành công
                        </ToastHeader>
                        <ToastBody>
                            Bạn đã đổi mật khẩu thành công
                        </ToastBody>
                    </Toast>
                </div>
                <div className="p-3 bg-danger my-2 rounded" id="toast-message-error">
                    <Toast>
                        <ToastHeader>
                            Thất bại
                        </ToastHeader>
                        <ToastBody>
                            Bạn đổi mật khẩu không thành công
                        </ToastBody>
                    </Toast>
                </div>
            </div>
        )
    }
}
