import React from 'react';
import ReactDOM from 'react-dom';
import Map from './Map';

// import BarChart from './BarChart';
import './App.css';

class App extends React.Component {

    render() {
        return (
            <div className="App">
                	<div id="text_container">
		<h1 style={{fontSize: "100px"}} id="text">Food Oasis</h1>
	</div>
                {/* <div style={{backgroundColor: "black", paddingTop: "10px", paddingBottom: "10px"}} className="row mb-2">
                    <h1 style={{color: "white", margin: "0px"}} className="col text-center">Food Oasis</h1>
                </div> */}
                <Map></Map>
            </div>
        );
    }
}

export default App;