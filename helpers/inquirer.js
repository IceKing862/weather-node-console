const inquirer = require('inquirer');
require('colors');

const optionList = [
  {
    type: 'list',
    name: 'opt',
    message: 'What do you want to do? / ¿Que desea hacer?',
    choices: [
      {
        value: 1,
        name: `${ '1'.green }. Find city / Buscar ciudad`,
      },
      {
        value: 2,
        name: `${ '2'.green }. History / Historial`,
      },
      {
        value: 0,
        name: `${ '0'.green }. Exit / Salir`,
      },
    ],
  },
];

const menu = async() => {
  
  console.clear();
  console.log('==========================='.green);
  console.log('     Select an option');
  console.log('   Seleccione una opción');
  console.log('===========================\n'.green);

  const { opt } = await inquirer.prompt(optionList);

  return opt;
}

const stop = async() => {

  const stopInput = [
    {
      type: 'input',
      name: 'stop',
      message: `Press ${ 'ENTER'.green } to continue / Presiona ${ 'ENTER'.green } para continuar`
    }
  ];

  console.log('\n');
  await inquirer.prompt(stopInput);
};

const readInput = async(message) => {

  const inputOptions = [
    {
      type: 'input',
      name: 'text',
      message,
      validate(value) {
        if ( value.length === 0 ) {
          return 'Write a city name / Ingrese una ciudad';
        }
        return true;
      }
    }
  ];

  const { text } = await inquirer.prompt(inputOptions);
  return text;
};

const showCities = async( cities = [] ) => {
   
  const choices = cities.map( (city, i) => {
    const idx = `${i + 1}.`.green;
    
    return {
      value: city.id,
      name: `${idx} ${city.name}`
    }
  })

  choices.unshift({
    value: '0',
    name: '0.'.green + 'Cancel / Cancelar'
  });
  const questions = [
    {
      type: 'list',
      name: 'id',
      message: 'Select a city / Seleccione una ciudad',
      choices
    }
  ];

  const { id } = await inquirer.prompt(questions);
  return id;
}

const confirmar = async(message) => {

  const question = [
    {
      type: 'confirm',
      name:  'ok',
      message
    }
  ];

  const { ok } = await inquirer.prompt(question);
  return ok;
}

const mostrarListadoChecklist = async( tareas = [] ) => {
  
  const choices = tareas.map( (tarea, i) => {
    const idx = `${i + 1}.`.green;
    
    return {
      value: tarea.id,
      name: `${idx} ${tarea.desc}`,
      checked: (tarea.completadoEn) ? true : false,
    }
  })


  const pregunta = [
    {
      type: 'checkbox',
      name: 'ids',
      message: 'Selecciones',
      choices
    }
  ];

  const { ids } = await inquirer.prompt(pregunta);
  return ids;
}

module.exports = {
  menu,
  stop,
  readInput,
  showCities,
  confirmar,
  mostrarListadoChecklist
}