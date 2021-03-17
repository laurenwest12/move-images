const express = require('express');
const app = express();
const fs = require('fs');
const csv = require('csvtojson');

const { csvFilePath, destinationFolder } = require('./config');

const getJson = () =>
	csv()
		.fromFile(csvFilePath)
		.then((json) => {
			return json;
		});

const moveAllFiles = (arr) => {
	const errors = [];
	for (let file of arr) {
		const { FilePath, FileName } = file;
		const destinationPath = `${destinationFolder}/${FileName}`;

		try {
			if (fs.existsSync(destinationPath)) {
				continue;
			} else {
				fs.copyFileSync(FilePath, destinationPath);
			}
		} catch (err) {
			errors.push(FileName);
		}
	}

	return errors;
};

app.listen(5050, async () => {
	console.log('Server is running...');
	const styles = await getJson();
	const errors = moveAllFiles(styles);
	console.log(errors);
	console.log('Done moving files');
});
