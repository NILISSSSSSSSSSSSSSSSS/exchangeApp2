import React, {Component} from 'react';
import { HashRouter as Router, Route } from "react-router-dom";
import Index from './Containers/Index';
import FiatTrade from './Containers/FiatTrade';
import BBList from './Containers/BBList';
import BBTrade from './Containers/BBTrade';
import Asset from './Containers/Asset';

import AboutUs from './Containers/AboutUs';
import Invite from './Containers/Invite';
import InviteRecord from './Containers/InviteRecord';

import FiatOrderRecord from './Containers/Fiat/FiatOrderRecord'
import FiatOrderDetail from './Containers/Fiat/FiatOrderDetail'
import AppealList from './Containers/Fiat/AppealList'
import AppealDetail from './Containers/Fiat/AppealDetail'
import AppealSubmit from './Containers/Fiat/AppealSubmit'

import BBOrders from './Containers/BBOrders'
import BBKline from './Containers/BBKline'

import Deposits from './Containers/Asset/Deposits'
import WithDraw from './Containers/Asset/WithDraw'
import DepositsRecord from './Containers/Asset/DepositsRecord'
import WithDrawRecord from './Containers/Asset/WithDrawRecord'
export default class Routers extends Component {
    render () {
        return (
            <Router>
                <div>
                    <Route path='/' exact component={Index} />
                    <Route path='/FiatTrade' component={FiatTrade} />
                    <Route path='/BBTrade' component={BBTrade} />
                    <Route path='/Asset' component={Asset} />
                    <Route path='/AboutUs' component={AboutUs} />
                    <Route path='/Invite' component={Invite} />
                    <Route path='/InviteRecord' component={InviteRecord} />
                    <Route path='/FiatOrderRecord' component={FiatOrderRecord}/>
                    <Route path='/FiatOrderDetail' component={FiatOrderDetail}/>
                    <Route path='/AppealList' component={AppealList}/>
                    <Route path='/AppealDetail' component={AppealDetail}/>
                    <Route path='/AppealSubmit' component={AppealSubmit}/>
                    <Route path='/BBOrders' component={BBOrders}/>
                    <Route path='/BBList' component={BBList}/>
                    <Route path='/BBKline' component={BBKline}/>
                    <Route path='/Deposits' component={Deposits}/>
                    <Route path='/WithDraw' component={WithDraw}/>
                    <Route path='/DepositsRecord' component={DepositsRecord}/>
                    <Route path='/WithDrawRecord' component={WithDrawRecord}/>
                </div>
            </Router>
        )
    }
}