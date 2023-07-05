import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';

const Register = ({ onRegisterUser }) => {

  const [isValid, setIsValid] = useState(false);
  const { values, errorMessages, validationState, handleChange } = useForm({});
  const errorEmail = errorMessages['email'];
  const errorPassword = errorMessages['password'];

  useEffect(() => {
    if (values.email && values.password) {
      const state = Object.values(validationState).some((item) => {
        return item === false;
      });
      setIsValid(!state);
    }
  }, [validationState, values]);

  function handleSubmit(e) {
    e.preventDefault();
    onRegisterUser({
      "email": values.email,
      "password": values.password,
    });
  }

  return (
    <div className="form-auth__container">
      <h3 className="form-auth__heading ">
        Регистрация
      </h3>
      <form className="form-auth form-auth_name_login" name="login" onSubmit={handleSubmit} noValidate>
        <input className="form-auth__item form-auth__item_name_email" type="email" name="email" placeholder="Email"
          onChange={handleChange} required />
        <span className={`form-auth__item-error form-auth__item-error_name_email ${isValid ? "" : "form-auth__item-error_active"}`} >
          {errorEmail}
        </span>
        <input className="form-auth__item form-auth__item_name_password" type="password" name="password" placeholder="Пароль" minLength="8"
          maxLength="40" onChange={handleChange} required />
        <span className={`form-auth__item-error form-auth__item-error_name_password ${isValid ? "" : "form-auth__item-error_active"}`} >
          {errorPassword}
        </span>
        <button className={`form-auth__button ${isValid ? "" : "form-auth__button_inactive"}`} type="submit" disabled={!isValid} >
          Зарегистрироваться
        </button>
      </form>
      <Link to="/sign-in" className="form-auth__link" >Уже зарегистрированы? Войти</Link>
    </div>
  )
}

export default Register;
