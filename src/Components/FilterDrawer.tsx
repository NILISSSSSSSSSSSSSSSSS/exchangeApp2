import React, { Component } from 'react';
import { Drawer, Tag, Button} from 'antd-mobile';

interface Props {
  open: boolean
  closeFilter: Function
  filterObj: any
  getChildParam: Function
  sidebarData: any
}

interface State {
  filterObj: any
}

export default class FilterDrawer extends Component<Props, State> {
  constructor(props: object) {
    super(props as Props)
    console.log(this.props.filterObj)
    this.state = {
      filterObj: {...this.props.filterObj}
    }
  }
  onOpenChange = () => {
    this.props.closeFilter()
  }
  selectOver () {
    this.props.getChildParam(this.state.filterObj)
    this.props.closeFilter()
  }
  render() {
    const selectTag = (key: any, value: any) => {
      this.setState({
        filterObj: {
          ...this.state.filterObj,
          [key]: value
        }
      })
    }
    // fix in codepen
    const sidebar = (
      <div className="draw-sidebar-container">
        {
          this.props.sidebarData.map((item: any, index: any) => {
            return (
              <div key={index}>
                <h3 key={index} style={{fontSize: 18, marginBottom: 15, marginTop: 25}}>{item.title}</h3>
                {item.children.map((child: any, childIndex: any) => {
                  return (
                    <Tag style={{margin: 5}} key={childIndex} onChange={() => selectTag(item.field, child.value)} selected={this.state.filterObj[item.field] === child.value}>{child.label}</Tag>
                  )
                })}
                <div style={{position: 'fixed', bottom: 180, display: 'flex'}}>
                  <Button type="ghost" size="small" style={{marginRight: 20}}>重置</Button>
                  <Button type="primary" size="small" onClick={() => this.selectOver()}>筛选</Button>
                </div>
              </div>
            )
          })
        }
      </div>
    );
    return (<div>
      <Drawer
        className="filter-drawer"
        position="right"
        style={{ minHeight: document.documentElement.clientHeight }}
        enableDragHandle={false}
        contentStyle={{ color: '#A6A6A6', textAlign: 'center', paddingTop: 42 }}
        sidebar={sidebar}
        open={this.props.open}
        onOpenChange={this.onOpenChange}
      >&nbsp;
      </Drawer>
    </div>);
  }
}