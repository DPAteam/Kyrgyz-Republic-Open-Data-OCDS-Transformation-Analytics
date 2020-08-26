import React     from 'react'
import PropTypes from 'prop-types'


const IconCart = props => <svg width="20" height="25" viewBox="-30 0 120 50" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fillRule="evenodd" clipRule="evenodd" d="M30.2421 18.6032C30.2421 20.0011 29.1171 21.1449 27.7421 21.1449C26.3671 21.1449 25.2421 20.0011 25.2421 18.6032V13.5199H20.2421C18.8671 13.5199 17.7421 12.3761 17.7421 10.9782C17.7421 9.58027 18.8671 8.43652 20.2421 8.43652H25.2421V3.35319C25.2421 1.95527 26.3671 0.811523 27.7421 0.811523C29.1171 0.811523 30.2421 1.95527 30.2421 3.35319V8.43652H35.2421C36.6171 8.43652 37.7421 9.58027 37.7421 10.9782C37.7421 12.3761 36.6171 13.5199 35.2421 13.5199H30.2421V18.6032ZM10.2668 49.1041C10.2668 46.3083 12.4918 44.0208 15.2418 44.0208C17.9918 44.0208 20.2418 46.3083 20.2418 49.1041C20.2418 51.9 17.9918 54.1875 15.2418 54.1875C12.4918 54.1875 10.2668 51.9 10.2668 49.1041ZM40.2417 44.0208C37.4917 44.0208 35.2667 46.3083 35.2667 49.1041C35.2667 51.9 37.4917 54.1875 40.2417 54.1875C42.9917 54.1875 45.2417 51.9 45.2417 49.1041C45.2417 46.3083 42.9917 44.0208 40.2417 44.0208ZM36.6171 31.3113H17.9922L15.2422 36.3946H42.7421C44.1171 36.3946 45.2421 37.5384 45.2421 38.9363C45.2421 40.3342 44.1171 41.478 42.7421 41.478H15.2422C11.4422 41.478 9.04216 37.335 10.8672 33.9292L14.2422 27.7275L5.24216 8.43629H2.74216C1.36716 8.43629 0.242157 7.29253 0.242157 5.89462C0.242157 4.4967 1.36716 3.35295 2.74216 3.35295H6.84216C7.79216 3.35295 8.69215 3.91212 9.09216 4.8017L19.0672 26.228H36.6171L45.0922 10.6475C45.7421 9.42753 47.2672 8.99545 48.4672 9.65629C49.6671 10.3425 50.1171 11.893 49.4422 13.113L40.9921 28.6934C40.1421 30.2692 38.4921 31.3113 36.6171 31.3113Z"
        fill={props.fill}/>
</svg>

IconCart.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
}

IconCart.defaultProps = {
  fill: '#3D5056',
}

export default IconCart