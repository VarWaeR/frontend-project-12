import React, { useRef, useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuth from '../Hooks/index.jsx';
import routes from '../Routes/routes.js';

const SignUpForm = () => {
  const [signUpStatus, setSignUpStatus] = useState('');
  const inputRef = useRef(null);
  const auth = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const signUpSchema = Yup.object().shape({
    username: Yup.string()
      .required(t('schema.required'))
      .min(3, t('schema.nameMin'))
      .max(20, t('schema.nameMax')),
    password: Yup.string().min(6, t('schema.passwordMin')).required(t('schema.required')),
    passwordConfirm: Yup.string()
      .required(t('schema.required'))
      .oneOf([Yup.ref('password'), null], t('schema.confirmPassword')),
  });

  const formik = useFormik({
    initialValues: { username: '', password: '', passwordConfirm: '' },
    validationSchema: signUpSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await axios.post(routes.signUpPath(), values);
        localStorage.setItem('userId', JSON.stringify(res.data));
        auth.logIn();
        navigate(routes.main());
      } catch (error) {
        if (error.isAxiosError && error.response.status === 409) {
          setSignUpStatus('userExist');
          setSubmitting(false);
        }
        if (error.isAxiosError && error.response.status === 401) {
          setSignUpStatus('error');
        }
        throw error;
      }
    },
  });

  const {
    handleSubmit,
    handleChange,
    values,
    touched,
    errors,
    isSubmitting,
  } = formik;

  return (
    <Form onSubmit={handleSubmit}>
      <h2 className="text-center mb-4">{t('signup.register')}</h2>
      <Form.Group className="form-floating mb-3">
        <Form.Control
          id="username"
          name="username"
          onChange={handleChange}
          value={values.username}
          type="text"
          ref={inputRef}
          isInvalid={(touched.username && !!errors.username) || signUpStatus}
        />
        <Form.Label htmlFor="username">{t('signup.name')}</Form.Label>
        {(signUpStatus || !!errors.username) && (
          <Form.Control.Feedback type="invalid" tooltip>
            {signUpStatus === 'userExist' ? t('signup.userExist') : errors.username}
          </Form.Control.Feedback>
        )}
      </Form.Group>
      <Form.Group className="form-floating mb-4">
        <Form.Control
          id="password"
          name="password"
          onChange={handleChange}
          value={values.password}
          type="password"
          isInvalid={(touched.password && !!errors.password) || signUpStatus}
        />
        <Form.Label htmlFor="password">{t('signup.password')}</Form.Label>
        {!!errors.password && (
          <Form.Control.Feedback type="invalid" tooltip>
            {errors.password}
          </Form.Control.Feedback>
        )}
      </Form.Group>
      <Form.Group className="form-floating mb-4">
        <Form.Control
          id="passwordConfirm"
          name="passwordConfirm"
          onChange={handleChange}
          value={values.passwordConfirm}
          type="password"
          isInvalid={(touched.passwordConfirm && !!errors.passwordConfirm) || signUpStatus}
        />
        <Form.Label htmlFor="passwordConfirm">{t('signup.passwordConfirm')}</Form.Label>
        {!!errors.passwordConfirm && (
          <Form.Control.Feedback type="invalid" tooltip>
            {errors.passwordConfirm}
          </Form.Control.Feedback>
        )}
      </Form.Group>
      <Button disabled={isSubmitting} className="w-100 mb-3" variant="primary" type="submit">
      {t('signup.confirm')}
      </Button>
    </Form>
  );
};

export default SignUpForm;
