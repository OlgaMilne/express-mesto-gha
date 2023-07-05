import { useEffect } from 'react';

function ImagePopup({ card, isOpen, onClose }) {

    useEffect(() => {
        if (!isOpen) return;

        const closeByEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        
        document.addEventListener('keydown', closeByEscape);
        return () => document.removeEventListener('keydown', closeByEscape);
    }, [isOpen]);

    function handleOverlay(e) {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }

    return (
        <section className={`popup popup_for_image popup_overlay_dark ${isOpen ? "popup_opened" : ""}`}
            onMouseDown={handleOverlay} >
            <div className="image-popup">
                <img className="image-popup__image" src={card.link} alt={card.name} />
                <p className="image-popup__caption">
                    {card.name}
                </p>
                <button className="popup__close-button" type="button" onClick={onClose}></button>
            </div>
        </section>
    );
}

export default ImagePopup;
