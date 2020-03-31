
import React, {Component} from 'react'
import { Carousel, Icon } from 'antd-mobile'
import { getArticlesByTag } from '../Apis/help-center'
import { request } from '../Constants/Config'

interface Props {
  siteInfo: any
}
interface State {
  noticeList: any
}

export default class NoticeCarousel extends Component<Props, State> {
  constructor(props: object) {
    super(props as Props)
    this.state = {
      noticeList: []
    }
  }
  private isFirst: boolean = true
  componentWillReceiveProps (nextProps: any) {
    if (nextProps.siteInfo && nextProps.siteInfo.parts && nextProps.siteInfo.parts.announcement) {
      if (this.isFirst) {
        this.isFirst = false
        this._getArticlesBytag(nextProps.siteInfo.parts.announcement)
      }
    }
  }
  componentWillUnmount () {
  }
  async _getArticlesBytag (id: string) {
    let res = await getArticlesByTag(id)
    if (res.success) {
      this.setState({
        noticeList: res.data.list
      })
    }
  }
  getTitle (item: any) {
    if (JSON.stringify(item) === '{}') {
      return ''
    }
    console.log(item)
    let resItem = item.title.find((titleItem: any) => titleItem.lang = 'zh-CN')
    if (resItem) {
      return resItem.str
    }
    return ''
  }
  openBrowser (id: string) {
    let webUrl = request[process.env.REACT_APP_ENV || 'test'].webUrl
    window.location.href = `${webUrl}/help-center/${id}`
  }
  render () {
    return (
      <div className="notice-carousel" style={{marginTop: 10}}>
      {this.state.noticeList && this.state.noticeList.length > 0?
        <Carousel
          vertical
          dots={false}
          autoplay={true}
          infinite
        >
          {this.state.noticeList.map((item: any) => (
            <div onClick={() => this.openBrowser(item._id)} key={item._id} style={{backgroundColor: '#fefcec', color: '#f76a24', height: 30, display: 'flex', alignItems: 'center', paddingLeft: 20}}>
            <Icon type="voice" size="xxs"/>
            <span style={{marginLeft: '5px'}}>{this.getTitle(item)}</span>
            </div>
          ))}
        </Carousel>
      :null}
      </div>
    )
  }
}