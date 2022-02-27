import React from 'react';
import ReactDOM from 'react-dom';
import Map from './Map';

// import BarChart from './BarChart';
import './App.css';

class App extends React.Component {

    render() {
        return (
            <div className="App container">
                <div className="row">
                    <h1 className="col text-center">Food Oasis</h1>
                </div>
                <Map></Map>
            </div>
        );
    }
}

export default App;