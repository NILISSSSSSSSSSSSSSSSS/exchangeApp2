import { Icon, Modal, List, SearchBar } from 'antd-mobile';
import React, {Component} from 'react';
import countryList from '../Constants/CallCode'

const Item = List.Item

interface Props {
  setCallingCode: Function
}
interface State {
  callingCode: string
  showCountrySelect: boolean
  countryList: Array<any>
}

export default class Country extends Component<Props, State> {
  constructor (props: object) {
    super(props as Props)
    this.state = {
      callingCode: '86',
      showCountrySelect: false,
      countryList
    }
  }
  open () {
    this.setState({ showCountrySelect: true })
  }
  close () {
    this.setState({ showCountrySelect: false })
  }
  search (val: string) {
    val = val.toLowerCase()
    // item.name === val || item.callingCode === val
    let list = countryList.filter(item => item.name.toLowerCase().indexOf(val) >= 0 || item.callingCode.indexOf(val) >= 0)
    this.setState({
      countryList: list
    })
  }
  select (callingCode: string) {
    this.props.setCallingCode(callingCode)
    this.setState({ callingCode: callingCode })
    this.close()
  }
  render () {
    return (
      <div className="country-select">
        <div className="outside" onClick={this.open.bind(this)}>
          <span>{this.state.callingCode}</span>
          <Icon type="down" />
        </div>
        <Modal
          className="full-modal country-select-modal"
          visible={this.state.showCountrySelect}
          transparent
          maskClosable={false}
        >
          <div className="search-header">
            <SearchBar placeholder="Search" onChange={this.search.bind(this)} cancelText=" " />
            <span className="link" onClick={() => this.close()}>取消</span>
          </div>
          
          <List>
            {this.state.countryList.map((item: any, index: number) => (
              <Item key={index} extra={item.callingCode} onClick={() => this.select(item.callingCode)}>{item.name}</Item>
            ))}
          </List>
        </Modal>
      </div>
    )
  }
}