require('dotenv').config();

const { inquirerMenu, pause, readInput, placeList } = require("./helpers/inquirer");
const { Busquedas } = require("./models/search");
require('colors')

console.log(process.env)

const main = async() => {
    const busquedas = new Busquedas;
    let option;
    do {
        option = await inquirerMenu()

        switch (option) {
            case 1:
                // ? Mostrar mensaje
                const lugar = await readInput('Ingresa la ciudad o lugar que deseas buscar.')
                
                // !Buscamos los lugares
                const data = await busquedas.searchCity(lugar)
                
                // !Seleccionamos el lugar
                const id = await placeList(data);
                if(id === 0) continue;
                const selectedPlace = data.find(element => element.id === id);
                busquedas.history(selectedPlace.name)
                const { name, lng, lat} = selectedPlace;

                // ! Datos del clima
                const climateDate = await busquedas.getClimate(lat, lng);
                const {desc, min, max, temp} = climateDate;

                console.log('Informacion de la ciudad \n'.green);
                console.log('Ciudad', name.green);
                console.log('Lat', lat);
                console.log('Long', lng);
                console.log('Temperatura', temp);
                console.log('Minima', min);
                console.log('Maxima', max);
                console.log('Clima actual: ', desc.green);
            break;
            case 2:
                // console.log(busquedas.capitaliceHistory);
                busquedas.capitaliceHistory.forEach(element => console.log(element));
            break;
        }

        if(option !== 0)await pause();

    } while (option !== 0);
}

main();