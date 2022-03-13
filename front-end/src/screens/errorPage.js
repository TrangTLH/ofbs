import React, { Component } from 'react';
import { Container } from 'reactstrap';

import TopMenu from '../components/common/topMenu';
import Footer from '../components/common/footer';
import { FaExclamationTriangle } from 'react-icons/fa';
import Messenger from '../components/common/messenger';

export default class errorPage extends Component {
    render() {
        return (
            <div className="not-found">
                <TopMenu />
                <Container className="not-found-content">
                    <div><FaExclamationTriangle className="icon-not-found" /></div>
                    <div>Trang này không tồn tại !</div>
                </Container>
                <Footer />
                <Messenger />
            </div>
        )
    }
}
