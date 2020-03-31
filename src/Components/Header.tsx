import { NavBar } from 'antd-mobile';
import React, {Component} from 'react';

interface Props {
  title: string
  icon?: React.ReactElement
  rightContent?: React.ReactElement | null
  mode?: 'dark' | 'light'
}

export default class Header extends Component<Props> {
  constructor (props: object) {
    super(props as Props)
  }
  render () {
    return (
      <div className="app-header">
        <NavBar
          mode={this.props.mode || "dark"}
          icon={this.props.icon}
          rightContent={this.props.rightContent}
        >{this.props.title}</NavBar>
      </div>
    )
  }
}