import React from 'react';
import PopupWithForm from '../PopupWithForm/PopupWithForm';

function ConfirmationPopup({ isOpen, onClose, onConfirm, isLoading }) {

    const textSubmit = isLoading ? 'Удаление...' : 'Да';

    function handleSubmit(e) {
        e.preventDefault();
        onConfirm();
    }

    return (
        <PopupWithForm isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} isValid={true}
            popupName='confirmation' formTitle="Вы уверены?" formName="confirmation" textSubmit={textSubmit} />
    )
}

export default ConfirmationPopup;
