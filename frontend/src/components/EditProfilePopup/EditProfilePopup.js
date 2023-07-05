import { useEffect, useState, useContext } from 'react';
import PopupWithForm from '../PopupWithForm/PopupWithForm';
import CurrentUserContext from '../../contexts/CurrentUserContext';
import { useForm } from '../../hooks/useForm';

function EditProfilePopup({ isOpen, onClose, onUpdateUser, isLoading }) {

  const currentUser = useContext(CurrentUserContext);

  const [isValid, setIsValid] = useState(true);
  const textSubmit = isLoading ? 'Сохранение...' : 'Сохранить';
  const { values, setValues, errorMessages, setErrorMessages, validationState, handleChange } = useForm({});
  const errorName = errorMessages['name'];
  const errorAbout = errorMessages['about'];

  useEffect(() => {
    setValues({ name: currentUser.name, about: currentUser.about });
    setErrorMessages({ name: '', about: '' });
    setIsValid(true);
  }, [currentUser, isOpen]);

  useEffect(() => {
    const state = Object.values(validationState).some((item) => {
      return item === false;
    });
    setIsValid(!state);
  }, [validationState]);

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateUser({
      "name": values.name,
      "about": values.about,
    });
  }

  return (
    <PopupWithForm isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} isValid={isValid} popupName='profile-edit' formTitle="Редактировать профиль" formName="profile-edit" textSubmit={textSubmit}  >
      <input className="form__item form__item_name_name" type="text" name="name" placeholder="Имя" minLength="2"
        maxLength="40" value={values.name} onChange={handleChange} required />
      <span className={`form__item-error form__item-error_name_name ${isValid ? "" : "form__item-error_active"}`} >
        {errorName}
      </span>
      <input className="form__item form__item_name_about" type="text" name="about" placeholder="О себе" minLength="2"
        maxLength="200" value={values.about} onChange={handleChange} required />
      <span className={`form__item-error form__item-error_name_about ${isValid ? "" : "form__item-error_active"}`} >
        {errorAbout}
      </span>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
