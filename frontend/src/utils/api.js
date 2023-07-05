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

  _request(endpoint, options) {
    return fetch(this._baseUrl+endpoint, options).then(this._checkResponse);
  }

  getInitialCards() {
    return this._request('/cards', {
      method: 'GET',
      headers: this._headers,
      credentials: 'include',
    });
  }

  addCard(bodyObj) {
    return this._request('/cards', {
      method: 'POST',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify(bodyObj),
    });
  }

  deleteCard(endUrl) {
    return this._request('/cards/' + endUrl, {
      method: 'DELETE',
      headers: this._headers,
      credentials: 'include',
    });
  }

  getUserProfile() {
    return this._request('/users/me', {
      method: 'GET',
      headers: this._headers,
      credentials: 'include',
    });
  }

  editUserProfile(bodyObj) {
    return this._request('/users/me', {
      method: 'PATCH',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify(bodyObj),
    });
  }

  editUserAvatar(bodyObj) {
    return this._request('/users/me/avatar', {
      method: 'PATCH',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify(bodyObj),
    });
  }

  changeLikeCardStatus(cardId, hasUserLike) {
    if (hasUserLike) {
      return this._request('/cards/' + cardId + '/likes', {
        method: 'DELETE',
        headers: this._headers,
        credentials: 'include',
      });
    } else {
      return this._request('/cards/' + cardId + '/likes', {
        method: 'PUT',
        headers: this._headers,
        credentials: 'include',
      });
    }
  }

}

const api = new Api({
  baseUrl: 'https://api.places.nomoreparties.sbs',
  headers: {
       'content-type': 'application/json; charset=UTF-8',
  },
});

export default api;
