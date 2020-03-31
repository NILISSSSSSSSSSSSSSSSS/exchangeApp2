import React, {Component} from 'react'
import { Icon, Tabs } from 'antd-mobile'
import { _state } from '../Constants/stateType'
import { connect } from 'react-redux'
import Header from '../Components/Header'
import NewPrice from '../Components/BBTrade/NewPrice'
import Kline from '../Components/BBTrade/Kline'
import Chart from '../Components/BBTrade/Chart'
import NewDeal from '../Components/BBTrade/NewDeal'
import { formatePairName } from '../Tools/function'

interface Props {
  history: any
  location: any
  system: any
}
interface State {
  pair: string
}

class BBKline extends Component<Props, State> {
  constructor(props: object) {
    super(props as Props)
    this.state = {
      pair: this.props.location.query && this.props.location.query.pair
    }
  }
  render () {
    return (
      <div className="bb-kline-container">
        <Header title={formatePairName(this.state.pair)} icon={<Icon type="left" onClick={() => this.props.history.push('/BBTrade')} />} />
        <div className="app-container">
          <NewPrice pair={this.state.pair} socket={this.props.system.socket}/>
          <Kline pair={this.state.pair} socket={this.props.system.socket}/>
        </div>
        <div style={{marginTop: 10}}>
        <Tabs
          tabs={[{title: '深度'}, {title: '成交'}]}
        >
          <Chart pair={this.state.pair} socket={this.props.system.socket}/>
          <NewDeal pair={this.state.pair} socket={this.props.system.socket}/>
        </Tabs>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: _state) => {
  console.log(state)
  return {
    siteInfo: state.siteInfo,
    system: state.system
  }
}

export default connect(mapStateToProps, {})(BBKline as React.ComponentType)