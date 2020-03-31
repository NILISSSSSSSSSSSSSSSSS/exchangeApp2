import React, {Component} from 'react'
import Header from '../../Components/Header'
import { WingBlank, Button, Icon, Toast } from 'antd-mobile'
import { depositsAddress } from '../../Apis/account'
import QRCode  from 'qrcode.react'
import { CopyToClipboard } from 'react-copy-to-clipboard';

interface Props {
  currencyId: string
  location: any
  history: any
}
interface State {
  data: any
  primaryChain: string
  address: string
}

export default class Deposits extends Component<Props, State> {
  constructor(props: object) {
    super(props as Props)
    this.state = {
      data: [],
      primaryChain: '',
      address: ''
    }
  }
  componentDidMount () {
    let currencyId = this.props.location.query && this.props.location.query.currencyId || 'USDT'
    currencyId && this._depositsAddress(currencyId)
  }
  changeTag (primaryChain: string) {
    if (this.state.primaryChain === primaryChain) {
      return
    }
    this.setState({
      primaryChain
    })
    this.changeAddress(primaryChain)
  }
  changeAddress (primaryChain: string) {
    let res = this.state.data.find((item: any) => item.primaryChain === primaryChain)
    if (res) {
      this.setState({
        address: res.address
      })
    }
  }
  async _depositsAddress (currencyId: string) {
    let res = await depositsAddress(currencyId)
    if (res.success && res.data.length > 0) {
      this.setState({
        data: res.data,
        primaryChain: res.data[0].primaryChain
      })
      this.changeAddress(res.data[0].primaryChain)
    }
  }
  onCopy (text: string, result: any) {
    console.log(text, result)
    if (result && text) {
      Toast.info('复制成功')
    } else {
      Toast.info('复制失败')
    }
  }
  render () {
    return (
      <div className="depos-page">
        <Header title="充值" icon={<Icon type="left" onClick={() => this.props.history.push('/Asset')}/>} rightContent={<span onClick={() => this.props.history.push('/DepositsRecord')}>充值记录</span>}/>
        <WingBlank>
          <div className="app-container">
            {this.state.data.length > 1?
            <div className="primary-chain">
              <div style={{marginBottom: 8}}>链名称</div>
              <div className="tag-list">
                {this.state.data.map((item: any) => (
                  <div className={`tag ${this.state.primaryChain === item.primaryChain && 'selected-tag'}`} key={item.primaryChain} onClick={() => this.changeTag(item.primaryChain)}>{item.primaryChain}</div>
                ))}
              </div>
            </div>
            : null}
            <div className="address-container">
              <QRCode value={this.state.address} />
              <div className="font-explain">充币地址</div>
              <div>{this.state.address}</div>
              <CopyToClipboard text={this.state.address} onCopy={this.onCopy.bind(this)}
               >
                <Button type="primary">复制地址</Button>
              </CopyToClipboard>
            </div>
            <div style={{marginTop: 30}} className="font-explain">请勿向上述地址充值任何非当前币种的资产，否则资产将不可找回</div>
          </div>
        </WingBlank>
      </div>
    )
  }
}