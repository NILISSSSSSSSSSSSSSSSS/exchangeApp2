import React, {Component} from 'react'
import { Button, InputItem, Toast, Modal } from 'antd-mobile'
import { getPairPrice } from '../../Apis/bbtrade'
import { checkRequireTxpwd } from '../../Apis/user'
import { tradePairs } from '../../Apis/bbtrade'

interface Props {
  pair: string
  defaultPrice: string
}
interface State {
  price: string
  amount: string
  isBuy: boolean
  assestsPass: string
}

export default class BuyOrSell extends Component<Props, State> {
  constructor(props: object) {
    super(props as Props)
    this.state = {
      price: '',
      amount: '',
      isBuy: true,
      assestsPass: ''
    }
  }
  componentWillReceiveProps (nextProps: any) {
    if (nextProps.defaultPrice) {
      this.setState({
        price: nextProps.defaultPrice === '-'? '': nextProps.defaultPrice
      })
    }
  }
  async _checkRequireTxpwd () {
    let res = await checkRequireTxpwd()
    if (res.success) {
      return res.data
    } else {
      return undefined
    }
  }
  async tradeHandle () {
    let amount = Number(this.state.amount)
    let price = Number(this.state.price)
    if (isNaN(amount) || amount <= 0) {
      Toast.info('交易数量必须是大于0的数')
      return
    }
    if (isNaN(price) || price <= 0) {
      Toast.info('单价必须是大于0的数')
      return
    }
    let isRequire = await this._checkRequireTxpwd()
    if (isRequire === undefined) {
      return
    }
    let message: any = ''
    if (isRequire) {
      message = <InputItem defaultValue={this.state.assestsPass} onChange={this.changeTxPwd.bind(this)} type="password" placeholder="资金密码"/>
    }
    Modal.alert('下单确认', message, [
      {text: '取消', onPress: () => {}, style: 'default'},
      {text: '确认', onPress: () => {this._tradePairs()}}
    ])
  }
  async _tradePairs () {
    let {isBuy, price, amount} = this.state
    let postObj = {
      pairName: this.props.pair,
      txPwd: this.state.assestsPass,
      isBuy,
      price: price.toString(),
      amount,
    }
    let res = await tradePairs(postObj)
    if (res.success) {
      Toast.info('委托单创建成功')
    }
  }
  tradeAmount () {
    let amount = Number(this.state.amount)
    let price = Number(this.state.price)
    if (isNaN(amount) || isNaN(price)){
      return 0
    }
    return amount * price
  }
  changeTxPwd (assestsPass: string) {
    console.log(assestsPass)
    this.setState({
      assestsPass
    })
  }
  render () {
    const aimCurrency = this.props.pair.split('_')[0]
    const souCurrency = this.props.pair.split('_')[1]
    return (
      <div className="buy-sell">
        <div style={{display: 'flex'}}>
          <Button style={{flex: 0.5, marginRight: 10, backgroundColor: this.state.isBuy? '#1882D4': 'transparent'}} onClick={() => this.setState({isBuy: true})}>买入</Button>
          <Button style={{flex: 0.5, backgroundColor: !this.state.isBuy? '#1882D4': 'transparent'}} onClick={() => this.setState({isBuy: false})}>卖出</Button>
        </div>
        <div style={{width: '100%', height: 10}}></div>
        <InputItem value={this.state.price} onChange={(val: string) => this.setState({price: val})}>单价</InputItem>
        <div style={{width: '100%', height: 10}}></div>
        <InputItem placeholder="数量" defaultValue={this.state.amount} onChange={(val: string) => this.setState({amount: val})} extra={aimCurrency}/>
        <div style={{width: '100%', height: 10}}></div>
        <div><span className="font-explain">交易额 </span><span className="font-main">{this.tradeAmount()} {souCurrency}</span></div>
        <div style={{width: '100%', height: 10}}></div>
        {this.state.isBuy? <Button type="primary" onClick={() => this.tradeHandle()}>买入 {aimCurrency}</Button>: <Button type="primary" onClick={() => this.tradeHandle()}>卖出 {aimCurrency}</Button>}
      </div>
    )
  }
}