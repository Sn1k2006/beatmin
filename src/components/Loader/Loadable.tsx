import React, { FC } from 'react';
import Loader from './index';

interface Props {
  loading: boolean;
  className?: string;
  children: any;
}

const Loadable: FC<Props> = ({ loading, className, children }) => {
  return (
    <div className={`loadable${loading ? ' loading' : ''} ${className || ''}`}>
      {children}
      {loading && (
        <div className="spinner">
          <Loader  />
        </div>
      )}
    </div>
  );
};

export default Loadable;
