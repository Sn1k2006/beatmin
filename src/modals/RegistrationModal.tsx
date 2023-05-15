import React, {FC, useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import asyncModal from 'react-async-modal';
import {ReactSVG} from "react-svg";
import close_svg from '../assets/images/icons/close.svg'
import {Input, Textarea} from "../components/FormControls";
import Button from "../components/Button";
import {toast} from "react-toastify";

interface Props {
  resolve: () => void;
}

const RegistrationModal: FC<Props> = ({resolve}) => {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({email: '', tg: '', links: ''});

  const handleChange = useCallback((key: string) => (e: any) => {
    setForm(prevState => {
      return {...prevState, [key]: e.target.value}
    })
  }, []);

  const handleSubmit = useCallback((e: any) => {
    e.preventDefault();
    setLoading(true);
    try {

    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className='registration-modal'>
      <ReactSVG src={close_svg} className='modal-close' onClick={resolve}/>
      <h3>{t('REGISTRATION')}</h3>
      <div className='my-3 pb-4'>{t('REGISTRATION_TEXT')}</div>
      <form onSubmit={handleSubmit}>
        <Input
          className='pb-4'
          placeholder='Email'
          type={'email'}
          value={form.email}
          onChange={handleChange('email')}
        />
        <Input
          className='pb-4'
          placeholder={t('TG_PLACEHOLDER') || ''}
          value={form.tg}
          onChange={handleChange('tg')}
        />
        <Textarea
          className='pb-4'
          placeholder={t('LINKS_PLACEHOLDER') || ''}
          value={form.links}
          onChange={handleChange('links')}
        />
        <Button
          loading={loading}
          className='w-100'
          size='sm'
          text={'CREATE_ACCOUNT'}
          type='submit'
        />
      </form>
    </div>
  );
};

const openRegistrationModal = (): Promise<boolean> => {
  return asyncModal(RegistrationModal, {}, {showCloseIcon: false, center: true});
};

export {openRegistrationModal};
