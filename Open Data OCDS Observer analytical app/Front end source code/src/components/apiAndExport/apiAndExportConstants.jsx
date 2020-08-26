import React from 'react'
import IconGearApi from '../icons/IconGearApi'
import IconDocument from '../icons/IconDocument'
import IconBox from '../icons/IconBox'
import { FormattedMessage } from 'react-intl'

export const EXPORT_CARDS_OPTIONS = [
  {
    title: <FormattedMessage  id='page.common.text.1' />,
    content: <FormattedMessage  id='page.common.text.1.1' />,
    icon: <IconGearApi fill="#FFFFFF"/>,
    link: 'http://ocds.zakupki.gov.kg/api/tendering'
  },
  {
    title: <FormattedMessage  id='page.common.text.2' />,
    content: <FormattedMessage  id='page.common.text.2.1' />,
    icon: <IconGearApi fill="white"/>,
    link: 'http://ocds.zakupki.gov.kg/api/planning'
  },
  {
    title: <FormattedMessage  id='page.common.text.3' />,
    content: <FormattedMessage  id='page.common.text.3.1' />,
    icon: <IconDocument fill="#FFFFFF"/>,
    // link: 'https://app.swaggerhub.com/apis/datapath/export-api-documentation/'
    link: 'https://app.swaggerhub.com/apis/DPAteam/export-api-documentation/1.0'
  },
  {
    title: <FormattedMessage  id='page.common.text.4' />,
    content: <FormattedMessage  id='page.common.text.4.1' />,
    icon: <IconBox />,
    link: 'https://standard.open-contracting.org/latest/en/'
  },
]