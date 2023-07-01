import { useEffect } from 'react';

function PopupWithForm({ isOpen, onClose, onSubmit, isValid, popupName, formTitle, formName, textSubmit, children }) {

  useEffect(() => {
    if (!isOpen) return;

    const closeByEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    document.addEventListener('keydown', closeByEscape);
    return () => document.removeEventListener('keydown', closeByEscape)
  }, [isOpen])

  function handleOverlay(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return (
    <section className={`popup  popup_for_${popupName} ${isOpen ? 'popup_opened' : ''}`}
      onMouseDown={handleOverlay}  >
      <div className="popup__container">
        <h3 className="popup__heading ">
          {formTitle}
        </h3>
        <form className={`form form_name_${formName}`} name={formName} onSubmit={onSubmit} noValidate>
          {children}
          <button className={`form__button ${isValid ? "" : "form__button_inactive"}`} type="submit" disabled={!isValid} >
            {textSubmit || 'Сохранить'}
          </button>
        </form>
        <button className="popup__close-button" type="button" onClick={onClose}></button>
      </div>
    </section>
  );
}

export default PopupWithForm;
