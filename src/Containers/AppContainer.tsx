import React, {Component} from 'react'
import Routers from '../Router'
import { connect } from 'react-redux'
import {getSiteInfo} from '../Apis/common'
import { legalList, currencyList, getAllLegalCurrency } from '../Apis/configure'
import { exchangeRateAll } from '../Apis/information'
import { getbbPairs } from '../Apis/bbtrade'
import { getCurrencyPriceAll } from '../Apis/common'
import { _state, _siteInfo } from '../Constants/stateType'
import { Dispatch } from 'redux'
import { setSiteInfo } from '../Reducers/SiteInfo'
import { showLoginHandle } from '../Reducers/System'
import { Modal } from 'antd-mobile'
import Login from '../Components/User/Login'
import Register from '../Components/User/Register'
import Reset from '../Components/User/Reset'


interface Props {
  setSiteInfo: Function
  showLogin: boolean
  showLoginHandle: Function
}
interface State {
  page: string
}
class AppContainer extends Component<Props, State> {
  constructor(props: object) {
    super(props as Props)
    this.state = {
      page: 'login'
    }
  }
  componentDidMount () {
    document.addEventListener("deviceready", this.onDeviceReady, false);
    console.log(process.env)
    localStorage.lang = 'zh-CN'
    this._getSiteInfo()
  }
  onDeviceReady () {
    //  开始检查是否需要更新并进行热更新流程
    
  }
  closeModal () {
    this.props.showLoginHandle(false)
  }
  reset () {
    this.setState({ page: 'login' })
  }
  async _getSiteInfo () {
    let res = await getSiteInfo()
    let res2 = await legalList()
    let res3 = await currencyList()
    let res4 = await getAllLegalCurrency()
    let res5 = await exchangeRateAll({symbols: res2.data})
    let res6 = await getbbPairs()
    console.log(res2.data)
    if (res.success) {
      let data = Object.assign({}, res.data, {legalList: res2.data, currencyList: res3.data, payWays: res4.data.payWays, rateList: res5.data.list, pairs: res6.data})
      this.props.setSiteInfo(data)
    }
  }
  setPageHandle (page: string) {
    this.setState({
      page
    })
  }
  render () {
    return (
      <div>
        <Routers />
        <Modal
          className="full-modal user-modal"
          visible={this.props.showLogin}
          transparent
          maskClosable={false}
          afterClose={() => this.reset()}
        >
          <div onClick={() => this.closeModal()} style={{textAlign: 'left', marginBottom: 60}}>取消</div>
          {
            this.state.page === 'login'? <Login closeModal={() => this.closeModal()} setPageHandle={this.setPageHandle.bind(this)}/>:
            (this.state.page === 'register'? <Register closeModal={() => this.closeModal()} setPageHandle={this.setPageHandle.bind(this)}/>:
            <Reset closeModal={() => this.closeModal()} setPageHandle={this.setPageHandle.bind(this)}/>)
          }
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state: _state) => {
  return {
    siteInfo: state.siteInfo,
    showLogin: state.system.showLogin
  }
}
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setSiteInfo: (data: _siteInfo) => dispatch(setSiteInfo(data)),
    showLoginHandle: (data: any) => dispatch(showLoginHandle(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer as React.ComponentType)