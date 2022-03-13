import React, { Component } from 'react';
import {
    Container, Row, Col, CardImg, Nav, NavItem,
    Button, Modal, ModalHeader, ModalBody, ModalFooter,
    Alert
} from 'reactstrap';
import { Link } from 'react-router-dom';
import ImageUploading from "react-images-uploading";
import { api, url } from '../../config/axios';
import ReactPaginate from 'react-paginate';
import { FaTrashAlt, FaRegPlusSquare } from 'react-icons/fa';

import TopMenu from '../../components/common/topMenu';
import Footer from '../../components/common/footer';
import Messenger from '../../components/common/messenger';
import { Notify } from '../../common/notify';

let restaurantId = '';
export default class myRestaurantImage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            images: [],
            imageUploads: [],
            modal: false,
            modal1: false,
            modal2: false,
            offset: 0,
            perPage: 12,
            currentPage: 0,
            imgDeleteId: ''
        }

        this.onChange = this.onChange.bind(this);
        this.addImage = this.addImage.bind(this);
        this.toggle = this.toggle.bind(this);
        this.toggle1 = this.toggle1.bind(this);
        this.toggle2 = this.toggle2.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        restaurantId = localStorage.getItem('resId');
        this.receivedData();
    }

    onChange = (imageList, addUpdateIndex) => {
        this.setState({ imageUploads: imageList });
    };

    deleteImage(imageId) {
        api.delete(url + `/images/deleteImageById?imageId=${imageId}`)
            .then(res => {
                this.toggle2(imageId);
                this.receivedData();
            })
    }

    addImage() {
        this.toggle();
        document.getElementById('error-form4').style.display = "none";
        let formData = new FormData();
        formData.append('file', this.state.imageUploads[0].file);
        api.post(url + `/images/upload?userId=0&dishId=0&serviceId=0&comboId=0&restaurantId=${restaurantId}&promotionId=0&typeId=2`,
            formData, {
        }).then(res => {
            this.receivedData();
            this.toggle1();
            this.setState({ imageUploads: [] })
        }).catch(err => {
            Notify('Tải ảnh lên không thành công', 'error', 'top-right');
        })
    }

    toggle() {
        this.setState({ modal: !this.state.modal })
    }

    toggle1() {
        this.setState({ modal1: !this.state.modal1 })
    }

    toggle2(imageId) {
        this.setState({ modal2: !this.state.modal2, imgDeleteId: imageId })
    }

    handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.receivedData();
        });

    };

    receivedData() {
        api.get(url + `/images/getRestaurantImages?restaurantId=${restaurantId}`)
            .then(res => {
                const data = res.data;
                const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                const imageList = slice.map((image, index) => {
                    return <Col className="myRes-detail-img-item" key={index} lg="3" md="4" sm="12">
                        <CardImg className="image-description" src={url + `/images/${image.image_id}`} />
                        <div className="icon-del"
                            onClick={(event) => {
                                event.preventDefault();
                                this.toggle2(image.image_id)
                            }}>
                            <FaTrashAlt />
                        </div>
                    </Col>
                })

                this.setState({
                    pageCount: Math.ceil(data.length / this.state.perPage),
                    imageList
                })
            });
    }

    render() {
        const { imageUploads, modal1, modal2, imgDeleteId } = this.state;

        return (
            <div className="myRes-image">
                <TopMenu />
                <Nav pills className="restaurant-detail-nav container">
                    <NavItem >
                        <Link to={`/users/profile/my-restaurant/detail`}>Thông tin</Link>
                    </NavItem>
                    <NavItem className="active">
                        <Link
                            onClick={() => {
                                localStorage.setItem('resId', '');
                                localStorage.setItem('resId', restaurantId)
                            }}
                            to={{
                                pathname: `/users/profile/my-restaurant/image`
                            }}
                        >
                            Ảnh
                        </Link>
                    </NavItem>
                    <NavItem>
                        <Link
                            onClick={() => {
                                localStorage.setItem('resId', '');
                                localStorage.setItem('resId', restaurantId)
                            }}
                            to={{
                                pathname: `/users/profile/my-restaurant/menu`,
                                state: { restaurantId: localStorage.getItem('resId') }
                            }}
                        >
                            Thực đơn
                        </Link>
                    </NavItem>
                    <NavItem>
                        <Link
                            onClick={() => {
                                localStorage.setItem('resId', '');
                                localStorage.setItem('resId', restaurantId)
                            }}
                            to={{
                                pathname: `/users/profile/my-restaurant/combo`
                            }}
                        >
                            Combo món ăn
                        </Link>
                    </NavItem>
                    <NavItem>
                        <Link
                            onClick={() => {
                                localStorage.setItem('resId', '');
                                localStorage.setItem('resId', restaurantId)
                            }}
                            to={{
                                pathname: `/users/profile/my-restaurant/service`
                            }}
                        >
                            Dịch vụ
                        </Link>
                    </NavItem>
                    <NavItem >
                        <Link
                            onClick={() => {
                                localStorage.setItem('resId', '');
                                localStorage.setItem('resId', restaurantId)
                            }}
                            to={{
                                pathname: `/users/profile/my-restaurant/promotion`
                            }}
                        >
                            Khuyến mãi
                        </Link>
                    </NavItem>
                    <NavItem >
                        <Link
                            onClick={() => {
                                localStorage.setItem('resId', '');
                                localStorage.setItem('resId', restaurantId)
                            }}
                            to={{
                                pathname: `/users/profile/my-restaurant/order`
                            }}
                        >
                            Đơn hàng
                        </Link>
                    </NavItem>
                </Nav>
                <Container>
                    <div>
                        <h3>Ảnh của nhà hàng</h3>
                        <hr />
                    </div>
                    <div className="myRes-image-add">
                        <Button color="primary" onClick={this.toggle1}><FaRegPlusSquare className="btn-add-image" />Thêm ảnh</Button>
                        <Modal isOpen={modal1} toggle={this.toggle1} className={``}>
                            <ModalHeader toggle={this.toggle1}>Thêm ảnh</ModalHeader>
                            <ModalBody>
                                <ImageUploading
                                    value={imageUploads}
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
                                                        <Alert color="danger" id="error-form4" className="error-form">
                                                            Không thể tải ảnh lên, vui lòng chọn một ảnh khác !
                                                        </Alert>
                                                    </div>
                                                )
                                            )
                                            )}

                                            <div className="btn-change-image" onClick={onImageUpdate}>Chọn hoặc đổi ảnh</div>
                                        </div>
                                    )}
                                </ImageUploading>
                            </ModalBody>
                            <ModalFooter>
                                {imageUploads.length > 0 &&
                                    <Button color="success" onClick={this.addImage}>
                                        Đồng ý
                                    </Button>}
                                <Button color="secondary" onClick={this.toggle1}>Quay lại</Button>{' '}
                            </ModalFooter>
                        </Modal>
                    </div>
                    <Row className="myRes-detail-list-img">
                        {this.state.imageList}
                    </Row>
                    {
                        (this.state.imageList && this.state.imageList.length > 0) ? <>
                            {
                                this.state.pageCount > 1 && <ReactPaginate
                                    previousLabel={"Trang trước"}
                                    nextLabel={"Trang sau"}
                                    breakLabel={"..."}
                                    breakClassName={"break-me"}
                                    pageCount={this.state.pageCount}
                                    marginPagesDisplayed={3}
                                    pageRangeDisplayed={3}
                                    onPageChange={this.handlePageClick}
                                    containerClassName={"pagination"}
                                    subContainerClassName={"pages pagination"}
                                    activeClassName={"active"}
                                />
                            }
                        </> : <div className="not-found">
                            Không tìm thấy kết quả nào
                        </div>
                    }
                </Container>
                <Footer />
                <Modal isOpen={modal2} toggle={this.toggle2} className={``}>
                    <ModalHeader toggle={this.toggle2}>Thông báo</ModalHeader>
                    <ModalBody>
                        Bạn có chắc chắn xóa ảnh này ?
                    </ModalBody>
                    <ModalFooter>
                        <div className="btn btn-success" onClick={() => this.deleteImage(imgDeleteId)}>Đồng ý</div>{' '}
                        <Button color="secondary" onClick={this.toggle2}>Quay lại</Button>
                    </ModalFooter>
                </Modal>
                <Messenger />
            </div >
        )
    }
}
