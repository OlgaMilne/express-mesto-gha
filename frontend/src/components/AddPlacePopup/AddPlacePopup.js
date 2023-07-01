import { useEffect, useState } from 'react';
import PopupWithForm from '../PopupWithForm/PopupWithForm';

function AddPlacePopup({ isOpen, onClose, onAddPlace, isLoading }) {

    const [name, setName] = useState('');
    const [link, setLink] = useState('');
    const [errorName, setErrorName] = useState('');
    const [errorLink, setErrorLink] = useState('');
    const [validationState, setValidationState] = useState({});
    const [isValid, setIsValid] = useState(true);
    const textSubmit = isLoading ? 'Создание...' : 'Создать';

    useEffect(() => {
        setName('');
        setLink('');
        setIsValid(true);
    }, [isOpen])

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

    function handleChangeLink(e) {
        if (!e.target.validity.valid) {
            setErrorLink(e.target.validationMessage);
        } else {
            setErrorLink('');
        }
        setLink(e.target.value);
        setValidationState({ ...validationState, [e.target.name]: e.target.validity.valid });
    }

    function handleSubmit(e) {
        e.preventDefault();
        onAddPlace({
            "name": name,
            "link": link,
        });
    }

    return (
        <PopupWithForm isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} isValid={isValid} popupName='add-card' formTitle="Новое место" formName="add-card" textSubmit={textSubmit}  >
            <input className="form__item form__item_name_location" type="text" name="location" placeholder="Место" minLength="2"
                maxLength="30" value={name} onChange={handleChangeName} required />
            <span className={`form__item-error form__item-error_name_location ${isValid ? "" : "form__item-error_active"}`} >
                {errorName}
            </span>
            <input className="form__item form__item_name_linkImage" type="url" name="linkImage" placeholder="Ссылка на картинку"
                value={link} onChange={handleChangeLink} required />
            <span className={`form__item-error form__item-error_name_linkImage ${isValid ? "" : "form__item-error_active"}`} >
                {errorLink}
            </span>
        </PopupWithForm>
    );
}

export default AddPlacePopup;
