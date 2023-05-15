import React, {FC} from 'react';
import './section.scss';
import {useTranslation} from "react-i18next";
import Carousel from "./Carousel";

interface Props {

}

const Section1: FC<Props> = () => {
  const {t} = useTranslation();
  return (
    <section id='section1'>
      <div className='d-flex justify-content-between align-items-center'>
        <Carousel/>
        <h1 dangerouslySetInnerHTML={{__html: t('H1_TITLE') || ''}}/>
      </div>
      <div className='d-flex align-items-center mt-80'>
        <p>{t('SECTION1_TEXT')}</p>
        <div className='section1-btns'>
          <button type='button' className='btn btn-primary'>{t('IN_CATALOG')}</button>
          <button type='button' className='btn btn-outline-light'>{t('LOGIN')}</button>
        </div>
      </div>
    </section>
  );
}

export default Section1;