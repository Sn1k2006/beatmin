import React, {FC, InputHTMLAttributes} from 'react';

import {useTranslation} from "react-i18next";
import {ReactSVG} from "react-svg";

interface Props extends InputHTMLAttributes<any> {
  label?: string;
  className?: string;
  icon?: any
}

const Input: FC<Props> = ({
                            label,
                            className,
                            icon,
                            ...props
                          }) => {
  const {t} = useTranslation();
  return (
    <div className={`form-group ${className || ''}`}>
      {label ?
        <label className={`form-control-label`}>
          <span>{t(label)}</span>
          {props.required ? <span className='text-danger text-12'>*</span> : null}
        </label>
        : null
      }
      <div className='form-control-wrap'>
        <textarea className={`form-control${icon ? ' form-control-icon' : ''}`} {...props} />
        {icon ? <div className='input-icon'><ReactSVG className='react-icon' src={icon}/></div> : null}
      </div>
    </div>
  );
}

export default Input;