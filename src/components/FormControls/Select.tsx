import React, { FC, SelectHTMLAttributes } from 'react';

import { useTranslation } from 'react-i18next';
import { ReactSVG } from 'react-svg';

interface Props extends SelectHTMLAttributes<any> {
  label?: string;
  className?: string;
  errorText?: string;
  error?: boolean;
  icon?: any;
  children?: any;
}

const Select: FC<Props> = ({
                            label,
                            className,
                            icon,
                            error,
                            errorText,
                             children,
                            ...props
                          }) => {
  const { t } = useTranslation();
  return (
    <div className={`form-group form-select${error ? ' error' : ''} ${className || ''}`}>
      {label ?
        <label className={`form-control-label`}>
          <span>{t(label)}</span>
          {props.required ? <span className='text-danger text-12'>*</span> : null}
        </label>
        : null
      }
      {errorText && error ? <div className='form-group-error'>{t(errorText)}</div> : null}
      <div className='form-control-wrap'>
        <select
          className={`form-control${icon ? ' form-control-icon' : ''}`}
          {...props} name={String(props?.value)}
          autoComplete='new-input'
        >
          {children}
        </select>

        {icon ? <div className='input-icon'><ReactSVG className='react-icon' src={icon} /></div> : null}
      </div>
    </div>
  );
};

export default Select;