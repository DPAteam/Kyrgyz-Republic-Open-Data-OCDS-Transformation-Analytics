import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Card from '../card/Card'
import { FormattedMessage } from 'react-intl'

import './exportCard.scss'

class ExportCard extends PureComponent {

  static contextTypes = {
    intl: PropTypes.object.isRequired,
  }

  handleClickButton = (link) => {
    window.open(link, "_blank")
  }

  render() {
    const { intl } = this.context
    const { info } = this.props
    return (
      <Card
        cardFluid
        // className="col-md-3 mobile-top-margin"
        cardClass="h-100 export-card-wrapper position-related mobile-top-margin"
      >
        <div className="rectangle-f" />
        <div className="rectangle-s" />
        <div className="rectangle-t" />
        <div className="display-flex display-flex-mobile">
          <div className="export-card-icon">
            {this.props.icon}
          </div>
          <div className="export-card-wrapper-text">
            <div className="export-card-title">
              {this.props.title}
            </div>
            <div className="export-card-subtitle">
              {this.props.content}
            </div>
            <div className="export-card-button" onClick={() => this.handleClickButton(this.props.link)}>
              <FormattedMessage id="page.common.text.16" >
                {msg => (
                  <span className="export-card-button-text">{msg}</span>
                )}
              </FormattedMessage>
            </div>
          </div>
        </div>
      </Card>
    )
  }
}


ExportCard.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  link: PropTypes.string,
  icon: PropTypes.object,
}

export default ExportCard
