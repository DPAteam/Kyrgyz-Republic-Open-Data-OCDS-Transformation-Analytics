import { addLocaleData } from 'react-intl'

import en from 'react-intl/locale-data/en'
import ru from 'react-intl/locale-data/ru'
import ky from 'react-intl/locale-data/ky'

export function initLocale() {
  addLocaleData([...ru, ...en, ...ky])
}
