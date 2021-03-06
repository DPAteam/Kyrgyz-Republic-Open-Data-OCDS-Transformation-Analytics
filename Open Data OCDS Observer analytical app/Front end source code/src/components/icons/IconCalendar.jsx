import React     from 'react'
import PropTypes from 'prop-types'


const IconCalendar = props => <svg width="25" height="25" viewBox="0 0 25 18" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g filter="url(#filter0_d)">
    <path d="M19.3 1.54545H18.45V0H16.75V1.54545H8.25V0H6.55V1.54545H5.7C4.765 1.54545 4 2.24091 4 3.09091V15.4545C4 16.3045 4.765 17 5.7 17H19.3C20.235 17 21 16.3045 21 15.4545V3.09091C21 2.24091 20.235 1.54545 19.3 1.54545ZM19.3 15.4545H5.7V5.40909H19.3V15.4545Z" fill="white"/>
  </g>
  <defs>
    <filter id="filter0_d" x="0" y="0" width="25" height="25" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="4"/>
      <feGaussianBlur stdDeviation="2"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
    </filter>
  </defs>
</svg>

IconCalendar.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
}

IconCalendar.defaultProps = {
  fill: '#3D5056',
}

export default IconCalendar
