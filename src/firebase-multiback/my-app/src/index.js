import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter as Router, Route, Link} from 'react-router-dom';
import App from './App';
import Backup_List from './components/backup_list';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Router>
    <switch>
      <Route path="/" component={App} />
      <Route path="/backups/all" component={Backup_List} />
    </switch>
  </Router>, document.getElementById('root'));
registerServiceWorker();
