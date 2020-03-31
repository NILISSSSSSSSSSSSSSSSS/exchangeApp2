import React, {Component} from 'react';
import Footer from '../Components/Footer'
import { _state } from '../Constants/stateType'
import { connect } from 'react-redux'
import Header from '../Components/Header'
import { Tabs } from 'antd-mobile'
import { getPairPrice } from '../Apis/bbtrade'
import { floatTopercent, currencyFormate, formatePairName } from '../Tools/function'

interface Props {
  history: any
  siteInfo: any
  system: any
}
interface State {
  socketPairs: any
  pairs: string
  pairsList: any
}
class BBList extends Component<Props, State> {
  constructor (props: any) {
    super(props as Props)
    this.state = {
      socketPairs: [],
      pairs: '',
      pairsList: []
    }
  }
  componentWillReceiveProps (nextProps: any) {
    if (nextProps.siteInfo.pairs) {
      this.setState({
        pairsList: nextProps.siteInfo.pairs,
        pairs: nextProps.siteInfo.pairs[0].pairs[0]
      })
      sessionStorage.pairsList = JSON.stringify(nextProps.siteInfo.pairs)
      sessionStorage.pairs = nextProps.siteInfo.pairs[0].pairs[0]
      this._getPairPrice(nextProps.siteInfo.pairs)
    }
  }
  componentWillUnmount () {
    this.props.system.socket.emit('unSubcrible', {
      businessName: "SUBSCRIBLE_PAIR_PRICE",
      pairNames: this.state.socketPairs
    })
  }
  componentDidMount () {
    if (sessionStorage.pairs) {
      this.setState({
        pairs: sessionStorage.pairs
      })
    }
    if (sessionStorage.pairsList) {
      this.setState({
        pairsList: JSON.parse(sessionStorage.pairsList)
      })
      this._getPairPrice(JSON.parse(sessionStorage.pairsList))
    }
    this.socketOnMsg()
  }
  socketOnMsg () {
    if (this.props.system.socket) {
      this.props.system.socket.on('data', (data: any) => {
        data = JSON.parse(data)
        let type= data.type
        let body = data.body
        let pairsList = this.state.pairsList
        console.log(pairsList)
        if (type === 'SUBSCRIBLE_PAIR_PRICE') {
          pairsList.forEach((listItem: any, listIndex: number) => {
            listItem.pairs.forEach((zoneItem: any, zoneIndex: number) => {
              if (zoneItem.name === body.pairName) {
                pairsList[listIndex].pairs[zoneIndex] = {name: zoneItem.name, ...body}
              }
            })
          })
          this.setState({
            pairsList
          })
        }
      })
    }
  }
  socketEmit (list: any) {
    if (this.props.system.socket) {
      this.props.system.socket.emit('subcrible', {
        businessName: "SUBSCRIBLE_PAIR_PRICE",
        pairNames: list
      })
    }
  }
  async _getPairPrice (pairsList: any) {
    let pairs:any = []
    pairsList.forEach((item: any) => {
      pairs = pairs.concat(item.pairs)
    })
    let postObj = {
      pairs,
      time: new Date()
    }
    let res = await getPairPrice(postObj)
    if (res.success) {
      let socketPairs:any = []
      pairsList.forEach((listItem: any, listIndex: number) => {
        socketPairs = (socketPairs.concat(listItem.pairs))
        listItem.pairs.forEach((zoneItem: any, zoneIndex: number) => {
          let resGet = res.data.find((resItem: any) => resItem.pairName === zoneItem)
          console.log(resGet)
          if (resGet) {
            pairsList[listIndex].pairs[zoneIndex] = {name: zoneItem, ...resGet}
          } else {
            pairsList[listIndex].pairs[zoneIndex] = {name: zoneItem, ...{
              price: '-',
              rise: '0',
              vol: '-'
            }}
          }
        })
      })
      this.setState({
        socketPairs,
        pairsList
      })
      this.socketEmit(socketPairs)
    }
  }
  getPriceByPair () {
    let price:any = ''
    this.state.pairsList.forEach((item: any) => {
      let res = item.pairs.find((item: any) => item.name === this.state.pairs)
      if (res) {
        price = res.price
      }
    })
    return price
  }
  setTabs (list: any) {
    let tabs: any = []
    list.forEach((item: any) => {
      tabs.push({title: item.zone})
    })
    return tabs
  }
  render () {
    const pairsList = this.state.pairsList
    return (
      <div>
        <Header
          title={'币币交易'}
        />
        <div className="app-container bb-list">
        <Tabs 
            tabBarBackgroundColor="transparent"
            tabs={pairsList && this.setTabs(pairsList)} 
            renderTabBar={props => <Tabs.DefaultTabBar 
            {...props} 
            page={6} 
            onTabClick={() => {}}
          />}>
            {pairsList.map((item: any, index:number) => (
              <div className="bb-drawer-tab-pane" key={index}>
                {/* <SearchBar></SearchBar> */}
                <div className="list" style={{height: document.documentElement.clientHeight - 140, overflowY: 'auto'}}>
                  {item.pairs.map((pair: any, index:number) => (
                    <div className="list-row col-3" key={index} onClick={() => this.props.history.push({pathname: '/BBTrade', query: {pairName: pair.name, price: currencyFormate(pair.price)}})}>
                      <span>
                        <h3>{formatePairName(pair.name)}</h3>
                        <div style={{marginTop: 5}}>24H量 {currencyFormate(pair.vol)}</div>
                      </span>
                      <span style={{textAlign: 'center'}}>{currencyFormate(pair.price)}</span>
                      <span style={{textAlign: 'right'}}>{pair.rise < 0?
                        <span className="decrease-div crease-div">{floatTopercent(pair.rise)}</span>:
                        <span className="increase-div crease-div">+ {floatTopercent(pair.rise)}</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Tabs>
        </div>
        <Footer {...this.props} />
      </div>
    )
  }
}

const mapStateToProps = (state: _state) => {
  console.log(state)
  return {
    siteInfo: state.siteInfo,
    system: state.system
  }
}

export default connect(mapStateToProps, {})(BBList as React.ComponentType)