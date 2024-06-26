const path = require('path');
const ExcelJs = require('exceljs');

const Contract = require('../models/contract');
const Track = require('../models/track');
const { contractFiletName } = require('../constants');

const createContractHandler = async (contractName) => {
  let contract = await Contract.findOne({ name: contractName });
  if (!contract) {
    contract = new Contract({ name: contractName });
    await contract.save();
    console.log('\n---Contract created---\n');
  }
  return contract;
};

const extractedRows = async () => {
  const rows = [];
  const workbook = new ExcelJs.Workbook();
  await workbook.xlsx.readFile(
    path.join(__dirname, '..', 'data', 'tracks.xlsx')
  );
  const workSheet = workbook.getWorksheet(1);
  workSheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    if (rowNumber > 2) {
      rows.push({ row, rowNumber });
    }
  });
  await ingestDataHandler(rows);
};
const checkContractExsit = async (contractName, errors, rowNumber) => {
  let trackContract = null;
  try {
    if (contractName) {
      trackContract = await Contract.findOne({ name: contractName });
      if (!trackContract) {
        errors.push({
          line: rowNumber,
          error: `Contract "${contractName}" not found`
        });
      }
    }
  } catch (error) {
    errors.push({
      line: rowNumber,
      error: `Error in finding contract: ${error.message}`
    });
  }
  return trackContract;
};
const checkTrackExist = async (title, version, artist, errors, rowNumber) => {
  try {
    const existingTrack = await Track.findOne({ title, version, artist });
    if (existingTrack) {
      errors.push({
        line: rowNumber,
        error: `Duplicate track found ===> title: "${title}" | Version: "${version}" | Artist: "${artist}"`
      });
      return true;
    }
    return false;
  } catch (error) {
    errors.push({
      line: rowNumber,
      error: `Error checking existing track: ${error.message}`
    });
  }
};
ingestDataHandler = async (dataRows) => {
  const rows = dataRows;
  try {
    const errors = [];
    await createContractHandler(contractFiletName);
    for (const { row, rowNumber } of rows) {
      const [id, title, version, artist, isrc, pLine, aliases, contractName] =
        row.values.slice(1);
      const aliasesArray = aliases
        ? aliases.split(';').map((alias) => alias.trim())
        : [];

      const trackContract = await checkContractExsit(
        contractName,
        errors,
        rowNumber
      );

      const isTrackExist = await checkTrackExist(
        title,
        version,
        artist,
        errors,
        rowNumber
      );

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
        if (
          (trackContract &&
            !isTrackExist &&
            contractName &&
            contractName === trackContract.name) ||
          (!contractName && !isTrackExist)
        ) {
          const track = new Track(trackData);
          await track.save();
          console.log(`Track "${title}" saved successfully.`);
        }
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
module.exports = {
  extractedRows,
  ingestDataHandler,
  createContractHandler,
  checkContractExsit,
  checkTrackExist
};
