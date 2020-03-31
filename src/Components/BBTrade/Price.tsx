import React, {Component} from 'react'
import { getPairDeepth } from '../../Apis/bbtrade'
import { InputItem, ActionSheet, Icon } from 'antd-mobile'
import { currencyFormate, fiatFormate } from '../../Tools/function'

interface Props {
  socket: any
  pair: string
}
interface State {
  deepData: any
  deepTypes: any
  curDeep: number
}

export default class Price extends Component<Props, State> {
  constructor(props: object) {
    super(props as Props)
    this.state = {
      deepData: [],
      deepTypes: [],
      curDeep: 1,
    }
  }
  componentWillReceiveProps (nextProps: any) {
    if (nextProps.pair) {
      this._getPairDeepth(nextProps.pair)
    }
  }
  componentWillUpdate (nextProps: any, nextState: any) {
  }
  componentDidMount () {
    this.socketOnMsg()
  }
  async _getPairDeepth (pair: string) {
    let res = await getPairDeepth({pairName: pair})
    if (res.success) {
      let deepTypes:any = []
      if (res.data) {
        res.data && res.data.forEach((item: any) => {
          deepTypes.push(item.deepType)
        })
        this.setState({
          deepData: res.data,
          curDeep: deepTypes[0],
          deepTypes
        })
        this.socketEmit()
      }
    }
  }
  socketOnMsg () {
    if (this.props.socket) {
      this.props.socket.on('data', (data: any) => {
        data = JSON.parse(data)
        let type= data.type
        let body = data.body.depths
        if (type === 'SUBSCRIBLE_PAIR_DEEP') {
          let deepTypes:any = []
          body.forEach((item: any) => {
            deepTypes.push(item.deepType)
          })
          this.setState({
            deepData: body,
            curDeep: deepTypes[0],
            deepTypes
          })
        }
      })
    }
  }
  socketEmit () {
    if (this.props.socket) {
      this.props.socket.emit('subcrible', {
        businessName: "SUBSCRIBLE_PAIR_DEEP",
        deepTypes: this.state.deepTypes,
        pairName: this.props.pair
      })
    }
  }
  openSelectDeep () {
    let buttons = JSON.parse(JSON.stringify(this.state.deepTypes))
    buttons.push('取消')
    ActionSheet.showActionSheetWithOptions({
      options: buttons,
      cancelButtonIndex: buttons.length - 1
    }, (btnIndex) => {
      if (btnIndex < buttons.length - 1) {
        this.setState({curDeep: this.state.deepTypes[btnIndex]})
      }
    })
  }
  render () {
    return (
      <div className="bb-price">
        <div className="flex-item"><span>价格</span><span>数量</span></div>
        {this.state.deepData.map((item: any) => {
          if (item.deepType === this.state.curDeep) {
            if (item.sell.length < 5) {
              let add = new Array(5 - item.sell.length).fill({price: '-', count: '-'})
              item.sell = item.sell.concat(add)
            }
            return item.sell.map((item: any, index: number) => {
              if (index < 5) {
                return (<div className="flex-item sell-item" key={index}><span>{fiatFormate(item.price)}</span><span>{currencyFormate(item.count)}</span></div>)
              }
            })
          }
        })}
        <div style={{width: '100%', height: 10}}></div>
        {this.state.deepData.map((item: any) => {
          if (item.deepType === this.state.curDeep) {
            if (item.buy.length < 5) {
              let add = new Array(5 - item.buy.length).fill({price: '-', count: '-'})
              item.buy = item.buy.concat(add)
            }
            return item.buy.map((item: any, index: number) => {
              if (index < 5) {
                return (<div className="flex-item buy-item" key={index}><span>{fiatFormate(item.price)}</span><span>{currencyFormate(item.count)}</span></div>)
              }
            })
          }
        })}
        
        {this.state.deepTypes? <div className="select-deep" onClick={() => this.openSelectDeep()}><span>{`深度 ${this.state.curDeep}`}</span><Icon type="down" /></div>: null}
      </div>
    )
  }
}