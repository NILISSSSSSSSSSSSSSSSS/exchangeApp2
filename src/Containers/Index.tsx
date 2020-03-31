import React, {Component} from 'react';
import Footer from '../Components/Footer'
import Header from '../Components/Header'
import AppCarousel from '../Components/Carousel'
import { _state } from '../Constants/stateType';
import { connect } from 'react-redux'
import { Carousel, WingBlank, Drawer, Button } from 'antd-mobile'
import { getbbPairs } from '../Apis/bbtrade'
import { getCurrencyPriceAll } from '../Apis/common'
import { getUserInfo } from '../Apis/user'
import { Dispatch } from 'redux'
import { showLoginHandle } from '../Reducers/System'
import { imgHost } from '../Constants/Config'
import NoticeCarousel from '../Components/NoticeCarousel'
interface Props {
  history: any
  siteInfo: any
  showLoginHandle: Function
}
interface State {
  drawIsShow: boolean
  pairs: Array<string>
  userInfo: any
  quotations: [
    {
      currencyId: string
      quotations: [
        {
          name: string
          usdValue: string
          firstUsdValue: string
        }
      ]
    }
  ]
}
class Index extends Component<Props, State> {
  constructor(props: object) {
    super(props as Props)
    this.state = {
      userInfo: {},
      drawIsShow: false,
      pairs: [],
      quotations: [
        {
          currencyId: '',
          quotations: [
            {
              name: '',
              usdValue: '',
              firstUsdValue: ''
            }
          ]
        }
      ]
    }
  }
  componentWillReceiveProps (nextProps: any) {
    console.log(nextProps)
    if (nextProps.siteInfo.pairs) {
      this._getbbPairs(nextProps.siteInfo.pairs)
      sessionStorage.pairsList = JSON.stringify(nextProps.siteInfo.pairs)
      sessionStorage.pairs = nextProps.siteInfo.pairs[0].pairs[0]
    }
  }
  componentDidMount () {
    if (sessionStorage.pairsList) {
      this._getbbPairs(JSON.parse(sessionStorage.pairsList))
    }
    let token = localStorage.token
    if (token) {
      this._getUserInfo()
    }
  }
  async _getUserInfo () {
    let res = await getUserInfo()
    if (res.success) {
      this.setState({
        userInfo: res.data
      })
    }
  }
  _getbbPairs (pairsList: any) {
    let pairs:any = []
    pairsList && pairsList.map((item: {pairs:Array<string>, zone: string}) => {
      if (item.zone === 'USDT') {
        pairs = pairs.concat(item.pairs)
      }
      return pairs
    })
    this.setState({
      pairs
    })
    this._getCurrencyPriceAll(pairs)
  }
  async _getCurrencyPriceAll (pairs: Array<string>) {
    let currencyIds: Array<string> = []
    pairs.map(item => {
      return currencyIds.push(item.split('_')[0])
    })
    let res = await getCurrencyPriceAll(currencyIds)
    if (res.success) {
      this.setState({
        quotations: res.data.list
      })
    }
  }
  renderQuotes () {
    function getAverage (quotations: any) {
      let result = quotations.find((item: any) => item.name === 'average')
      if (result) {
        let usdValue = result.usdValue
        let changeUsdValue = '0'
        if (Number(result.firstUsdValue) !== 0) {
          changeUsdValue = `${((Number(result.usdValue) - Number(result.firstUsdValue)) / Number(result.firstUsdValue) * 100).toFixed(2)}`
        }
        return {usdValue, changeUsdValue}
      }
    }
    for(let i = 0; i < Math.ceil(this.state.quotations.length / 3); i++) {
      return (
        <div key={i} style={{height: 100, display: 'flex', marginTop: 10, backgroundColor: '#fff'}}>
          {this.state.quotations.slice(3*i, 3*i+3).map(item => (
            <div style={{height: 100, width: '33%', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center'}} key={item.currencyId}>
              <h5>{item.currencyId} / USDT</h5>
              <div style={{color: '#00AC8E', marginTop: 10}}>{getAverage(item.quotations) && Number((getAverage(item.quotations) as any).usdValue).toFixed(4)}</div>
              <div style={{color: '#00AC8E', marginTop: 10}}>{getAverage(item.quotations) && Number((getAverage(item.quotations) as any).changeUsdValue)}%</div>
            </div>
          ))}
        </div>
      )
    }
  }
  alert () {
    console.log(123)
  }
  openDrawChange (...args: any) {
    this.setState({
      drawIsShow: false
    })
  }
  openDraw () {
    this.setState({
      drawIsShow: true
    })
  }
  logout () {
    this.setState({
      userInfo: {}
    })
    localStorage.token = ''
  }
  render () {
    let hasC2cModule = false
    let hasOtcModule = false
    this.props.siteInfo.menu && this.props.siteInfo.menu.nav.forEach((item: any) => {
      if (item.link === '/c2c-trade') {
        hasC2cModule = true
      }
    })
    this.props.siteInfo.menu && this.props.siteInfo.menu.nav.forEach((item: any) => {
      if (item.link === '/otc') {
        hasOtcModule = true
      }
    })
    let links: any = [
      {link: '/BBOrders', label: '币币成交单', icon: 'iconfont iconjinbi'},
      {link: '/Invite', label: '邀请好友', icon: 'iconfont iconyaoqingjiangli'},
      {link: '/AboutUs', label: '关于我们', icon: 'iconfont iconiconset0142'}
    ]
    if (hasC2cModule) {
      links.unshift({link: {pathname: '/FiatOrderRecord', query: {isC2C: true}}, label: '快捷订单', icon: 'iconfont iconshandian'})
    }
    if (hasOtcModule) {
      links.unshift({link: {pathname: '/FiatOrderRecord', query: {isC2C: false}}, label: '法币订单', icon: 'iconfont icondingdan'})
    }
    console.log(links)
    const sidebar = (
      <div className="draw-sidebar-container draw-index">
        <div className="person">
          {
            this.state.userInfo.avatar?
            <img width="60" height="60" className="avatar" src={imgHost + this.state.userInfo.avatar} alt=""/>:
            <i className="iconfont iconperson"></i>
          }
          {
            this.state.userInfo.nickname?
            <span style={{marginTop: 15}}>{this.state.userInfo.nickname}</span>:
            <span className="link" onClick={() => this.props.showLoginHandle(true)}>登录</span>
          }
        </div>
        <div className="list" style={{marginTop: 20}}>
          {links.map((item: any) => 
            <div style={{padding: 15, display: 'flex', alignItems: 'center'}} key={item.label} onClick={() => this.props.history.push(item.link)}>
              <i className={`${item.icon} font-explain`} style={{marginRight: 8}}></i>
              <span>{item.label}</span>
            </div>
          )}
        </div>
        {this.state.userInfo.nickname?<Button type="primary" onClick={this.logout.bind(this)} style={{position: 'fixed', bottom: 10, left: 20, width: 200}}>退出</Button>:null}
      </div>
    )
    return (
      <div>
        <Header 
          title="首页"
          icon={<i onClick={this.openDraw.bind(this)} className="iconfont iconperson"></i>}
        />
        <div className="app-container app-index">
          <AppCarousel img={this.props.siteInfo.parts && this.props.siteInfo.parts.carousels['zh-CN']}/>
          <NoticeCarousel siteInfo={this.props.siteInfo}/>
          {this.state.quotations.length > 0?
          <Carousel>
            {this.renderQuotes()}
          </Carousel>: null
          }
          {/* <WingBlank>
            <div className="box" onClick={() => this.alert()}>
              <h2>快捷买币</h2>
              <p className="font-explain" style={{marginTop: 10}}>支持{this.props.siteInfo.currencyList && this.props.siteInfo.currencyList.join('， ')}等</p>
            </div>
          </WingBlank> */}
        </div>
        <Footer {...this.props}/>
        <Drawer
          className="filter-drawer"
          style={{ minHeight: document.documentElement.clientHeight }}
          position="left"
          sidebar={sidebar}
          open={this.state.drawIsShow}
          onOpenChange={this.openDrawChange.bind(this)}
        >&nbsp;</Drawer>
      </div>
    )
  }
}

const mapStateToProps = (state: _state) => {
  console.log(state)
  return {
    siteInfo: state.siteInfo
  }
}
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    showLoginHandle: (data: any) => dispatch(showLoginHandle(data))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Index as React.ComponentType)