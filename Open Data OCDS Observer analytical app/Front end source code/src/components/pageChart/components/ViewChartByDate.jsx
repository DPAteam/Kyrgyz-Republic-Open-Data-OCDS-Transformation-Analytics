import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './ViewChartByDate.scss'
import * as classnames from 'classnames'
import { FormattedMessage } from 'react-intl'

class ViewChartByDate extends React.Component {
  constructor(props) {
    super(props)
  }

  renderDay = (activeIndex) => {
    return this.props.days.map((day, index) => {
      if(index < this.props.days.length - 2) {
        return (
          <div className="flex-item" key={`view_chart_by_date${index}`}>
            <div className={classnames('selected-date-left', index === activeIndex && 'active')}/>
            <div className="flex-item-child"/>
            <div className={index === 0 ? "day-div-left custom-position-first-element" : "day-div-left"}>
              {day}
            </div>
          </div>
        )
      } else {
        if(index !== this.props.days.length - 1) {
          return (
            <div className="flex-item" key={`view_chart_by_date${index}`}>
              <div className={classnames('selected-date-left', index === activeIndex && 'active')}/>
              <div className={classnames('selected-date-right', (index + 1) === activeIndex && 'active')}/>
              <div className="flex-item-child"/>
              <div className="flex-item-child-end"/>
              <div className="day-div-left">
                {day}
              </div>
              <div className="day-div-right">
                {this.props.days[index + 1]}
              </div>
            </div>
          )
        }
      }

      // <div key={`$day_${index}`}>
      //   <div>
      //     <div style={{
      //       position: 'absolute',
      //       float: 'left',
      //       width: '8.65px',
      //       left: `${((index * 158.1) + 76)}px`,
      //       top: '4px',
      //       border: '0.665101px solid #599EC0',
      //       transform: 'rotate(90deg)',
      //     }} />
      //   </div>
      //   <div style={{
      //     position: 'absolute',
      //     top: '25px',
      //     left: `${((index * 158) + 45)}px`,
      //     fontStyle: 'normal',
      //     fontWeight: 'normal',
      //     fontSize: '16px',
      //     color: '#2A577F',
      //   }}>{day}</div>
      // </div>
    })
  }

  render() {
    // return (
    //   <div className="view-chart-by-date" style={{ position: 'relative', width: '100%', height: '150px' }}>
    //     <div className="view-chart-by-date-wrapper">
    //       <div className={classnames('play-pause-circle', this.props.playStatus ? 'pause-icon' : 'play-icon')}
    //            onClick={(e) => this.props.handlePlayPauseChange(e, !this.props.playStatus)}/>
    //       <span>Исследовать данные</span>
    //       <div className="play-pause-icon">
    //
    //       </div>
    //
    //     </div>
    //     <div className="selected-date" style={{left: `${(this.props.daySelectedIndex * 158.1) + 55}px`}}/>
    //     <div>
    //       <div style={{
    //         // position: absolute;
    //         position: 'relative',
    //         width: '950.43px',
    //         // height: 0px;
    //         // left: 486.28px;
    //         // top: 1267.54px;
    //         border: '0.665101px solid #599EC0',
    //         margin: '0 auto',
    //       }} />
    //     </div>
    //     <div style={{ position: 'relative' }}>
    //       {this.renderDay()}
    //     </div>
    //   </div>
    // )
    return (
      <div className="view-chart-by-date" style={{ position: 'relative', width: '100%', height: '200px' }}>
        <div className="view-chart-by-date-wrapper">
          <div className={classnames('play-pause-circle', this.props.playStatus ? 'pause-icon' : 'play-icon')}
               onClick={(e) => this.props.handlePlayPauseChange(e, !this.props.playStatus)} />
          <span><FormattedMessage id="page.common.text.15" /></span>
          <div className="play-pause-icon">

          </div>

        </div>
        {/*<div className="selected-date" style={{ left: `${(this.props.daySelectedIndex * 158.1) + 55}px` }} />*/}
        <div className="days-container">
          <div className="flex-container">
            {this.renderDay(this.props.daySelectedIndex)}
          </div>
        </div>
      </div>
    )
  }
}


ViewChartByDate.propTypes = {
  days: PropTypes.array.isRequired,
  playStatus: PropTypes.bool,
  daySelectedIndex: PropTypes.number,
  handlePlayPauseChange: PropTypes.func,
}

export default ViewChartByDate