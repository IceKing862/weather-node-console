const fs = require('fs');

const axios = require('axios');

class Searches {

  history = [];
  dbPath = './db/database.json'
  
  constructor() {
    this.readDB();
  }

  get capitalizedHistory() {
    return this.history.map(place => {
      let letters = place.split(' ');
      letters = letters.map(letter => letter[0].toUpperCase() + letter.substring(1));

      return letters.join(' ');
    })
  }

  get paramsMapBox() {
    return {
      'access_token': process.env.MAPBOX_KEY,
      'language': 'es',
      'limit': 5,
    }
  }

  get paramsOpenWeather() {
    return {
      appid: process.env.OPENWEATHER_KEY,
      'units': 'metric',
      'lang': 'es',
    }
  }

  async findCity(city = '') {
    
    try {
      const intance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/`,
        params: this.paramsMapBox,
      });

      const resp = await intance.get(`${ city }.json`);
      return resp.data.features.map( city => ({
        id: city.id,
        name: city.place_name,
        lng: city.center[0],
        lat: city.center[1],
      }));

    } catch (error) {
      return [];
    }

  }

  async getWeather(lat, lon) {

    try {
      const instance = axios.create({
        baseURL: `https://api.openweathermap.org`,
        params: { ...this.paramsOpenWeather, lat, lon },
      })

      const resp = await instance.get('/data/2.5/weather');
      const {weather, main} = resp.data;
      
      return {
        desc: weather[0].description,
        min: main.temp,
        max: main.temp_max,
        temp: main.temp_min,
      }

    } catch (error) {
      console.log(error)
    }
  }

  addHistory( place = '' ) {
    if (this.history.includes(place.toLocaleLowerCase())) {
      return;
    }
    this.history = this.history.splice(0, 4);

    this.history.unshift(place.toLocaleLowerCase());

    this.saveDB();
  }

  saveDB() {
    const payload = {
      history: this.history,
    }

    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  readDB(){
    if(!fs.existsSync(this.dbPath)) {
      return;
    }

    const info = fs.readFileSync(this.dbPath, {encoding: 'utf8'});
    const data = JSON.parse(info);

    this.history = data.history;
  }
}

module.exports = Searches;