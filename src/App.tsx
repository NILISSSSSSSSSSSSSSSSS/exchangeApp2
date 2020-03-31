import './Styles/index.less';
import React from 'react';
import AppContainer from './Containers/AppContainer'
import {Provider} from 'react-redux'
import store from './Reducers/Index'

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="app">
        <AppContainer />
      </div>
    </Provider>
    
  );
}

export default App;
