import React from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Carousel.css';
import aquariumparis from "../assets/images/aquariumparis.png";
import eiffeltower from "../assets/images/eiffeltower.png";
import santorini from "../assets/images/santorini.png";
import capacodia from "../assets/images/capacodia.png";
import dubai from "../assets/images/dubai.png";
import budapest from "../assets/images/budapest.png";
import whale from "../assets/images/whale.png";
import newyork from "../assets/images/newyork.png";



const images = [
  {
    src: aquariumparis,
    text: 'Aquarium in Paris - A mesmerizing underwater adventure!',
  },
  {
    src: eiffeltower,
    text: 'Eiffel Tower - 1-Hour Seine Cruise starting at the Eiffel Tower.',
  },
  {
    src: santorini,
    text: 'Santorini - Small Group Sightseeing Tour with a Local Guide.',
  },
  {
    src: capacodia,
    text: 'Cappadocia: Hot Air Balloon Tour with Light Breakfast.',
  },
  {
    src: dubai,
    text: 'Dubai: Quad Bike, Dune Buggy, and Sandboarding Experience.',
  },
  {
    src: budapest,
    text: 'Budapest: Mandala Day Spa & Luxury Pool Experience.',
  },
  {
    src: whale,
    text: 'Los Gigantes: Whale-watching cruise or dolphin tour and swimming in Masca.',
  },
  {
    src: newyork,
    text: 'New York City: Manhattan Helicopter Tour.',
  },



];

const Carousel = () => {
  const navigate = useNavigate();

  const handleBookNowClick = () => {
    navigate('/ActivitiesGuest');
  };

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 1500, // 10 seconds
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="carousel-slide">
            <img src={image.src} alt={`Slide ${index + 1}`} className="carousel-image" />
            <p className="carousel-text">{image.text}</p>
            <button className="book-now-button" onClick={handleBookNowClick}>
              BOOK NOW!
            </button>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
