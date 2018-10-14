import React, { Component } from 'react';
import Select from 'react-select';
import './App.css';

class App extends Component {
    constructor() {
        super()
        this.state = {
            loading: true,
            wetFoodOptions: [],
        }
    }

    componentWillMount() {
        fetch('https://spreadsheets.google.com/feeds/list/14e4-F9rcLuyZ71so6S4E-QrcXHTjO8907BVZiR3mH2k/od6/public/basic?alt=json')
            .then((response) => response.json())
            .then((responseJson) => {
                const googleSheetEntry = responseJson.feed.entry;
                const wetFoods = [];
                for (var i = 0; i < googleSheetEntry.length; i++) {
                    wetFoods[i] = {
                        label: googleSheetEntry[i].title.$t,
                        value: parseFloat(
                            googleSheetEntry[i].content.$t.split(" ")[1]
                        )
                    };
                }
                this.setState({
                    loading: false,
                    wetFoodOptions: wetFoods,
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    render() {
        return (
            <div className="App">
                <InfoSection />
                <WetFoodSelector
                    options={this.state.wetFoodOptions}
                />
                <WetFoodAmount />
                <DryFoodAmount />
            </div>
        );
    }
}

class InfoSection extends Component {
    render() {
        return (
            <div className="InfoSection">
                <div className="title">Plutocat</div>
                <div className="title-image">Image of Cat</div>
                <div className="tagline">(he's kind of a big deal)</div>
            </div>
        )
    }
}

class WetFoodSelector extends Component {
    render() {
        return (
            <div className="WetFoodSelector">
                <Select options={this.props.options} />
            </div>
        )
    }
}

class WetFoodAmount extends Component {
    render() {
        return (
            <div className="WetFoodAmount">
                Text Input for Wet Food Amount
            </div>
        )
    }
}


class DryFoodAmount extends Component {
    render() {
        return (
            <div className="DryFoodAmount">
                Text Display for Dry Food Amount
            </div>
        )
    }
}

export default App;
