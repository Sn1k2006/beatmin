import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import Loader from "./Loader";
import {ReactSVG} from "react-svg";

interface Props {
  icon?: any;
  text?: string;
  title?: string;
  size?: 'sm' | 'lg' | 'md' | 'xs';
  color?: 'primary' | 'success' | 'secondary' | 'danger' | 'warning';
  outline?: boolean;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  reverse?: boolean;
  loading?: boolean;
  loaderColor?: string;

  onClick?(event: React.MouseEvent<HTMLElement>): void;
}

const Button: FC<Props> = ({
                             text,
                             title,
                             icon,
                             className,
                             onClick,
                             size = 'md',
                             color = 'primary',
                             disabled = false,
                             loading = false,
                             outline = false,
                             type = 'button',
                             loaderColor,
                             reverse = false
                           }) => {
  const {t} = useTranslation();
  return (
    <button
      disabled={disabled}
      type={type}
      title={t(title || '') || ''}
      className={`d-flex align-items-center${reverse ? ' flex-row-reverse' : ''} btn btn-${size} btn${
        outline ? '-outline' : ''
      }-${color} ${className || ''}`}
      onClick={!loading ? (e) => onClick && onClick(e) : () => {
      }}
    >
      <div>
        {icon &&
        <div className='btn-icon'>
          <ReactSVG src={icon}/>
        </div>
        }
        {loading
          ? <Loader color={loaderColor}/>
          : <span>{t(text || '')}</span>
        }
      </div>
    </button>
  );
};

export default Button;
