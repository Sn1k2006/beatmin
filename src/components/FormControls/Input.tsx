import React, {FC, InputHTMLAttributes, useCallback} from 'react';

import { useTranslation } from 'react-i18next';
import { ReactSVG } from 'react-svg';

interface Props extends InputHTMLAttributes<any> {
  label?: string;
  className?: string;
  errorText?: string;
  error?: boolean;
  icon?: any;
}

const Input: FC<Props> = ({
                            label,
                            className,
                            icon,
                            error,
                            errorText,
                            ...props
                          }) => {
  const { t } = useTranslation();
  return (
    <div className={`form-group${error ? ' error' : ''} ${className || ''}`}>
      {label ?
        <label className={`form-control-label`}>
          <span>{t(label)}</span>
          {props.required ? <span className='text-danger text-12'>*</span> : null}
        </label>
        : null
      }
      {errorText && error ? <div className='form-group-error'>{t(errorText)}</div> : null}
      <div className='form-control-wrap'>
        <input
          className={`form-control${icon ? ' form-control-icon' : ''}`}
          {...props}
          name={String(props?.value)}
          autoComplete='new-input'
        />
        {icon ? <div className='input-icon'><ReactSVG className='react-icon' src={icon} /></div> : null}
      </div>
    </div>
  );
};

export default Input;