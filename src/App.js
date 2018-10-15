import React, { Component } from 'react';
import Select from 'react-select';
import './App.css';
import GentlemanCat from './gentlemancat.png';


const GOOGLE_SHEET_URL = 'https://spreadsheets.google.com/feeds/list/14e4-F9rcLuyZ71so6S4E-QrcXHTjO8907BVZiR3mH2k/od6/public/basic?alt=json';

class App extends Component {
    constructor() {
        super()
        this.state = {
            loading: true,
            wetFoodOptions: [],
            kcalPerKgWetFood: 0,
            gWetFood: '',
            kcalPerFeeding: 123,
            kcalPerKgDryFood: 3790,
        }
        this.onWetFoodChange = this.onWetFoodChange.bind(this);
        this.onWetFoodAmountChange = this.onWetFoodAmountChange.bind(this);
        this.calculateDryFood = this.calculateDryFood.bind(this);
    }

    componentWillMount() {
        fetch(GOOGLE_SHEET_URL)
            .then((response) => response.json())
            .then((responseJson) => {
                const wetFoodOptions = responseJson.feed.entry.map((row) => {
                    return {
                        label: row.title.$t,
                        value: parseFloat(
                            row.content.$t.split(' ')[1]
                        )
                    }
                });
                this.setState({
                    loading: false,
                    wetFoodOptions: wetFoodOptions,
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    onWetFoodChange(wetFood) {
        this.setState({ kcalPerKgWetFood: wetFood.value });
    }

    onWetFoodAmountChange(event) {
        this.setState({ gWetFood: event.target.value });
    }

    calculateDryFood() {
        if (isNaN(this.state.gWetFood) === true) { return 0 }
        const kgWetFood = this.state.gWetFood / 1000;
        const kcalWetFood = this.state.kcalPerKgWetFood * kgWetFood;
        // kgDryFood = (kcalPerFeeding - kcalWetFood) / kcalPerKgDryFood;
        const kgDryFood = (this.state.kcalPerFeeding - kcalWetFood) / this.state.kcalPerKgDryFood;

        return Math.round(kgDryFood*1000);
    }

    render() {
        return (
            <div className='App'>
                <InfoSection />
                <WetFoodSelector
                    options={this.state.wetFoodOptions}
                    onWetFoodChange={this.onWetFoodChange}
                />
                <div className='Amounts'>
                    <WetFoodAmount
                        gWetFood={this.state.gWetFood}
                        onWetFoodAmountChange={this.onWetFoodAmountChange}
                    />
                    <DryFoodAmount
                        amount={this.calculateDryFood()}
                    />
                </div>
            </div>
        );
    }
}

class InfoSection extends Component {
    render() {
        return (
            <div className='InfoSection'>
                <div className='title'><h1>Plutocat</h1></div>
                <div className='title-image'>
                    <img
                        src={GentlemanCat}
                        alt='A very fancy cat'
                    />
                </div>
                <div className='tagline'>(he is kind of a big deal)</div>
            </div>
        )
    }
}

class WetFoodSelector extends Component {
    render() {
        return (
            <div className='WetFoodSelector'>
                <Select
                    options={this.props.options}
                    onChange={this.props.onWetFoodChange}
                />
            </div>
        )
    }
}

class WetFoodAmount extends Component {
    render() {
        return (
            <div className='WetFoodAmount'>
                <input
                    type='number'
                    value={this.props.gWetFood}
                    onChange={this.props.onWetFoodAmountChange}
                />
                <div className='unit-label'>
                    g
                </div>
            </div>
        )
    }
}


class DryFoodAmount extends Component {
    render() {
        return (
            <div className='DryFoodAmount'>
                <div className='display'>{this.props.amount} g</div>
            </div>
        )
    }
}

export default App;
