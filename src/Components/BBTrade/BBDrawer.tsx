import React, {Component} from 'react'
import { Drawer, Tabs, SearchBar, ListView } from 'antd-mobile'

interface Props {
  pairsList: any
  open: boolean
  closeFilter: Function
  getParam: Function
}
interface State {
}

export default class BBDrawer extends Component<Props, State> {
  constructor(props: object) {
    super(props as Props)
  }
  onOpenChange () {
    this.props.closeFilter()
  }
  getParam (pair: string) {
    this.props.getParam(pair)
    this.props.closeFilter()
  }
  setTabs (list: any) {
    let tabs: any = []
    list.forEach((item: any) => {
      tabs.push({title: item.zone})
    })
    return tabs
  }
  render () {
    const pairsList = this.props.pairsList
    const sidebar = (
      <div>
        <Tabs 
            tabs={pairsList && this.setTabs(pairsList)} 
            renderTabBar={props => <Tabs.DefaultTabBar 
            {...props} 
            page={3} 
            onTabClick={() => {}}
          />}>
            {this.props.pairsList.map((item: any, index:number) => (
              <div className="bb-drawer-tab-pane" key={index}>
                {/* <SearchBar></SearchBar> */}
                <div className="list" style={{height: document.documentElement.clientHeight - 44, overflowY: 'auto'}}>
                  {item.pairs.map((pair: any, index:number) => (
                    <div className="list-row" key={index} onClick={() => this.getParam(pair.name)}>
                      <div>{pair.name}</div>
                      <div>{pair.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Tabs>
      </div>
    )
    return (
      <Drawer
        className="bb-drawer"
        position="left"
        style={{ minHeight: document.documentElement.clientHeight }}
        enableDragHandle={false}
        contentStyle={{ color: '#A6A6A6', textAlign: 'center', paddingTop: 42 }}
        sidebar={sidebar}
        open={this.props.open}
        onOpenChange={this.onOpenChange.bind(this)}
      >&nbsp;
      </Drawer>
    )
  }
}