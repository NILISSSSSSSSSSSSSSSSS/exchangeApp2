import React, {Component} from 'react'
import { ListView, PullToRefresh, Icon, WingBlank, Flex } from 'antd-mobile'
import Header from '../../Components/Header'
import {fiatFormate, currencyFormate, depositsStatus, formatDate} from '../../Tools/function'
import { depositRecords } from '../../Apis/finance/transaction'

interface Props {
  history: any
}
interface State {
  isLoading: boolean
  dataSource: any
  dataArray: any
  postObj: any
  page: number
  refreshing: boolean
}

export default class DepositsRecord extends Component<Props, State> {
  constructor(props: any) {
    super(props as Props)
    
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1: any, row2: any) => row1 !== row2
    });
    this.state = {
      isLoading: false,
      dataSource,
      dataArray: [],
      postObj: {
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
    obj = {...this.state.postObj, ...obj, limit: 30}
    if (obj.page === undefined) {
      obj.page = 0
    }
    let res = await depositRecords(obj)
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
  onEndReached () {
    this._getData({page: this.state.page})
  }
  onRefresh () {
    this._getData({})
  }
  renderRow (rowData:any, sectionID:any, rowID:any) {
    return(
      <div className="custom-table" key={`${sectionID}-${rowID}`} >
          <div className="table-body col-4">
            <span>{formatDate(rowData.createTime)}</span><span>{currencyFormate(rowData.amount)}</span><span>{rowData.currencyName}</span><span>{depositsStatus(rowData.depositsStatus)}</span>
          </div>
      </div>
    )
  }
  render () {
    const separator = (sectionID: any, rowID: any) => (
      <div className="separator" key={`${sectionID}-${rowID}`}></div>
    )
    return (
      <div className="depos-record">
        <Header
          icon={<Icon type='left' onClick={() => this.props.history.push('/Asset')}/>}
          title=""
        />
        
          <div className="app-container">
            <WingBlank><h2 style={{marginBottom: 15}}>充值记录</h2></WingBlank>
            <div style={{height: document.documentElement.clientHeight - 80}}>
            <ListView
              dataSource={this.state.dataSource}
              renderFooter={() => (<div style={{ textAlign: 'center' }}>
              {this.state.isLoading ? '加载中…' : '已加载全部'}
              </div>
              )}
              renderRow={this.renderRow.bind(this)}
              renderHeader={() => <div className="table-header col-4"><span>时间</span><span>数量</span><span>币种</span><span>状态</span></div>}
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
          </div>
        
      </div>
    )
  }
}