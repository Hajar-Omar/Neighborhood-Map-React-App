import React, { Component } from 'react'
import LocationItem from './MenuItem'


export default class Filter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            locations: '',
            query: ''
        };

        this.filterLocations = this.filterLocations.bind(this);
    }


     // Filter Locations based on user query
    filterLocations(event) {
        this.props.closeInfoWindow();
        const { value } = event.target;
        var locations = [];
        this.props.locationsList.forEach(function (location) {
            if (location.longname.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                location.marker.setVisible(true);
                locations.push(location);
            } else {
                location.marker.setVisible(false);
            }
        });

        this.setState({
            locations: locations,
            query: value
        });
    }

    componentWillMount() {
        this.setState({
            locations: this.props.locationsList
        });
    }


  

    render() {

        var locationlist = this.state.locations.map(function (listItem, index) {
            return (
                <LocationItem key={index} openInfoWindow={this.props.openInfoWindow.bind(this)} data={listItem} />
            );
        }, this);

        return (
            <div className="search">
                <input role="search on loactions" aria-labelledby="filter" className="search-field" type="text" placeholder="Filter"
                    value={this.state.query} onChange={this.filterLocations} />
                <ul>
                    {locationlist}
                </ul>
            </div>
        )
    }
}