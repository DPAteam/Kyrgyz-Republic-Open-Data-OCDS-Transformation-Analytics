export const AUDITORS_TABLE_COLUMNS = [
  {
    title: '',
    dataIndex: 'name',
    sorter: (a, b) => { return a.name.localeCompare(b.name)},
    width: '40%',
    translate_key: 'common.text.155'
  },
  {
    title: '',
    dataIndex: 'email',
    sorter: (a, b) => { return a.email.localeCompare(b.email)},
    width: '30%',
    translate_key: 'common.text.157'
  },
  {
    title: '',
    dataIndex: 'editButton',
    align: 'center',
    width: '10%',
  },
]