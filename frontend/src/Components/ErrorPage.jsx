import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ErrorPage = () => {
  const { t } = useTranslation();
  return (
    <div className="text-center">
      <h1 className="h4 text-muted">{t('notFoundPage.notFound')}</h1>
      <p className="text-muted">
        {t('notFoundPage.walkTo')}
        <Link to="/">{t('notFoundPage.teleport')}</Link>
      </p>
    </div>
  );
};

export default ErrorPage;