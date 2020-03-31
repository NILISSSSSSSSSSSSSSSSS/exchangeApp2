import React from 'react';
import { TradingView, Datafeed } from 'trader-view'
import { IChartingLibraryWidget, IDatafeed, Bar } from 'trader-view'
import { PERIOD } from '../../Constants/kline'
import { getKlines } from '../../Apis/bbtrade'

type IProps = {
  pair: string
  socket: any
}
class Kline extends React.Component<IProps> {
  public widget?: IChartingLibraryWidget
  public datafeed?: any
  public socket?: WebSocket

  public state = {
    interval: '15',
    pair: ''
  }

  /**
   * 初始化WebSocket
   */
  public initWebSocket() {
    if (this.props.socket) {
      this.props.socket.emit('subcrible', {
        businessName: 'SUBSCRIBLE_PAIR_K_LINE',
        pairName: this.state.pair,
        rangeType: this.state.interval
      })
    }
  }
  /**
   * 监听WebSocket响应
   * @param msg string
   */
  public onSocketMessage(msg: string) {
    try {
      const _msg = JSON.parse(msg)
      this.datafeed.updateData({
        bars: [],
        meta: {noData: false}
      })
      console.log(_msg)
    } catch (err) {
      console.error(err)
    }
  }

  /**
   * 初始化 JS API
   */
  public initDatafeed() {
    this.datafeed = new Datafeed({
      history: (params: any) => {
        return this.fetchHistoryData(
          params.symbol,
          params.resolution,
          params.from,
          params.to
        )
      },
      config: () => new Promise(resolve => resolve({
        supports_search: true,
        supports_group_request: false,
        supported_resolutions: ['1', '5', '15', '30', '60', 'D', 'W', 'M'],
        supports_marks: false,
        supports_timescale_marks: false,
        supports_time: false
      })),
      symbols: () => new Promise(resolve => resolve({
        name: this.state.pair,
        full_name: this.state.pair,
        description: this.state.pair,
        type: 'btcusdt',
        session: '24x7',
        exchange: this.state.pair.split('_')[0],
        listed_exchange: this.state.pair.split('_')[0],
        timezone: 'Asia/Shanghai',
        format: 'price',
        pricescale: 100,
        minmov: 1,
        has_intraday: true,
        supported_resolutions: ['1', '5', '15', '30', '60', 'D']
      }))
    })
  }

  /**
   * 获取历史数据
   */
  public async fetchHistoryData(symbol: string, period: string, from: number, to: number) {
    console.log(period)
    const { interval } = this.state
    if (interval !== period) {
      // 退订
      // 订阅
      this.setState({ interval: period })
    }
    const res = await getKlines({
      endTime: new Date(to * 1000).toISOString(),
      limit: 500,
      pairName: symbol,
      rangeType: PERIOD[period],
      startTime: new Date(from * 1000).toISOString()
    })
    const list: Bar[] = []
    if (res.data && res.data.klines) {
      const _list = res.data.klines
      for (let i = 0; i < _list.length; i++) {
        list.push({
          time: _list[i].createTime,
          close: _list[i].end,
          high: _list[i].high,
          low: _list[i].low,
          open: _list[i].start,
          volume: _list[i].vol
        })
      }
    }
    this.initWebSocket()
    return {
      bars: list,
      meta: { noData: !list.length }
    }
  }

  /**
   * 初始化图表
   */
  public initTradingView() {
    if (!this.datafeed) {
      return
    }
    const { interval } = this.state
    this.widget = new TradingView({
      // debug: true, // uncomment this line to see Library errors and warnings in the console
      fullscreen: false,
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight * 0.6,
      symbol: this.state.pair,
      interval: interval,
      container_id: 'tv_chart_container',

      //	BEWARE: no trailing slash is expected in feed URL
      datafeed: this.datafeed,
      library_path: './charting_library/',
      locale: 'zh',

      // 禁用的功能
      disabled_features: [
        "control_bar",
        "edit_buttons_in_legend",
        "header_settings",
        "header_chart_type",
        "compare_symbol",
        "display_market_status",
        "go_to_date",
        "header_chart_type",
        "header_compare",
        "header_interval_dialog_button",
        "header_screenshot",
        "header_symbol_search",
        "header_undo_redo",
        "header_saveload",
        "legend_context_menu",
        "show_hide_button_in_legend",
        "show_interval_dialog_on_key_press",
        "snapshot_trading_drawings",
        "symbol_info",
        "use_localstorage_for_settings",
        "left_toolbar",
        "main_series_scale_menu",
        "timeframes_toolbar"
      ],
      // 开启的功能
      enabled_features: [
        "delete_button_in_legend",
        "dont_show_boolean_study_arguments",
        "hide_last_na_study_output",
        "move_logo_to_main_pane",
        "same_data_requery",
        "side_toolbar_in_fullscreen_mode",
        "disable_resolution_rebuild"
      ],
      overrides: {
        "paneProperties.legendProperties.showLegend": false
      },
      charts_storage_url: 'http://saveload.tradingview.com',
      charts_storage_api_version: '1.1',
      client_id: 'tradingview.com',
      user_id: 'public_user_id',
      theme: 'Dark',
      timezone: 'Asia/Shanghai'
    })
  }

  public componentDidMount() {
    console.log(this.props.pair)
    this.setState({
      pair: this.props.pair
    }, () => {
      this.initDatafeed()
      this.initTradingView()
    })
    // window.addEventListener(
    //   'DOMContentLoaded',
    //   this.initTradingView.bind(this),
    //   false
    // )
  }

  public render() {
    return <div>
      <div id="tv_chart_container"></div>
    </div>
  }
}

export default Kline;
