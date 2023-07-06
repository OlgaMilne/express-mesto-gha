import { useEffect, useState } from 'react';
import PopupWithForm from '../PopupWithForm/PopupWithForm';
import { useForm } from '../../hooks/useForm';

function AddPlacePopup({ isOpen, onClose, onAddPlace, isLoading }) {

    const [isValid, setIsValid] = useState(true);
    const textSubmit = isLoading ? 'Создание...' : 'Создать';
    const { values, setValues, errorMessages, setErrorMessages, validationState, handleChange } = useForm({});
    const errorLocation = errorMessages['location'];
    const errorLink = errorMessages['linkImage'];

    useEffect(() => {
        setValues({ location: '', linkImage: '' });
        setErrorMessages({ location: '', linkImage: '' });
        setIsValid(false);
    }, [isOpen])

    useEffect(() => {
        if (values.location && values.linkImage) {
            const state = Object.values(validationState).some((item) => {
                return item === false;
            });
            setIsValid(!state);
        }
    }, [validationState]);

    function handleSubmit(e) {
        e.preventDefault();
        onAddPlace({
            "name": values.location,
            "link": values.linkImage,
        });
    }

    return (
        <PopupWithForm isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} isValid={isValid} popupName='add-card' formTitle="Новое место" formName="add-card" textSubmit={textSubmit}  >
            <input className="form__item form__item_name_location" type="text" name="location" placeholder="Место" minLength="2"
                maxLength="30" value={values.location} onChange={handleChange} required />
            <span className={`form__item-error form__item-error_name_location ${!isOpen && (isValid || !isValid)  ? "" : "form__item-error_active"}`} >
                {errorLocation}
            </span>
            <input className="form__item form__item_name_linkImage" type="url" name="linkImage" placeholder="Ссылка на картинку"
                value={values.linkImage} onChange={handleChange} required />
            <span className={`form__item-error form__item-error_name_linkImage ${!isOpen && (isValid || !isValid) ? "" : "form__item-error_active"}`} >
                {errorLink}
            </span>
        </PopupWithForm>
    );
}

export default AddPlacePopup;
