import React, {Component} from 'react'
import { ListView, List, Button, Icon, Radio, Tabs, Modal, InputItem, Toast } from 'antd-mobile'
import {fiatFormate, currencyFormate, fiatSymbol, formatDate} from '../../Tools/function'
import Header from '../../Components/Header'
import { orderDetail } from '../../Apis/otc'
import { orderCancle, orderPay, orderReceiverPay } from '../../Apis/order'
import { checkRequireTxpwd } from '../../Apis/user'
import { getPayway } from '../../Apis/receipt'
import { connect } from 'react-redux'
import { _state, _siteInfo } from '../../Constants/stateType'
import { imgHost } from '../../Constants/Config'

const Item = List.Item
interface Props {
  siteInfo: any
  history: any
}
interface State {
  assestsPass: string
  payWay: string
  orderId: string
  order: any
  tabs: Array<any>
  payWayDetail: Array<any>
  curPayWay: string
  bigImg: boolean
}

class FiatOrderDetail extends Component<Props, State> {
  constructor(props: any) {
    super(props as Props)
    this.state = {
      assestsPass: '',
      payWay: '',
      orderId: (props.location.query && props.location.query.id) || "5dd8ea2c0ae742001128d85b",
      order: {},
      tabs: [],
      payWayDetail: [],
      curPayWay: '',
      bigImg: false,
    }
  }
  private imgUrl: string = ''
  componentDidMount () {
    if (this.state.orderId) {
      this._orderDetail()
      this._getPayway()
    }
  }
  async _orderDetail () {
    let res = await orderDetail({orderId: this.state.orderId})
    if (res.success) {
      console.log(res.data)
      this.setState({
        order: res.data
      })
    }
  }
  async _getPayway () {
    let res = await getPayway({orderId: this.state.orderId})
    if (res.success) {
      let list = res.data
      let tabs:any = []
      list.forEach((item: any) => tabs.push({title: item.payWay}))
      this.setState({
        curPayWay: tabs[0].title,
        payWay: tabs[0].title,
        payWayDetail: res.data,
        tabs
      })
    }
  }
  tabChange (tab: any, index: number) {
    if (tab.title === this.state.curPayWay) {
      return
    }
    this.setState({
      curPayWay: tab.title
    })
  }
  controlBigImg (val: boolean, url?: any) {
    if (val) {
      this.imgUrl = url
    }
    this.setState({
      bigImg: val
    })
  }
  curPayWayDes(obj: any) {
    let lang = localStorage.lang
    let payway = this.state.curPayWay
    if (this.props.siteInfo.payWays) {
      let res = this.props.siteInfo.payWays.find((item: any) => item.id === payway)
      if (res) {
        let selectAim = obj.field? res[obj.field]: res.addons[obj.addonIndex]
        let returnData = selectAim.title.find((item: any) => item.lang === lang)
        if (returnData) {
          return returnData.str
        }
      }
    }
  }
  cancelOrderHandle () {
    Modal.alert('取消订单', '是否确认取消订单', [
      {text: '取消', onPress: () => {}, style: 'default'},
      {text: '确认', onPress: () => {this._orderCancle()}}
    ])
  }
  async _orderCancle () {
    let id = this.state.orderId
    let res = await orderCancle({id})
    if (res.success) {
      this._orderDetail()
    }
  }
  changeTxPwd (assestsPass: string) {
    console.log(assestsPass)
    this.setState({
      assestsPass
    })
  }
  async orderPayHandle () {
    let isRequire = await this._checkRequireTxpwd()
    console.log(this.state.payWayDetail)
    let message: any = ''
    if (this.state.order.isC2C) {
      if (isRequire) {
        message = <InputItem defaultValue={this.state.assestsPass} onChange={this.changeTxPwd.bind(this)} type="password" placeholder="资金密码"/>
      }
    } else {
      if (isRequire) {
        message = (
          <div>
            <InputItem defaultValue={this.state.assestsPass} onChange={this.changeTxPwd.bind(this)} type="password" placeholder="资金密码"/>
            <List renderHeader={() => '付款方式'}>
              {this.state.payWayDetail.map((item: any) => (
                <Radio.RadioItem key={item.payWay} checked={this.state.payWay === item.payWay} onChange={() => {
                  this.setState({payWay: item.payWay})
                }}>
                  {item.payWay}
                </Radio.RadioItem>
              ))}
            </List>
          </div>
        )
      } else {
        message = (
          <div>
            {this.state.payWayDetail.map((item: any) => (<Radio onChange={e => console.log(e)} key={item.payWay}>{item.payWay}</Radio>))}
          </div>
        )
      }
    }
    Modal.alert('确认付款', message, [
      {text: '取消', onPress: () => {}, style: 'default'},
      {text: '确认', onPress: () => {this._confirmPay()}}
    ])
  }
  async orderReceiverPayHandle () {
    let isRequire = await this._checkRequireTxpwd()
    let message: any = ''
    if (isRequire) {
      message = <InputItem defaultValue={this.state.assestsPass} onChange={this.changeTxPwd.bind(this)} type="password" placeholder="资金密码"/>
    }
    Modal.alert('确认收款', message, [
      {text: '取消', onPress: () => {}, style: 'default'},
      {text: '确认', onPress: () => {this._confirmReceive()}}
    ])
  }
  async _confirmPay () {
    let isRequire = await this._checkRequireTxpwd()
    if (isRequire && this.state.assestsPass === '') {
      Toast.info('资金密码不能为空')
      return
    }
    if (this.state.order.isC2C) {
      this._orderReceiverPay()
    } else {
      if (this.state.payWay === '') {
        Toast.info('请选择你使用的付款方式')
        return
      }
      this._orderPay()
    }
  }
  async _confirmReceive () {
    let isRequire = await this._checkRequireTxpwd()
    if (isRequire && this.state.assestsPass === '') {
      Toast.info('资金密码不能为空')
      return
    }
    this._orderReceiverPay()
  }
  async _orderReceiverPay () {
    let postObj = {
      id: this.state.orderId,
      assestsPass: this.state.assestsPass || undefined
    }
    let res = await orderReceiverPay(postObj)
    if (res.success) {
      this._orderDetail()
    }
  }
  async _orderPay () {
    let postObj = {
      id: this.state.orderId,
      assestsPass: this.state.assestsPass || undefined,
      payWay: this.state.payWay
    }
    let res = await orderPay(postObj)
    if (res.success) {
      this._orderDetail()
    }
  }
  async _checkRequireTxpwd () {
    let res = await checkRequireTxpwd()
    if (res.success) {
      return res.data
    }
  }
  showAppeal(data:any) {
    if (!data.isAppeal) {
      if (data.isC2C) {
        return true
      } else {
        if (data.orderStatus !== "waitPay") {
          return true
        } else {
          return false
        }
      }
    } else {
      return false
    }
  }
  appealHandle () {
    this.props.history.push({pathname: '/AppealSubmit', query: {id: this.state.order.id, orderCode: this.state.order.orderCode}})
  }
  // getFiatRate () {
  //   if (this.props.siteInfo) {
  //     let rateList = this.props.siteInfo.rateList
  //     let one = rateList && rateList.find((item: any) => item.legalCurrencyType === this.state.order.legalCurrency)
  //     if (one) {
  //       return one.usdValue
  //     }
  //   }
    
