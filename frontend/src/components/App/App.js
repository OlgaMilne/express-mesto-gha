import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import api from '../../utils/api';
import auth from '../../utils/auth';
import Header from '../Header/Header';
import Main from '../Main/Main';
import EditProfilePopup from '../EditProfilePopup/EditProfilePopup';
import EditAvatarPopup from '../EditAvatarPopup/EditAvatarPopup';
import AddPlacePopup from '../AddPlacePopup/AddPlacePopup';
import ImagePopup from '../ImagePopup/ImagePopup';
import ConfirmationPopup from '../ConfirmationPopup/ConfirmationPopup';
import Footer from '../Footer/Footer';
import CurrentUserContext from '../../contexts/CurrentUserContext';
import Login from '../Login/Login';
import Register from '../Register/Register';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import InfoTooltip from '../InfoTooltip/InfoTooltip';
import NotFoundPage from '../NotFoundPage/NotFoundPage';

function App() {

  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);
  const [isDeleteCardPopupOpen, setIsDeleteCardPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({ name: '', link: '#' });
  const [deletedCardId, setDeletedCardId] = useState('');
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isError, setIsError] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getUserProfile(), api.getInitialCards()])
        .then(([userData, cardsData]) => {
          setCurrentUser(userData);
          setCards(cardsData.reverse());
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, [loggedIn]);

  useEffect(function () {
    auth.checkToken()
      .then((userData) => {
        setUserEmail(userData.email);
        setLoggedIn(true);
        navigate('/', { replace: true, });
      })
      .catch((err) => {
        if (err === '401') {
          setLoggedIn(false);
          navigate('/sign-in', { replace: true, });
        } else {
          console.log(err);
        }
      });
  }, [loggedIn, navigate]);

  function handleRegisterUser(userData) {
    auth.register(userData)
      .then(() => {
        setIsError(false);
        setIsInfoTooltipPopupOpen(true)
        navigate('/sign-in', { replace: true, })
      })
      .catch((err) => {
        setIsError(true);
        setIsInfoTooltipPopupOpen(true)
        console.log(err);
      })
  }

  function handleLogin(userData) {
    auth.login(userData)
      .then((user) => {
        setUserEmail(user.email);
        setLoggedIn(true);
        navigate('/', { replace: true, })
      })
      .catch((err) => {
        setIsError(true);
        setIsInfoTooltipPopupOpen(true)
        console.log(err);
      })
  }

  function logOut() {
    auth.logout()
      .then(() => {
        setLoggedIn(false);
        navigate('/sign-in', { replace: true, })
      })
      .catch((err) => {
        console.log(err);
      })
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  };

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  };

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  };

  function handleCardTrashClick(cardId) {
    setDeletedCardId(cardId);
    setIsDeleteCardPopupOpen(true);
  };

  function handleAddPlace(dataCard) {
    setIsLoading(true);
    api.addCard(dataCard)
      .then(newCard => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
  }

  function handleUpdateAvatar(avatar) {
    setIsLoading(true);
    api.editUserAvatar(avatar)
      .then(userData => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
  }

  function handleUpdateUser(user) {
    setIsLoading(true);
    api.editUserProfile(user)
      .then(userData => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
  }

  function handleDeleteCard() {
    setIsLoading(true);
    api.deleteCard(deletedCardId)
      .then(() => {
        const updatedCards = cards.filter((item) => item._id !== deletedCardId);
        setCards(updatedCards);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
  };

  function handleCardClick(name, link) {
    setSelectedCard({ name: name, link: link, });
    setIsImagePopupOpen(true);
  }

  function handleCardLike(card) {
    const hasUserLike = card.likes.some(i => i === currentUser._id);
    api.changeLikeCardStatus(card._id, hasUserLike)
      .then((newCard) => {
        setCards(cards.map((item) => item._id === card._id ? newCard : item,));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsDeleteCardPopupOpen(false);
    setIsImagePopupOpen(false);
    setIsInfoTooltipPopupOpen(false)
    setTimeout(() => setIsLoading(false), 1000);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header email={userEmail} logOut={logOut} />

      <Routes>
        <Route path='/' element={
          <ProtectedRoute
            element={Main}
            cards={cards}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            onCardTrashClick={handleCardTrashClick}
            onCardLike={handleCardLike}
            loggedIn={loggedIn}
          />
        }
        />
        <Route path='/sign-in' element={<Login onLogin={handleLogin} />} />
        <Route path='/sign-up' element={<Register onRegisterUser={handleRegisterUser} />} />
        <Route path='/404' element={<NotFoundPage />} />
        <Route path='*' element={<Navigate to='/404' replace />} />
      </Routes>

      <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} isLoading={isLoading} onUpdateAvatar={handleUpdateAvatar} />

      <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} isLoading={isLoading} onUpdateUser={handleUpdateUser} />

      <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} isLoading={isLoading} onAddPlace={handleAddPlace} />

      <ConfirmationPopup isOpen={isDeleteCardPopupOpen} onClose={closeAllPopups} isLoading={isLoading} onConfirm={handleDeleteCard} />

      <ImagePopup isOpen={isImagePopupOpen} onClose={closeAllPopups} card={selectedCard} />

      <InfoTooltip isOpen={isInfoTooltipPopupOpen} onClose={closeAllPopups} isError={isError} />

      <Footer />

    </CurrentUserContext.Provider>

  );
}

export default App;
