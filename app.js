const fs = require('fs');
const argv = require('./config/yargs');
const payu = require('./config/payu');
const axios = require('axios');
const colors = require('colors');

let api = payu.sandbox;
let authorization = Buffer.from(payu.api_login + ':' + payu.api_key).toString('base64');

let command = argv._[0];

let headers = { 'Authorization': 'Basic ' + authorization, 'Content-Type': 'application/json', 'Accept': 'application/json' };

switch (command) {

	case 'create':
		const createPlan = require('./config/create');
		axios.post(`${api}/rest/v4.9/plans`, JSON.stringify(createPlan.create), { headers })
			.then(response => {

				if (!fs.existsSync('./plan-logs')) {
					fs.mkdirSync('./plan-logs');
				}

				fs.writeFile(`./plan-logs/${argv.plancode}.json`, JSON.stringify(createPlan.create), (err) => {
					if (err) throw err;
					console.log(colors.green('¡Se ha creado el plan ' + argv.plancode + ' con éxito!'));
					console.log('___________________________________________');
					console.log(response.data);
				});

			})
			.catch(err => console.log(colors.red(err.response.data)));
	break;

	case 'read':
		axios.get(`${api}/rest/v4.9/plans/${argv.plancode}`, { headers })
			.then(response => {
				console.log(response.data);
			})
			.catch(err => console.log(colors.red(err.response.data)));
	break;

	case 'update':
		const updatePlan = require('./config/update');
		axios.put(`${api}/rest/v4.9/plans/${argv.plancode}`, JSON.stringify(updatePlan.update), { headers })
			.then(response => {
				fs.writeFile(`./plan-logs/${argv.plancode}.json`, JSON.stringify(updatePlan.update), (err) => {
					if (err) throw err;
					console.log(colors.green('¡Se ha actualizado el plan ' + argv.plancode + ' con éxito!'));
					console.log('___________________________________________');
					console.log(response.data);
				});
			})
			.catch(err => console.log(colors.red(err.response.data)));
	break;

	case 'delete':
		axios.delete(`${api}/rest/v4.9/plans/${argv.plancode}`, { headers })
			.then(response => {
				console.log(colors.green('El plan ' + argv.plancode + ' se ha eliminado correctamente'));
			})
			.catch(err => console.log(colors.red(err.response.data)));
	break;

	default:
		console.log('Command not found');

}