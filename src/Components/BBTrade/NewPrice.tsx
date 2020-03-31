import React, {Component} from 'react'
import { InputItem, ActionSheet, Icon } from 'antd-mobile'
import { currencyFormate, fiatFormate } from '../../Tools/function'
import { getPairPrice } from '../../Apis/bbtrade'

interface Props {
  socket: any
  pair: string
}
interface State {
  priceObj: any
}

export default class NewPrice extends Component<Props, State> {
  constructor(props: object) {
    super(props as Props)
    this.state = {
      priceObj: {}
    }
  }
  componentDidMount () {
    this._getPairPrice(this.props.pair)
  }
  async _getPairPrice (pair: any) {
    let postObj = {
      pairs: [pair],
      time: new Date()
    }
    let res = await getPairPrice(postObj)
    if (res.success) {
      console.log(res.data[0])
      if (res.data && res.data.length > 0) {
        this.setState({
          priceObj: res.data[0]
        })
      }
    }
  }
  render () {
    return (
      <div className="bb-newprice">
        <div>
          <div className="font-explain">最新价</div>
          <h2>{this.state.priceObj.price}</h2>
        </div>
        <div>
          <div><span className="font-explain">高</span><span>{currencyFormate(this.state.priceObj.high)}</span></div>
          <div><span className="font-explain">低</span><span>{currencyFormate(this.state.priceObj.low)}</span></div>
          <div><span className="font-explain">24H</span><span>{currencyFormate(this.state.priceObj.vol)}</span></div>
        </div>
      </div>
    )
  }
}