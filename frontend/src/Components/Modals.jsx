import React, { useRef, useEffect, useState } from 'react';
import {
  Modal as BootstrapModal,
  Form,
  Button,
} from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import filter from 'leo-profanity';
import { actions } from '../Slices/index.js';
import {
  useAddChannel,
  useUpdateChannel,
  useDeleteChannel,
  useGetChannels,
} from '../Api/channelsApi.js';

function AddChannelForm({ handleClose }) {
  const { data: channels } = useGetChannels(undefined);
  const channelNames = channels.map(({ name }) => name);
  const inputRef = useRef(null);
  const [
    addChannel,
    { error, isLoading }, // eslint-disable-line
  ] = useAddChannel();
  const { t } = useTranslation();

  const getValidationSchema = (channels) => yup.object().shape({
    name: yup
      .string()
      .trim()
      .required(t('modals.required'))
      .min(1, t('modals.minName'))
      .max(20, t('modals.maxName'))
      .notOneOf(channels, t('modals.uniq')),
  });

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: getValidationSchema(channelNames),
    onSubmit: async ({ name }) => {
      const filteredName = filter.clean(name);
      const channel = { name: filteredName };
      getValidationSchema(channelNames).validateSync({ name: filteredName });
      addChannel(channel);
      toast.success(t('toast.add'));
      handleClose();
    },
    validateOnBlur: false,
    validateOnChange: false,
  });

  return (
    <>
      <BootstrapModal.Header>
        <BootstrapModal.Title>{t('modals.addTitle')}</BootstrapModal.Title>
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
            <label className="visually-hidden" htmlFor="name">{t('modals.modalName')}</label>
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
                {t('modals.cancelButton')}
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={formik.isSubmitting}
              >
                {t('modals.confirmButton')}
              </Button>
            </div>
          </Form.Group>
        </Form>
      </BootstrapModal.Body>
    </>
  );
}

function RemoveChannelForm({ handleClose }) {
  const [loading, setLoading] = useState(false);
  const [
    deleteChannel,
    { error, isLoading }, // eslint-disable-line
  ] = useDeleteChannel();
  const channelId = useSelector((state) => state.ui.modal.extra?.channelId);
  const handleRemove = async () => {
    setLoading(true);
    deleteChannel(channelId);
    toast.success(t('toast.remove'));
    handleClose();
  };
  const { t } = useTranslation();

  return (
    <>
      <BootstrapModal.Header>
        <BootstrapModal.Title>{t('modals.removeTitle')}</BootstrapModal.Title>
        <Button
          variant="close"
          type="button"
          onClick={handleClose}
          aria-label="Close"
          data-bs-dismiss="modal"
        />
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        <p className="lead">{t('modals.sure')}</p>
        <div className="d-flex justify-content-end">
          <Button
            className="me-2"
            variant="secondary"
            type="button"
            onClick={handleClose}
            disabled={loading}
          >
            {t('modals.cancelButton')}
          </Button>
          <Button
            variant="danger"
            type="button"
            onClick={handleRemove}
            disabled={loading}
          >
            {t('modals.confirmRemove')}
          </Button>
        </div>
      </BootstrapModal.Body>
    </>
  );
}

function RenameChannelForm({ handleClose }) {
  const { data: channels } = useGetChannels(undefined);
  const channelNames = channels.map(({ name }) => name);
  const channelId = useSelector((state) => state.ui.modal.extra?.channelId);
  const channel = channels.find(({ id }) => channelId === id);
  const inputRef = useRef(null);
  const [
    updateChannel,
    { error, isLoading }, // eslint-disable-line
  ] = useUpdateChannel();
  const { t } = useTranslation();

  const getValidationSchema = (channels) => yup.object().shape({
    name: yup
      .string()
      .trim()
      .required(t('modals.required'))
      .min(1, t('modals.minName'))
      .max(20, t('modals.maxName'))
      .notOneOf(channels, t('modals.uniq')),
  });

  useEffect(() => {
    setTimeout(() => inputRef.current.select());
  }, []);
  const formik = useFormik({
    initialValues: {
      name: channel.name,
    },
    validationSchema: getValidationSchema(channelNames),
    onSubmit: async ({ name }) => {
      const filteredName = filter.clean(name);
      const data = { name: filteredName, id: channelId };
      getValidationSchema(channelNames).validateSync({ name: filteredName });
      updateChannel(data);
      toast.success(t('toast.rename'));
      handleClose();
    },
    validateOnBlur: false,
    validateOnChange: false,
  });

  return (
    <>
      <BootstrapModal.Header>
        <BootstrapModal.Title>{t('modals.renameTitle')}</BootstrapModal.Title>
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
            <label className="visually-hidden" htmlFor="name">{t('modals.modalName')}</label>
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
                {t('modals.cancelButton')}
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={formik.isSubmitting}
              >
                {t('modals.confirmButton')}
              </Button>
            </div>
          </Form.Group>
        </Form>
      </BootstrapModal.Body>
    </>
  );
}

const mapping = {
  addChannel: AddChannelForm,
  removeChannel: RemoveChannelForm,
  renameChannel: RenameChannelForm,
};

function Modal() {
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
}

export default Modal;
