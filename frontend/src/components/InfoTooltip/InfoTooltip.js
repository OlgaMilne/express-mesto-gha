import { useEffect } from 'react';
import {} from '../../images/sign-error.svg'

function InfoTooltip({ isOpen, onClose, isError }) {

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
    <section className={`popup  popup_for_infoTooltip ${isOpen ? 'popup_opened' : ''}`}
      onMouseDown={handleOverlay}  >
      <div className="popup__container">
      <div className={`popup__icon popup__icon_sign_${isError ? 'error' : 'ok'}`}>
       </div>
        <h3 className="popup__message">
          {isError ?
            ('Что-то пошло не так! Попробуйте ещё раз.')
            : ('Вы успешно зарегистрировались!')}
        </h3>     
        <button className="popup__close-button" type="button" onClick={onClose}></button>
      </div>
    </section>
  )
}

export default InfoTooltip;