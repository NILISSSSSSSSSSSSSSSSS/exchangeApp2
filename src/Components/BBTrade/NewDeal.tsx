
import React, {Component} from 'react'
import { getPairDeal } from '../../Apis/bbtrade'
import NoData from '../NoData'
import { formatDate, direction, currencyFormate } from '../../Tools/function'

interface Props {
  pair: string
  socket: any
}
interface State {
  data: any
}

export default class NewDeal extends Component<Props, State> {
  constructor(props: object) {
    super(props as Props)
    this.state = {
      data: []
    }
  }
  componentDidMount () {
    this._getPairDeal()
    this.socketOnMsg()
  }
  socketOnMsg () {
    if (this.props.socket) {
      this.props.socket.on('data', (data: any) => {
        data = JSON.parse(data)
        let type= data.type
        let body = data.body
        //  最新价
        let lastestPrice = body.bills[0].price
        let dataList = this.state.data
        if (type === 'SUBSCRIBLE_PAIR_BILL') {
          body.bills.forEach((item: any) => {
            dataList.unshift({
              billId: item.billId,
              billAmount: item.count,
              pairName: item.pairName,
              tradeDirection: item.tradeDirection,
              type: item.userType,
              billPrice: item.price,
              createTime: item.createTime
            })
          })
          this.setState({
            data: dataList
          })
        }
      })
    }
  }
  socketEmit () {
    if (this.props.socket) {
      this.props.socket.emit('subcrible', {
        businessName: "SUBSCRIBLE_PAIR_BILL",
        pairName: this.props.pair
      })
    }
  }
  async _getPairDeal () {
    let postObj = {pairName: this.props.pair}
    let res = await getPairDeal(postObj)
    if (res.success) {
      this.setState({
        data: res.data.list
      })
      this.socketEmit()
    }
  }
  timeFormate (s: any) {
    return formatDate(s, 'hh:mm:ss')
  }
  render () {
    return (
      <div className="custom-table" style={{paddingTop: 20, paddingBottom: 20}}>
        <div className="table-header col-4"><span>时间</span><span>方向</span><span>价格</span><span>数量</span></div>
        {this.state.data.length <= 0? <NoData />: this.state.data.map((item: any) => 
          <div className="table-body col-4">
            <span>{this.timeFormate(item.createTime)}</span><span>{direction(item.tradeDirection)}</span><span>{currencyFormate(item.billPrice)}</span><span>{currencyFormate(item.billAmount)}</span>
          </div>
        )}
      </div>
    )
  }
}