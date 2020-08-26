import React, { Component } from 'react'
import PropTypes            from 'prop-types'

import { Table as AntTable } from 'antd'

import './Table.scss'


class Table extends Component {
  render() {
    return <AntTable
      rowSelection={this.props.rowSelection}
      dataSource={this.props.data}
      columns={this.props.columns}
      loading={this.props.isFetching}
      rowClassName={this.props.rowClassName}
      {...this.props}
    />
  }
}

Table.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array,
  rowSelection: PropTypes.object,
  isFetching: PropTypes.bool,
  rowClassName: PropTypes.func,
}

export default Table
