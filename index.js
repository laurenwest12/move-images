const express = require('express');
const app = express();
const fs = require('fs');
const sql = require('msnodesqlv8');

const {
	destinationFolder,
	server,
	database,
	driver,
	query,
} = require('./config');

const connectionString = `server=${server};Database=${database};Trusted_Connection=Yes;Driver=${driver}`;

const moveAllFiles = async () => {
	await sql.query(connectionString, query, (err1, rows) => {
		let submitted = [['FilePath', 'FileName']];
		let rewrites = [['FilePath', 'FileName']];
		let errors = [['FilePath', 'ErrorMessage']];

		for (let row of rows) {
			const { Brand, FilePath, FILENAME } = row;
			const brandTrim = Brand.trim();

			// const fileArr = FileName.split('\\');
			// const file = fileArr[fileArr.length - 1];

			const destinationPath = `${destinationFolder}/${brandTrim}/${FILENAME}`;

			console.log(FILENAME);
			try {
				if (!fs.existsSync(`${destinationFolder}/${brandTrim}/`)) {
					fs.mkdirSync(`${destinationFolder}/${brandTrim}/`);
				}

				if (fs.existsSync(destinationPath)) {
					rewrites.push([FilePath, FILENAME]);
					continue;
				} else {
					try {
						fs.copyFileSync(FilePath, destinationPath);
						submitted.push([FilePath, FILENAME]);
					} catch (err2) {
						errors.push([err2.path, err2.message]);
					}
				}
			} catch (err3) {
				errors.push(err3.message);
			}
		}
		let submittedCsv = submitted.map((e) => e.join(',')).join('\n');
		let rewritesCsv = rewrites.map((e) => e.join(',')).join('\n');
		let errorsCsv = errors.map((e) => e.join(',')).join('\n');

		fs.writeFileSync(`${destinationFolder}/submitted.csv`, submittedCsv);
		fs.writeFileSync(`${destinationFolder}/rewrites.csv`, rewritesCsv);
		fs.writeFileSync(`${destinationFolder}/errors.csv`, errorsCsv);

		console.log('Done');
	});
};

app.listen(5050, async () => {
	console.log('Server is running...');
	await moveAllFiles();
});
