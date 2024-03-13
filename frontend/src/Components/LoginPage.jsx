import React, { useRef, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  Button,
  Form,
  Container,
  Card,
  Row,
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import useAuth from '../Hooks/index.jsx';
import routes from '../Routes/routes.js';

const LoginPage = () => {
  const auth = useAuth();
  const [authFailed, setAuthFailed] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  const { t } = useTranslation();

  const signInSchema = Yup.object().shape({
    username: Yup.string().required(t('schema.required')),
    password: Yup.string().required(t('schema.required')),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: signInSchema,
    onSubmit: async (values) => {
      setAuthFailed(false);

      try {
        const res = await axios.post(routes.loginPath(), values);
        localStorage.setItem('userId', JSON.stringify(res.data));
        auth.logIn();
        navigate(routes.main());
      } catch (err) {
        formik.setSubmitting(false);
        if (!err.isAxiosError) {
          toast.error(t('toast.unknown'));
          return;
        }

        if (err.response?.status === 401) {
          setAuthFailed(true);
          inputRef.current.select();
        } else {
          toast.error(t('toast.network'));
        }
      }
    },
  });

  return (
    <>
      <Container fluid className="h-100 m-3">
        <Row className="justify-content-center align-items-center h100">
          <Card style={{ width: '30rem' }} className="text-center shadow-sm">
            <Card.Body className="row">
              <Form className="form-container mt-3 mt-mb-0" onSubmit={formik.handleSubmit}>
                <h2 className="text-center mb-4">{t('login.enter')}</h2>
                <Form.Group className="form-floating mb-3">
                  <Form.Control
                    id="username"
                    name="username"
                    ref={inputRef}
                    onChange={formik.handleChange}
                    value={formik.values.username}
                    type="text"
                    isInvalid={authFailed}
                  />
                  <Form.Control.Feedback type="invalid">{formik.errors.username}</Form.Control.Feedback>
                  <Form.Label htmlFor="username">{t('login.name')}</Form.Label>
                </Form.Group>
                <Form.Group className="form-floating mb-3">
                  <Form.Control
                    id="password"
                    name="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    type="password"
                    isInvalid={authFailed}
                  />
                  <Form.Control.Feedback type="invalid">{formik.errors.password ?? t('login.error')}</Form.Control.Feedback>
                  <Form.Label htmlFor="password">{t('login.password')}</Form.Label>
                </Form.Group>
                <Button className="w-100 mb-3" variant="primary" type="submit">
                  {t('login.enter')}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Row>
      </Container>
      <div className="card-footer p-4">
        <div className="text-center">
          <span>{t('login.noAccount')}</span>
          {' '}
          <Link to="/signup">{t('login.register')}</Link>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
