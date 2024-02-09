import React, { useRef, useEffect } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  Button,
  Form,
  Container,
  Card,
  Row,
} from 'react-bootstrap';


const LoginPage = () => {
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const signInSchema = Yup.object().shape({
    username: Yup.string().required('Поле обязательно для заполнения!'),
    password: Yup.string().required('Поле обязательно для заполнения!'),
  })

  const submit = () => console.log('success')

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: signInSchema,
    onSubmit: submit,
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
                    isInvalid={formik.touched.username && formik.errors.username}
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
                    isInvalid={formik.touched.password && formik.errors.password}
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