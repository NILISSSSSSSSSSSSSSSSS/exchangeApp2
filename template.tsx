import React, {Component} from 'react'

interface Props {}
interface State {}

export default class FiatOrderDetail extends Component<Props, State> {
  constructor(props: object) {
    super(props as Props)
  }
  render () {
    return (
      <div className="order-detail"></div>
    )
  }
}