import { useEffect, useState, useContext } from 'react';
import PopupWithForm from '../PopupWithForm/PopupWithForm';
import CurrentUserContext from '../../contexts/CurrentUserContext';

function EditProfilePopup({ isOpen, onClose, onUpdateUser, isLoading  }) {

  const currentUser = useContext(CurrentUserContext);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errorName, setErrorName] = useState('');
  const [errorDescription, setErrorDescription] = useState('');
  const [validationState, setValidationState] = useState({});
  const [isValid, setIsValid] = useState(true);
  const textSubmit = isLoading ? 'Сохранение...' : 'Сохранить';

  useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
    setIsValid(true);
  }, [currentUser, isOpen]);

  useEffect(() => {
    const state = Object.values(validationState).some((item) => {
      return item === false;
    });
    setIsValid(!state);
  }, [validationState]);

  function handleChangeName(e) {
    if (!e.target.validity.valid) {
      setErrorName(e.target.validationMessage);
    } else {
      setErrorName('');
    }
    setName(e.target.value);
    setValidationState({ ...validationState, [e.target.name]: e.target.validity.valid });
  }

  function handleChangeDescription(e) {
    if (!e.target.validity.valid) {
      setErrorDescription(e.target.validationMessage);
    } else {
      setErrorDescription('');
    }
    setDescription(e.target.value);
    setValidationState({ ...validationState, [e.target.name]: e.target.validity.valid });
  }

  function handleSubmit(e) {
    e.preventDefault();
      onUpdateUser({
      name,
      "about": description,
    });
  }

  return (
    <PopupWithForm isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} isValid={isValid} popupName='profile-edit' formTitle="Редактировать профиль" formName="profile-edit" textSubmit={textSubmit}  >
      <input className="form__item form__item_name_name" type="text" name="name" placeholder="Имя" minLength="2"
        maxLength="40" value={name} onChange={handleChangeName} required />
      <span className={`form__item-error form__item-error_name_name ${isValid ? "" : "form__item-error_active"}`} >
        {errorName}
      </span>
      <input className="form__item form__item_name_about" type="text" name="about" placeholder="О себе" minLength="2"
        maxLength="200" value={description} onChange={handleChangeDescription} required />
      <span className={`form__item-error form__item-error_name_about ${isValid ? "" : "form__item-error_active"}`} >
        {errorDescription}
      </span>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
