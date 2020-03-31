import React, {Component} from 'react'
import { getEntrustOrders, entrustCancel } from '../../Apis/bbtrade'
import {currencyFormate, formatDate, direction} from '../../Tools/function'
import NoData from '../NoData'
import { Button, Toast } from 'antd-mobile'

interface Props {
  history: any
  socket: any
  pair: string
}
interface State {
  orders: any
}

export default class Entrust extends Component<Props, State> {
  constructor(props: object) {
    super(props as Props)
    this.state = {
      orders: []
    }
  }
  componentWillReceiveProps (nextProps: any) {
    if (nextProps.pair) {
      if (localStorage.token) {
        this._getEntrustOrders(nextProps.pair)
      }
    }
  }
  componentDidMount () {
    this.socketOnMsg()
  }
  async _getEntrustOrders (pair: string) {
    let postObj = {
      pairName: pair,
      status: ['normal'],
      page: 0,
      limit: 99999
    }
    let res = await getEntrustOrders(postObj)
    if (res.success) {
      this.setState({
        orders: res.data.list
      })
      this.socketEmit()
    }
  }
  socketOnMsg () {
    if (this.props.socket) {
      this.props.socket.on('data', (data: any) => {
        data = JSON.parse(data)
        let type= data.type
        let body = data.body
        if (type === 'SUBSCRIBLE_MY_BB_DELEGATION_CHANGE') {
          console.log(body)
          let orders = this.state.orders
          if (body.status === 'normal') {
            orders.unshift({
              price: body.price,
              status: body.status,
              fullCount: body.fullCount,
              pairName: body.pairName.replace('|', '_'),
              id: body.reqId,
              _id: body.reqId,
              createTime: body.createTime,
              type: body.type,
              remainCount: body.remainCount,
              updateTime: body.updateTime,
              billAmount: Number(body.billAmount) || 0
            })
          } else {
            let index = orders.findIndex((x: any) => x.id === body.reqId)
            if (index >= 0) {
              orders.splice(index, 1)
            }
          }
          this.setState({
            orders
          })
        }
      })
    }
  }
  socketEmit () {
    if (this.props.socket) {
      this.props.socket.emit('subcrible', {
        businessName: "SUBSCRIBLE_MY_BB_DELEGATION_CHANGE", //  SUBSCRIBLE_MY_BB_BILL???
        token: localStorage.token
      })
    }
  }
  async cancel (id: string) {
    let res = await entrustCancel({id: id})
    if (res.success) {
      let index = this.state.orders.findIndex((x: any) => x.id === id)
      if (index >= 0) {
        let orders = this.state.orders
        orders.splice(index, 1)
        this.setState({
          orders
        })
      }
      Toast.info('撤单成功')
    }
  }
  goBBOrders () {
    this.props.history.push({pathname: '/BBOrders'})
  }
  render () {
    return (
      <div className="bb-entrust">
        <div className="header">
          <h3>当前委托</h3>
          <span style={{padding: 5}} onClick={() => this.goBBOrders()}>成交单</span>
        </div>
        <div className="custom-table">
          <div className="table-header col-4"><span>价格</span><span>数量</span><span>方向</span><span>时间</span><span>操作</span></div>
          {
            this.state.orders.length <= 0?<NoData />: this.state.orders.map((item: any) => (
              <div className="table-body col-5" key={item.orderId}>
                <span>{currencyFormate(item.price)}</span>
                <span>{currencyFormate(item.fullCount)}</span>
                <span>{direction(item.type)}</span>
                <span>{formatDate(item.createTime)}</span>
                <span className="link" onClick={() => this.cancel(item.id)}>撤销</span>
              </div>
            ))
          }
        </div>
      </div>
    )
  }
}