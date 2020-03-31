import React, {Component} from 'react'
import Header from '../Components/Header'
import { Icon, Button, Toast } from 'antd-mobile'
import { getUserInfo } from '../Apis/user'
import QRCode  from 'qrcode.react'
import { CopyToClipboard } from 'react-copy-to-clipboard'


interface Props {
  history: any
}
interface State {
  inviteCode: string
}

export default class Invite extends Component<Props, State> {
  constructor(props: object) {
    super(props as Props)
    this.state = {
      inviteCode: ''
    }
  }
  componentDidMount () {
    this._getUserInfo()
  }
  async _getUserInfo() {
    let res = await getUserInfo()
    if (res.success) {
      this.setState({
        inviteCode: res.data.inviteCode
      })
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
      <div className="about-us">
        <Header 
          title="邀请好友"
          icon={<Icon type="left" onClick={() => this.props.history.push('/')}/>}
          rightContent={<i className=" iconfont iconi-order" onClick={() => this.props.history.push('/InviteRecord')}></i>}
        />
        <div className="app-container">
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <QRCode value={this.state.inviteCode} />
            <div style={{marginTop: 20}}>
              <span style={{fontSize: 16, marginRight: 10}}>{this.state.inviteCode}</span>
              <CopyToClipboard text={this.state.inviteCode} onCopy={this.onCopy.bind(this)}
                >
                <span className="font-primary">复制地址</span>
              </CopyToClipboard>
            </div>
          </div>
          
        </div>
      </div>
    )
  }
}
