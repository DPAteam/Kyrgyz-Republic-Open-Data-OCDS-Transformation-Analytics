import React                   from 'react'
import PropTypes               from 'prop-types'
import { DatePicker }          from "antd"
import * as classnames         from "classnames"

const { RangePicker } = DatePicker

const DateRangePicker = props => {
  return <RangePicker
    className={classnames(props.className)}
    format={props.format}
    placeholder={props.placeholder}
    onChange={props.onSubmit}
    {...props}
  />
}

DateRangePicker.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  className: PropTypes.string,
  format: PropTypes.string,
  placeholder: PropTypes.array,
}

DateRangePicker.defaultProps = {
  className: '',
  format: 'YYYY-MM-DD',
  placeholder: [ 'Start Time', 'End Time' ],
}

export default DateRangePicker
