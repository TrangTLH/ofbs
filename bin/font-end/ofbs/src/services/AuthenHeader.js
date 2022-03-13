export default function authenHeader() {
    const token = JSON.parse(localStorage.getItem('jwtToken'));

    return {
        Authorization: token
    };
}