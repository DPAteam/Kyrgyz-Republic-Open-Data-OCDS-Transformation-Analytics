import React, { Fragment, PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Checkbox, Tabs, Tag, Input, message, Select, Row } from 'antd'
import _ from 'lodash'
import md5 from 'react-native-md5'
import { generate } from 'shortid'
import * as classnames from 'classnames'
import { FormattedMessage } from 'react-intl'
import DropdownSelect from '../../../components/dropdown/DropdownSelect'
import { SELECT_TYPES } from '../../../containers/private/constants'

import './FilterForm.scss'
import { isArray } from 'highcharts'

const { Option } = Select

class FilterForm extends PureComponent {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
  }

  static propTypes = {
    filters: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]),
    filtersSelected: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]),
    filtersDisplay: PropTypes.object,
    onFilterData: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    onClearFilter: PropTypes.func,
    onDeselectFilter: PropTypes.func,
    onDropFilterOption: PropTypes.func,
    isFetching: PropTypes.bool,
    lang: PropTypes.string,
    mappings: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.handleSearch = _.debounce(this.handleSearch, 1000)
    this.handleSetMinExpectedValue = _.debounce(this.handleSetMinExpectedValue, 1000)
    this.handleSetMaxExpectedValue = _.debounce(this.handleSetMaxExpectedValue, 1000)
    this.state = {
      filterKey: generate(),
      disabled: true,
      disabledFeedback: true,
      value: undefined,
      feedbackValue: '',
    }
  }

  getSelectType = type => {
    switch (type) {
      case SELECT_TYPES.multiSelect:
        return 'multiple'

      case SELECT_TYPES.search:
        return 'multiple'

      default:
        return 'default'
    }
  }

  handleSearch = (filterKey, value) => {
    this.props.onSearch(filterKey, value)
  }

  handleSearchInMappings = (filterKey, value) => {
    this.props.onSearch(filterKey, value)
  }

  handleSearchBy = (filterKey, value) => {
    if (filterKey === 'itemCpv2' || filterKey === 'itemCpv') {
      this.handleSearchInMappings(filterKey, value)
    } else {
      this.handleSearch(filterKey, value)
    }
  }

  renderSelectedFilters = (key, data) => {
    if (data[key].translationOptions.mappingKey) {
      let prepareString = ''
      if (_.isArray(data[key].selected)) {
        return _.map(data[key].selected, (op, index) => {
          if (typeof op === 'string') {
            if (data[key].translationOptions.needMD5Hash) {
              prepareString = `${data[key].translationOptions.prefixName}${md5.hex_md5(op)}`
            } else {
              prepareString = `${data[key].translationOptions.prefixName}${op.replace(' ', '_')}`
            }
          } else {
            prepareString = op
          }
          // let prepareString = typeof op === 'string' ? `${data[key].translationOptions.prefixName}${op.replace(' ', '_')}` : op
          let findValue = _.find(this.props.mappings[data[key].translationOptions.mappingKey], { [data[key].translationOptions.searchKey]: prepareString })
          if (findValue) {
            if (data[key].translationOptions.doubleNameKey) {
              return <Tag
                key={`tag_${index}`}><b>{findValue[data[key].translationOptions.doubleNameKey]}</b> - {findValue[data[key].translationOptions[this.props.lang]]}
              </Tag>
            } else {
              return <Tag key={`tag_${index}`}>{findValue[data[key].translationOptions[this.props.lang]]}</Tag>
            }
          } else {
            return <Tag key={`tag_${index}`}>{op}</Tag>
          }
        })
      } else {
        if (typeof op === 'string') {
          if (data[key].translationOptions.needMD5Hash) {
            prepareString = `${data[key].translationOptions.prefixName}${md5.hex_md5(data[key].selected)}`
          } else {
            prepareString = `${data[key].translationOptions.prefixName}${data[key].selected.replace(' ', '_')}`
          }
        } else {
          prepareString = data[key].selected
        }
        let prepareString = typeof data[key].selected === 'string' ? `${data[key].translationOptions.prefixName}${data[key].selected.replace(' ', '_')}` : data[key].selected
        let findValue = _.find(this.props.mappings[data[key].translationOptions.mappingKey], { [data[key].translationOptions.searchKey]: prepareString })
        return <Tag>{findValue ? findValue[data[key].translationOptions[this.props.lang]] : data[key].selected}</Tag>
      }
    } else {
      if (!!data[key].props) return <Tag>{data[key].props.children}</Tag>
      if (!!data[key].selected) return _.map(data[key].selected, (item, index) => <Tag
        key={`tag_${index}`}>{item}</Tag>)
      if (!!data[key].selectedUA) return _.map(data[key].selectedUA, (item, index) => <Tag
        key={`tag_${index}`}>{item}</Tag>)
    }
  }

  renderSelected = () => {
    const { intl } = this.context
    const { filtersDisplay } = this.props
    if (!filtersDisplay) return

    return <div className="row col-md-12 mb-2 mt-2 selected-filter__wrapper">
      {_.map(Object.keys(filtersDisplay), key => {

        if (key === 'minExpectedValue' && !!filtersDisplay[key].selected) return <div
          className="selected-filter mt-1">
          <span className="selected-filter__title">{intl.formatMessage({ id: 'common.text.112.4' })}:&nbsp;</span>
          <span className="selected-filter__list">.
            <Tag>{filtersDisplay[key].selected}</Tag>
          </span>
        </div>

        if (key === 'maxExpectedValue' && !!filtersDisplay[key].selected) return <div
          className="selected-filter mt-1">
          <span className="selected-filter__title">{intl.formatMessage({ id: 'common.text.112.5' })}:&nbsp;</span>
          <span className="selected-filter__list">
            <Tag>{filtersDisplay[key].selected}</Tag>
          </span>
        </div>

        if (Array.isArray(filtersDisplay[key].selected) && _.isEmpty(filtersDisplay[key].selected)) return
        if (!Array.isArray(filtersDisplay[key].selected) && _.isEmpty(filtersDisplay[key].selected) && filtersDisplay[key].props === undefined) return
        if (filtersDisplay[key].props === false) return
        return <div className="selected-filter mt-1" key={`filter_${key}`}>
          {/*<span className="selected-filter__title">{filtersDisplay[key].keyUA}:&nbsp;</span>*/}
          <span className="selected-filter__title">{filtersDisplay[key].keyUA.matchAll(/common.text/g) ?
            <FormattedMessage id={filtersDisplay[key].keyUA} /> : filtersDisplay[key].keyUA}:&nbsp;</span>
          <span className="selected-filter__list">
            {this.renderSelectedFilters(key, filtersDisplay)}
          </span>
        </div>
      })}
    </div>
  }

  parseSelectedArr = (arr, options) => {
    let result = arr.map((item, i) => {
      return _.find(options, ['key', item]).value
    })
    return result
  }

  renderSelectFilters = (groupKey) => {
    const { filters, onFilterData } = this.props
    const { intl } = this.context

    return _.map(filters, (filter, i) => {
      let clonedFilterOptions = _.cloneDeep(filter.options)

      if (filter.translationOptions.mappingKey) {
        clonedFilterOptions = _.map(filter.options, (op) => {
          let prepareString = ''

          if (typeof op[filter.translationOptions.searchValueKey] === 'string') {
            if (filter.translationOptions.needMD5Hash) {
              prepareString = `${filter.translationOptions.prefixName}${md5.hex_md5(op[filter.translationOptions.searchValueKey])}`
            } else {
              prepareString = `${filter.translationOptions.prefixName}${op[filter.translationOptions.searchValueKey].replace(' ', '_')}`
            }
          } else {
            prepareString = op[filter.translationOptions.searchValueKey]
          }

          // if (typeof op[filter.translationOptions.searchValueKey] === 'string') {
          //   prepareString = `${filter.translationOptions.prefixName}${op[filter.translationOptions.searchValueKey].replace(' ', '_')}`
          // } else {
          //   prepareString = op[filter.translationOptions.searchValueKey]
          // }

          let findValue = _.find(this.props.mappings[filter.translationOptions.mappingKey], { [filter.translationOptions.searchKey]: prepareString })
          let translatedValue = ''
          if (findValue) {
            if (filter.translationOptions.doubleNameKey) {
              translatedValue =
                findValue[filter.translationOptions.doubleNameKey] + ' - ' + findValue[filter.translationOptions[this.props.lang]]
            } else {
              translatedValue = !_.isEmpty(findValue[filter.translationOptions[this.props.lang]]) ? findValue[filter.translationOptions[this.props.lang]] : findValue[filter.translationOptions.searchKey]
            }
          } else {
            translatedValue = op[filter.translationOptions.searchValueKey]
          }

          if (filter.key === 'itemCpv2' || filter.key === 'itemCpv') {
            return {
              key: op.key,
              value: op.key + ' - ' + translatedValue,
            }
          } else {
            return {
              key: op.key,
              value: translatedValue,
            }
          }
        })
      }

      if (filter.group === groupKey)
        return <div className={classnames('filter-label-wrapper', filter.position)} key={`filter_key_${filter.key}`}>
          {/*<span className="filter-label mt-3"><FormattedMessage id={filter.keyUA}/></span>*/}
          <span className="filter-label mt-3">{filter.keyUA.matchAll(/common.text/g) ?
            <FormattedMessage id={filter.keyUA} /> : filter.keyUA}</span>
          <DropdownSelect
            showArrow
            allowClear
            loading={this.props.isFetching}
            className="mt-1 flex-50"
            onDeselect={selected => this.props.onDeselectFilter(filter.key, selected, filter.options)}
            mode={this.getSelectType(filter.type)}
            filterOption={false}
            key={filter.key}
            onSearch={filter.type === 'search' ? (value) => this.handleSearchBy(filter.key, value, filter.options) : null}
            placeholder={intl.formatMessage({ id: filter.keyUA })}
            options={clonedFilterOptions}
            onChange={filter.type === 'select' ?
              (selected, props) => onFilterData(
                filter.key,
                selected,
                filter.options,
                filter.keyUA,
                filter.translationOptions,
                !!props && props.props,
              )
              : null}
            onSelect={(selected, props) => this.props.onSelect(
              filter.key,
              selected,
              filter.options,
              filter.keyUA,
              filter.translationOptions,
              !!props && props.props,
            )}
            onBlur={filter.type !== 'select'
              ? (selected, props) => onFilterData(
                filter.key,
                selected,
                filter.options,
                filter.keyUA,
                filter.translationOptions,
                props,
                Array.isArray(selected) ? this.parseSelectedArr(selected, filter.options) : false,
              ) : null}
            // style={{ width: '100%' }}
            animdelay={50}
            // disabled={_.isEmpty(filter.options) || (filter.group === 'queuePriority' && this.state.disabled)}
            disabled={(filter.key !== 'itemCpv2' && filter.key !== 'itemCpv') && _.isEmpty(filter.options) || (filter.group === 'queuePriority' && this.state.disabled)}
          />
        </div>
    })
  }

  renderTabsGroup = (tabName, groupKey, optionalChildren) => {
    return <Tabs.TabPane
      key={`${groupKey}_${this.state.filterKey}`}
      tab={tabName}
      className="tab-content-wrapper"
    >
      {!!optionalChildren && optionalChildren}
      {this.renderSelectFilters(groupKey)}
    </Tabs.TabPane>
  }

  handleClearFilter = () => {
    Promise.resolve(this.setState({
      filterKey: generate(),
    })).then(() => this.props.onClearFilter())
  }

  renderClearBtn = (data) => {
    let viewResetButton = false
    if (_.isEmpty(data)) {
      return
    } else {
      _.forEach(Object.keys(data), dataKey => {
        if (!_.isEmpty(data[dataKey].selected)) {
          viewResetButton = true
        }
      })
    }

    const { intl } = this.context
    return viewResetButton ? (<div className="mt-2 clear-filters-btn" onClick={this.handleClearFilter}>
      <span>{intl.formatMessage({ id: 'common.text.143' })}</span>
      <span></span>
    </div>) : null
  }

  handleSetMinExpectedValue = value => {
    const { intl } = this.context
    const { filtersSelected } = this.props
    const highName = 'maxExpectedValue'
    const lowName = 'minExpectedValue'

    if (value === '')
      this.props.onFilterData(lowName, value, [], intl.formatMessage({ id: 'common.text.112.2.1' }), false)
    else if (value[0] === '-')
      message.error(intl.formatMessage({ id: 'common.text.142' }))
    else if (!_.isEmpty(filtersSelected[highName]) && filtersSelected[highName] < value && filtersSelected[highName] !== '')
      message.error(intl.formatMessage({ id: 'common.text.141' }))
    else this.props.onFilterData(lowName, value, [], intl.formatMessage({ id: 'common.text.112.2.1' }), false)
  }

  handleSetMaxExpectedValue = value => {
    const { intl } = this.context
    const { filtersSelected } = this.props
    const highName = 'maxExpectedValue'
    const lowName = 'minExpectedValue'

    if (value === '')
      this.props.onFilterData(highName, value, [], intl.formatMessage({ id: 'common.text.112.3.1' }), false)
    else if (value[0] === '-')
      message.error(intl.formatMessage({ id: 'common.text.142' }))
    else if (!_.isEmpty(filtersSelected[lowName]) && value < filtersSelected[lowName])
      message.error(intl.formatMessage({ id: 'common.text.141' }))
    else this.props.onFilterData(highName, value, [], intl.formatMessage({ id: 'common.text.112.3.1' }), false)
  }

  renderExpectedValue = () => {
    const { intl } = this.context
    return <div className={classnames('filter-label-wrapper', 'col-md-12')}>
      <span className="filter-label mt-3">{intl.formatMessage({ id: 'common.text.112.1' })}</span>
      <Input.Group
        compact
        className="exp-value-group flex-50 mt-1"
      >
        <Input
          style={{
            borderRight: 0,
            pointerEvents: 'none',
            backgroundColor: '#fff',
          }}
          placeholder={intl.formatMessage({ id: 'common.text.112.1' })}
          disabled
        />
        <Input
          type="number"
          min={0}
          style={{ textAlign: 'center' }}
          placeholder={intl.formatMessage({ id: 'common.text.112.2' })}
          onChange={e => this.handleSetMinExpectedValue(e.target.value)}
        />
        <Input
          style={{
            width: 30,
            borderLeft: 0,
            pointerEvents: 'none',
            backgroundColor: '#fff',
          }}
          placeholder="~"
          disabled
        />
        <Input
          type="number"
          min={0}
          style={{
            textAlign: 'center',
            borderLeft: 0,
          }}
          onChange={e => this.handleSetMaxExpectedValue(e.target.value)}
          placeholder={intl.formatMessage({ id: 'common.text.112.3' })}
        />
      </Input.Group>
    </div>
  }

  handleChangeFeedbackStatus = (value) => {
    this.setState({
      feedbackValue: value,
    }, () => {
      if (!_.isEmpty(value)) {
        let feedbackStatus = false
        switch (value) {
          case 'withFeedback':
            feedbackStatus = true
            break
          case 'withoutFeedback':
            feedbackStatus = false
            break

          default:
            feedbackStatus = false
            break
        }
        this.props.onChangeCheckbox('hasChecklist', feedbackStatus)
      } else {
        this.props.onDropFilterOption('hasChecklist', true)

      }
    })
  }

  renderQueue = () => {
    const { onChangeCheckbox, onDropFilterOption } = this.props
    // const { feedbackValue } = this.state
    return (
      <Row style={{ width: '100%' }}>
        <div className='col-md-12 mt-3'>
          <p>У режимі перегляду вам буде надано перелік процедур, що знаходяться в актуальній черзі процедур з ризиком
            для вашого регіону.</p>
          <Checkbox onChange={e => {
            this.setState(state => {
              return {
                disabled: !state.disabled,
                // feedbackValue: !e.target.checked ? '' : feedbackValue
              }
            })
            // !e.target.checked && onDropFilterOption('hasChecklist', false)
            e.target.checked ? onChangeCheckbox('inQueue', true) : onDropFilterOption('inQueue', true)
          }}>Увімкнути режим перегляду черги ризикованих процедур</Checkbox>
        </div>
        <div className='col-md-12 mt-3'>
          <p>Попередній аналіз процедур</p>
          <Select value={this.state.feedbackValue} style={{ width: '100%' }}
                  onChange={this.handleChangeFeedbackStatus}>
            <Option value="">Усі процедури</Option>
            <Option value="withFeedback">Відгук надано</Option>
            <Option value="withoutFeedback">Відгук не надано</Option>
          </Select>
        </div>
      </Row>
    )
  }

  render() {
    const { filtersDisplay, filters } = this.props
    const { intl } = this.context
    if (!filters) return <div></div>

    return <Fragment>
      <div className="card-container">
        <Tabs type="card">
          {/*{this.renderTabsGroup('Черга', 'queuePriority', this.renderQueue())}*/}
          {/*common.text.19*/}
          {/*{this.renderTabsGroup(intl.formatMessage({ id: 'common.text.19' }), 'customer')}*/}

          {this.renderTabsGroup(intl.formatMessage({ id: 'common.text.19' }), 'contractingAuthorityTab')}
          {this.renderTabsGroup(intl.formatMessage({ id: 'common.text.20' }), 'proceduresWithRiskTab', this.renderExpectedValue())}
          {this.renderTabsGroup(intl.formatMessage({ id: 'common.text.21' }), 'procurementSubjectTab')}
          {this.renderTabsGroup(intl.formatMessage({ id: 'common.text.22' }), 'riskTab')}
          {/*{this.renderTabsGroup('Моніторинг', 'monitoring')}*/}
        </Tabs>
      </div>
      {this.renderSelected()}
      {this.renderClearBtn(filtersDisplay)}
    </Fragment>
  }
}

export default FilterForm