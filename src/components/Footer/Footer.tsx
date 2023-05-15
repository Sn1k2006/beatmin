import React, {FC} from 'react';
import {useTranslation} from "react-i18next";

import './footer.scss';

interface Props {
}

const Footer: FC<Props> = () => {
  const {t} = useTranslation();
  return (
    <footer>
      <a href="#" className='mx-3'>{t('PRIVACY')}</a>
      <a href="#" className='mx-3'>{t('TERMS')}</a>
    </footer>
  );
}

export default Footer;