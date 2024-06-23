const assert = require('assert');
const mongoose = require('mongoose');
const Track = require('../models/track');
const Contract = require('../models/contract');

const {
  createContractHandler,
  checkContractExsit,
  checkTrackExist
} = require('../utils/dataHandler');
const { dbUriTest } = require('../constants');
const { connectDb } = require('../config/db');

describe('Check if track already exist, track will not be saved & check if contract exists, track will be saved', () => {
  let errors = [];
  before(async () => {
    await mongoose.connection.close();
    await connectDb(dbUriTest);
    const contractName = 'Contract 1';
    await createContractHandler(contractName);
  });

  beforeEach(async () => {
    try {
      await Track.deleteMany();
    } catch (error) {
      console.log('-- Error in deleting data from Tracks collection ---');
    }
  });
  after(async () => {
    await mongoose.connection.close();
    console.log('---- DB disconnected ---- ');
  });
  let mockTrackDataWithContract = {
    row: {
      title: 'Track 1',
      version: '1.0',
      artist: 'Artist 1',
      isrc: 'ISRC1',
      pLine: 'P Line 1',
      aliases: 'aliases 1; aliases 2',
      contractName: 'Contract 1'
    },

    rowNumber: 3
  };

  const { title, version, artist, isrc, pLine, aliases, contractName } =
    mockTrackDataWithContract.row;
  const aliasesArray = aliases
    ? aliases.split(';').map((alias) => alias.trim())
    : [];
  const trackDataWithContract = {
    title,
    version,
    artist,
    isrc,
    pLine,
    aliases: aliasesArray
  };
  it('should save track when contract exists and contract found', async () => {
    const trackContract = await checkContractExsit(
      contractName,
      errors,
      mockTrackDataWithContract.rowNumber
    );
    if (trackContract) {
      trackDataWithContract.contract = trackContract._id;
    }

    const track = new Track(trackDataWithContract);
    await track.save();
    console.log(`Track "${title}" saved successfully.`);
    const savedTrack = await Track.findOne({ title: 'Track 1' });
    assert.ok(savedTrack);
    assert.deepStrictEqual(
      savedTrack.contract.toString(),
      trackContract._id.toString(),
      'Saved Track contract should match trackContract._id'
    );
  });
  it('Should not save the track if it already exists in DB', async () => {
    const trackContract = await checkContractExsit(
      contractName,
      errors,
      mockTrackDataWithContract.rowNumber
    );
    if (trackContract) {
      trackDataWithContract.contract = trackContract._id;
    }

    const track = new Track(trackDataWithContract);
    await track.save();
    const isTrackExist = await checkTrackExist(
      title,
      version,
      artist,
      errors,
      mockTrackDataWithContract.rowNumber
    );
    if (isTrackExist) {
      console.log('Track already exist');
    }
    assert.ok(isTrackExist);
  });
});
describe('If track does not have contract, track will be saved without contract', () => {
  let errors = [];
  before(async () => {
    await mongoose.connection.close();
    await connectDb(dbUriTest);
    const contractName = 'Contract 1';
    await createContractHandler(contractName);
  });

  beforeEach(async () => {
    try {
      await Track.deleteMany();
    } catch (error) {
      console.log('-- Error in deleting data from Tracks collection ---');
    }
  });
  after(async () => {
    await mongoose.connection.close();
    console.log('---- DB disconnected ---- ');
  });
  it('Should save the track, that does not have a contract', async () => {
    let mockTrackDataWithoutContract = {
      row: {
        title: 'Track 1',
        version: '1.0',
        artist: 'Artist 1',
        isrc: 'ISRC1',
        pLine: 'P Line 1',
        aliases: 'aliases 1; aliases 2'
      },

      rowNumber: 4
    };
    const { title, version, artist, isrc, pLine, aliases, contractName } =
      mockTrackDataWithoutContract.row;
    const aliasesArray = aliases
      ? aliases.split(';').map((alias) => alias.trim())
      : [];
    const trackDataWithoutContract = {
      title,
      version,
      artist,
      isrc,
      pLine,
      aliases: aliasesArray
    };
    let isTrackExist = await checkTrackExist(
      title,
      version,
      artist,
      errors,
      mockTrackDataWithoutContract.rowNumber
    );
    assert.ok(!isTrackExist);
    if (!contractName) {
      const track = new Track(trackDataWithoutContract);
      await track.save();
      isTrackExist = await checkTrackExist(
        title,
        version,
        artist,
        errors,
        mockTrackDataWithoutContract.rowNumber
      );
      assert.ok(isTrackExist);
    }
  });
});
describe('It should not save the track if it has a contract but contrack does not exist in DB/Contract collection', () => {
  const errors = [];
  before(async () => {
    await mongoose.connection.close();
    await connectDb(dbUriTest);
    const contractName = 'Contract 1';
    await createContractHandler(contractName);
  });

  beforeEach(async () => {
    try {
      await Track.deleteMany();
    } catch (error) {
      console.log('-- Error in deleting data from Tracks collection ---');
    }
  });
  after(async () => {
    await mongoose.connection.close();
    console.log('---- DB disconnected ---- ');
  });
  it('Should check if contract exsit. If it does not exist, track will not be  saved', async () => {
    let mockTrackDataWithContract = {
      row: {
        title: 'Track 1',
        version: '1.0',
        artist: 'Artist 1',
        isrc: 'ISRC1',
        pLine: 'P Line 1',
        aliases: 'aliases 1; aliases 2',
        contractName: 'Contract 2'
      },
      rowNumber: 4
    };
    const { title, version, artist, isrc, pLine, aliases, contractName } =
      mockTrackDataWithContract.row;
    const contract = await Contract.findOne({ name: contractName });
    assert.ok(!contract);
    const isTrackExist = await checkTrackExist(
      title,
      version,
      artist,
      errors,
      mockTrackDataWithContract.rowNumber
    );
    assert.ok(!isTrackExist);
  });
});
