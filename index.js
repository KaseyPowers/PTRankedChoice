const fs = require("fs");
const parse = require("csv-parse");

const { readRecord, getResults } = require("./readRecords");

const parser = parse({
  delimiter: ",",
});
// Use the readable stream api
parser.on("readable", () => {
  while ((record = parser.read())) {
    readRecord(record);
  }
});
// Catch any error
parser.on("error", function (err) {
  console.error(err.message);
});

parser.on("end", () => {
  getResults();
});

const file = "./results.csv";
const stream = fs.createReadStream(file, { encoding: "utf8" });
stream.pipe(parser);
