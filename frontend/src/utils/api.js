class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`Ошибка: ${res.status}`);
    };
  }

  _request(url, options) {
    return fetch(url, options).then(this._checkResponse);
  }

  getInitialCards() {
    return this._request(this._baseUrl + 'cards', {
      method: 'GET',
      headers: this._headers,
    });
  }

  addCard(bodyObj) {
    return this._request(this._baseUrl + 'cards', {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify(bodyObj),
    });
  }

  deleteCard(endUrl) {
    return this._request(this._baseUrl + 'cards/' + endUrl, {
      method: 'DELETE',
      headers: this._headers,
    });
  }

  getUserProfile() {
    return this._request(this._baseUrl + 'users/me', {
      method: 'GET',
      headers: this._headers,
    });
  }

  editUserProfile(bodyObj) {
    return this._request(this._baseUrl + 'users/me', {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify(bodyObj),
    });
  }

  editUserAvatar(bodyObj) {
    return this._request(this._baseUrl + 'users/me/avatar', {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify(bodyObj),
    });
  }

  changeLikeCardStatus(cardId, hasUserLike) {
    if (hasUserLike) {
      return this._request(this._baseUrl + 'cards/' + cardId + '/likes', {
        method: 'DELETE',
        headers: this._headers,
      });
    } else {
      return this._request(this._baseUrl + 'cards/' + cardId + '/likes', {
        method: 'PUT',
        headers: this._headers,
      });
    }
  }

}

const api = new Api({
  baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-62/',
  headers: {
    authorization: 'acc868aa-03f1-432c-addf-4dea173b05f4',
    'content-type': 'application/json; charset=UTF-8',
  },
});

export default api;
