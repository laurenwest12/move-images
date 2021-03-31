const express = require('express');
const app = express();
const fs = require('fs');
const sql = require('msnodesqlv8');

const { destinationFolder } = require('./config');
const { server, database, driver } = require('./config');

const connectionString = `server=${server};Database=${database};Trusted_Connection=Yes;Driver=${driver}`;

const moveAllFiles = async () => {
	await sql.query(
		connectionString,
		'SELECT * FROM LabelPackImagesRL',
		(err, rows) => {
			for (let row of rows) {
				const { tempcode, FileName } = row;
				const fileArr = FileName.split('\\');
				const file = fileArr[fileArr.length - 1];

				const destinationPath = `${destinationFolder}/RALPH LAUREN/${file}`;
				console.log(file);
				try {
					if (!fs.existsSync(`${destinationFolder}/RALPH LAUREN`)) {
						fs.mkdirSync(`${destinationFolder}/RALPH LAUREN`);
					}
					if (fs.existsSync(destinationPath)) {
						continue;
					} else {
						fs.copyFileSync(FileName, destinationPath);
					}
				} catch (err) {
					console.log(err);
				}
			}
		}
	);
};

app.listen(5050, async () => {
	console.log('Server is running...');
	await moveAllFiles();
	console.log('Done moving files');
});
