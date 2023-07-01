import { useState, useEffect } from 'react';


const Login = ({ onLogin }) => {

  const [formValue, setFormValue] = useState({
    email: '',
    password: '',
  });
 
  const [errorEmail, setErrorEmail] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [validationState, setValidationState] = useState({});
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    const state = Object.values(validationState).some((item) => {
        return item === false;
    });
    setIsValid(!state);
}, [validationState]);

  function handleChangeEmail(e) {
  
    if (!e.target.validity.valid) {
      setErrorEmail(e.target.validationMessage);
  } else {
      setErrorEmail('');
  }

    setFormValue({
      ...formValue,
      [e.target.name]: e.target.value,
    });
   
    setValidationState({ ...validationState, [e.target.name]: e.target.validity.valid });

  }

  function handleChangePassword(e) {
  
    if (!e.target.validity.valid) {
      setErrorPassword(e.target.validationMessage);
  } else {
      setErrorPassword('');
  }

    setFormValue({
      ...formValue,
      [e.target.name]: e.target.value,
    });
   
    setValidationState({ ...validationState, [e.target.name]: e.target.validity.valid });

  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("заходим");
    onLogin(formValue); 
  }

  return (
    <div className="form-auth__container">
      <h3 className="form-auth__heading">
        Вход
      </h3>
      <form className="form-auth form-auth_name_login" name="login" onSubmit={handleSubmit} noValidate>
        <input className="form-auth__item form-auth__item_name_email" type="email" name="email" placeholder="Email"
          onChange={handleChangeEmail} required />
        <span className={`form-auth__item-error form-auth__item-error_name_email ${isValid ? "" : "form-auth__item-error_active"}`} >
          {errorEmail}
        </span>
        <input className="form-auth__item form-auth__item_name_password" type="password" name="password" placeholder="Пароль" minLength="8"
          maxLength="40" onChange={handleChangePassword} required />
        <span className={`form-auth__item-error form-auth__item-error_name_password ${isValid ? "" : "form-auth__item-error_active"}`} >
          {errorPassword}
        </span>
        <button className={`form-auth__button ${isValid ? "" : "form-auth__button_inactive"}`} type="submit" disabled={!isValid} >
         Войти
        </button>
      </form>    
    </div>
  );
}


export default Login;