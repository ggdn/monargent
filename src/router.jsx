import React from 'react';
import {render} from 'react-dom';
import Provider from 'react-redux/lib/components/Provider'
import Router from 'react-router/lib/Router'
import Route from 'react-router/lib/Route'
import hashHistory from 'react-router/lib/hashHistory'
import IndexRoute from 'react-router/lib/IndexRoute'
import App from './App.jsx';
import Creche from './component/creche/Creche';

render((
        <Router history = { hashHistory }>
            <Route path = "/" component = {App}>
                <IndexRoute component = {Creche} />
            </Route>
        </Router>
), document.getElementById('app'));
