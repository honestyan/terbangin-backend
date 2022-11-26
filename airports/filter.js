const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const dataPath = path.join(__dirname, "data.json");

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

writeFilteredData("ID");
