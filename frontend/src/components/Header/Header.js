import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

function Header({ email, logOut }) {

    function handleClick() {
        logOut();
    }

    return (
        <header className="header">
            <a className="header__logo"></a>
            <Routes>
                <Route path='/sign-in' element={<Link className='header__link' to="/sign-up">Регистрация</Link>} />
                <Route path='/sign-up' element={<Link className='header__link' to="/sign-in">Войти</Link>} />
                <Route path='/' element={<span><span className='header__text'>{email}</span><button className='header__link header__link_color_dark' onClick={handleClick} type="button" >Выйти</button></span>} />
            </Routes>
        </header>
    );
}

export default Header;