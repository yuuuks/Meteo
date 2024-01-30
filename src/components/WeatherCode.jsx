import React from 'react'




import cloudsIcon from '../assets/img/clouds.png'
import fogIcon from '../assets/img/fog.png'
import heavyRainIcon from '../assets/img/heavy-rain.png'
import heavySnowIcon from '../assets/img/heavy-snow.png'
import partialSunIcon from '../assets/img/partial-sun.png'
import slightSnowIcon from '../assets/img/slight-snow.png'
import sunRainIcon from '../assets/img/sun-rain.png'
import sunshineIcon from '../assets/img/sunshine.png'
import thunderstormIcon from '../assets/img/thunderstorm.png'

const codes = [{
    code: 95,
    image: thunderstormIcon
}, {
    code: 85,
    image: heavySnowIcon
}, {
    code: 80,
    image: heavyRainIcon
}, {
    code: 75,
    image: heavySnowIcon
}, {
    code: 71,
    image: slightSnowIcon
}, {
    code: 65,
    image: heavyRainIcon
}, {
    code: 51,
    image: sunRainIcon
}, {
    code: 45,
    image: fogIcon
}, {
    code: 3,
    image: cloudsIcon
}, {
    code: 2,
    image: partialSunIcon
}, {
    code: 0,
    image: sunshineIcon
}]

const findImg = code => codes
    .find(i => code >= i.code)
    ?.image

const WeatherCode = props => {
    const {
        code
    } = props 

    return <img
        src={findImg(code)}
        alt="Weather logo"
        className="weathercode-img"
    />}



export default WeatherCode