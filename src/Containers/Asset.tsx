import React, {Component} from 'react';
import Footer from '../Components/Footer'
import Header from '../Components/Header'
import { _state } from '../Constants/stateType'
import { connect } from 'react-redux'
import { getCurrencyPriceAll } from '../Apis/common'
import { accountList } from '../Apis/account'
import { Button } from 'antd-mobile'

interface Props {
  history: any
  siteInfo: any
}
interface State {
  list: any
  quotations: any
  countAll: number
}
class Asset extends Component<Props, State> {
  constructor (props: any) {
    super(props as Props)
    this.state = {
      list: [],
      quotations: [],
      countAll: 0
    }
  }
  componentDidMount () {
    this._accountList()
  }
  async _accountList () {
    let res = await accountList()
    if (res.success) {
      this.setState({
        list: res.data
      })
      let currencyList: any = []
      res.data.forEach((item: any) => {
        currencyList.push(item.currency)
      })
      this._getCurrencyPriceAll(currencyList)
    }
  }
  async _getCurrencyPriceAll (currencyList: any) {
    let res = await getCurrencyPriceAll(currencyList)
    if (res.success) {
      this.setState({
        quotations: res.data.list
      })
      this.toFiat()
    }
  }
  //  数字上W转
  toWan (n: number | string) {
    if (n === null || n === undefined) {
      return '--'
    }
    n = Number(n)
    if (n / 10000 > 1) {
      let fixed = (n / 10000).toFixed(2)
      // if (fixed.toString().split('.')[1] === '00') {
      //   str = fixed.toString().split('.')[0]
      // } else {
      //   str = fixed
      // }
      return parseFloat(fixed) + '万'
    } else {
      let fixed = n.toFixed(2)
      // let str = ''
      // if (fixed.toString().split('.')[1] === '00') {
      //   str = fixed.toString().split('.')[0]
      // } else {
      //   str = fixed
      // }
      return parseFloat(fixed)
    }
  }
  toFiat () {
    let list = JSON.parse(JSON.stringify(this.state.list))
    let countAll: any = 0
    console.log(list)
    console.log(this.state.quotations)
    list.forEach((currency: any, index: number) => {
      this.state.quotations.forEach((quotation: any) => {
        if (currency.currency === quotation.currencyId) {
          quotation.quotations.forEach((price: any) => {
            if (price.name === 'average') {
              console.log('aaa', this.props.siteInfo)
              this.props.siteInfo.rateList && this.props.siteInfo.rateList.forEach((fiat: any) => {
                console.log('bbb', fiat)
                if (fiat.legalCurrencyType === 'CNY') {
                  list[index].fiat = Number(currency.availableBalance) * Number(price.usdValue) / Number(fiat.usdValue)
                  countAll += Number(currency.availableBalance) * Number(price.usdValue) / Number(fiat.usdValue)
                }
              })
            }
          })
        }
      })
    })
    console.log(list)
    this.setState({
      list,
      countAll
    })
  }
  render () {
    return (
      <div className="asset-page">
        <Header title="资产"/>
        <div className="app-container" style={{paddingBottom: 50}}>
          <div className="count-all">
            <div>总资产折合</div>
            <div style={{marginTop: 10}}><span style={{fontSize: 18}}>{this.state.countAll !== undefined? this.toWan(this.state.countAll): 0} </span><span>CNY</span></div>
          </div>
          <div className="list">
          {this.state.list.map((item: any) =>
            <div key={item.currency}>
              <div  style={{padding: 10}}>
                <div className="font-primary" style={{fontSize: 16, marginBottom: 10}}>{item.currency}</div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <div>
                    <div className="font-explain" style={{marginBottom: 5}}>可用</div><div>{item.availableBalance}</div>
                  </div>
                  <div>
                    <div className="font-explain" style={{marginBottom: 5}}>冻结</div><div>{item.freeze}</div>
                  </div>
                  <div>
                    <div className="font-explain" style={{marginBottom: 5}}>折合(CNY)</div><div>{item.fiat !== undefined? this.toWan(item.fiat): 0}</div>
                  </div>
                </div>
                <div className="btns">
                {
                    item.setting.allowRecharge?
                    <Button type="primary" onClick={() => this.props.history.push({pathname: '/Deposits', query: {currencyId: item.currency}})}>充值</Button>:null
                  }
                  {
                    item.setting.allowWithdraw?
                    <Button type="warning" onClick={() => this.props.history.push({pathname: '/WithDraw', query: {currencyId: item.currency}})}>提币</Button>:null
                  }
                  
                </div>
              </div>
              <div className="separator"></div>
            </div>
          )}
          </div>
        </div>
        <Footer {...this.props} />
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

export default connect(mapStateToProps, {})(Asset as React.ComponentType)