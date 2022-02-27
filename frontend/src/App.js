import React from 'react';
import ReactDOM from 'react-dom';
import Map from './Map';

// import BarChart from './BarChart';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component {

    render() {
        return (
            <div className="App">
                <Map></Map>
            </div>
        );
    }
}

export default App;