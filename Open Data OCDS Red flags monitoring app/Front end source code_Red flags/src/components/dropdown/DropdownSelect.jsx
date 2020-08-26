import React                   from 'react'
import PropTypes               from 'prop-types'
import { Select }              from "antd"
import _                       from "lodash"

import './DropdownSelect.scss'


const renderOption = option => {
  const Option = Select.Option
  return <Option
    key={option.key}
    value={option.key}
  >
    {option.value}
  </Option>
}

const renderOptions = options => {
  return _.map(options, item => {
    return renderOption(item)
  })
}

/**
 * DropdownSelect component API docs
 *
 * @param props [ ...props ]
 * @param {string} [className=""] Component className
 * @param {Object[]} options Options(Array of Objects)
 * @param {string} [selected=array[0].value] Selected option
 * @param {Function} onChange function(value, option(selected object))
 *
 * @example
 * <DropdownSelect
 *    options=[{
 *      key: 'first',
 *      value: 'First'
 *    }]
 *    className="custom-class-name"
 *    selected={this.state.selected}
 *    onChange={this.handleSelect}
 * />
 *
 * @version 0.0.1
 * @author [Dmitriy Barchuk]
 */

class DropdownSelect extends React.PureComponent {

  render() {
    const selectProps = this.props
    return <Select
      onChange={() => this.props.onChange(this.selected, this.props.options)}
      className={this.props.className}
      {...selectProps}
    >
      {renderOptions(this.props.options)}
    </Select>
  }
}

DropdownSelect.propTypes = {
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func,
  className: PropTypes.string,
  animdelay: PropTypes.number,
}

DropdownSelect.defaultProps = {
  className: '',
  animdelay: 0,
}

export default DropdownSelect
