import React, {FC} from 'react';
import PlayBtn from "../../components/PlayBtn";
import previous_svg from '../../assets/images/icons/previous.svg'
import next_svg from '../../assets/images/icons/next.svg'
import {ReactSVG} from "react-svg";

interface Props {
  onSwitch: (dir: number) => (e: any) => void;
  onPlay: (id: number) => (e: any) => void;
  item: any;
  idx: number;
}

const CarouselItem: FC<Props> = ({item, onSwitch, onPlay}) => {

  return (
    <div className='slick-carousel-item'>
      <img src="https://i.pinimg.com/736x/98/b9/52/98b952001792e2b836669abf4d853712.jpg" alt="preview"
           className='slick-carousel-item-preview'/>
      <div className='slick-carousel-item-controls-wrap'>
        <div className='slick-carousel-item-controls'>
          <div className='slick-carousel-item-controls-switch' onClick={onSwitch(-1)}>
            <ReactSVG src={previous_svg}/>
          </div>
          <PlayBtn onClick={onPlay(item.id)} active={false}/>
          <div className='slick-carousel-item-controls-switch' onClick={onSwitch(1)}>
            <ReactSVG src={next_svg}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarouselItem;