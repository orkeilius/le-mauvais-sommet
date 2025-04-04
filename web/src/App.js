import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import ProductManagement from './components/ProductManagement';
import AuctionsPage from './pages/AuctionsPage';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/users" component={UserManagement} />
        <Route path="/products" component={ProductManagement} />
        <Route path="/auctions" component={AuctionsPage} />
      </Switch>
    </Router>
  );
}

export default App;
