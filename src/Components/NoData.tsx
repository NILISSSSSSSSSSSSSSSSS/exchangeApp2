import React, {Component} from 'react'

interface Props {}
interface State {}

export default class NoData extends Component<Props, State> {
  constructor(props: object) {
    super(props as Props)
  }
  render () {
    return (
      <div style={{minHeight: 60, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>暂无数据</div>
    )
  }
}