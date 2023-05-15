import Button from './Button';
import {useTranslation} from "react-i18next";

const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary(): void }) => {
  const {t} = useTranslation();
  return (
    <div className="d-flex justify-content-center">
      <div className="alert alert-danger mt-5" style={{ width: 800 }}>
        <h4 className="mb-4">
          {t('SMTH_WENT_WRONG')}
        </h4>
        <p className="lead">{t('ERROR')}: {error.message}</p>
        <p>
          <span dangerouslySetInnerHTML={{__html: t('ERROR_MSG') || ''}} />
          <a href="https://t.me/monetizesupport" className="text-danger">
            {t('in_tg')}
          </a>{' '}
          {t('or')}{' '}
          <a href="mailto:support@monetize.club" className="text-danger">
            {t('by_email')}
          </a>
        </p>
        <details className="cursor-pointer mb-3">
          <pre className="p-3 border-1 bg-light">{error.stack}</pre>
        </details>

        <div className="d-flex">
          <Button onClick={resetErrorBoundary} text="SKIP" color="danger" className="me-2 px-4" />
          <Button
            onClick={() => window.location.reload()}
            text="RELOAD"
            outline
            color="danger"
            className="me-2 px-4"
          />
          <Button onClick={() => window.location.replace('/')} text="START_OVER" outline color="danger" className="px-4" />
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;
