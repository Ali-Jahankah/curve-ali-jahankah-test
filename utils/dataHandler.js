const path = require('path');
const ExcelJs = require('exceljs');

const Contract = require('../models/contract');
const Track = require('../models/track');
exports.ingestDataHandler = async () => {
  try {
    let contract = await Contract.findOne({ name: 'Contract 1' });
    if (!contract) {
      contract = new Contract({ name: 'Contract 1' });
      await contract.save();
      console.log('\n---Contract created---\n');
    }
    const workbook = new ExcelJs.Workbook();
    await workbook.xlsx.readFile(
      path.join(__dirname, '..', 'data', 'tracks.xlsx')
    );
    const workSheet = workbook.getWorksheet(1);

    const errors = [];
    const rows = [];
    workSheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      if (rowNumber > 2) {
        rows.push({ row, rowNumber });
      }
    });
    for (const { row, rowNumber } of rows) {
      const [id, title, version, artist, isrc, pLine, aliases, contractName] =
        row.values.slice(1);
      const aliasesArray = aliases
        ? aliases.split(';').map((alias) => alias.trim())
        : [];
      let trackContract = null;
      try {
        if (contractName) {
          trackContract = await Contract.findOne({ name: contractName });
          if (!trackContract) {
            errors.push({
              line: rowNumber,
              error: `Contract "${contractName}" not found`
            });
            continue;
          }
        }
      } catch (error) {
        errors.push({
          line: rowNumber,
          error: `Error in finding contract: ${error.message}`
        });
        continue;
      }
      try {
        const existingTrack = await Track.findOne({ title, version, artist });
        if (existingTrack) {
          errors.push({
            line: rowNumber,
            error: `Duplicate track found. Detail s===> [title: "${title}" | Version: "${version}" | Artist: "${artist}")]`
          });
          continue;
        }
      } catch (error) {
        errors.push({
          line: rowNumber,
          error: `Error checking existing track: ${error.message}`
        });
        continue;
      }
      let trackData = {
        title,
        version,
        artist,
        isrc,
        pLine,
        aliases: aliasesArray
      };
      if (trackContract) {
        trackData.contract = trackContract._id;
      }
      try {
        const track = new Track(trackData);
        await track.save();
        console.log(`Track "${title}" saved successfully.`);
      } catch (err) {
        errors.push({ line: rowNumber, error: err.message });
        console.error(`Error in saving track "${title}": ${err.message}`);
      }
    }
    if (errors.length > 0) {
      console.error('Errors Summary here: ');
      console.error(errors);
    } else {
      console.log('--- Data ingested successfully ---');
    }
  } catch (error) {
    console.error('Error during data ingestion:', error);
  }
};
