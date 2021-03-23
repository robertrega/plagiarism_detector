import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import Plagiarism from "./pages/plagiarism/plagiarism";
import {BrowserRouter, Switch, Route, RouteComponentProps, Redirect} from 'react-router-dom'
import Upload from "./pages/upload/upload";


/**
 * @interface AppState is the state of the App component
 * tracks whether projects were uploaded
 */
interface AppState {
    uploaded: boolean,
}


/**
 * @class App is container for the entire app
 * Allows redirection to plagiarism page if projects were uploaded
 */
class App extends React.Component<{}, AppState>{
  state =  {
    uploaded: false,
  }

 setUpload = () =>{
      this.setState({uploaded:true})
 }

  render(){
  return <BrowserRouter>
    <Switch>
      <Route exact path={"/"} component={(props:RouteComponentProps)=>
                                            <Upload setUpload={this.setUpload}
                                            history={props.history} />}/>

        { this.state.uploaded ?
            <Route exact path={"/plagiarism"}  component={Plagiarism}/> :
            <Redirect to={"/"}/>
        }
    </Switch>
  </BrowserRouter>

  }
}
export default App;
