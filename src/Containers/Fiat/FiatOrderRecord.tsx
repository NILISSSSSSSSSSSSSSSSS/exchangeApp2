import React, {Component} from 'react'
import { ListView, PullToRefresh, Icon, WingBlank, Flex } from 'antd-mobile'
import Header from '../../Components/Header'
import FilterDrawer from '../../Components/FilterDrawer'
import {fiatFormate, currencyFormate, orderStatusFilter, formatDate, direction} from '../../Tools/function'
import { otcHistory } from '../../Apis/otc'
import { imgHost } from '../../Constants/Config'
import { tradeType, orderStatus } from '../../Constants/Enum'

interface Props {
  history: any
}
interface State {
  openDrawer: boolean
  isLoading: boolean
  dataSource: any
  dataArray: any
  postObj: any
  page: number
  refreshing: boolean
}

export default class FiatOrderRecord extends Component<Props, State> {
  constructor(props: any) {
    super(props as Props)
    
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1: any, row2: any) => row1 !== row2
    });
    this.state = {
      openDrawer: false,
      isLoading: false,
      dataSource,
      dataArray: [],
      postObj: {
        isC2C: (props.location.query && props.location.query.isC2C) || false,
        tradeType: undefined,
        orderStatus: undefined
      },
      page: 0,
      refreshing: false
    }
  }
  componentDidMount () {
    this._getData({})
  }
  async _getData (obj: any) {
    this.setState({isLoading: true})
    obj = {...this.state.postObj, ...obj, limit: 20}
    if (obj.page === undefined) {
      obj.page = 0
    }
    let res = await otcHistory(obj)
    this.setState({isLoading: false})
    let dataArray: any = []
    if (res.success) {
      if (obj.page === 0) {
        dataArray = res.data.datas
      } else {
        dataArray = this.state.dataArray.concat(res.data.datas)
      }
      this.setState({
        dataArray,
        dataSource: this.state.dataSource.cloneWithRows(dataArray),
        page: obj.page + 1
      })
    }
  }
  controlFilter (val: boolean) {
    console.log(val)
    this.setState({
      openDrawer: val
    })
  }
  getChildParam (obj: any) {
    this.setState({
      postObj: obj
    }, () => {
      console.log(this.state.postObj)
      this._getData({})
    })
  }
  onEndReached () {
    this._getData({page: this.state.page})
  }
  onRefresh () {
    this._getData({})
  }
  goOrderDetail (id: string) {
    this.props.history.push({pathname: '/FiatOrderDetail', query: {id}})
  }
  renderRow (rowData:any, sectionID:any, rowID:any) {
    return(
      <div className="list-row" key={`${sectionID}-${rowID}`} onClick={() => this.goOrderDetail(rowData.id)}>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: 'center'}}>
          <h4>{direction(rowData.tradeType)} {rowData.currencyId}</h4>
          <div className="font-explain" style={{display: 'flex', alignItems: 'center'}}><span >{orderStatusFilter(rowData.orderStatus)}</span><Icon type="right" /></div>
        </div>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: 'center', marginTop: 15}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
            <span style={{marginBottom: 10}}>时间</span>
            <span>{formatDate(rowData.updateTime)}</span>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
            <span style={{marginBottom: 10}}>数量</span>
            <span>{currencyFormate(rowData.tradeCurrencyAmount)}</span>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
            <span style={{marginBottom: 10}}>交易总额({rowData.legalCurrency})</span>
            <span>{fiatFormate(rowData.legalCurrencyAmount)}</span>
          </div>
        </div>
      </div>
    )
  }
  render () {
    const separator = (sectionID: any, rowID: any) => (
      <div className="separator" key={`${sectionID}-${rowID}`}></div>
    )
    const sidebarData = [
      {
        title: '交易类型',
        field: 'tradeType',
        children: tradeType
      },
      {
        title: '交易状态',
        field: 'orderStatus',
        children: orderStatus
      }
    ]
    return (
      <div className="order-list">
        <Header
          icon={<Icon type='left' onClick={() => this.props.history.push('/')}/>}
          title=""
          rightContent={<i className="iconfont iconfilter" onClick={() => this.controlFilter(true)}></i>}
        />
        
          <div className="app-container">
            <div style={{paddingLeft: 15, paddingRight: 15, marginBottom: 15, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
              <h2>订单记录</h2>
              <div className="link">申诉历史</div>
            </div>
            <div style={{height: document.documentElement.clientHeight - 80}}>
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
            </div>
            <FilterDrawer open={this.state.openDrawer} sidebarData={sidebarData} filterObj={this.state.postObj} getChildParam={this.getChildParam.bind(this)} closeFilter={() => this.controlFilter(false)}/>
          </div>
        
      </div>
    )
  }
}