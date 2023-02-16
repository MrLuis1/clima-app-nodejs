const fs = require('fs');
const axios = require('axios');

class Busquedas {
    historial = [];
    dbPath = './db/data.json'
    
    constructor(){
        // TODO: leer db si existe
        this.readDB()
    }

    get capitaliceHistory() {
        return this.historial.map(word => {
            const newWord = word.split(' ');
            const upperPlaces = newWord.map(upperWord => upperWord[0].toUpperCase() + upperWord.substring(1))
            return upperPlaces.join(" ");
        })
    }

    get paramMapBox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'types': 'place',
            'language': 'es'
        }
    };

    async searchCity(place = '') {
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
                params: this.paramMapBox
            });
            const response = await instance.get();
            return response.data.features.map(place => ({id: place.id, name: place.place_name, lng: place.center[0], lat: place.center[1]}));
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async getClimate( lat, lon ) {
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {
                    lat,
                    lon,
                    appid: process.env.OPEN_WEATHER,
                    units: 'metric',
                    lang: 'es'
                }
            });
            const response = await instance.get();
            const { weather, main } = response.data;

            return {
                desc: weather[0].main,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }
        } catch (error) {
            console.log(error)
        }
    }

    history(place = '') {
        if(!this.historial.includes(place.toLocaleLowerCase())) this.historial.unshift(place.toLocaleLowerCase());
        this.capitaliceHistory;
        this.saveDB()
    }

    saveDB() {
        const payload = {
            historial: this.historial,
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
        this.readDB()
    }

    readDB() {
        if( !fs.existsSync(this.dbPath) ){
            const data = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});
            const parseData = JSON.parse(data);
            console.log(parseData.historial)
            this.historial = parseData.historial
        } return
    }
}

module.exports = {Busquedas}