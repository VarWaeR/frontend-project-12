import React, { useRef, useEffect, useState } from 'react';
import {
  Modal as BootstrapModal,
  Form,
  Button,
} from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';

import { actions } from '../Slices/index.js';
import {
  useAddChannel,
  useUpdateChannel,
  useDeleteChannel,
  useGetChannels,
} from '../Api/channelsApi.js';

const getValidationSchema = (channels) => yup.object().shape({
  name: yup
    .string()
    .trim()
    .required('Поле обязательно для заполнения')
    .min(1, 'Минимальное количество симовлов: 1')
    .notOneOf(channels, 'Имя канала не дожно совпадать с ост'),
});

const AddChannelForm = ({ handleClose }) => {
  const { data: channels } = useGetChannels(undefined);
  const channelNames = channels.map(({ name }) => name);
  const inputRef = useRef(null);
  const [
    addChannel,
    { error, isLoading },
  ] = useAddChannel();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: getValidationSchema(channelNames),
    onSubmit: async ({ name }) => {
      getValidationSchema(channelNames).validateSync({ name });
      addChannel({ name });
      handleClose();
    },
    validateOnBlur: false,
    validateOnChange: false,
  });

  return (
    <>
      <BootstrapModal.Header>
        <BootstrapModal.Title>Добавить</BootstrapModal.Title>
        <Button
          variant="close"
          type="button"
          onClick={handleClose}
          aria-label="Close"
          data-bs-dismiss="modal"
        />
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group>
            <Form.Control
              className="mb-2"
              disabled={formik.isSubmitting}
              ref={inputRef}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              isInvalid={(formik.errors.name && formik.touched.name) || !!formik.status}
              name="name"
              id="name"
            />
            <label className="visually-hidden" htmlFor="name">Название канала</label>
            <Form.Control.Feedback type="invalid">
              {formik.errors.name || formik.status}
            </Form.Control.Feedback>
            <div className="d-flex justify-content-end">
              <Button
                className="me-2"
                variant="secondary"
                type="button"
                onClick={handleClose}
              >
                Отменить
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={formik.isSubmitting}
              >
                Отправить
              </Button>
            </div>
          </Form.Group>
        </Form>
      </BootstrapModal.Body>
    </>
  );
};

const RemoveChannelForm = ({ handleClose }) => {
  const [loading, setLoading] = useState(false);
  const [
    deleteChannel,
    { error, isLoading },
  ] = useDeleteChannel();
  const channelId = useSelector((state) => state.ui.modal.extra?.channelId);
  const handleRemove = async () => {
    setLoading(true);
    deleteChannel(channelId);
    handleClose();
  };

  return (
    <>
      <BootstrapModal.Header>
        <BootstrapModal.Title>Удалить</BootstrapModal.Title>
        <Button
          variant="close"
          type="button"
          onClick={handleClose}
          aria-label="Close"
          data-bs-dismiss="modal"
        />
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        <p className="lead">Подтвердить</p>
        <div className="d-flex justify-content-end">
          <Button
            className="me-2"
            variant="secondary"
            type="button"
            onClick={handleClose}
            disabled={loading}
          >
            Отменить
          </Button>
          <Button
            variant="danger"
            type="button"
            onClick={handleRemove}
            disabled={loading}
          >
            Удалить
          </Button>
        </div>
      </BootstrapModal.Body>
    </>
  );
};

const RenameChannelForm = ({ handleClose }) => {
  const { data: channels } = useGetChannels(undefined);
  const channelNames = channels.map(({ name }) => name);
  const channelId = useSelector((state) => state.ui.modal.extra?.channelId);
  const channel = channels.find(({ id }) => channelId === id);
  const inputRef = useRef(null);
  const [
    updateChannel,
    { error, isLoading },
  ] = useUpdateChannel();
  useEffect(() => {
    setTimeout(() => inputRef.current.select());
  }, []);
  const formik = useFormik({
    initialValues: {
      name: channel.name,
    },
    validationSchema: getValidationSchema(channelNames),
    onSubmit: async ({ name }) => {
      const data = { name, id: channelId };
      getValidationSchema(channelNames).validateSync({ name });
      updateChannel(data);
      handleClose();
    },
    validateOnBlur: false,
    validateOnChange: false,
  });

  return (
    <>
      <BootstrapModal.Header>
        <BootstrapModal.Title>Переименовать</BootstrapModal.Title>
        <Button
          variant="close"
          type="button"
          onClick={handleClose}
          aria-label="Close"
          data-bs-dismiss="modal"
        />
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group>
            <Form.Control
              className="mb-2"
              disabled={formik.isSubmitting}
              ref={inputRef}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              isInvalid={(formik.errors.name && formik.touched.name) || !!formik.status}
              name="name"
              id="name"
            />
            <label className="visually-hidden" htmlFor="name">Название канала</label>
            <Form.Control.Feedback type="invalid">
              {formik.errors.name || formik.status}
            </Form.Control.Feedback>
            <div className="d-flex justify-content-end">
              <Button
                className="me-2"
                variant="secondary"
                type="button"
                onClick={handleClose}
              >
                Отменить
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={formik.isSubmitting}
              >
                Отправить
              </Button>
            </div>
          </Form.Group>
        </Form>
      </BootstrapModal.Body>
    </>
  );
};

const mapping = {
  addChannel: AddChannelForm,
  removeChannel: RemoveChannelForm,
  renameChannel: RenameChannelForm,
};

const Modal = () => {
  const dispatch = useDispatch();
  const isOpened = useSelector((state) => state.ui.modal.isOpened);

  const handleClose = () => {
    dispatch(actions.closeModal());
  };
  const modalType = useSelector((state) => state.ui.modal.type);

  const Component = mapping[modalType];

  return (
    <BootstrapModal show={isOpened} onHide={handleClose} centered>
      {Component && <Component handleClose={handleClose} />}
    </BootstrapModal>
  );
};

export default Modal;