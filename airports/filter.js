const fs = require("fs");
const path = require("path");
const { Airport } = require("../models");

const dataPath = path.join(__dirname, "data_latest.json");

const readData = () => {
  const data = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(data);
};

const filter = (arr) => {
  const filtered = arr.filter((item, index) => {
    return arr.indexOf(item) === index;
  });
  return filtered;
};

const writeData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data));
};

const filterByalpha2countryCode = (alpha2countryCode) => {
  const data = readData();
  const filtered = data.filter((item) => {
    return item.alpha2countryCode === alpha2countryCode;
  });
  return filtered;
};

//write filterByalpha2countryCode to new json
const writeFilteredData = (alpha2countryCode) => {
  const filtered = filterByalpha2countryCode(alpha2countryCode);
  const filteredData = filter(filtered);
  writeData(filteredData);
};

const filterByCountryName = (countryName) => {
  const data = readData();
  const filtered = data.filter((item) => {
    return item.countryName === countryName;
  });
  return filtered;
};

//delete key value except iata, name, city, countryName, latitude, longitude
const deleteKey = (arr) => {
  const filtered = arr.map((item) => {
    delete item.fs;
    delete item.icao;
    delete item.faa;
    delete item.cityCode;
    delete item.countryCode;
    delete item.regionName;
    delete item.timeZoneRegionName;
    delete item.weatherZone;
    delete item.localTime;
    delete item.utcOffsetHours;
    delete item.elevationFeet;
    delete item.classification;
    delete item.active;
    delete item.weatherUrl;
    delete item.delayIndexUrl;
    return item;
  });
  return filtered;
};

const writeDeleteKey = (alpha2countryCode) => {
  const filtered = filterByCountryName(alpha2countryCode);
  const filteredData = deleteKey(filtered);
  writeData(filteredData);
};

// writeDeleteKey("Indonesia");

//insert data_latest.json to database
const insertData = async () => {
  const data = readData();
  const insert = await Airport.bulkCreate(data);
  return insert;
};

insertData();
