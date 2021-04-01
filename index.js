const express = require('express');
const app = express();
const fs = require('fs');
const sql = require('msnodesqlv8');

const { destinationFolder } = require('./config');
const { server, database, driver, query } = require('./config');

const connectionString = `server=${server};Database=${database};Trusted_Connection=Yes;Driver=${driver}`;

const moveAllFiles = async () => {
	await sql.query(connectionString, query, (err, rows) => {
		let submitted = [];
		let rewrites = [];
		let errors = [];

		for (let row of rows) {
			const { Brand, FilePath, FILENAME } = row;
			const brandTrim = Brand.trim();

			// const fileArr = FileName.split('\\');
			// const file = fileArr[fileArr.length - 1];

			const destinationPath = `${destinationFolder}/${brandTrim}/${FILENAME}`;

			console.log(file);
			try {
				if (!fs.existsSync(`${destinationFolder}/${brandTrim}/`)) {
					fs.mkdirSync(`${destinationFolder}/${brandTrim}/`);
				}

				if (fs.existsSync(destinationPath)) {
					continue;
				} else {
					fs.copyFileSync(FilePath, destinationPath);
				}
			} catch (err) {
				console.log(err);
				errors.push(err);
			}
		}
		console.log(errors);
	});
};

app.listen(5050, async () => {
	console.log('Server is running...');
	await moveAllFiles();
	console.log('Done moving files');
});
