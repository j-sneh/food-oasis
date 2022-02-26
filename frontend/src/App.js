import React from 'react';
import ReactDOM from 'react-dom';
import Map from './Map';
import BarChart from './BarChart';
import './App.css';

class App extends React.Component {

    state = {
        data: [12, 5, 6, 6, 9, 10],
        width: 960,
        height: 600
    }

    render() {
        return (
            <div className="App">
                <Map></Map>
            </div>
        );
        // return (
        //     <div className="App">
        //         <BarChart data={this.state.data} width={this.state.width} height={this.state.height} />
        //     </div>
        // );
    }
}

export default App;