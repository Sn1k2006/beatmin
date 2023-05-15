import React, {FC} from 'react';

interface Props {
  text?: string;
  color?: string;
  className?: string;
}

const Loader: FC<Props> = ({className}) => {
  return (
    <div className="lds-dual-ring"></div>
  );
};

export default Loader;
