import React, {FC} from 'react';
import close from '../assets/images/icons/close.svg'
import { ReactSVG } from 'react-svg';

interface Props {
  onClick: (e: any) => void;
  className?: string;
}

const CloseBtn: FC<Props> = ({onClick, className}) => {

  return (
    <button type='button' className={`close-btn ${className || ''}`} onClick={onClick}>
      <ReactSVG className='react-icon' src={close} />
    </button>
  );
}

export default CloseBtn;