import { Component } from 'react';
import {
    CardImg, Row, Form, FormGroup,
    Input, Label, Button, Card, CardTitle, CardText,
    CardSubtitle, CardBody, Container
} from 'reactstrap';

import axios from 'axios';
import subVn from "sub-vn";
import StarRatings from "react-star-ratings";
import Carousel from 'react-multi-carousel';

import TopMenu from '../components/topMenu';
import Footer from '../components/footer';
import { Redirect } from 'react-router';

const responsive = {
    desktop: {
        breakpoint: {
            max: 3000,
            min: 1024
        },
        items: 4,
        partialVisibilityGutter: 40
    },
    mobile: {
        breakpoint: {
            max: 464,
            min: 0
        },
        items: 1,
        partialVisibilityGutter: 30
    },
    tablet: {
        breakpoint: {
            max: 1024,
            min: 464
        },
        items: 2,
        partialVisibilityGutter: 30
    }
}
export default class home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            provinces: subVn.getProvinces(),
            districts: [],
            restaurantsType1: [],
            restaurantsType2: [],
            searchObject: {
                restaurantName: '',
                province: '',
                district: '',
                type: 0
            },
            isSubmit: false
        };
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
        this.setState({ isSubmit: true })
    }

    componentDidMount() {
        axios.get('http://localhost:8080/restaurants/1')
            .then(res => {
                this.setState({ restaurantsType1: res.data })
            })
        axios.get('http://localhost:8080/restaurants/2')
            .then(res => {
                this.setState({ restaurantsType2: res.data })
            })
    }

    render() {
        let { provinces, districts, restaurantsType1,
            restaurantsType2, searchObject, isSubmit
        } = this.state;

        return (
            <div className="home-container">
                <TopMenu />
                <div className="wallpaper">
                    <CardImg className="image" src={process.env.PUBLIC_URL + '/images/wallpaper.png'} alt="Logo" />
                    <div className="home-title">Feast Booking</div>
                </div>
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
                <div className="home-content">
                    <div className="content-title">Trung tâm tổ chức sự kiện nổi bật</div>
                    <div className="content-restaurant">
                        <div className="section-1">
                            <div className="content-restaurant-heading">
                                <div className="heading-title">Tiệc lưu động</div>
                                <div className="heading-see-all">Xem tất cả</div>
                            </div>
                            <Container className="content-restaurant-list">
                                <Row className="content-restaurant-row">
                                    <Carousel
                                        responsive={responsive}
                                        additionalTransfrom={0}
                                        autoPlay={this.props.deviceType !== "desktop" ? true : false}
                                        autoPlaySpeed={3000}
                                        centerMode={true}
                                        containerClass="container"
                                        focusOnSelect={false}
                                        infinite={true}
                                        slidesToSlide={1}
                                        containerClass="container-with-dots"
                                    >
                                        {restaurantsType1.map(restaurant => {
                                            return <Card key={restaurant.restaurantId} className="item">
                                                <CardImg className="restaurant-img" top width="100%" src={'http://localhost:8080/images/' + restaurant.imageId} alt="Nhà hàng" />
                                                <CardBody className="restaurant-content">
                                                    <CardTitle tag="h5">{restaurant.restaurantName}</CardTitle>
                                                    <CardSubtitle className="restaurant-location" tag="h6" className="mb-2 text-muted">{restaurant.province}</CardSubtitle>
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
                                        })}
                                    </Carousel>
                                </Row>
                            </Container>
                        </div>
                        <div className="section-2">
                            <div className="content-restaurant-heading">
                                <div className="heading-title">Tiệc tại trung tâm</div>
                                <div className="heading-see-all">Xem tất cả</div>
                            </div>
                            <Container className="content-restaurant-list">
                                <Row className="content-restaurant-row">
                                    <Carousel
                                        responsive={responsive}
                                        additionalTransfrom={0}
                                        autoPlay={this.props.deviceType !== "desktop" ? true : false}
                                        autoPlaySpeed={3000}
                                        centerMode={true}
                                        containerClass="container"
                                        focusOnSelect={false}
                                        infinite={true}
                                        slidesToSlide={1}
                                        containerClass="container-with-dots"
                                    >
                                        {restaurantsType2.map(restaurant => {
                                            return <Card key={restaurant.restaurantId} className="item">
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
                                        })}
                                    </Carousel>
                                </Row>
                            </Container>
                        </div>
                    </div>
                </div>
                <Footer />
                {
                    isSubmit &&
                    <Redirect to={{
                        pathname: '/search-result',
                        state: { searchResult: searchObject }
                    }} />
                }
            </div>
        );
    }
}