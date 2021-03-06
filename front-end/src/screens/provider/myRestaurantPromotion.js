import React, { Component } from 'react';
import {
    Nav, NavItem, Container, Table, Form,
    Label, Input, Button, Modal, ModalHeader,
    ModalBody, ModalFooter, Alert, CardImg
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { api, url } from '../../config/axios';
import ImageUploading from "react-images-uploading";
import { FaRegPlusSquare } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';

import TopMenu from '../../components/common/topMenu';
import Footer from '../../components/common/footer';
import MyRestaurantPromotionItem from '../../components/provider/myRestaurantPromotionItem';
import { formatDateForInput } from '../../common/formatDate';
import { Notify } from '../../common/notify';
import { validateDescription, validateEmpty, validatePromotionPercentage, validateUsername } from '../../common/validate';
import Messenger from '../../components/common/messenger';

let restaurantId = '';
export default class myRestaurantPromotion extends Component {
    constructor(props) {
        super(props);

        this.state = {
            images: [],

            name: '',
            discount: 0,
            status: 1,
            start: '',
            end: '',
            description: '',
            modal: false,

            offset: 0,
            perPage: 10,
            currentPage: 0
        }

        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeDiscount = this.onChangeDiscount.bind(this);
        this.onChangeStart = this.onChangeStart.bind(this);
        this.onChangeEnd = this.onChangeEnd.bind(this);
        this.onChangeStatus = this.onChangeStatus.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);

        this.onChange = this.onChange.bind(this);
        this.addPromotion = this.addPromotion.bind(this);
        this.toggle = this.toggle.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        restaurantId = localStorage.getItem('resId');
        this.receivedData();
    }

    onChangeName(e) {
        e.preventDefault();
        this.setState({ name: e.target.value });
    }

    onChangeDiscount(e) {
        e.preventDefault();
        this.setState({ discount: e.target.value });
    }

    onChangeStatus(e) {
        e.preventDefault();
        this.setState({ status: e.target.value });
    }

    onChangeStart(e) {
        e.preventDefault();
        this.setState({ start: e.target.value });
    }

    onChangeEnd(e) {
        e.preventDefault();
        this.setState({ end: e.target.value });
    }

    onChangeDescription(e) {
        e.preventDefault();
        this.setState({ description: e.target.value });
    }

    toggle() { this.setState({ modal: !this.state.modal }) };

    onChange = (imageList, addUpdateIndex) => {
        this.setState({ images: imageList });
    }

    handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: 0,
            offset: offset
        }, () => {
            this.receivedData();
        });

    };

    receivedData() {
        api.get(`/promotions/getPromotionsByRestaurantId?restaurantId=${restaurantId}&isActive=0`)
            .then(res => {
                const data = res.data;
                const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                const promotionsPaging = slice.map((promotion, index) => {
                    return <MyRestaurantPromotionItem key={index} promotion={promotion} count={index + 1} restaurantId={restaurantId} />
                })

                this.setState({
                    pageCount: Math.ceil(data.length / this.state.perPage),
                    promotionsPaging
                })
            });
    }

    validate() {
        if (!validateEmpty(this.state.name.trim())) {
            Notify('Vui l??ng nh???p t??n khuy???n m??i', 'error', 'top-right');
            return false;
        } else if (!validateUsername(this.state.name)) {
            Notify('T??n khuy???n m??i ph???i ??t h??n 100 k?? t???', 'error', 'top-right');
            return false;
        } else if (!validatePromotionPercentage(this.state.discount)) {
            Notify('Ph???n tr??m khuy???n m??i ph???i ??t h??n 3 k?? t???', 'error', 'top-right');
            return false;
        } if (!validateEmpty(this.state.description.trim())) {
            Notify('M?? t??? kh??ng ???????c ????? tr???ng', 'error', 'top-right');
            return false;
        } else if (!validateDescription(this.state.description)) {
            Notify('M?? t??? khuy???n m??i ph???i ??t h??n 2000 k?? t???', 'error', 'top-right');
            return false;
        } else {
            return true;
        }
    }

    addPromotion() {
        const { discount, name, description, start, end, images } = this.state;
        if (images.length > 0) {
            if (this.validate()) {
                api.get(`/restaurants/getRestaurantById?restaurantId=${restaurantId}`)
                    .then(res => {
                        let restaurant = res.data;
                        api.get(`/promotions/getPromotionsByRestaurantId?restaurantId=${restaurantId}&isActive=0`)
                            .then(res => {
                                let count = 0;
                                res.data.forEach(promotion => {
                                    if (name === promotion.promotion_name) {
                                        count = count + 1;
                                    }
                                });

                                if (count === 0) {
                                    api.post(`/promotions/save`,
                                        {
                                            "name": name,
                                            "restaurant": restaurant,
                                            "description": description,
                                            "discountPercentage": discount,
                                            "startDate": start,
                                            "endDate": end,
                                            "status": { id: 1, name: 'active' }
                                        }, {
                                        headers: {
                                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                                        }
                                    }).then(res => {
                                        this.toggle();
                                        this.updateImage(res.data.id);
                                        this.receivedData();
                                        Notify('Th??m khuy???n m??i th??nh c??ng', 'success', 'top-right');
                                    })
                                } else {
                                    Notify("Khuy???n m??i n??y ???? t???n t???i", "error", "top-right");
                                }
                            })
                    })
            }
        } else {
            Notify('Vui l??ng th??m ???nh c???a khuy???n m??i', 'warning', 'top-right');
        }
    }

    updateImage(promotionId) {
        let formData = new FormData();
        if (this.state.images.length > 0) {
            formData.append('file', this.state.images[0].file);
            document.getElementById('error-form4').style.display = "none";

            api.post(url + `/images/upload?userId=0&dishId=0&serviceId=0&comboId=0&restaurantId=0&promotionId=${promotionId}&typeId=1`,
                formData, {
            }).then(res => {
                this.receivedData(0, '');
            }).catch(err => {
                Notify('T???i ???nh l??n kh??ng th??nh c??ng', 'error', 'top-right');
            })
        }
    }

    render() {
        const { discount, modal, start, end,
            images, name, description
        } = this.state;

        let yearEnd = (new Date(start)).getFullYear();
        let monthEnd = (new Date(start)).getMonth() + 1;
        let dayEnd = (new Date(start)).getDate() + 1;

        let minEnd = formatDateForInput(`${yearEnd}-${monthEnd}-${dayEnd}`);

        return (
            <div className="myRes-promotion">
                <TopMenu />
                <Nav pills className="restaurant-detail-nav container">
                    <NavItem >
                        <Link to={`/users/profile/my-restaurant/detail`}>Th??ng tin</Link>
                    </NavItem>
                    <NavItem>
                        <Link
                            onClick={() => {
                                localStorage.setItem('resId', '');
                                localStorage.setItem('resId', restaurantId)
                            }}
                            to={{
                                pathname: `/users/profile/my-restaurant/image`
                            }}
                        >
                            ???nh
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
                            Th???c ????n
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
                            Combo m??n ??n
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
                            D???ch v???
                        </Link>
                    </NavItem>
                    <NavItem className="active">
                        <Link
                            onClick={() => {
                                localStorage.setItem('resId', '');
                                localStorage.setItem('resId', restaurantId)
                            }}
                            to={{
                                pathname: `/users/profile/my-restaurant/promotion`
                            }}
                        >
                            Khuy???n m??i
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
                            ????n h??ng
                        </Link>
                    </NavItem>
                </Nav>
                <Container>
                    <h3>Khuy???n m??i</h3>
                    <hr />
                    <div className="add-promotion">
                        <Button color="primary" onClick={this.toggle}>
                            <FaRegPlusSquare className="btn-add-promotion" />Th??m khuy???n m??i
                        </Button>

                        <Modal isOpen={modal} toggle={this.toggle} className={``}>
                            <ModalHeader toggle={this.toggle}>Th??m khuy???n m??i</ModalHeader>
                            <ModalBody>
                                <Form onSubmit={(event) => {
                                    event.preventDefault();
                                    this.addPromotion();
                                }}>
                                    <div>
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
                                                                <CardImg className="promotion-image" top src={image.data_url} />
                                                                <Alert color="danger" id="error-form4" className="error-form">
                                                                    Kh??ng th??? t???i ???nh l??n, vui l??ng ch???n m???t ???nh kh??c !
                                                                </Alert>
                                                            </div>
                                                        )
                                                    )
                                                    )}

                                                    <div className="btn-change-image" onClick={onImageUpdate}>Ch???n ho???c ?????i ???nh</div>
                                                </div>
                                            )}
                                        </ImageUploading>
                                    </div>
                                    <div>
                                        <Label for="name"><b>T??n khuy???n m??i <span className="require-icon">*</span></b></Label>
                                        <Input
                                            type="text"
                                            name="name"
                                            id="name"
                                            placeholder="Nh???p t??n khuy???n m??i"
                                            onChange={this.onChangeName}
                                            value={name}
                                            required="required"
                                        />

                                        <Label for="discount"><b>Ph???n tr??m khuy???n m??i (%) <span className="require-icon">*</span></b></Label>
                                        <Input
                                            type="number"
                                            name="discount"
                                            id="discount"
                                            min={0}
                                            max={100}
                                            placeholder="Nh???p ph???n tr??m khuy???n m??i"
                                            onChange={this.onChangeDiscount}
                                            value={discount}
                                            required="required"
                                        />

                                        <Label for="start"><b>Ng??y b???t ?????u <span className="require-icon">*</span></b></Label>
                                        <Input
                                            type="date"
                                            name="start"
                                            id="start"
                                            min={formatDateForInput(new Date())}
                                            placeholder="Nh???p ng??y b???t ?????u"
                                            onChange={this.onChangeStart}
                                            value={start}
                                            required="required"
                                        />

                                        <Label for="end"><b>Ng??y k???t th??c <span className="require-icon">*</span></b></Label>
                                        <Input
                                            type="date"
                                            name="end"
                                            id="end"
                                            min={minEnd}
                                            placeholder="Nh???p ng??y k???t th??c"
                                            onChange={this.onChangeEnd}
                                            value={end}
                                            required="required"
                                        />

                                        <Label for="description"><b>M?? t??? <span className="require-icon">*</span></b></Label>
                                        <Input
                                            type="textarea"
                                            name="description"
                                            id="description"
                                            placeholder="M?? t??? khuy???n m??i"
                                            onChange={this.onChangeDescription}
                                            value={description}
                                            required="required"
                                        />
                                    </div>
                                    <Input type="submit" value="L??u" className="btn btn-success btn-save" />
                                </Form>
                            </ModalBody>
                            <ModalFooter>
                                {/* <Button color="success" onClick={() => this.addPromotion()}>L??u</Button>{' '} */}

                                <Button color="secondary" onClick={this.toggle}>Quay l???i</Button>
                            </ModalFooter>
                        </Modal>

                    </div>
                    <div className="table-responsive">
                        <Table className="promotion-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>T??n khuy???n m??i</th>
                                    <th>Ng??y b???t ?????u</th>
                                    <th>Ng??y k???t th??c</th>
                                    <th>Tr???ng th??i</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.promotionsPaging}
                            </tbody>
                        </Table>
                    </div>
                    {
                        (this.state.promotionsPaging && this.state.promotionsPaging.length > 0) ? <>
                            {
                                this.state.pageCount > 1 && <ReactPaginate
                                    previousLabel={"Trang tr?????c"}
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
                            Kh??ng t??m th???y k???t qu??? n??o
                        </div>
                    }
                </Container>
                <Footer />
                <Messenger />
            </div>
        )
    }
}
