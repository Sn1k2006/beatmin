import React, {FC} from 'react';
import play_svg from '../../assets/images/icons/play.svg'
import pause_svg from '../../assets/images/icons/pause.svg'

import './play-btn.scss';
import {ReactSVG} from "react-svg";
import {IAsset} from "../../modules/rest";

interface Props {
  onClick: (e: any) => void;
  active: boolean;
  audio?: IAsset;
}

const PlayBtn: FC<Props> = ({onClick, active, audio}) => {

  return (
    <div className='btn-play'>
      {Array(26).fill({}).map((item, i) => {
          if (i < 16) return null;
          return <span className={`btn-play-equalizer item-${i}`} style={{
            bottom: `calc(34px + ${34 * Math.cos(i * 6)}px)`,
            left: `calc(34px + ${34 * Math.sin(i * 6)}px)`,
            transform: `rotate(${ Math.sin(i * 6) * 100}deg)`,
          }}/>
        }
      )}
      <ReactSVG src={active ? pause_svg : play_svg}/>
      {active ? <audio src={audio?.url} autoPlay={true} controls={false}/> : null}
    </div>
  );
}

export default PlayBtn;