  // }
  render () {
    let lang = localStorage.lang
    return (
      <div className="order-detail font-reverse">
        <Header
          mode='light'
          icon={<Icon type='left' onClick={() => this.props.history.push('/FiatOrderRecord')}/>}
          title=""
        />
        <div className="app-container" style={{paddingBottom: 52}}>
          <div style={{padding: 15, backgroundColor: '#0852C4'}}>
            {(() => {
              switch (this.state.order.orderStatus) {
                case 'waitPay':
                  return (
                    <div style={{display: 'flex', flexDirection: 'column', paddingBottom: 10}}>
                      <div style={{fontSize: 22, marginBottom: 10}}>请付款</div>
                      <div>请在 {formatDate(this.state.order.expireTime)} 前完成付款</div>
                    </div>
                  )
                case 'waitCoin':
                  return null
                case 'success':
                  return (
                    <div style={{display: 'flex', flexDirection: 'column', paddingBottom: 10}}>
                      <div style={{fontSize: 22, marginBottom: 10}}>已完成</div>
                      <div>交易已完成</div>
                    </div>
                  )
                case 'cancel':
                  return (
                    <div style={{display: 'flex', flexDirection: 'column', paddingBottom: 10}}>
                      <div style={{fontSize: 22, marginBottom: 10}}>已取消</div>
                      <div>交易已取消</div>
                    </div>
                  )
                case 'expire':
                  return (
                    <div style={{display: 'flex', flexDirection: 'column', paddingBottom: 10}}>
                      <div style={{fontSize: 22, marginBottom: 10}}>已过期</div>
                      <div>交易已过期</div>
                    </div>
                  )
                default:
                  return null
              }
            })()}
            
          </div>
          <div className="card">
              <List>
                <Item extra={`${fiatFormate(this.state.order.legalCurrencyAmount)} ${this.state.order.legalCurrency}`}>总金额</Item>
                <Item extra={`${fiatFormate(this.state.order.unitPrice)} ${this.state.order.legalCurrency}`}>单价</Item>
                <Item extra={`${fiatFormate(this.state.order.tradeCurrencyAmount)} ${this.state.order.currencyId}`}>数量</Item>
              </List>
              <div className="list-group-sep">
                <Tabs
                  tabs={this.state.tabs}
                  renderTabBar={props => <Tabs.DefaultTabBar 
                  {...props} 
                  page={6} 
                  onTabClick = {this.tabChange.bind(this)}
                />}>
                  {this.state.payWayDetail.map((item: any) => (
                    <List key={item.payWay}>
                    <Item extra={item.code}>{this.curPayWayDes({field: 'code'})}</Item>
                    <Item onClick={() => this.controlBigImg(true, imgHost + item.pic)} extra={<img width="20" height="20" src={imgHost + item.pic}/>}>{this.curPayWayDes({field: 'pic'})}</Item>
                    {item.addon.map((addon: any, index: number) => {
                      return <Item key={index} extra={addon}>{this.curPayWayDes({addonIndex: index})}</Item>
                    })}
                  </List>
                  ))}
                </Tabs>
              </div>
              <List className="list-group-sep">
                <Item extra={this.state.order.orderCode}>订单编号</Item>
                <Item extra={this.state.order.paycode}>支付码</Item>
              </List>
            </div>
        </div>
        <Modal
          visible={this.state.bigImg}
          onClose={() => this.controlBigImg(false)}
        >
          <img src={this.imgUrl} alt="" width="100%" height="100%" onClick={() => this.controlBigImg(false)}/>
        </Modal>
        <div className="btns">
          {(
            (!this.state.order.isC2C && this.state.order.orderStatus === 'waitPay') || 
            (this.state.order.isC2C && this.state.order.waitPayTime > new Date())
            ) && (this.state.order.tradeType === 'buy' )? <Button type="warning" onClick={() => this.cancelOrderHandle()}>取消订单</Button>: null}
          
          {(this.state.order.orderStatus === 'waitPay' && (
            (this.state.order.isC2C && this.state.order.isOwner && this.state.order.tradeType === 'buy') ||
            (!this.state.order.isC2C && this.state.order.tradeType === 'buy')))? <Button type="primary" onClick={() => this.orderPayHandle()}>我已付款</Button>: null}
          
          {this.state.order.orderStatus === 'waitCoin' && (
            (!this.state.order.isC2C && this.state.order.tradeType === 'sell') ||
            (this.state.order.isC2C && this.state.order.isOwner && this.state.order.tradeType === 'sell')
            )? <Button type="primary" onClick={() => this.orderReceiverPayHandle()}>我已收款</Button>: null}
            {this.showAppeal(this.state.order)?<Button type="primary" onClick={() => this.appealHandle()}>申诉</Button>:null}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: _state) => {
  return {
    siteInfo: state.siteInfo
  }
}

export default connect(mapStateToProps, {})(FiatOrderDetail as React.ComponentType)