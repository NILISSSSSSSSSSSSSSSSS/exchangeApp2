import React, {Component} from 'react';
import Footer from '../Components/Footer'
import { _state } from '../Constants/stateType'
import { connect } from 'react-redux'
import Header from '../Components/Header'
import BBDrawer from '../Components/BBTrade/BBDrawer'
import { Icon } from 'antd-mobile'
import { getPairPrice } from '../Apis/bbtrade'
import BuyOrSell from '../Components/BBTrade/BuyOrSell'
import Price from '../Components/BBTrade/Price'
import Entrust from '../Components/BBTrade/Entrust'
import { formatePairName } from '../Tools/function'

interface Props {
  location: any
  history: any
  siteInfo: any
  system: any
}
interface State {
  pairName: string
  price: string
}
class BBTrade extends Component<Props, State> {
  constructor (props: any) {
    super(props as Props)
    this.state = {
      pairName: '',
      price: ''
    }
  }
  componentDidMount () {
    if (this.props.location.query) {
      let {pairName, price} = this.props.location.query
      this.setState({
        pairName,
        price
      })
      localStorage.lastPair = JSON.stringify({
        pairName,
        price
      })
    } else {
      let {pairName, price} = JSON.parse(localStorage.lastPair)
      this.setState({
        pairName,
        price
      })
    }
    
    
  }
  render () {
    return (
      <div>
        <Header
          icon={<Icon type="left" onClick={() => this.props.history.push('/BBList')}/>}
          title={formatePairName(this.state.pairName)}
          rightContent={<i className="iconfont iconstock-line" onClick={() => this.props.history.push({pathname: '/BBKline', query: {pair: this.state.pairName}})}></i>}
        />
        <div className="app-container" style={{paddingLeft: 20, paddingRight: 20}}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div style={{flex: 0.6, marginRight: 15}}><BuyOrSell pair={this.state.pairName} defaultPrice={this.state.price}/></div>
            <div style={{flex: 0.4}}><Price socket={this.props.system.socket} pair={this.state.pairName} /></div>
          </div>
          <div><Entrust {...this.props} socket={this.props.system.socket} pair={this.state.pairName}/></div>
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

export default connect(mapStateToProps, {})(BBTrade as React.ComponentType)