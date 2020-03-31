import React, { Component } from 'react'
import { login, isExist, getVertifyCode, register } from '../../Apis/default'
import Country from '../../Components/Country'
import { InputItem, Button, Toast } from 'antd-mobile'

interface Props {
  closeModal: Function
  setPageHandle: Function
}

interface State {
  way: 'email' | 'phone'
  registerStep: number
  postData: object
  phone: string
  email: string
  password: string
  txPassword: string
  verifyCode: string
  callingCode: string
  node: any
}
export default class Register extends Component<Props, State> {
  constructor (props: object) {
    super(props as Props)
    this.state = {
      way: 'email',
      registerStep: 0,
      postData: {},
      phone: '',
      email: '',
      password: '',
      txPassword: '',
      verifyCode: '',
      callingCode: '+86',
      node: <span onClick={this.getVerifyCode.bind(this)}>获取验证码</span>
    }
  }
  private interval: any = null
  setWay (way: 'email'|'phone') {
    this.setState({
      way
    })
  }
  setCallingCode (callingCode: string) {
    this.setState({
      callingCode: `+${callingCode}`
    })
  }
  inputEmail (val: string) {
    this.setState({
      email: val
    })
  }
  inputPhone (val: string) {
    this.setState({
      phone: val
    })
  }
  inputPW (val: string) {
    this.setState({
      password: val
    })
  }
  inputTxPw (val: string) {
    this.setState({
      txPassword: val
    })
  }
  inputVerifyCode (val: string) {
    this.setState({
      verifyCode: val
    })
  }
  async isExist (type: 'email' | 'phone') {
    let phoneOrEmail = this.state[type]
    if (type === 'phone') {
      phoneOrEmail = this.state.callingCode + this.state.phone
    }
    let postData = {
      phoneOrEmail
    }
    let res = await isExist(postData)
    if (res.success) {
      if (res.data) {
        Toast.info('账号已存在')
      } else {
        this.setState({
          registerStep: 1,
          postData
        })
      }
    }
  }
  async getVerifyCode () {
    this.interval && clearInterval(this.interval)
    let time = 60
    let node
    this.interval = setInterval(() => {
      if (time <= 0) {
        node = <span onClick={this.getVerifyCode.bind(this)}>获取验证码</span>
      } else {
        node = <span>{time}S后获取</span>
        time--
      }
      this.setState({
        node
      })
    }, 1000)
    let res = await getVertifyCode({...this.state.postData, serviceName: 'signUp'})
    if (res.success) {
      Toast.info('验证码已发送，请查看并填入')
    }
  }
  async registerHandle () {
    let postData = {
      ...this.state.postData,
      stepId: 1,
      password: this.state.password,
      txPassword: this.state.txPassword,
      verifyCode: this.state.verifyCode
    }
    let res = await register(postData)
    if (res.success) {
      Toast.info('注册成功')
      this.reset()
      this.props.setPageHandle('login')
      this.interval && clearInterval(this.interval)
    }
  }
  reset () {
    // 重置
    this.setState({
      way: 'email',
      registerStep: 0,
      postData: {},
      phone: '',
      email: '',
      password: '',
      txPassword: '',
      verifyCode: ''
    })
  }
  componentWillUnmount () {
    this.interval && clearInterval(this.interval)
  }
  render () {
    return (
      this.state.registerStep === 0?
        (<div className="login">
          <h3 style={{textAlign: 'left'}}>注册</h3>
          {this.state.way === 'email'?
            (<div className="email">
              <InputItem value={this.state.email} onChange={this.inputEmail.bind(this)} placeholder="邮箱" />
              <Button type="primary" style={{marginTop: 40}} disabled={!this.state.email} onClick={() => this.isExist('email')}>下一步</Button>
              <div className="link" style={{textAlign: 'left', marginTop: 40}} onClick={() => this.setWay('phone')}>手机号码注册</div>
            </div>):
            (<div className="phone">
            <Country setCallingCode={this.setCallingCode.bind(this)}/>
            <InputItem value={this.state.phone} onChange={this.inputPhone.bind(this)} placeholder="手机号码" />
            <Button type="primary" style={{marginTop: 40}} disabled={!this.state.phone} onClick={() => this.isExist('phone')}>下一步</Button>
            <div className="link" style={{textAlign: 'left', marginTop: 40}} onClick={() => this.setWay('email')}>邮箱注册</div>
          </div>)
          }
          <div className="link" style={{position: 'fixed', bottom: 20, textAlign: 'left'}}>
            <div><span className="font-main">已有账号？</span > <span onClick={() => this.props.setPageHandle('login')}>登录</span></div>
          </div>
        </div>):
        (
          <div className="google">
            <InputItem  value={this.state.password} onChange={this.inputPW.bind(this)} placeholder="密码" type="password" />
            <InputItem  value={this.state.txPassword} onChange={this.inputTxPw.bind(this)} placeholder="资金密码" type="password" />
            <InputItem  value={this.state.verifyCode} onChange={this.inputVerifyCode.bind(this)} placeholder="验证码" extra={this.state.node} type="password" />
            <Button type="primary" style={{marginTop: 40}} disabled={!this.state.password || !this.state.txPassword || !this.state.verifyCode} onClick={() => this.registerHandle()}>注册</Button>
          </div>
        )
    )
  }
}
