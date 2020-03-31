import React, {Component} from 'react'
import Header from '../../Components/Header'
import { WingBlank, Button, Icon, InputItem, Toast } from 'antd-mobile'
import { preWithdraw, withdraw } from '../../Apis/finance/transaction'
import { currencyFormate, withdrawRequest } from '../../Tools/function'

interface Props {
  history: any
  location: any
}
interface State {
  address: string
  amount: string
  assestsPass: string
  code: string
  preData: any
}

export default class WithDraw extends Component<Props, State> {
  constructor(props: object) {
    super(props as Props)
    this.state = {
      address: '',
      amount: '',
      assestsPass: '',
      code: '',
      preData: null
    }
  }
  componentDidMount () {
    let currencyId = this.props.location.query && this.props.location.query.currencyId
    currencyId && this._preWithdraw(currencyId)
  }
  async _preWithdraw(currencyId: string) {
    let res = await preWithdraw({currencyId})
    if (res.success) {
      this.setState({
        preData: res.data
      })
    }
  }
  changeAddress (address: string) {
    this.setState({
      address
    })
  }
  changeAmount (amount: string) {
    this.setState({
      amount
    })
  }
  changeTxPwd (assestsPass: string) {
    this.setState({
      assestsPass
    })
  }
  changeCode (code: string) {
    this.setState({
      code
    })
  }
  async withdrawHandle () {
    if (!this.props.location.query.currencyId) {
      return
    }
    if (this.state.address === '') {
      Toast.info('提币地址不能为空')
      return
    }
    let amount = Number(this.state.amount)
    if (isNaN(amount) || amount > Number(this.state.preData.availableBalance)) {
      Toast.info('提币金额必须是数字,且小于钱包余额')
      return
    }
    if (this.state.assestsPass === '') {
      Toast.info('资金密码不能为空')
      return
    }
    let postObj = {
      currencyId: this.props.location.query && this.props.location.query.currencyId,
      amount: this.state.amount,
      to: this.state.address,
      assestsPass: this.state.assestsPass,
      code: this.state.code,
      desc: ''
    }
    let res = await withdraw(postObj)
    if (res.success) {
      Toast.info(withdrawRequest(res.data))
    }
  }
  render () {
    let preData = this.state.preData
    if (!preData){
      return null
    }
    console.log(preData)
    let currencyId = this.props.location.query && this.props.location.query.currencyId || 'USDT'
    return (
      <div className="withdraw-page">
        <Header title="提币" icon={<Icon type="left" onClick={() => this.props.history.push('/Asset')}/>} rightContent={<span onClick={() => this.props.history.push('/WithDrawRecord')}>提币记录</span>}/>
        <WingBlank><div className="app-container">
          <span>可用余额: {currencyFormate(preData.availableBalance)} {currencyId}</span>
          <div style={{marginTop: 20}}>
            <InputItem defaultValue={this.state.address} onChange={this.changeAddress.bind(this)} placeholder="提币地址(输入或长按粘贴)"/>
          </div>
          <div style={{marginTop: 20}}>
            <InputItem defaultValue={this.state.amount} onChange={this.changeAmount.bind(this)} placeholder="提币数量"/>
          </div>
          <div style={{marginTop: 10, display: 'flex'}} className="font-explain">最小提币数:{preData.list.map((item: any, index: number) => (
            <div style={{marginLeft: 10}}><span className="font-primary">{item.withdrawMin} {currencyId}</span><span>({item.primaryChain}链)</span></div>
          ))}</div>
          <div style={{marginTop: 20}}>
            <InputItem defaultValue={this.state.assestsPass} onChange={this.changeTxPwd.bind(this)} placeholder="资金密码" type="password"/>
          </div>
          <div style={{marginTop: 20}}>
            <InputItem defaultValue={this.state.code} onChange={this.changeCode.bind(this)} placeholder="谷歌验证码(未绑定可为空)" type="password"/>
          </div>
          <div style={{marginTop: 40, display: 'flex'}} className="font-explain">手续费: {preData.list.map((item: any) => (
            <div style={{marginLeft: 10}}><span className="font-primary">{(item.withdrawFeePercent * 100)}% + {item.withdrawFeeFixed} {currencyId}</span><span>({item.primaryChain}链)</span></div>
          ))}</div>
          <Button style={{marginTop: 20}} type="primary" onClick={() => this.withdrawHandle()}>提币</Button>
        </div>
        </WingBlank>
      </div>
    )
  }
}