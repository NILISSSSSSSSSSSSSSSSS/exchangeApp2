import React, {Component} from 'react'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import {Tabs} from 'antd-mobile'
import { _state } from '../Constants/stateType'
import { connect } from 'react-redux'
import OTCAdList from '../Components/FiatTrade/OTCAdList'
import C2CTrade from '../Components/FiatTrade/C2CTrade'
import FilterDrawer from '../Components/FilterDrawer'

interface State {
  isC2C: boolean
  tradeType: string
  currencyId: string
  legalCurrency: string
  filterDrawerOpen: boolean
  payWay: string
}

interface Props {
  history: any
  siteInfo: any
}

class FiatTrade extends Component<Props, State> {
  constructor(props: object) {
    super(props as Props)
    this.state = {
      isC2C: false,
      tradeType: 'sell',
      currencyId: '',
      legalCurrency: '',
      payWay: '',
      filterDrawerOpen: false
    }
  }
  componentDidMount() {
  }
  goOrderRecord () {
    this.props.history.push({pathname: '/FiatOrderRecord', query: {isC2C: this.state.isC2C}})
  }
  renderC2CSwitch() {
    let _this = this
    let hasC2cModule = false
    this.props.siteInfo.menu && this.props.siteInfo.menu.nav.forEach((item: any) => {
      if (item.link === '/c2c') {
        hasC2cModule = true
      }
    })
    if (!hasC2cModule) {
      return null
    }
    function C2CSwitch (val: boolean) {
      _this.setState({ isC2C: val })
    }
    return (
      <div className="header-right">
        <span className={this.state.isC2C? "selected": ""} onClick={() => C2CSwitch(true)}>快捷区</span>
        <span className={this.state.isC2C? "": "selected"} onClick={() => C2CSwitch(false)}>自选区</span>
      </div>
    )
  }
  setTrade (tradeType: string) {
    this.setState({
      tradeType
    })
  }
  renderContent () {
    return 
  }
  setTabs (currencyList: Array<string>) {
    let res:any = []
    currencyList.forEach(item => {
      res.push({title: item})
    })
    return res
  }
  tabChange (tab: any, index: number) {
    if (tab.title === this.state.currencyId) {
      return
    }
    this.setState({
      currencyId: tab.title
    })
  }
  controlFilter (val: boolean) {
    console.log(val)
    this.setState({
      filterDrawerOpen: val
    })
  }
  getChildParam (obj: any) {
    this.setState({
      legalCurrency: obj.legalCurrency,
      payWay: obj.payWay
    })
  }
  render () {
    let legalSidebarChildren: any = []
    let paywaySidebarChildren: any = []
    const getSidebarData = () => {
      this.props.siteInfo.legalList && this.props.siteInfo.legalList.forEach((item: string) => {
        legalSidebarChildren.push({label: item, value: item})
      })
      this.props.siteInfo.payWays && this.props.siteInfo.payWays.forEach((item: any) => {
        paywaySidebarChildren.push({label: item.id, value: item.id})
      })
    }
    getSidebarData()
    const sidebarData_otc = [
      {
        title: '法币',
        field: 'legalCurrency',
        children: legalSidebarChildren
      }
    ]
    const sidebarData_c2c = [
      {
        title: '法币',
        field: 'legalCurrency',
        children: legalSidebarChildren
      },
      {
        title: '付款方式',
        field: 'payWay',
        children: paywaySidebarChildren
      }
    ]
    return (
      <div className="app-fiatTrade">
        <Header 
          title="法币交易"
          rightContent={this.renderC2CSwitch()}
        />
        <div className="app-container">
            <div className="buysell-header">
              <div className="left">
                <div className={this.state.tradeType === 'sell'? 'selected': ''} onClick={() => this.setTrade('sell')}>我要买</div>
                <div className={this.state.tradeType === 'buy'? 'selected': ''} onClick={() => this.setTrade('buy')}>我要卖</div>
              </div>
              <div className="right">
                <div className="filter" onClick={() => this.controlFilter(true)}>
                  <i className="iconfont iconfilter"></i>
                  <span>筛选</span>
                </div>
                <div className="order" onClick={() => this.goOrderRecord()}>
                  <i className="iconfont iconi-order"></i>
                  <span>订单</span>
                </div>
              </div>
            </div>
            <div className="tabs-container">
            <Tabs 
              tabs={this.props.siteInfo.currencyList && this.setTabs(this.props.siteInfo.currencyList)} 
              renderTabBar={props => <Tabs.DefaultTabBar 
              {...props} 
              page={6} 
              onTabClick={this.tabChange.bind(this)}
            />}>
              {this.state.isC2C
              ?<C2CTrade {...this.props} payWay={this.state.payWay || (this.props.siteInfo.payWays && this.props.siteInfo.payWays[0].id)} currencyId={this.state.currencyId || (this.props.siteInfo.currencyList && this.props.siteInfo.currencyList[0])} legalCurrency={this.state.legalCurrency || (this.props.siteInfo.legalList && this.props.siteInfo.legalList[0])} tradeType={this.state.tradeType}/>
              :<OTCAdList {...this.props} currencyId={this.state.currencyId || (this.props.siteInfo.currencyList && this.props.siteInfo.currencyList[0])} legalCurrency={this.state.legalCurrency || (this.props.siteInfo.legalList && this.props.siteInfo.legalList[0])} tradeType={this.state.tradeType}/>}
            </Tabs>
            {
              this.state.isC2C
              ?<FilterDrawer key={1} sidebarData={sidebarData_c2c} filterObj={{legalCurrency: this.state.legalCurrency || (this.props.siteInfo.legalList && this.props.siteInfo.legalList[0]), payWay: this.state.payWay || (this.props.siteInfo.payWays && this.props.siteInfo.payWays[0].id)}} open={this.state.filterDrawerOpen} getChildParam={this.getChildParam.bind(this)} closeFilter={() => this.controlFilter(false)}/>
              :<FilterDrawer key={2} sidebarData={sidebarData_otc} filterObj={{legalCurrency: this.state.legalCurrency || (this.props.siteInfo.legalList && this.props.siteInfo.legalList[0])}} open={this.state.filterDrawerOpen} getChildParam={this.getChildParam.bind(this)} closeFilter={() => this.controlFilter(false)}/>
            }
            {/* <FilterDrawer sidebarData={sidebarData} filterObj={{legalCurrency: this.state.legalCurrency}} open={this.state.filterDrawerOpen} getChildParam={this.getChildParam.bind(this)} closeFilter={() => this.controlFilter(false)}/> */}
            </div>
        </div>
        
        <Footer {...this.props}/>

        
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

export default connect(mapStateToProps, {})(FiatTrade as React.ComponentType)