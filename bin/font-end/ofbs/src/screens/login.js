import { Component } from 'react';
import {
  Form, FormGroup, Label, Input, Toast,
  ToastBody, ToastHeader
} from 'reactstrap';
import { Link, Redirect } from "react-router-dom";

import axios from 'axios';

import TopMenu from '../components/topMenu';

class login extends Component {
  constructor() {
    super();
    this.state = {
      phoneLogin: "",
      password: "",
      redirect: false
    }

    this.onchangePhoneLogin = this.onchangePhoneLogin.bind(this);
    this.onchangePassword = this.onchangePassword.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onchangePhoneLogin(e) {
    this.setState({
      phoneLogin: e.target.value
    });
  }

  onchangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  onSubmit(e) {
    e.preventDefault();
    // AuthenService.login(this.state.phoneLogin, this.state.password);

    const phone = '+84' + this.state.phoneLogin.substring(1, this.state.phoneLogin.length);

    axios.post('http://localhost:8080/users/login', {
      phoneLogin: phone,
      password: this.state.password
    })
      .then(res => {
        // document.getElementById('toast-message-success').style.display = "block";
        // window.setTimeout(() =>
        //   document.getElementById('toast-message-success').style.display = "none"
        //   , 5000
        // );
        this.setState({
          redirect: true
        });

      }).catch((error) => {
        document.getElementById('toast-message-error').style.display = "block";
        window.setTimeout(() =>
          document.getElementById('toast-message-error').style.display = "none"
          , 5000
        );
      });
  }

  render() {
    let { phoneLogin, password, redirect } = this.state;
    if (redirect === true) {
      return <Redirect to="/" />;
    }
    return <div className="container">
      <TopMenu />
      <Form className="form-login" inline
        onSubmit={this.onSubmit}
      >
        <div className="login-heading mb-4">Đăng nhập</div>
        <FormGroup className="mb-2 mr-sm-2 mb-sm-0 form-group">
          <Label for="phone-number" hidden>Số điện thoại:  </Label>
          <div className="phone-number-input">
            <span className="prefix-phone-input">(+84)</span>
            <Input
              className="input-phone-number"
              type="text"
              name="phoneLogin"
              id="phone-number"
              placeholder="Số điện thoại"
              value={phoneLogin}
              onChange={this.onchangePhoneLogin}
              required="required"
            />
          </div>
        </FormGroup>
        {' '}
        <FormGroup className="mb-2 mr-sm-2 mb-sm-0 form-group">
          <Label for="examplePassword" className="mr-sm-2 ">Mật khẩu:</Label>
          <Input
            type="password"
            name="password"
            id="examplePassword"
            placeholder="Mật khẩu"
            value={password}
            onChange={this.onchangePassword}
            required="required"
          />
        </FormGroup>
        <Input type="submit" value="Đăng nhập" className="btn-login btn btn-success" />

        <div className="link-form">
          <Link to="/forget-password" className="link-forget-password">Quên mật khẩu ?</Link>
          <Link to="/register" className="link-register">Đăng kí tài khoản mới</Link>
        </div>
      </Form>

      <div className="p-3 bg-success my-2 rounded" id="toast-message-success">
        <Toast>
          <ToastHeader>
            Thành công
          </ToastHeader>
          <ToastBody>
            Đăng nhập thành công
          </ToastBody>
        </Toast>
      </div>
      <div className="p-3 bg-danger my-2 rounded" id="toast-message-error">
        <Toast>
          <ToastHeader>
            Thất bại
          </ToastHeader>
          <ToastBody>
            Số điện thoại hoặc Mật khẩu không chính xác
          </ToastBody>
        </Toast>
      </div>
    </div>
  }
}

export default login;
