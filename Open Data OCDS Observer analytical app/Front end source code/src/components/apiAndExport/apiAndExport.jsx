import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'
import _ from 'lodash'
import moment from 'moment'
import DateRangePicker from '@wojtekmaj/react-daterange-picker'
import {
  getBelarusProductsShare,
  getCountriesOkrbTopAmount,
  getProductCountriesContractItemsAmount,
} from '../../store/stories/buyBelarusian/actions'
import { exportToFile } from '../../store/dashboard/apiExport/apiExportActions'
import ExportCard from '../exportCard/exportCard'
import { EXPORT_CARDS_OPTIONS } from './apiAndExportConstants'
import IconCalendar from '../icons/IconCalendar'
import IconDownload from '../icons/IconDownload'

import './apiAndExport.scss'
import { setCurrentRoute } from '../../store/navigation/NavActions'

class apiAndExport extends React.Component {

  constructor(props) {
    super(props)

    props.setCurrentRoute('/api-export')
  }

  state = {
    date: [new Date(), new Date()],
    exportType: 'json',
  }

  static contextTypes = {
    intl: PropTypes.object.isRequired,
  }


  renderCard = (cardOption) => {
    return (
      <ExportCard
        title={cardOption.title}
        content={cardOption.content}
        icon={cardOption.icon}
        link={cardOption.link}
      />
    )
  }

  renderCardGroup = () => {
    let chunkedArray = _.chunk(_.cloneDeep(EXPORT_CARDS_OPTIONS), 2)

    return chunkedArray.map((cardOptions, index) => (
      <div className="row">
        {cardOptions.map((cardOption) => (
          <div className="col-md-12 col-xl-6" style={{ marginTop: 30 }}>
            {this.renderCard(cardOption)}
          </div>
        ))}
      </div>
    ))
  }

  setActive = (type) => {
    this.setState({
      exportType: type,
    })
  }

  onChange = (date) => {
    this.setState({
      date: date,
    })
  }

  handleDownloadFile = () => {

    let dateRange = {
      dateFrom: moment(this.state.date[0]).format('YYYY-MM-DD'),
      dateTo: moment(this.state.date[1]).format('YYYY-MM-DD'),
    }

    this.props.exportToFile(dateRange, this.state.exportType, `${dateRange.dateFrom}_${dateRange.dateTo}.${this.state.exportType}`)
  }

  render() {
    const { intl } = this.context

    return (
      <div className="apiAndExport" style={{ minHeight: window.innerHeight - 215 }}>
        <div className="pt-110">
          <div className="row">
            <div className="col-md-12 col-xl-6">
              <div className="export-main-title">
                <FormattedMessage id="page.apiExport.text.1.0" />
              </div>
            </div>
            <div className="col-md-12 col-xl-6">
              <div className="row margin-top-15">
                <div className="col-md-12">
                  <DateRangePicker
                    onChange={this.onChange}
                    value={this.state.date}
                    calendarIcon={<IconCalendar />}
                    clearIcon={null}
                    format={'y-MM-d'}
                    className="float-right"
                  />
                </div>
              </div>
              <div className="row margin-top-15">
                <div className="col-md-12">
                  <div className="float-right checkbox-wrapper">
                    {/*<div className="checkbox-content" onClick={() => this.setActive('json')}>*/}
                    {/*  <span>JSON</span>*/}
                    {/*  <div className={this.state.exportType === 'json' ? 'checked-circle-active' : 'checked-circle'} />*/}
                    {/*</div>*/}
                    {/*<div className="checkbox-content" onClick={() => this.setActive('xls')}>*/}
                    {/*  <span>Excel</span>*/}
                    {/*  <div className={this.state.exportType === 'xls' ? 'checked-circle-active' : 'checked-circle'} />*/}
                    {/*</div>*/}
                    <div className="checkbox-content">
                      <div className="export-button" onClick={this.handleDownloadFile}>
                        <div className="export-button-icon"><IconDownload fill="#FFFFFF" /></div>
                        <FormattedMessage id="page.common.text.17">
                          {msg => (
                            <span className="export-button-text">{msg}</span>
                          )}
                        </FormattedMessage>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {this.renderCardGroup()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({
                           buyBelarusianState,
                           locale,
                         }) => {
  return {
    productCountries: buyBelarusianState.productCountriesContractItemsAmount,
    productCountriesIsFetching: buyBelarusianState.productCountriesContractItemsAmountIsFetching,
    countriesTop: buyBelarusianState.countriesOkrbTopAmount,
    countriesTopIsFetching: buyBelarusianState.countriesOkrbTopAmountIsFetching,
    belarusProductsShare: buyBelarusianState.belarusProductsShare,
    lang: locale.lang,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getProductCountriesContractItemsAmount: bindActionCreators(getProductCountriesContractItemsAmount, dispatch),
    getCountriesOkrbTopAmount: bindActionCreators(getCountriesOkrbTopAmount, dispatch),
    getBelarusProductsShare: bindActionCreators(getBelarusProductsShare, dispatch),
    setCurrentRoute: bindActionCreators(setCurrentRoute, dispatch),
    exportToFile: bindActionCreators(exportToFile, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(apiAndExport)