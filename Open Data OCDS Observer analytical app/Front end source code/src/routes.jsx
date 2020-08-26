import React                       from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import Dashboard                  from './components/pages/dashboard/DashboardPage'
import Statistic                  from "./components/pages/statistic/StatisticPage"
import PageChart                  from "./components/pageChart/PageChart"
import NewPageChart                  from "./components/pageChart/NewPageChart"
import StoryWhatToBuy             from "./components/storyWhatToBuy/StoryWhatToBuy"
import StoryGovernmentProcurement from "./components/storyGovernmentProcurement/StoryGovernmentProcurement"
import StoryBuyBelarusian         from "./components/storyBuyBelarusian/StoryBuyBelarusian"
import apiAndExport         from "./components/apiAndExport/apiAndExport"


export const BaseRoutes = () => <Switch>
  <Route exact path="/" render={() => <Redirect to="/dashboard/weekly" />} />
  <Route exact path="/dashboard" render={() => <Redirect to="/dashboard/weekly" />} />

  <Route path="/dashboard" component={Dashboard} />
  <Route path="/statistic" component={Statistic} />
  <Route path="/api-export" component={apiAndExport} />
</Switch>

export const StoryRoutes = () => <Switch>
  {/*<Route path="/dashboard/weekly" component={PageChart} />*/}
  <Route path="/dashboard/weekly" component={NewPageChart} />
  <Route path="/dashboard/what-to-buy-in-your-region" component={StoryWhatToBuy} />
  <Route path="/dashboard/why-government-procurement-is-important-to-the-country" component={StoryGovernmentProcurement} />
  <Route path="/dashboard/buy-kyrgyzstan" component={StoryBuyBelarusian} />
</Switch>
