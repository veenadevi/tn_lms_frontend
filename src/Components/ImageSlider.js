import React from 'react'
import './ImageSlider.css'
import { Carousel } from 'react-bootstrap'
import carousal_1 from '../img/banner_1.png' // Correct import
import carousal_2 from '../img/banner_2.png' // Correct import
import carousal_3 from '../img/banner_3.png' // Correct import
import { colors } from '@material-ui/core'


function ImageSlider() {
    return (
        <div className='slider'>
            <Carousel>
                <Carousel.Item interval={1000}>
                    <img
                        className="d-block w-100"
                        src={carousal_1}
                        alt="First slide"
                    />
                    <Carousel.Caption>
                        <h3>புத்துலகம் படைக்க புத்தகம் படிப்போம் - அப்துல் கலாம்.</h3>
                       
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item interval={500}>
                    <img
                        className="d-block w-100"
                        src={carousal_2}
                        alt="Second slide"
                    />
                    <Carousel.Caption>
                        <h3>அறிவால் உயர்ந்து அரியாசனம் செய்வோம் - தேசத்தந்தை மகாத்மா காந்தி.</h3>
                        
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src={carousal_3}
                        alt="Third slide"
                    />
                    <Carousel.Caption>
                        <h3>புத்தகங்கள் - நீங்கள் கைகளில் ஏந்தியிருக்கும் கனவுகள். – Neil Gaiman</h3>
                        
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </div>
    )
}

export default ImageSlider
