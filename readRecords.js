const {
  displayResults,
  displayCurrentVotes,
  victory,
} = require("./displayFns");
// store each option
let options = false;
let longestName = 0;

// NOTE: just telling this to skip the first column since we know it's timestamp
function readHeader(record) {
  options = [];
  record.forEach((column, index) => {
    if (index > 0) {
      const result = /\[(.*)\]/.exec(column);
      options.push(result && result[1]);
    }
  });
}

const votes = [];
function readRow(record) {
  // TODO: Figure this one out
  // only store indexes that have a value in options
  // store the rank of each of those indexes,
  // use that to create an array of option(indexes) in order of rank
  const ranks = [];
  record.forEach((column, index) => {
    // if this index is a valid option, and if a rank is submitted
    if (index > 0) {
      ranks.push((column && parseInt(column, 10)) || 0);
    }
  });
  // console.log("ranks: ", ranks.join(","));
  let vote = [];
  for (let i = 0; i < options.length; i += 1) {
    vote[i] = -1;
  }
  ranks.forEach((rank, index) => {
    // ranks are 1 indexed, so subtract 1 before setting anything
    if (rank >= 1) {
      vote[rank - 1] = index;
    }
  });
  vote = vote.filter((val) => val >= 0);
  // console.log("Vote Indexes: ", vote.join(","));
  // console.log(
  //   "vote: ",
  //   vote.map((val) => options[val])
  // );
  // console.log("\n");
  votes.push(vote);
}

function readRecord(record) {
  if (options) {
    readRow(record);
  } else {
    readHeader(record);
  }
}

// check the current results
function getCurrentResults() {
  const counts = {};
  options.filter(Boolean).forEach((name) => {
    counts[name] = 0;
  });
  votes.forEach((choices) => {
    const firstChoice = choices[0] && options[choices[0]];
    if (firstChoice) {
      counts[firstChoice] += 1;
    }
  });
  return counts;
}

function eliminateLastPlace(counts, firstCount) {
  const lowestCount = Math.min(
    ...options
      .map((option) => (option && counts[option]) || 0)
      .filter((count) => count > 0)
  );

  const namesToRemove = options.filter(
    (opt) => opt && counts[opt] <= lowestCount
  );

  const displayNamesToRemove = firstCount
    ? namesToRemove
    : namesToRemove.filter((opt) => opt && counts[opt] > 0);
  console.log(`Removing these options: [${displayNamesToRemove.join(", ")}]`);

  const optionsToRemove = namesToRemove.map((option) =>
    options.indexOf(option)
  );
  for (let i = 0; i < votes.length; i += 1) {
    votes[i] = votes[i].filter((val) => optionsToRemove.indexOf(val) < 0);
  }
}

// run rank choice results until a victor is found
function getResults() {
  let votesToWin = Math.ceil(votes.length / 2);
  // if votes.length is even, to win is 50% + 1
  if (votes.length % 2 === 0) {
    console.log("Even votes: ", votes.length);
    votesToWin += 1;
  }
  let firstCount = true;
  let hasWinner = false;
  while (!hasWinner) {
    displayCurrentVotes(votes, options);
    const counts = getCurrentResults();
    displayResults(counts, votesToWin, firstCount);
    // check for winner
    options.forEach((option) => {
      const optCount = (option && counts[option]) || 0;
      if (optCount >= votesToWin) {
        hasWinner = option;
      }
    });
    firstCount = false;
    if (!hasWinner) {
      eliminateLastPlace(counts, firstCount);
      console.log("-----------------\n");
    } else {
      victory();
      console.log(hasWinner);
    }
  }
}

module.exports = {
  readRecord,
  getResults,
};
