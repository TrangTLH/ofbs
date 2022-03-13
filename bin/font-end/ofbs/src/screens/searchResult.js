import axios from 'axios';
import React, { Component } from 'react'
import {
    Container, Row, CardImg, Form, FormGroup,
    Input, Label, Button, Card, CardTitle, CardText,
    CardSubtitle, CardBody, Col
} from 'reactstrap';
import { Redirect } from 'react-router';

import subVn from "sub-vn";
import StarRatings from "react-star-ratings";
import ReactPaginate from 'react-paginate';

import TopMenu from '../components/topMenu';
import Footer from '../components/footer';

export default class searchResult extends Component {
    constructor(props) {
        super(props);

        this.state = {
            provinces: subVn.getProvinces(),
            districts: [],
            restaurantSearch: [],
            searchObject: {
                restaurantName: '',
                province: '',
                district: '',
                type: 0
            },
            isSubmit: false,
            offset: 0,
            perPage: 12,
            currentPage: 0
        }

        this.handlePageClick = this.handlePageClick.bind(this);
        this.onProvinceClick = this.onProvinceClick.bind(this);
        this.onChangeRestaurantName = this.onChangeRestaurantName.bind(this);
        this.onDistrictClick = this.onDistrictClick.bind(this);
        this.onChangeCheckboxTypeOne = this.onChangeCheckboxTypeOne.bind(this);
        this.onChangeCheckboxTypeTwo = this.onChangeCheckboxTypeTwo.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChangeRestaurantName(event) {
        event.preventDefault();
        this.setState(prevState => {
            let searchObject = { ...prevState.searchObject };
            searchObject.restaurantName = event.target.value;
            return { searchObject };
        })
    }

    onProvinceClick(event) {
        event.preventDefault();
        let provinceCode = event.target.value;
        this.setState({
            districts: subVn.getDistrictsByProvinceCode(provinceCode)
        });

        this.setState(prevState => {
            let searchObject = { ...prevState.searchObject };
            let index = event.nativeEvent.target.selectedIndex;
            let provinceName = event.nativeEvent.target[index].text;

            searchObject.province = provinceName;
            return { searchObject };
        })
    }

    onDistrictClick(event) {
        event.preventDefault();
        this.setState(prevState => {
            let searchObject = { ...prevState.searchObject };
            let index = event.nativeEvent.target.selectedIndex;
            let districtName = event.nativeEvent.target[index].text;

            searchObject.district = districtName;
            return { searchObject };
        })
    }

    onChangeCheckboxTypeOne(event) {
        let check = event.target.checked;
        let cbTypeTwo = document.getElementById('cbTypeTwo');

        if (check) {
            this.setState(prevState => {
                let searchObject = { ...prevState.searchObject };
                searchObject.type = 1;
                return { searchObject };
            })
        } if ((check && cbTypeTwo.checked) || (!check && !cbTypeTwo.checked)) {
            this.setState(prevState => {
                let searchObject = { ...prevState.searchObject };
                searchObject.type = 0;
                return { searchObject };
            })
        }

        if (!check && cbTypeTwo.checked) {
            this.setState(prevState => {
                let searchObject = { ...prevState.searchObject };
                searchObject.type = 2;
                return { searchObject };
            })
        }
    }

    onChangeCheckboxTypeTwo(event) {
        let check = event.target.checked;
        let cbTypeOne = document.getElementById('cbTypeOne');

        if (check) {
            this.setState(prevState => {
                let searchObject = { ...prevState.searchObject };
                searchObject.type = 2;
                return { searchObject };
            })
        }
        if ((check && cbTypeOne.checked) || (!check && !cbTypeOne.checked)) {
            this.setState(prevState => {
                let searchObject = { ...prevState.searchObject };
                searchObject.type = 0;
                return { searchObject };
            })
        }

        if (!check && cbTypeOne.checked) {
            this.setState(prevState => {
                let searchObject = { ...prevState.searchObject };
                searchObject.type = 1;
                return { searchObject };
            })
        }
    }

    onSubmit(e) {
        e.preventDefault();
        this.receivedData();
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
        const { state } = this.props.location;
        if (state !== undefined && state !== null) {
            this.setState({
                searchObject: state.searchResult
            });
        }

        let restaurant = this.state.searchObject;

        if (restaurant.province === "Tỉnh/ Thành phố") {
            restaurant.province = "";
        }

        axios.get(`http://localhost:8080/restaurants?type=${restaurant.type}&province=${restaurant.province}&district=${restaurant.district}&restaurantName=${restaurant.restaurantName}`)
            .then(res => {
                const data = res.data;
                const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                const restaurants = slice.map((restaurant) => {
                    return <Col key={restaurant.restaurantId} className="search-item" lg="3" md="6" sm="12">
                        <Card key={restaurant.restaurantId} className="item">
                            <CardImg className="restaurant-img" top width="100%" src={'http://localhost:8080/images/' + restaurant.imageId} alt="Nhà hàng" />
                            <CardBody className="restaurant-content">
                                <CardTitle tag="h5">{restaurant.restaurantName}</CardTitle>
                                <CardSubtitle tag="h6" className="mb-2 text-muted">{restaurant.province}</CardSubtitle>
                                <CardText className="restaurant-size">{'Khoảng ' + restaurant.size + ' người'}</CardText>
                                <StarRatings
                                    rating={restaurant.rate}
                                    starDimension="20px"
                                    starSpacing="4px"
                                    starRatedColor="#ffe200"
                                    numberOfStars={5}
                                    className="rating-star"
                                />
                                <Button color="success">Xem thêm</Button>
                            </CardBody>
                        </Card>
                    </Col>
                })

                this.setState({
                    pageCount: Math.ceil(data.length / this.state.perPage),
                    restaurants
                })
            });
    }

    componentDidMount() {
        this.receivedData();
    }

    render() {
        let { provinces, districts, searchObject, isSubmit } = this.state;

        return (
            <div>
                <TopMenu />
                <div className="home-search">
                    <Form className="search-form">
                        <FormGroup>
                            <Input
                                type="text"
                                name="text"
                                id="text-search"
                                placeholder="Tìm kiếm"
                                value={searchObject.restaurantName}
                                onChange={this.onChangeRestaurantName}
                            />
                        </FormGroup>
                        <div className="search-location">
                            <FormGroup className="citySelect">
                                <Label for="citySelect"><b>Chọn tỉnh/ thành phố:</b></Label>
                                <Input type="select" name="citySelect" id="citySelect" onChange={this.onProvinceClick}>
                                    <option>Tỉnh/ Thành phố</option>
                                    {provinces.map((province) => {
                                        return (
                                            <option key={province.code} value={province.code}>
                                                {province.name}
                                            </option>
                                        );
                                    })}
                                </Input>
                            </FormGroup>
                            <FormGroup className="districtSelect">
                                <Label for="districtSelect"><b>Chọn quận/ huyện: </b></Label>
                                <Input type="select" name="districtSelect" id="districtSelect" onChange={this.onDistrictClick}>
                                    <option>Quận/ Huyện</option>
                                    {districts.map((district) => {
                                        return (
                                            <option key={district.code} value={district.code}>
                                                {district.name}
                                            </option>
                                        );
                                    })}
                                </Input>
                            </FormGroup>
                        </div>
                        <div className="search-other">
                            <FormGroup className="search-other-cb1" check>
                                <Label check>
                                    <Input id="cbTypeOne" type="checkbox" onChange={this.onChangeCheckboxTypeOne} /> Tiệc lưu động
                            </Label>
                            </FormGroup>
                            <FormGroup check>
                                <Label check>
                                    <Input id="cbTypeTwo" type="checkbox" onChange={this.onChangeCheckboxTypeTwo} /> Tiệc tại trung tâm
                            </Label>
                            </FormGroup>
                        </div>
                        <Input onClick={this.onSubmit} type="submit" className="btn btn-success btn-search" value="Tìm kiếm" />
                    </Form>
                </div>
                <Container className="search-content">
                    <Row>
                        {this.state.restaurants}
                    </Row>
                    <ReactPaginate
                        previousLabel={"Trang trước"}
                        nextLabel={"Trang sau"}
                        breakLabel={"..."}
                        breakClassName={"break-me"}
                        pageCount={this.state.pageCount}
                        marginPagesDisplayed={5}
                        pageRangeDisplayed={5}
                        onPageChange={this.handlePageClick}
                        containerClassName={"pagination"}
                        subContainerClassName={"pages pagination"}
                        activeClassName={"active"} />
                </Container>
                <Footer />
            </div>
        )
    }
}
