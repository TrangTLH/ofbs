import { Component } from "react";
import firebase from "../config/firebase";
import { Form, FormGroup, Label, Input, Toast,
    ToastBody, ToastHeader, Alert 
} from 'reactstrap';

import TopMenu from '../components/topMenu';
import axios from "axios";

class register extends Component {
    constructor() {
        super();

        this.state = {
            name: "",
            phoneNumber: "",
            password: "",
            rePassword: "",
        }

        this.onchangeName = this.onchangeName.bind(this);
        this.onchangePhoneNumber = this.onchangePhoneNumber.bind(this);
        this.onchangePassword = this.onchangePassword.bind(this);
        this.onchangeRePassword = this.onchangeRePassword.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.validateConfirmPassword = this.validateConfirmPassword.bind(this);
    }

    onchangeName(e) {
        this.setState({
            name: e.target.value
        })
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

    validateConfirmPassword() {
        const { password, rePassword } = this.state;

        if (password !== rePassword) {
            return false;
        } else {
            return true;
        }
    }

    handleClick(e) {
        e.preventDefault();

        let { name, password } = this.state;

        const phone = '+84' + this.state.phoneNumber.substring(1, this.state.phoneNumber.length);
        axios.get('http://localhost:8080/users/findByPhoneNumber/' + phone)
            .then(res => {
                if (res.data === null || res.data === '') {
                    document.getElementById('error-form1').style.display = "none";
                    document.getElementById('error-form2').style.display = "none";
                    if (this.validateConfirmPassword() === true) {
                        document.getElementById('error-form1').style.display = "none";
                        document.getElementById('error-form2').style.display = "none";
                        let recapcha = new firebase.auth.RecaptchaVerifier("recaptcha");
                        firebase.auth().signInWithPhoneNumber(phone, recapcha)
                            .then(function (e) {
                                let code = prompt("Nh???p m?? OTP", "");
                                if (code == null) return;
                                e.confirm(code)
                                    .then(function (result) {
                                        axios.post('http://localhost:8080/users/register', {
                                            name: name,
                                            phoneLogin: phone,
                                            password: password,
                                            phoneNumber: phone
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

    render() {
        let { name, phoneNumber, password, rePassword } = this.state;

        return (
            <div className="container">
                <TopMenu />
                <Form className="form-register" inline
                    onSubmit={this.handleClick}
                >
                    <div className="title-register">????ng k??</div>
                    <FormGroup>
                        <Label for="name">H??? v?? t??n</Label>
                        <Input
                            type="text"
                            name="Name"
                            id="name"
                            placeholder="H??? v?? t??n "
                            value={name}
                            onChange={this.onchangeName}
                        />
                    </FormGroup>
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
                        <Label for="password" hidden>M???t kh???u :</Label>
                        <Input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="M???t kh???u"
                            value={password}
                            onChange={this.onchangePassword}
                            required="required"
                        />
                    </FormGroup>
                    {' '}
                    <FormGroup>
                        <Label for="re-password" hidden>Nh???p l???i m???t kh???u:</Label>
                        <Input
                            type="password"
                            name="rePassword"
                            id="re-password"
                            placeholder="Nh???p l???i m???t kh???u"
                            value={rePassword}
                            onChange={this.onchangeRePassword}
                            required="required"
                        // onBlur={this.onBlurRePassword(password, rePassword)}
                        />
                    </FormGroup>
                    {' '}
                    <div id="recaptcha"></div>
                    <Alert color="danger" id="error-form1" className="error-form">
                        S??? ??i???n tho???i ???? t???n t???i !
                    </Alert>
                    <Alert color="danger" id="error-form2" className="error-form">
                        M???t kh???u kh??ng kh???p !
                    </Alert>
                    <Input type="submit" value="????ng k??" className="btn-register btn btn-success btn-forget-password" />
                </Form>
                <div className="p-3 bg-success my-2 rounded" id="toast-message-success">
                    <Toast>
                        <ToastHeader>
                            Th??nh c??ng
                        </ToastHeader>
                        <ToastBody>
                            B???n ???? ????ng k?? th??nh c??ng
                        </ToastBody>
                    </Toast>
                </div>
                <div className="p-3 bg-danger my-2 rounded" id="toast-message-error">
                    <Toast>
                        <ToastHeader>
                            Th???t b???i
                        </ToastHeader>
                        <ToastBody>
                            B???n ????ng k?? kh??ng th??nh c??ng
                        </ToastBody>
                    </Toast>
                </div>
            </div>
        );
    }
}

export default register;
