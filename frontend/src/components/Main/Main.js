import { useContext } from 'react';
import Card from '../Card/Card';
import CurrentUserContext from '../../contexts/CurrentUserContext';

function Main({ cards, onEditProfile, onAddPlace, onEditAvatar, onCardClick, onCardLike, onCardTrashClick }) {

    const currentUser = useContext(CurrentUserContext);

    return (
        <main>
            <section className="profile" >
                <button type="button" className="profile__button-userAvatar" onClick={onEditAvatar}  >
                    <img className="profile__userAvatar" src={currentUser.avatar} alt="аватар пользователя" />
                </button>
                <div className="profile__info">
                    <h1 className="profile__userName">
                        {currentUser.name}
                    </h1>
                    <button className="profile__edit-button" type="button" onClick={onEditProfile} ></button>
                    <p className="profile__userAbout">
                        {currentUser.about}
                    </p>
                </div>
                <button className="profile__add-button" type="button" onClick={onAddPlace}></button>
            </section>

            <section className="gallery" aria-label="фото галерея" >
                <ul className="cards">

                    {cards.map((card) => {
                        return (
                            <Card card={card} key={card._id}
                                onCardClick={onCardClick} onCardLike={onCardLike} onCardTrashClick={onCardTrashClick} />
                        );
                    })}

                </ul>


            </section>
        </main>
    );
}

export default Main;
