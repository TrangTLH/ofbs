import axios from 'axios';

const API_URL = "http://localhost:8080";

class AuthenService {
    login(username, password) {
        return axios
            .post(API_URL + "/authenticate", {
                username,
                password
            })
            .then(res => {
                console.log(res)
                if (res.data.token) {
                    localStorage.setItem("jwtToken", res.data.token);
                }

                return res.data;
            })
    }

    logout() {
        localStorage.removeItem("jwtToken");
    }

    register(username, password) {
        return axios.post(API_URL + "/register", {
            username,
            password
        });
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('jwtToken'));
    }
}

export default new AuthenService();