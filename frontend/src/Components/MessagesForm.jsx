import React, { useEffect, useRef } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { Send } from 'react-bootstrap-icons';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import filter from 'leo-profanity';
import { useAddMessage } from '../Api/messagesApi.js';

const MessagesForm = ({ channel }) => {
  const { t } = useTranslation();
  const { username } = JSON.parse(localStorage.getItem('userId'));
  const inputRef = useRef(null);
  const [ addMessage ] = useAddMessage();

  const validationSchema = yup.object().shape({
    body: yup
      .string()
      .trim()
      .required('Required'),
  });

  const formik = useFormik({
    initialValues: { body: '' },
    validationSchema,
    onSubmit: async ({ body }) => {
      const message = {
        body: filter.clean(body),
        channelId: channel.id,
        username,
      };
      
      addMessage(message);
      formik.resetForm();
      formik.setSubmitting(false);
      inputRef.current.focus();
    },
    validateOnBlur: false,
  });

  useEffect(() => {
    inputRef.current.focus();
  }, [channel, formik.isSubmitting]);

  const isInvalid = !formik.isValid;

  return (
    <Form noValidate onSubmit={formik.handleSubmit} className="py-1 border rounded-2">
      <InputGroup>
        <Form.Control
          ref={inputRef}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.body}
          name="body"
          aria-label={t('messages.newMessage')}
          disabled={formik.isSubmitting}
          placeholder={t('messages.placeholder')}
          className="border-0 p-0 ps-2"
        />
        <Button variant="group-vertical" type="submit" disabled={isInvalid}>
          <Send size={20} />
          <span className="visually-hidden">{t('messages.send')}</span>
        </Button>
      </InputGroup>
    </Form>
  );
};

export default MessagesForm;