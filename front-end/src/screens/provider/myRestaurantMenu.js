import React, { Component } from 'react';
import {
    Nav, NavItem, Container, Table,
    Label, Input, Button, Modal, ModalHeader,
    ModalBody, ModalFooter, Alert, CardImg, Form
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { api, url } from '../../config/axios';
import ImageUploading from "react-images-uploading";
import { FaSearch, FaRegPlusSquare } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';

import TopMenu from '../../components/common/topMenu';
import Footer from '../../components/common/footer';
import MyRestaurantMenuItem from '../../components/provider/myRestaurantMenuItem';
import { Notify } from '../../common/notify';
import { validateCapacity, validateDescription, validateEmpty, validateUsername } from '../../common/validate';
import Messenger from '../../components/common/messenger';

let restaurantId = '';
export default class myRestaurantMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dishes: [],
            categories: [],
            images: [],
            nameSearch: '',
            categorySearch: 0,

            name: '',
            category: 1,
            status: 1,
            price: '',
            description: '',
            modal: false,

            offset: 0,
            perPage: 10,
            currentPage: 0
        }

        this.onChangeNameSearch = this.onChangeNameSearch.bind(this);
        this.onChangeCategorySearch = this.onChangeCategorySearch.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeCategory = this.onChangeCategory.bind(this);
        this.onChangePrice = this.onChangePrice.bind(this);
        this.onChangeStatus = this.onChangeStatus.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChange = this.onChange.bind(this);
        this.search = this.search.bind(this);
        this.addDish = this.addDish.bind(this);
        this.toggle = this.toggle.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        restaurantId = localStorage.getItem('resId');
        api.get(`/dishes/getCategories`)
            .then(res => {
                this.setState({ categories: res.data })
            })
        this.receivedData(0, this.state.nameSearch.trim());
    }

    onChangeName(e) {
        this.setState({ name: e.target.value });
    }

    onChangeCategory(e) {
        this.setState({ category: e.target.value });
    }

    onChangeStatus(e) {
        this.setState({ status: e.target.value });
    }

    onChangePrice(e) {
        this.setState({ price: e.target.value });
    }

    onChangeDescription(e) {
        this.setState({ description: e.target.value });
    }

    onChangeNameSearch(e) {
        this.setState({ nameSearch: e.target.value });
    }

    onChangeCategorySearch(e) {
        this.setState({ categorySearch: e.target.value });
    }

    search() {
        const { nameSearch, categorySearch } = this.state;
        this.setState({
            currentPage: 0,
            offset: 0
        }, () => {
            this.receivedData(categorySearch, nameSearch.trim());
        })
    }

    updateImage(dishId) {
        let formData = new FormData();
        formData.append('file', this.state.images[0].file);
        document.getElementById('error-form4').style.display = "none";

        api.post(url + `/images/upload?userId=0&dishId=${dishId}&serviceId=0&comboId=0&restaurantId=0&promotionId=0&typeId=1`,
            formData, {
        }).then(res => {
            this.receivedData(0, '');
        }).catch(err => {
            Notify('T???i ???nh l??n kh??ng th??nh c??ng', 'error', 'top-right');
        })
    }

    validate() {
        if (!validateEmpty(this.state.name.trim())) {
            Notify('Vui l??ng nh???p t??n m??n ??n', 'error', 'top-right');
            return false;
        } else if (!validateUsername(this.state.name)) {
            Notify('T??n m??n ??n ph???i ??t h??n 100 k?? t???', 'error', 'top-right');
            return false;
        } else if (!validateCapacity(this.state.price)) {
            Notify('Gi?? m??n ??n ph???i ??t h??n 10 k?? t???', 'error', 'top-right');
            return false;
        } if (!validateEmpty(this.state.description.trim())) {
            Notify('M?? t??? kh??ng ???????c ????? tr???ng', 'error', 'top-right');
            return false;
        } else if (!validateDescription(this.state.description)) {
            Notify('M?? t??? ph???i nh??? h??n 2000 k?? t???', 'error', 'top-right');
            return false;
        } else {
            return true;
        }
    }

    addDish() {
        const { category, name, price, status, description, images } = this.state;
        if (images.length > 0) {
            if (this.validate()) {
                api.get(`/restaurants/getRestaurantById?restaurantId=${restaurantId}`)
                    .then(res => {
                        let dishStatus = '';
                        let menuCategory = '';
                        let restaurant = res.data;

                        if (status === 1) {
                            dishStatus = 'active';
                        } else {
                            dishStatus = 'inactive';
                        }

                        switch (category) {
                            case 1:
                                menuCategory = 'Khai v???';
                                break;

                            case 2:
                                menuCategory = 'M??n ch??nh';
                                break;

                            case 3:
                                menuCategory = 'Tr??ng mi???ng';
                                break;

                            case 4:
                                menuCategory = '????? u???ng';
                                break;
                            default:
                                break;
                        }
                        api.get(`/dishes/getDishesByRestaurantId?restaurantId=${restaurantId}&categoryId=0&dishName=&statusId=0`)
                            .then(res => {
                                let count = 0
                                res.data.forEach(dish => {
                                    if (name.trim() === dish.dish_name.trim()) {
                                        count = count + 1;
                                    }
                                });
                                if (count === 0) {
                                    api.post(`/dishes/save`,
                                        {
                                            "name": name,
                                            "status": { id: status, name: dishStatus },
                                            "description": description,
                                            "price": price,
                                            "restaurant": restaurant,
                                            "menuCategory": { id: category, name: menuCategory }
                                        }, {
                                        headers: {
                                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                                        }
                                    }).then(res => {
                                        this.toggle();
                                        this.updateImage(res.data.id);
                                        this.receivedData(0, '');
                                        this.setState({
                                            images: [],
                                            name: '',
                                            category: 1,
                                            status: 1,
                                            price: '',
                                            description: ''
                                        })

                                        Notify("Th??m m??n ??n th??nh c??ng", "success", "top-right");
                                    })
                                } else {
                                    Notify("T??n m??n ??n ???? t???n t???i trong nh?? h??ng", "error", "top-right");
                                }
                            })
                    })
            }
        } else {
            Notify('Vui l??ng th??m ???nh c???a m??n ??n', 'warning', 'top-right');
        }
    }

    toggle() {
        this.setState({ modal: !this.state.modal });

    };

    onChange = (imageList, addUpdateIndex) => {
        this.setState({ images: imageList });
    }

    handlePageClick = (e) => {
        window.scrollTo(0, 0);
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.receivedData(0, this.state.nameSearch.trim());
        });

    };

    componentWillUnmount() {
        this.setState({ dishesPaging: [] });
    }

    receivedData(categoryId, nameSearch) {
        api.get(`/dishes/getDishesByRestaurantId?restaurantId=${restaurantId}&categoryId=${categoryId}&dishName=${nameSearch}&statusId=0`)
            .then(res => {
                const data = res.data;
                const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                const dishesPaging = slice.map((dish, index) => {
                    return <MyRestaurantMenuItem key={index} dish={dish} count={index + 1} restaurantId={restaurantId} currentPage={this.state.currentPage} />
                })

                this.setState({
                    pageCount: Math.ceil(data.length / this.state.perPage),
                    dishesPaging
                })
            });
    }

    render() {
        const { categorySearch, nameSearch, categories, modal,
            images, category, name, price, status, description
        } = this.state;

        return (
            <div className="myRes-menu">
                <TopMenu searchResMenu />
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
                    <NavItem className="active">
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
                    <h3>M??n ??n</h3>
                    <hr />
                    <div className="menu-search" id="menu-search">
                        <div>
                            <Input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Nh???p t??n m??n ??n"
                                onChange={this.onChangeNameSearch}
                                value={nameSearch}
                            />
                        </div>
                        <div>
                            <Input
                                type="select"
                                name="categorySearch"
                                id="categorySearch"
                                onChange={this.onChangeCategorySearch}
                                value={categorySearch}
                            >
                                <option value={0}>T???t c???</option>
                                {categories.map((category) => {
                                    return (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    );
                                })}
                            </Input>
                        </div>

                        <div>
                            <Button onClick={this.search} className="btn-menu-search" color="primary">
                                <FaSearch className="icon-search" />
                            </Button>
                        </div>
                        <div>
                            <Button color="primary" onClick={this.toggle}>
                                <FaRegPlusSquare className="icon-add-service" />Th??m m??n ??n
                            </Button>
                        </div>
                        <Modal isOpen={modal} toggle={this.toggle} className={``}>
                            <ModalHeader toggle={this.toggle}>Th??m m??n ??n</ModalHeader>
                            <ModalBody>
                                <Form onSubmit={(event) => {
                                    event.preventDefault();
                                    this.addDish();
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
                                                                <CardImg className="business-image" top src={image.data_url} />
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
                                        <Label for="name"><b>T??n m??n ??n <span className="require-icon">*</span></b></Label>
                                        <Input
                                            type="text"
                                            name="name"
                                            id="name"
                                            placeholder="Nh???p t??n m??n ??n"
                                            onChange={this.onChangeName}
                                            value={name}
                                            required="required"
                                        />

                                        <Label for="category"><b>Lo???i h??nh <span className="require-icon">*</span></b></Label>
                                        <Input
                                            type="select"
                                            name="category"
                                            id="category"
                                            onChange={this.onChangeCategory}
                                            value={category}
                                        >
                                            {categories.map((category) => {
                                                return (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                );
                                            })}
                                        </Input>

                                        <Label for="status"><b>Tr???ng th??i <span className="require-icon">*</span></b></Label>
                                        <Input
                                            type="select"
                                            name="status"
                                            id="status"
                                            onChange={this.onChangeStatus}
                                            value={status}
                                        >
                                            <option value="1">??ang kinh doanh</option>
                                            <option value="2">Ng???ng kinh doanh</option>
                                        </Input>

                                        <Label for="price"><b>Gi?? m??n ??n (VN??) <span className="require-icon">*</span></b></Label>
                                        <Input
                                            type="number"
                                            name="price"
                                            id="price"
                                            min={1000}
                                            placeholder="Nh???p gi?? m??n ??n"
                                            onChange={this.onChangePrice}
                                            value={price}
                                            required="required"
                                        />

                                        <Label for="description"><b>M?? t??? <span className="require-icon">*</span></b></Label>
                                        <Input
                                            type="textarea"
                                            name="description"
                                            id="description"
                                            placeholder="M?? t??? m??n ??n"
                                            onChange={this.onChangeDescription}
                                            value={description}
                                            required="required"
                                        />
                                    </div>
                                    <Input type="submit" value="L??u" className="btn btn-success btn-save" />
                                </Form>
                            </ModalBody>
                            <ModalFooter>
                                {/* <Button color="success" onClick={() => this.addDish()}>L??u</Button>{' '} */}
                                <Button color="secondary" onClick={this.toggle}>Quay l???i</Button>
                            </ModalFooter>
                        </Modal>

                    </div>
                    <div className="table-responsive">
                        <Table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>T??n m??n ??n</th>
                                    <th>Gi?? (VN??)</th>
                                    <th>Lo???i m??n ??n</th>
                                    <th>Tr???ng th??i</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.dishesPaging}
                            </tbody>
                        </Table>
                    </div>
                    {
                        (this.state.dishesPaging && this.state.dishesPaging.length > 0) ? <>
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
