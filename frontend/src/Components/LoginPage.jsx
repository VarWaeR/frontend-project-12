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
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../Hooks/index.jsx';


const LoginPage = () => {
  const auth = useAuth();
  const [authFailed, setAuthFailed] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const signInSchema = Yup.object().shape({
    username: Yup.string().required('Поле обязательно для заполнения!'),
    password: Yup.string().required('Поле обязательно для заполнения!'),
  })

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: signInSchema,
    onSubmit: async (values) => {
      setAuthFailed(false);

      try {
        const res = await axios.post('/api/v1/login', values);
        localStorage.setItem('userId', JSON.stringify(res.data));
        auth.logIn();
        navigate("/");
      } catch (err) {
        formik.setSubmitting(false);
        if (err.isAxiosError && err.response.status === 401) {
          setAuthFailed(true);
          inputRef.current.select();
          return;
        }
        throw err;
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
                <h2 className="text-center mb-4">Войти</h2>
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
                  <Form.Label htmlFor="username">Логин</Form.Label>
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
                  <Form.Control.Feedback type="invalid">{formik.errors.password ?? 'Неверные логин или пароль'}</Form.Control.Feedback>
                  <Form.Label htmlFor="password">Пароль</Form.Label>
                </Form.Group>
                <Button className="w-100 mb-3" variant="primary" type="submit">
                  Войти
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Row>
      </Container>
    </>
  );
};

export default LoginPage;