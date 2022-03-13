import axios from 'axios';

const API_URL = 'http://localhost:8080/users';

export default axios.create({
    baseURL: API_URL
})
// class UserService {
//     getAllUser() {
//         axios.get(API_URL)
//             .then(res => {
//                 return res.data;
//             })
//             .catch(err => {
//                 console.log(err);
//             });
//     }

//     findByPhoneNumber(phoneNumber) {
//         axios.get(API_URL + '/findByPhoneNumber/' + phoneNumber)
//             .then(res => {
//                 // console.log(res.data);
//                 return res.data;
//             })
//             .catch(err => {
//                 console.log(err);
//             });

//     }
// }

// export default new UserService();