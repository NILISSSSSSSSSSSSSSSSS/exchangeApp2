import React, { Component } from 'react'
import { login } from '../../Apis/default'
import Country from '../../Components/Country'
import { InputItem, Button, Toast } from 'antd-mobile'

interface Props {
  closeModal: Function
  setPageHandle: Function
}

interface State {
  way: 'email' | 'phone'
  loginStep: number
  postData: object
  phone: string
  email: string
  password: string
  googleCode: string
  callingCode: string
}
export default class Reset extends Component<Props, State> {
  constructor (props: object) {
    super(props as Props)
    this.state = {
      way: 'email',
      loginStep: 0,
      postData: {},
      phone: '',
      email: '',
      password: '',
      googleCode: '',
      callingCode: '+86'
    }
  }
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
  inputGoogle (val: string) {
    this.setState({
      googleCode: val
    })
  }
  async loginHandle (type: 'email' | 'phone') {
    let phoneOrEmail = this.state[type]
    if (type === 'phone') {
      phoneOrEmail = this.state.callingCode + this.state.phone
    }
    let postData = {
      stepId: 0,
      phoneOrEmail,
      password: this.state.password,
      googleCode: ''
    }
    let res = await login(postData)
    if (res.success) {
      if (res.data.waitForGoogleAuth) {
        this.setState({
          loginStep: 1,
          postData
        })
      } else {
        Toast.info('登录成功')
        localStorage.token = res.data.token
        this.props.closeModal(false)
        this.reset()
      }
    }
  }
  async googleVerifyHandle () {
    let postData = {
      ...this.state.postData,
      stepId: 1,
      googleCode: this.state.googleCode
    }
    let res = await login(postData)
    if (res.success) {
      Toast.info('登录成功')
      localStorage.token = res.data.token
      this.props.closeModal(false)
      this.reset()
    }
  }
  reset () {
    // 重置
    this.setState({
      way: 'email',
      loginStep: 0,
      postData: {},
      phone: '',
      email: '',
      password: '',
      googleCode: '',
    })
  }
  render () {
    return (
      this.state.loginStep === 0?
        (<div className="login">
          <h3 style={{textAlign: 'left'}}>找回密码</h3>
          {this.state.way === 'email'?
            (<div className="email">
              <InputItem value={this.state.email} onChange={this.inputEmail.bind(this)} placeholder="邮箱" />
              <InputItem  value={this.state.password} onChange={this.inputPW.bind(this)} placeholder="密码" type="password" />
              <Button type="primary" style={{marginTop: 40}} disabled={!this.state.email || !this.state.password} onClick={() => this.loginHandle('email')}>登录</Button>
              <div className="link" style={{textAlign: 'left', marginTop: 40}} onClick={() => this.setWay('phone')}>手机号码登录</div>
            </div>):
            (<div className="phone">
            <Country setCallingCode={this.setCallingCode.bind(this)}/>
            <InputItem value={this.state.phone} onChange={this.inputPhone.bind(this)} placeholder="手机号码" />
            <InputItem value={this.state.password} onChange={this.inputPW.bind(this)} placeholder="密码" type="password" />
            <Button type="primary" style={{marginTop: 40}} disabled={!this.state.phone || !this.state.password} onClick={() => this.loginHandle('phone')}>登录</Button>
            <div className="link" style={{textAlign: 'left', marginTop: 40}} onClick={() => this.setWay('email')}>邮箱登录</div>
          </div>)
          }
          <div className="link" style={{position: 'fixed', bottom: 20, textAlign: 'left'}}>
          <div><span className="font-main">已有账号？</span > <span onClick={() => this.props.setPageHandle('login')}>登录</span></div>
          </div>
        </div>):
        (
          <div className="google">
            <InputItem  value={this.state.googleCode} onChange={this.inputGoogle.bind(this)} placeholder="谷歌验证码" type="password" />
            <Button type="primary" style={{marginTop: 40}} disabled={!this.state.googleCode} onClick={() => this.googleVerifyHandle()}>确认</Button>
          </div>
        )
    )
  }
}
