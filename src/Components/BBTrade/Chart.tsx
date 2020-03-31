import React, { Component } from 'react';
import ReactEcharts from "echarts-for-react";
import { getPairDeepth } from '../../Apis/bbtrade';

interface Props {
  socket: any
  pair: string
}
interface State {
  buy: any
  sell: any
  xData: any
  deepData: any
  deepTypes: any
  curDeep: number
}
export default class Chart extends Component<Props, State> {
  constructor (props: object) {
    super(props as Props)
    this.state = {
      buy: [],
      sell: [],
      xData: [],
      deepData: [],
      deepTypes: [],
      curDeep: 1
    }
  }
  componentWillReceiveProps (nextProps: any) {
  }
  componentDidMount () {
    this.socketOnMsg()
    if (this.props.pair) {
      this._getPairDeepth(this.props.pair)
    }
  }
  async _getPairDeepth (pair: string) {
    let res = await getPairDeepth({pairName: pair})
    if (res.success) {
      let deepTypes:any = []
      if (res.data) {
        res.data.forEach((item: any) => {
          deepTypes.push(item.deepType)
        })
        this.setState({
          deepData: res.data,
          curDeep: deepTypes[0],
          deepTypes
        })
        this.setChartData()
        this.socketEmit()
      }
    }
  }
  socketOnMsg () {
    if (this.props.socket) {
      this.props.socket.on('data', (data: any) => {
        data = JSON.parse(data)
        let type= data.type
        let body = data.body
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
          this.setChartData()
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
  setChartData () {
    if (this.state.deepTypes.length <= 0) {
      return
    }
    let data = this.state.deepData[this.state.deepTypes.length - 1]
    let buy:any = []
    let buyCount = 0
    data.buy.forEach((item: any) => {
      buyCount += Number(item.count)
      buy.unshift(buyCount.toFixed(2))
    })
    let sell:any = []
    let sellCount = 0
    data.sell.reverse().forEach((item: any) => {
      sellCount += Number(item.count)
      sell.push(sellCount.toFixed(2))
    })
    buy = buy.concat(new Array(data.sell.length).fill(''))
    sell = new Array(data.buy.length).fill('').concat(sell)
    let xData = new Array(2)
    this.setState({
      buy,
      sell
    })
  }
  getOption = () => {
    return {
      grid: {
        left: '20',
        right: '10',
        bottom: '2%',
        top: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        splitLine: {
          show: false
        },
        boundaryGap: false,
        axisLine: {
          show: false
        },
        axisLabel: {
          show: false,
          // interval: 3,
          color: '#fff' // '#282C32'
        }
      },
      yAxis: {
        type: 'value',
        position: 'right',
        boundaryGap: true,
        splitLine: {
          show: false
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: '#fff'// '#E4E9ED'
          }
        },
        axisLabel: {
          show: true,
          interval: 3,
          color: '#fff'// '#282C32'
        }
      },
      series: [
        {
          showSymbol: false,
          symbol: 'circle',
          type: 'line',
          areaStyle: {
            color: '#e66653',
            opacity: 0.2
          },
          lineStyle: {
            width: 0
          },
          itemStyle: {
            color: '#e66653',
            bordeWidth: 2,
            shadowColor: '#e66653',
            shadowBlur: 15
          },
          markPoint: {
            symbol: 'circle'
          },
          data: this.state.buy
        },
        {
          showSymbol: false,
          symbol: 'circle',
          type: 'line',
          areaStyle: {
            color: '#fff',
            opacity: 0.2
          },
          lineStyle: {
            width: 0
          },
          itemStyle: {
            color: '#999999', // '#999999',
            bordeWidth: 2,
            shadowColor: 'rgba(0, 0, 0, 0.7)',
            shadowBlur: 15
          },
          markPoint: {
            symbol: 'circle'
          },
          data: this.state.sell
          // data: sell
        }
      ]
    };
  };
  render() {
    return (
      <div className='examples'>
        <div className='parent'>
          <ReactEcharts
            option={this.getOption()}
            style={{height: '350px', width: '100%'}}
            className='react_for_echarts' />
        </div>
      </div>
    );
  }
}