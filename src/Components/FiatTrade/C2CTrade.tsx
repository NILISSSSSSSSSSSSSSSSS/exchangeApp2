import React, {Component} from 'react'
import { InputItem, WingBlank, Button, Toast } from 'antd-mobile'
import { createOrder, adQueryVip } from '../../Apis/c2c-trade'
import { fiatFormate } from '../../Tools/function'

interface Props {
  history: any
  currencyId: string
  legalCurrency: string
  tradeType: string
  payWay: string
}
interface State {
  currencyAmount: string
  unitPriceUSD: string
}
export default class C2CTrade extends Component<Props, State>{
  constructor(props: object) {
    super(props as Props)
    this.state = {
      currencyAmount: '',
      unitPriceUSD: '0'
    }
  }
  async _adQueryVip (obj: any) {
    let currencyAmount = this.state.currencyAmount
    if (Number(currencyAmount) <= 0) {
      return
    }
    obj = {...this.props, ...obj}
    let res = await adQueryVip({...obj, count: 1, currencyAmount: this.state.currencyAmount})
    if (res.success) {
      let unitPriceUSD = '0'
      if (res.data.list.length > 0) {
        unitPriceUSD = res.data.list[0].unitPriceUSD
      }
      this.setState({
        unitPriceUSD
      })
    }
  }
  async _createOrder () {
    if (this.state.unitPriceUSD === '0') {
      Toast.info('没有查询到符合的广告，无法下单')
      return
    }
    let tradeCurrencyAmount = Number(this.state.currencyAmount)
    if (isNaN(tradeCurrencyAmount) || tradeCurrencyAmount <= 0) {
      Toast.info('交易数量必须事大于0的数')
      return
    }
    let {currencyId, legalCurrency, tradeType, payWay} = this.props
    let postObj = {
      currencyId,
      unitPriceUSD: this.state.unitPriceUSD,
      tradeCurrencyAmount: tradeCurrencyAmount.toString(),
      legalCurrency,
      tradeType,
      payWay
    }
    let res = await createOrder(postObj)
    if (res.success) {
      let id = res.data.id
      this.props.history.push({pathname: '/FiatOrderDetail', query: {id}})
    }
  }
  changeAmount (val: string) {
    if (isNaN(Number(val))) {
      val = '0'
    }
    this.setState({
      currencyAmount: val
    })
  }
  inputBlur () {
    this._adQueryVip({})
  }
  componentWillUpdate(nextProps: any, nextState: any) {
    if (
      nextProps.tradeType !== this.props.tradeType || nextProps.currencyId !== this.props.currencyId || nextProps.legalCurrency !== this.props.legalCurrency
      || nextProps.payWay !== this.props.payWay
      ) {
      let {tradeType, currencyId, legalCurrency, payWay} = nextProps
      this._adQueryVip({tradeType, currencyId, legalCurrency, payWay})
    }
  }
  render() {
    return (
      <div className="c2c-trade">
        <div className="input-label">购买数量</div>
        <WingBlank>
          <InputItem onBlur={this.inputBlur.bind(this)} value={this.state.currencyAmount} onChange={this.changeAmount.bind(this)} placeholder="请输入数量" extra={this.props.currencyId}/>
          <div className="explain-under-input">{this.state.unitPriceUSD === '0'? '未查询到符合条件的广告': (`${fiatFormate(this.state.unitPriceUSD)} ${this.props.legalCurrency}/${this.props.currencyId}`)}</div>
          <Button type="primary" style={{marginTop: 30}} size="large" onClick={() => this._createOrder()}>
            <i className="iconfont iconshandian" style={{display: "inline-block", verticalAlign: "middle"}}></i>
            <span style={{marginLeft: 5}}>购买</span>
          </Button>
        </WingBlank>
        
      </div>
    )
  }
}