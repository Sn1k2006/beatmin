import React, {FC} from 'react';
import {useTranslation} from "react-i18next";
import './header.css';
import {observer} from 'mobx-react';
import logo from '../../assets/images/logo.png';
import {ReactSVG} from "react-svg";
import arrowRight from '../../assets/images/icons/arrow-right.svg'
import {openRegistrationModal} from "../../modals";

interface Props {

}

const Header: FC<Props> = () => {
  const {t} = useTranslation()
  return (
    <header>
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <div className='d-flex align-items-center'>
          <img src={logo} alt='logo' className='header-logo'/>
          <a href="https://axtune.com" className='btn btn-primary btn-sm btn-circle' target='_blank'>
            <ReactSVG src={arrowRight} />
          </a>
          <div className='ps-3 text-14'>{t('BEATMAKERS')}</div>
        </div>
        <div className='d-flex align-items-center'>
          <button type='button' className='btn btn-primary btn-sm px-4' onClick={openRegistrationModal}>
            {t('REGISTRATION')}
          </button>
          <a href="https://axtune.com" className='btn btn-outline-light btn-sm px-4 mx-4' target='_blank'>
            {t('LOGIN')}
          </a>
        </div>
      </div>
    </header>
  );
};


export default observer(Header);
