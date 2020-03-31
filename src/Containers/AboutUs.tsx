import React, {Component} from 'react'
import Header from '../Components/Header'
import { Icon, List } from 'antd-mobile'
import { version } from '../Constants/Config'

const Item = List.Item

interface Props {
  history: any
}
interface State {}

export default class AboutUs extends Component<Props, State> {
  constructor(props: object) {
    super(props as Props)
  }
  render () {
    return (
      <div className="about-us">
        <Header title="关于我们" icon={<Icon type="left" onClick={() => this.props.history.goBack()} />}/>
        <div className="app-container">
          <List>
            <Item extra={version}>版本</Item>
          </List>
        </div>
      </div>
    )
  }
}
