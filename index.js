require('dotenv').config();

const { menu, stop, readInput, showCities } = require('./helpers/inquirer');
const Searches = require('./models/searches');

const main = async() => {
  const searches = new Searches();
  let opt;

  do {
    opt = await menu();

    switch (opt) {
      case 1:
        const city = await readInput('City / Ciudad');
        const cities = await searches.findCity(city);

        const id = await showCities(cities);
        if ( id === '0') continue;

        const place = cities.find( city => city.id === id);
        searches.addHistory(place.name);
        const weather = await searches.getWeather(place.lat, place.lng);

        console.clear();
        console.log('\nCity information / Informacion de la ciudad\n'.green);  
        console.log('City / Ciudad:', place.name);  
        console.log('Lat:', place.lat);  
        console.log('Lng:', place.lng);   
        console.log('Temperature / Temperatura:', weather.temp);  
        console.log('Min:', weather.min);  
        console.log('Max:', weather.max);  
        console.log('Description / Descripción:', weather.desc);  
        break;
      case 2:
        searches.capitalizedHistory.forEach((place, i) => {
          const idx = `${i + 1}`.green;
          console.log(`${idx} ${place}`);
        });
        break;
      case 0:
        console.log(opt)
        break;
    }

    if (opt !== 0) await stop();
  } while (opt !== 0);
}

main();