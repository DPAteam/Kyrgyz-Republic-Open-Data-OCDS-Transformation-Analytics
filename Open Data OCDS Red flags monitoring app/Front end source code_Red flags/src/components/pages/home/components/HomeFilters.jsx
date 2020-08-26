import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withTranslate } from 'react-redux-multilingual'
import { Row, Col, DatePicker } from 'antd'
import moment from 'moment'

class HomeFilters extends Component {
  render() {
    const {
      translate,
      allSelectedData,
    } = this.props

    return (
      <Row style={{ marginBottom: 15 }}>
        <Col span={24}>
          <Row>
            <Col span={8}></Col>
            <Col span={8}></Col>
            <Col span={4}>
              {translate('tender_filter_start_date_period')}:
            </Col>
            <Col span={4}>
              <span style={{ marginLeft: '5%'}}>{translate('tender_filter_end_date_period')}:</span>
            </Col>
          </Row>
          <Row style={{ marginBottom: 15 }}>
            <Col span={8}></Col>
            <Col span={8}></Col>
            <Col span={4}>
              <DatePicker
                style={{ width: '95%' }}
                placeholder={translate('start_data')}
                onChange={this.props.handleStartDateSelected}
                value={allSelectedData.hasOwnProperty('contractStartDate') ? moment(allSelectedData.contractStartDate) : null}
              />
            </Col>
            <Col span={4}>
              <DatePicker
                style={{ width: '95%', marginLeft: '5%' }}
                placeholder={translate('end_date')}
                onChange={this.props.handleEndDateSelected}
                value={allSelectedData.hasOwnProperty('contractEndDate') ? moment(allSelectedData.contractEndDate) : null}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}

HomeFilters.propTypes = {
  allSelectedData: PropTypes.object,
  handleStartDateSelected: PropTypes.func,
  handleEndDateSelected: PropTypes.func,
}


export default withTranslate(HomeFilters)