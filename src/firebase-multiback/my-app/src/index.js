import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import paths from './utils/RouthPaths.js'

ReactDOM.render(
  <Router>
    <switch>
    {/* leaving the default path exposed for readability. all others are resolved.*/}
    {
      paths.map((v) => 
        <Route path={v.path} component={v.component} />
      )
    }
    </switch>
  </Router>, document.getElementById('root'));
registerServiceWorker();