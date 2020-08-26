import React     from 'react'
import PropTypes from 'prop-types'

const IconDownload = props => <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M9.75 7.77778H7.3125V0H5.6875V7.77778H3.25L6.5 10.8889L9.75 7.77778ZM0 12.4444V14H13V12.4444H0Z" fill={props.fill}/>
</svg>


IconDownload.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
}

IconDownload.defaultProps = {
  fill: '#3D5056',
}

export default IconDownload