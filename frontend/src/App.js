import React from 'react';
import ReactDOM from 'react-dom';
import Map from './Map';

// import BarChart from './BarChart';
import './App.css';

class App extends React.Component {

    render() {
        return (
            <div className="App container">
                <Map></Map>
            </div>
        );
    }
}

export default App;