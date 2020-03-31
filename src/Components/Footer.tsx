import React, {Component} from 'react';
import { TabBar } from 'antd-mobile';
import { createHashHistory } from 'history';
const history = createHashHistory();

interface Props {
  siteInfo: any
}

interface State {
  hidden: boolean
  fullScreen: boolean
}

export default class Footer extends Component<Props, State> {
  constructor(props: object) {
    super(props as Props);
    this.state = {
      hidden: false,
      fullScreen: false,
    };
  }
  componentDidMount() {
    console.log(this.props.siteInfo)
  }
  directUrl (url: string) {
    console.log(this.props.siteInfo)
    history.push(url)
  }
  render() {
    const hasFiatTrade = () => {
      let flag = false
      this.props.siteInfo.menu && this.props.siteInfo.menu.nav.forEach((item: any) => {
        if (item.link.indexOf('/c2c-trade') > -1 || item.link.indexOf('/otc') > -1) {
          flag = true
        }
      })
      return flag
    }
    return (
      <div style={{ position: 'fixed', width: '100%', bottom: 0 }}>
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
          hidden={this.state.hidden}
        >
          <TabBar.Item
            title="首页"
            key="index"
            icon={<i className="iconfont icon01"></i>}
            selectedIcon={<i className="iconfont icon01 iconfont-selected"></i>}
            selected={history.location.pathname === '/'}
            onPress={() => this.directUrl('/')}
            data-seed="logId"
          >
          </TabBar.Item>
          {hasFiatTrade() &&
          <TabBar.Item
            icon={<i className="iconfont iconhuobiyuxiaofei"></i>}
            selectedIcon={<i className="iconfont iconhuobiyuxiaofei iconfont-selected"></i>}
            selected={history.location.pathname === '/FiatTrade'}
            title="法币交易"
            key="FiatTrade"
            onPress={() => this.directUrl('/FiatTrade')}
            data-seed="logId1"
          >
          </TabBar.Item>}
          <TabBar.Item
            icon={<i className="iconfont iconBTC"></i>}
            selectedIcon={<i className="iconfont iconBTC iconfont-selected"></i>}
            selected={history.location.pathname === '/BBList'}
            title="币币交易"
            key="BBList"
            onPress={() => this.directUrl('/BBList')}
          >
          </TabBar.Item>
          <TabBar.Item
            icon={<i className="iconfont iconqianbao"></i>}
            selectedIcon={<i className="iconfont iconqianbao iconfont-selected"></i>}
            selected={history.location.pathname === '/Asset'}
            title="资产"
            key="Asset"
            onPress={() => this.directUrl('/Asset')}
          >
          </TabBar.Item>
        </TabBar>
      </div>
    );
  }
}
