import React, {Component} from 'react'
import { WingBlank, ListView, PullToRefresh, Icon } from 'antd-mobile'
import { bbEntrustHistory } from '../Apis/bbtrade'
import Header from '../Components/Header'
import { direction, formatDate, currencyFormate, formatePairName } from '../Tools/function';

interface Props {
  location: any
  history: any
}
interface State {
  dataSource: any
  dataArray: any
  isLoading: boolean
  page: number
  refreshing: boolean
}

export default class BBOrders extends Component<Props, State> {
  constructor(props: object) {
    super(props as Props)
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1: any, row2: any) => row1 !== row2
    })
    this.state = {
      dataSource,
      dataArray: [],
      isLoading: false,
      page: 0,
      refreshing: false
    }
  }
  componentDidMount () {
    this._getData({})
  }
  renderRow (rowData:any, sectionID:any, rowID:any) {
    return(
      <div className="list-row" key={`${sectionID}-${rowID}`}>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: 'center'}}>
          <h4>{formatePairName(rowData.pairName)}</h4>
          <div style={{display: 'flex', alignItems: 'center'}}>{direction(rowData.type)}</div>
        </div>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: 'center', marginTop: 15}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
            <span style={{marginBottom: 10}}>时间</span>
            <span>{formatDate(rowData.createTime)}</span>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
            <span style={{marginBottom: 10}}>价格({rowData.pairName.split('_')[1]})</span>
            <span>{currencyFormate(rowData.billPrice)}</span>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
            <span style={{marginBottom: 10}}>数量({rowData.pairName.split('_')[0]})</span>
            <span>{currencyFormate(rowData.billAmount)}</span>
          </div>
        </div>
      </div>
    )
  }
  async _getData (obj: any) {
    this.setState({isLoading: true})
    obj = {...obj, limit: 20}
    if (obj.page === undefined) {
      obj.page = 0
    }
    let res = await bbEntrustHistory(obj)
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
  render () {
    const separator = (sectionID: any, rowID: any) => (
      <div className="separator" key={`${sectionID}-${rowID}`}></div>
    )
    return (
      <div className="bb-orders">
        <Header title="" icon={<Icon type="left" onClick={() => this.props.history.goBack()}/>}/>
        <div className="app-container">
          <WingBlank><h2 style={{marginBottom: 15}}>订单记录</h2></WingBlank>
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
        </div>
      </div>
      
    )
  }
}