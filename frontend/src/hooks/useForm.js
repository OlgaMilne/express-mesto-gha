import { useState } from 'react';

export function useForm(inputValues = {}) {
    const [values, setValues] = useState(inputValues);
    const [errorMessages, setErrorMessages] = useState({});
    const [validationState, setValidationState] = useState({});

    const handleChange = (event) => {
        if (!event.target.validity.valid) {
            setErrorMessages({ ...errorMessages, [event.target.name]: event.target.validationMessage });
        } else {
            setErrorMessages({ ...errorMessages, [event.target.name]: '' });
        }

        setValues({ ...values, [event.target.name]: event.target.value });
        setValidationState({ ...validationState, [event.target.name]: event.target.validity.valid });
    }

    return { values, setValues, errorMessages, setErrorMessages, validationState, setValidationState, handleChange };
}
