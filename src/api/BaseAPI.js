import axios from 'axios';

export default {
  onLogin: (username, password) => {
    let details = {
      username: username,
      password: password,
      grant_type: `password`,
    };
    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    return axios({
      method: 'POST',
      url: 'http://demo3099111.mockable.io/',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: formBody
    })
    .then(res => res.data)
    .catch(error => { throw error });
  },
  onGetUserInfo: (token) => {
    return axios('http://demo3099111.mockable.io/', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token
      },
    })
    .then(res => res.data)
    .catch(error => { throw error });
  }
}