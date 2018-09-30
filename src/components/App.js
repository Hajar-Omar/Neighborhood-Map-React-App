import React, { Component } from 'react';
import '../css/App.css';
import LocationMenu from './MenuFilter'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      locationsList: [
        {
          'name': 'Pyramids',
          'type': 'museum',
          'lat': 29.9772962,
          'lng': 31.1324955,
          'streetAddress': 'pyramids, Giza, Egypt'
        },
        {
          'name': 'Big Egyption',
          'type': 'museum',
          'lat': 29.9942315,
          'lng': 31.1187471,
          'streetAddress': 'pyramids, Giza, Egypt'
        },
        {
          'name': 'Le Méridien Pyramids Hotel & Spa',
          'type': 'establishment',
          'lat': 29.9891785,
          'lng': 31.130273,
          'streetAddress': 'Square - Pyramids Al Remaya'
        },
        {
          'name': 'Pyramid',
          'type': 'Hospital',
          'lat': 29.9909756,
          'lng': 31.1517888,
          'streetAddress': 'Omranya, Giza, Egypt'
        },
        {
          'name': 'Salah ElDein',
          'type': 'Castle',
          'lat': 30.0298877,
          'lng': 31.2610777,
          'streetAddress': 'Qesm Al Khalifah, Giza, Egypt'
        },
        {
          'name': 'El Mahmodya',
          'type': 'Mosque',
          'lat': 30.03160819999999,
          'lng': 31.2577427,
          'streetAddress': 'Salah Eldein square, Giza, Egypt'
        },
        {
          'name': 'El Azhar',
          'type': 'Park',
          'lat': 30.0406319,
          'lng': 31.2647327,
          'streetAddress': 'Salah Salem St., Giza, Egypt'
        },
        {
          'name': 'Cairo Tower',
          'type': 'Landmark',
          'lat': 30.045915,
          'lng': 31.2242898,
          'streetAddress': 'El Zamalk, Giza, Egypt'
        },
        {
          'name': 'Giza Zoo',
          'type': 'Zoo',
          'lat': 30.0226574,
          'lng': 31.2136607,
          'streetAddress': 'Charles De Gaulle, Giza, Egypt'
        },
        {
          'name': 'Cairo University',
          'type': 'University',
          'lat': 30.0227646,
          'lng': 31.2073201,
          'streetAddress': 'Giza, Egypt'
        },
        {
          'name': 'Oct. war Panorama',
          'type': 'Panorama',
          'lat': 30.0742728,
          'lng': 31.3068068,
          'streetAddress': 'Salah Salem St., Cairo, Egypt'
        },
        {
          'name': 'El Baroon Palace',
          'type': 'Palace',
          'lat': 30.08671339999999,
          'lng': 31.330259,
          'streetAddress': 'El Oroba, Cairo, Egypt'
        }
      ],
      map: '',
      infowindow: '',
      marker: ''
    };

    // retain object instance when used in the function
    this.initMap = this.initMap.bind(this);
    this.openInfoWindow = this.openInfoWindow.bind(this);
    this.closeInfoWindow = this.closeInfoWindow.bind(this);
  }

  componentDidMount() {
    // Connect the initMap() within this class to window so Google Maps can invoke it
    window.initMap = this.initMap;

    //Load the google maps Asyn and inject it's script to index.html
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCPi0o_tjNjKYYDe_6nYg82r0leI7kKlOE&callback=initMap';
    script.async = true;
    script.onerror = function () {
      document.write("Google Maps can't be loaded");
    };
    ref.parentNode.insertBefore(script, ref);
  }

  // Initialise the map
  initMap() {
    var self = this;

    var mapview = document.getElementById('map');
    mapview.style.height = (window.innerHeight - 50) + "px";
    var map = new window.google.maps.Map(mapview, {
      center: { lat: 30.045915, lng: 31.2242898 },
      zoom: 12,
      mapTypeControl: false
    });

    var InfoWindow = new window.google.maps.InfoWindow({});

    window.google.maps.event.addListener(InfoWindow, 'closeclick', function () {
      self.closeInfoWindow();
    });

    this.setState({
      map: map,
      infowindow: InfoWindow
    });

    window.google.maps.event.addDomListener(window, "resize", function () {
      var center = map.getCenter();
      window.google.maps.event.trigger(map, "resize");
      self.state.map.setCenter(center);
    });

    window.google.maps.event.addListener(map, 'click', function () {
      self.closeInfoWindow();
    });

    var locationsList = [];
    this.state.locationsList.forEach(function (location) {
      var longname = location.name + ' - ' + location.type;
      var marker = new window.google.maps.Marker({
        position: new window.google.maps.LatLng(location.lat, location.lng),
        animation: window.google.maps.Animation.DROP,
        map: map
      });

      marker.addListener('click', function () {
        self.openInfoWindow(marker);
      });

      location.longname = longname;
      location.marker = marker;
      location.display = true;
      locationsList.push(location);
    });
    this.setState({
      locationsList: locationsList
    });
  }


  //Open the infowindow for marker
  openInfoWindow(marker) {
    this.closeInfoWindow();
    this.state.infowindow.open(this.state.map, marker);
    marker.setAnimation(window.google.maps.Animation.BOUNCE);
    this.setState({
      marker: marker
    });
    this.state.infowindow.setContent('Loading Data...');
    this.state.map.setCenter(marker.getPosition());
    this.state.map.panBy(0, -100);
    this.getMarkerInfo(marker);
  }


  // Retrive the location data from the foursquare api for the marker and display it in the infowindow
  getMarkerInfo(marker) {
    var self = this;
    var clientId = "QNPFSARFNLRZTF5ZUJ4A3YXSZ2JSCCFPGDXY4PKXBL2DL1XO";
    var clientSecret = "INDKRWQWM0EMH2YLMKUGAEV5PURADOMDJT5GGIYIO0OJGLOR";
    var url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId +
      "&client_secret=" + clientSecret + "&v=20130815&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";
    fetch(url)
      .then(response => {
        if (response.status !== 200) {
          self.state.infowindow.setContent("Sorry data can't be loaded");
          return;
        }

        response.json().then(function (data) {
          var location_data = data.response.venues[0];
          var locName = `<span>${location_data.name}</span><br />`;
          var formattedAddress = `<span>${location_data.location.formattedAddress[0]}</span><br />`;
          var readMore = '<a href="https://foursquare.com/v/' + location_data.id + '" target="_blank">Read More on Foursquare Website!</a>'

          self.state.infowindow.setContent(locName + formattedAddress + readMore);
        });
      }
      )
      .catch(function (err) {
        self.state.infowindow.setContent("Sorry data can't be loaded");
      });
  }


  // Close the infowindow for marker
  closeInfoWindow() {
    if (this.state.marker) {
      this.state.marker.setAnimation(null);
    }
    this.setState({
      marker: ''
    });
    this.state.infowindow.close();
  }


  openNav() {
    document.querySelector(".filter-menu").style.width = "250px";
    document.querySelector(".map-container").style.width = "calc( 100% - 250px )"
  }

  closeNav() {
    document.querySelector(".filter-menu").style.width = '0';
    document.querySelector(".map-container").style.width = "100%";
  }



  render() {
    return (
      <div>
        <section className="filter-menu">
          <h1>Locations</h1>
          <a className="closebtn" role="button" aria-label="close filter menu" onClick={this.closeNav}>&times;</a>
          <LocationMenu key="100" locationsList={this.state.locationsList} openInfoWindow={this.openInfoWindow}
            closeInfoWindow={this.closeInfoWindow} />
        </section>
        <section className="map-container">
          <header>
            <a className="burger-menu" role="button" aria-label="open filter menu" onClick={this.openNav}>&#9776;</a>
          </header>
          <div id="map" role="application" aria-label="Google Maps"></div>
        </section>
      </div>
    );
  }
}

export default App;