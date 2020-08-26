import React, { Component } from 'react'
import { Card, Col, Row, Spin } from 'antd'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withTranslate } from 'react-redux-multilingual'
import { BASE_CARDS_OPTIONS } from '../HomePageConstants'
import {
  toCurrencyWithoutPostfix, toCurrencyWithPostfix, toNumberFormat,
  toPercentFormat,
} from '../../../utils/NumberUtils'

import './HomeCardPanel.css'

class HomeCardPanel extends Component {
  componentDidMount() {
    // this.props.fetchDashboardBuyerInfo()
  }

  render() {
    const { translate, dashboardBaseInfoData, dashboardBaseInfoDataIsFetching } = this.props

    return (
      <Spin spinning={dashboardBaseInfoDataIsFetching} size="large">
        <Row style={{ marginBottom: 15 }}>
          {BASE_CARDS_OPTIONS.map((optionItem, index) => {
            let classname = ''
            if(index === 0) {
              classname = 'first-element-buyer-dashboard-card-panel'
            } else if(index === (BASE_CARDS_OPTIONS.length - 1)) {
              classname = 'last-element-buyer-dashboard-card-panel'
            } else {
              classname = 'buyer-dashboard-card-panel'
            }

            return (
            <Col span={6} key={`buyer_dashboard_panel_${index}`}>
              <Card title={translate(optionItem.titleKey)} className={classname}>
                {optionItem.cardData.map((cardOption, ind) => {
                  let value = dashboardBaseInfoData[cardOption.valueKey]
                  switch (cardOption.numberFormat){
                    case 'number':
                      value = toNumberFormat(value)
                      break
                    case 'currency_without_postfix':
                      value = toCurrencyWithoutPostfix(value)
                      break
                    case 'currency_with_postfix':
                      value = toCurrencyWithPostfix(value)
                      break
                    case 'percent':
                      value = toPercentFormat(value)
                      break

                    default:
                      value = toNumberFormat(value)
                  }
                  return (
                    <div key={`buyer_dashboard_content_${ind}`}>
                      <Card.Grid style={cardOption.textGridStyle}>{translate(cardOption.translateKey)}</Card.Grid>
                      <Card.Grid style={cardOption.valueGridStyle}><b>{value}</b></Card.Grid>
                    </div>
                  )
                })}
              </Card>
            </Col>
          )})}
        </Row>
      </Spin>
    )
  }
}

function mapStateToProps({
                           prioritizationStore,
                           homeStore,
                           mappingsStore,
                         }) {
  return {
    filterRequestBody: prioritizationStore.filterRequestBody,
    dashboardBaseInfoData: homeStore.dashboardBaseInfoData,
    dashboardBaseInfoDataIsFetching: homeStore.dashboardBaseInfoDataIsFetching,
    allMappings: mappingsStore.allMappings,
  }
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslate(HomeCardPanel))
