import React, {Component} from 'react';
import { ListView, PullToRefresh, Button, InputItem, WingBlank, Toast, Modal } from 'antd-mobile';
import { adListOTC } from '../../Apis/adver'
import { otcBuyIn } from '../../Apis/otc'
import { imgHost } from '../../Constants/Config'
import {fiatFormate, currencyFormate, fiatSymbol} from '../../Tools/function'

interface Props {
  history: any
  currencyId: string
  legalCurrency: string
  tradeType: string
}

interface State {
  tradeCurrencyAmount: string
  isLoading: boolean
  dataSource: any
  dataArray: []
  page: number
  refreshing: boolean
  rowData: any
  showPoup: boolean
}

export default class OTCAdList extends Component<Props, State> {
    constructor(props: object) {
      super(props as Props)
      const dataSource = new ListView.DataSource({
        rowHasChanged: (row1: any, row2: any) => row1 !== row2
      });
      this.state = {
        tradeCurrencyAmount: '',
        isLoading: false,
        dataSource,
        dataArray: [],
        page: 0,
        refreshing: false,
        rowData: null,
        showPoup: false
      }
    }
    private lv: any
    componentWillUpdate(nextProps: any) {
      if (nextProps.tradeType !== this.props.tradeType || nextProps.currencyId !== this.props.currencyId || nextProps.legalCurrency !== this.props.legalCurrency) {
        this.setState({page: 0})
        this._getData({tradeType: nextProps.tradeType, currencyId: nextProps.currencyId, legalCurrency: nextProps.legalCurrency})
      }
    }
    componentDidMount() {
      this._getData({})
    }
    changeTradeCurrencyAmount (tradeCurrencyAmount: any) {
      this.setState({
        tradeCurrencyAmount
      })
    }
    async _otcBuyIn (adId: string) {
      let tradeCurrencyAmount = Number(this.state.tradeCurrencyAmount)
      if (isNaN(tradeCurrencyAmount) || tradeCurrencyAmount <= 0) {
        Toast.info('交易数量必须为正数')
        return
      }
      let postData = {
        adId,
        tradeCurrencyAmount: tradeCurrencyAmount.toString()
      }
      let res = await otcBuyIn(postData)
      if (res.success) {
        let id = res.data.id
        this.props.history.push({pathname: '/FiatOrderDetail', query: {id}})
      }

    }
    async _getData (obj: any) {
      this.setState({isLoading: true})
      obj = {...this.props, ...obj, limit: 20}
      if (obj.page === undefined) {
        obj.page = 0
      }
      let res = await adListOTC(obj)
      this.setState({isLoading: false})
      let dataArray: any = []
      if (res.success) {
        if (obj.page === 0) {
          dataArray = res.data.list
        } else {
          dataArray = this.state.dataArray.concat(res.data.list)
        }
        this.setState({
          dataArray,
          dataSource: this.state.dataSource.cloneWithRows(dataArray),
          page: obj.page + 1
        })
      }
    }
    closePoup () {
      this.setState({
        showPoup: false
      })
    }
    _createOrder (rowData: any) {
      this.setState({
        rowData,
        showPoup: true
      })
    }
    onEndReached () {
      this._getData({page: this.state.page})
    }
    onRefresh () {
      this._getData({})
    }
    renderRow (rowData:any, sectionID:any, rowID:any) {
      return(
        <div className="list-row" key={`${sectionID}-${rowID}`}>
          <div className="line">
            <div className="left" style={{display: 'flex', alignItems: 'center'}}>
              <img className="avatar" src={`${imgHost}${rowData.avatar}`} alt=""/>
              <h3 style={{fontSize: 18, marginLeft: 5}}>{rowData.nickName}</h3>
            </div>
            <div className="right"></div>
          </div>
          <div className="line">
            <div className="left font-explain">
              <span style={{marginRight: 5}}>数量</span>
              <span>{currencyFormate(rowData.count)}</span>
            </div>
            <div className="right font-explain">
              <span>单价</span>
            </div>
          </div>
          <div className="line">
            <div className="left font-explain">
              <span style={{marginRight: 5}}>限量({this.props.currencyId})</span>
              <span>{currencyFormate(rowData.countMinLimit)} - {currencyFormate(rowData.countMaxLimit)}</span>
            </div>
            <div className="right">
              <span style={{fontSize: 20}} className="font-primary">{fiatSymbol(this.props.legalCurrency)}{fiatFormate(rowData.unitPrice)}</span>
            </div>
          </div>
          <div className="line">
            <div className="left">
              {rowData.payWay.map((item: string) => (
                <img key={item} width='30' height='30' src={(`/img/${item}.png`)} alt="" />
              ))}
              
            </div>
            <div className="right">
              {
                this.props.tradeType === 'sell'?
                <Button className="btn btn-buy" type="primary" size="small" onClick={() => this._createOrder(rowData)}>购买</Button>:
                <Button className="btn btn-sell" type="primary" size="small">出售</Button>
              }
            </div>
          </div>
        </div>
      )
    }
    render () {
      const separator = (sectionID: any, rowID: any) => (
        <div className="separator" key={`${sectionID}-${rowID}`}></div>
      )
      return (
        <div style={{height: document.documentElement.clientHeight - 201}}>
          <ListView
            dataSource={this.state.dataSource}
            renderFooter={() => (<div style={{ textAlign: 'center' }}>
            {this.state.isLoading ? '加载中…' : '已加载全部'}
            </div>
            )}
            renderSeparator={separator}
            renderRow={this.renderRow.bind(this)}
            style={{
            height: '100%',
            overflow: 'auto',
            }}
            pullToRefresh={
              <PullToRefresh
              getScrollContainer={() => undefined}
              distanceToRefresh={25}
              damping={60}
              direction={'down'}
              refreshing={this.state.refreshing}
              indicator={{deactivate: ''}}
              onRefresh={this.onRefresh.bind(this)}
              />
            }
            scrollRenderAheadDistance={500}
            onEndReached={() => this.onEndReached()}
            onEndReachedThreshold={10}
          />
          {this.state.showPoup?
          <Modal
            visible={this.state.showPoup}
            onClose={() => this.closePoup()}
            animationType="slide-up"
            popup
          >
            <div className="dialog-header">购买 {this.props.currencyId}</div>
            <div style={{marginTop: 10, textAlign: 'left'}}>
              <span className="input-label">交易数量</span>
              <WingBlank>
                <InputItem value={this.state.tradeCurrencyAmount} onChange={this.changeTradeCurrencyAmount.bind(this)} extra={this.props.currencyId}/>
                <div className="explain-under-input">限额 {currencyFormate(this.state.rowData.countMinLimit)} - {currencyFormate(this.state.rowData.countMaxLimit)}</div>
              </WingBlank>
            </div>
            <div style={{marginTop: 10}}>
              <WingBlank>
              </WingBlank>
            </div>
            <WingBlank style={{marginTop: 20, marginBottom: 20, display: 'flex', justifyContent: 'center'}}>
              {/* <Button style={{width: 100}} type="ghost">取消</Button> */}
              <Button style={{width: 200}} type="primary" onClick={() => this._otcBuyIn(this.state.rowData.id)}>下单</Button>
            </WingBlank>
          </Modal>:null
          }
          
        </div>
      )
    }
  }
