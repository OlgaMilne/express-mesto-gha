import { useEffect, useState, useContext, useRef } from 'react';
import PopupWithForm from '../PopupWithForm/PopupWithForm';
import CurrentUserContext from '../../contexts/CurrentUserContext';

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar, isLoading }) {

    const currentUser = useContext(CurrentUserContext);

    const inputElement = useRef();
    const [avatar, setAvatar] = useState('');
    const [error, setError] = useState('');
    const [validationState, setValidationState] = useState({});
    const [isValid, setIsValid] = useState(true);
    const textSubmit = isLoading ? 'Сохранение...' : 'Сохранить';

    useEffect(() => {
        setAvatar(currentUser.avatar);
        setIsValid(true);
    }, [currentUser, isOpen]);

    useEffect(() => {
        const state = Object.values(validationState).some((item) => {
            return item === false;
        });
        setIsValid(!state);
    }, [validationState]);

    function handleChange(e) {
        if (!inputElement.current.validity.valid) {
            setError(inputElement.current.validationMessage);
        } else {
            setError('');
        }
        setAvatar(inputElement.current.value);
        setValidationState({ ...validationState, [inputElement.current.name]: inputElement.current.validity.valid });
    }

    function handleSubmit(e) {
        e.preventDefault();
        onUpdateAvatar({
            'avatar': avatar,
        })
    }

    return (
        <PopupWithForm isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} isValid={isValid} popupName='avatar' formTitle="Обновить аватар" formName="avatar" textSubmit={textSubmit} >
            <input ref={inputElement} className="form__item form__item_name_avatar" type="url" name="avatar" placeholder="Ссылка на картинку"
                value={avatar} onChange={handleChange} required />
            <span className={`form__item-error form__item-error_name_avatar ${isValid ? "" : "form__item-error_active"}`} >
                {error}
            </span>
        </PopupWithForm>
    )
}

export default EditAvatarPopup;
