import { useContext } from 'react';
import CurrentUserContext from '../../contexts/CurrentUserContext';

function Card({ card, onCardClick, onCardLike, onCardTrashClick }) {

  const currentUser = useContext(CurrentUserContext);
  const isOwn = card.owner === currentUser._id;
  const isLiked = card.likes.some(i => i === currentUser._id);
  const likes = card.likes.length;
  const cardLikeButtonClassName = (`card__like-button ${isLiked && 'card__like-button_active'}`);;

  function handleClick() {
    onCardClick(card.name, card.link);
  }

  function handleLikeClick() {
     onCardLike(card);
  }

  function handleDeleteCard() {
    onCardTrashClick(card._id);
  }

  return (
    <li className="card">
      <img className="card__photo" src={card.link} alt={card.name} onClick={handleClick} />
      <div className="card__info">
        <h2 className="card__caption">
          {card.name}
        </h2>
        <div className="card__wrapper">
          <button className={cardLikeButtonClassName} type="button" onClick={handleLikeClick}></button>
          <span className="card__like-count">
            {likes}
          </span>
        </div>
      </div>
      {isOwn && <button className="card__trash-button" type="button" onClick={handleDeleteCard} />}
    </li>
  );
}

export default Card;
