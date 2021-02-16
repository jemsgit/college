import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

import { fetchData } from '../../fetcher'

import Main from '../main/main';
import Abitur from '../abitur/abitur';
import Student from '../student/student';
import Schedule from '../schedule/schedule';
import Conference from '../conference/conference';
import Exam from '../exam/exam';

import './app.css'

export default class App extends Component {
    constructor() {
      super();
      this.state = {}
    }

    componentDidMount() {
      fetchData().then((data) => {
        if(data) {
          this.setState(data);
        }
      })
    }

    render() {
      return (<div className='app'>
        <Router>
          <Switch>
            <Route path="/abitur" exact={ true }>
              <Abitur state={this.state}/>
            </Route>
            <Route path="/student" exact={ true }>
              <Student state={this.state}/>
            </Route>
            <Route path="/schedule" exact={ true }>
              <Schedule state={this.state}/>
            </Route>
            <Route path="/conference" exact={ true }>
              <Conference state={this.state}/>
            </Route>
            <Route path="/exam" exact={ true }>
              <Exam state={this.state}/>
            </Route>
            <Route path="/" exact={ true }>
              <Main news={this.state.news}/>
            </Route>

        </Switch>
      </Router></div>);
    }
}
