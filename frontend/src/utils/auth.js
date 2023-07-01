class Auth {
    constructor(options) {
        this._baseUrl = options.baseUrl;
        this._headers = options.headers;
    }

    _checkResponse(res) {
        if (res.ok) {
            return res.json();
        } else {
            return Promise.reject(res.status);
        };
    }

    _request(url, options) {
        return fetch(url, options).then(this._checkResponse);
    }

    register(bodyObj) {
        return this._request(this._baseUrl + '/signup', {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify(bodyObj),
        });
    }

    login(bodyObj) {
        return this._request(this._baseUrl + '/signin', {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify(bodyObj),
        });
    }

    checkToken(userToken) {
        const headers = this._headers;
        headers.Authorization = `Bearer ${userToken}`;
        return this._request(this._baseUrl + '/users/me', {
            method: 'GET',
            headers: headers,
        });
    }

}

const auth = new Auth({
    baseUrl: 'https://api.places.nomoreparties.sbs',
    headers: {
        'content-type': 'application/json',
    },
});

export default auth;
