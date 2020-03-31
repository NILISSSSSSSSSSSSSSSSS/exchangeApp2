import React, {Component} from 'react'
import Header from '../../Components/Header'
import { Icon, Picker, List, ImagePicker, TextareaItem, Button, Toast } from 'antd-mobile'
import {appealType} from '../../Constants/Enum'
import { orderComplaint } from '../../Apis/c2c-trade'
import { uploadFile } from '../../Apis/common'

interface Props {
  location: any
  history: any
}
interface State {
  orderCode: string
  id: string
  appealType: any
  files: any
  appealMsg: string
  addonPic: any
}

export default class AppealSubmit extends Component<Props, State> {
  constructor(props: object) {
    super(props as Props)
    this.state = {
      orderCode: '',
      id: '',
      appealType: [],
      files: [],
      appealMsg: '',
      addonPic: []
    }
  }
  async onChangeFile (files: any, type: any, index: any) {
    console.log(type)
    if (type === 'add') {
      let imgData = new FormData()
      imgData.append('file', files[files.length - 1].file)
      let res = await uploadFile(imgData)
      if (res.success) {
        let addonPic = this.state.addonPic
        addonPic.push(res.data)
        this.setState({
          addonPic,
          files,
        })
      }
    }
    if (type === 'remove') {
      let addonPic = this.state.addonPic
      addonPic.splice(index, 1)
      console.log(addonPic)
      this.setState({
        addonPic,
        files,
      })
    }
  }
  textAreaChange = (val: any) => {
    this.setState({appealMsg: val})
  }
  async submitHandle () {
    if (this.state.appealType.length === 0) {
      Toast.info('请选择申诉类型')
      return
    }
    if (this.state.appealMsg === '') {
      Toast.info('申诉文字不能为空')
      return
    }
    const formData = {
      addonPic: this.state.addonPic,
      orderId: this.state.id,
      appealType: this.state.appealType[0],
      appealMsg: this.state.appealMsg
    }
    let res = await orderComplaint(formData)
    if (res.success) {
      Toast.info('申诉提交成功')
      this.props.history.push({pathname: '/FiatOrderDetail', query: {id: this.state.id}})
    }
  }
  componentDidMount () {
    this.setState({
      orderCode: this.props.history.query? this.props.history.query.orderCode: '9d4f73e8',
      id: this.props.history.query? this.props.history.query.id: '5dd8ea2c0ae742001128d85b'
    })
  }
  render () {
    return (
      <div className="appeal-submit">
        <Header title="申诉提交" icon={<Icon type="left" onClick={() => this.props.history.push({pathname: '/FiatOrderDetail', query: {id: this.state.id}})} />}/>
        <div className="app-container" style={{paddingLeft: 15, paddingRight: 15}}>
          <p>对订单{this.state.orderCode}发起申诉</p>
          <Picker
            title="申诉类型"
            cols={1}
            data={appealType}
            value={this.state.appealType}
            onOk={(val: any) => this.setState({appealType: val})}
          >
            <List.Item arrow="horizontal">申诉类型</List.Item>
          </Picker>
          <ImagePicker
            files={this.state.files}
            onChange={this.onChangeFile.bind(this)}
            selectable={this.state.files.length < 7}
            multiple={false}
          />
          <TextareaItem
            title="文字描述"
            placeholder="文字描述"
            onChange={this.textAreaChange.bind(this)}
            autoHeight
          />
          <Button style={{marginTop: 20}} type="primary" onClick={() => this.submitHandle()}>提交</Button>
        </div>
      </div>
    )
  }
}