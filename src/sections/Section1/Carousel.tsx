import React, {FC, useRef} from 'react';
import Slider, {Settings, ResponsiveObject} from "react-slick";
import CarouselItem from "./CarouselItem";

interface Props {

}

const Carousel: FC<Props> = (props) => {
  const _slider: any = useRef(null);
  const settings: Settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerPadding: '10px',
    centerMode: true,
    swipe: false
  };

  const handleSwitch = (dir: number) => (e: any) => {
    e.stopPropagation();
    console.log(_slider.current)
    if(dir === -1) {
      _slider.current.slickPrev();
    } else {
      _slider.current.slickNext();
    }

  }

  const handlePlay = (id: number) => (e: any) => {
    e.stopPropagation();

  }

  return (
    <div className='slick-carousel-wrap'>
      <div className='slick-carousel'>
        <Slider {...settings} ref={_slider} >
          {Array(5).fill({}).map((item, i) => (
            <CarouselItem
              key={i}
              idx={i}
              item={item}
              onSwitch={handleSwitch}
              onPlay={handlePlay}
            />
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default Carousel;