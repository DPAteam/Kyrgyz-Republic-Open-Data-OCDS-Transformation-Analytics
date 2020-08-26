import { ENGLISH_TRANSLATION }        from '../../common/messages/en'
import { RUSSIAN_TRANSLATION }        from '../../common/messages/ru'
import { KYRGYZSTAN_TRANSLATION }        from '../../common/messages/ky'
import { CHANGE_LOCALE, LOCALE_NAME } from "./LocaleConstants"
import ru_RU from 'antd/lib/locale-provider/ru_RU'
import en_US from 'antd/lib/locale-provider/en_US'
import moment from 'moment'
import * as numeral from 'numeral'
import numeralRu from 'numeral/locales/ru'
import 'moment/locale/ru'

const initialState = {
  lang: localStorage.getItem(LOCALE_NAME) || RUSSIAN_TRANSLATION.lang,
  messages: loadMessages(localStorage.getItem(LOCALE_NAME)),
  existsLanguage: ['ru', 'en', 'ky'],
}

export const localeReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_LOCALE:
      switch (action.locale) {
        case ENGLISH_TRANSLATION.lang:
          localStorage.setItem(LOCALE_NAME, ENGLISH_TRANSLATION.lang)
          moment.locale('en')
          numeral.locale('en')

          return {
            ...initialState.locale,
            lang: ENGLISH_TRANSLATION.lang,
            messages: ENGLISH_TRANSLATION.messages,
          }
        case RUSSIAN_TRANSLATION.lang:
          localStorage.setItem(LOCALE_NAME, RUSSIAN_TRANSLATION.lang)
          moment.locale('ru_RU')
          numeral.locale('ru', numeralRu)

          return {
            ...initialState.locale,
            lang: RUSSIAN_TRANSLATION.lang,
            messages: RUSSIAN_TRANSLATION.messages,
          }
        case KYRGYZSTAN_TRANSLATION.lang:
          localStorage.setItem(LOCALE_NAME, KYRGYZSTAN_TRANSLATION.lang)
          moment.locale('ky')
          numeral.locale('ru')

          return {
            ...initialState.locale,
            lang: KYRGYZSTAN_TRANSLATION.lang,
            messages: KYRGYZSTAN_TRANSLATION.messages,
          }

        default:
          localStorage.setItem(LOCALE_NAME, RUSSIAN_TRANSLATION.lang)
          moment.locale('ru_RU')
          numeral.locale('ru', numeralRu)

          return {
            ...initialState.locale,
            lang: RUSSIAN_TRANSLATION.lang,
            messages: RUSSIAN_TRANSLATION.messages,
          }
      }
    case CHANGE_LOCALE + '_ERROR':
      return {
        ...state,
      }
    default: {
      return state
    }
  }
}

function loadMessages(locale) {
  switch (locale) {
    case ENGLISH_TRANSLATION.lang:
      return ENGLISH_TRANSLATION.messages

    case RUSSIAN_TRANSLATION.lang:
      return RUSSIAN_TRANSLATION.messages

    case KYRGYZSTAN_TRANSLATION.lang:
      return KYRGYZSTAN_TRANSLATION.messages

    default:
      return RUSSIAN_TRANSLATION.messages
  }
}
