function displayCurrentVotes(votes, options) {
  console.log(`Current votes: (count ${votes.length})`);
  votes.forEach((vote) => {
    if (vote.length <= 0) {
      console.log("[]");
    } else {
      const names = vote.map((index) => options[index]);
      console.log(
        `[ ${names[0]} ], ${names.slice(1, 3).join(", ")}${
          names.length > 3 ? "..." : ""
        }`
      );
    }
  });
}

function displayResults(counts, votesToWin, firstCount) {
  // TODO: this math might change if a vote has all its options elliminated? would the 50% be calculated with them still there or of votes remaining?
  let useOptions = Object.keys(counts);
  if (!firstCount) {
    useOptions = useOptions.filter((opt) => {
      return counts[opt] > 0;
    });
  }
  const firstRow = `To Win: ${votesToWin} `;
  const longestName = Math.max(
    firstRow.length,
    ...useOptions.map((val) => val.length)
  );
  const rows = useOptions.map((option) => {
    let output = option;
    while (output.length < longestName) {
      output += " ";
    }
    return output;
  });
  rows.unshift(firstRow);
  while (rows[0].length < longestName) {
    rows[0] += " ";
  }

  let atCount = 0;
  const largestCount = Math.max(useOptions.map((opt) => counts[opt]));

  while (atCount <= largestCount || atCount <= votesToWin) {
    // set line for votes to win first without modifying atCount
    if (atCount === votesToWin) {
      for (let i = 0; i < rows.length; i += 1) {
        rows[i] += i > 0 ? "|" : "*";
      }
    }

    rows[0] += atCount % 5 ? " " : "" + atCount;
    for (let i = 1; i < rows.length; i += 1) {
      if (atCount === 0) {
        rows[i] += "|";
      } else {
        const opt = useOptions[i - 1];
        const hasVotes = counts[opt] >= atCount;
        rows[i] += hasVotes ? "=" : " ";
      }
    }
    atCount += 1;
  }
  for (let i = 1; i < rows.length; i += 1) {
    const opt = useOptions[i - 1];
    const totalCount = counts[opt];
    rows[i] += ` total:${totalCount}`;
  }

  rows.forEach((row) => console.log(row));
}

const winnerLines = [
  " __     __ __            __                                ",
  "|  \\   |  \\  \\          |  \\                               ",
  "| ▓▓   | ▓▓\\▓▓ _______ _| ▓▓_    ______   ______  __    __ ",
  "| ▓▓   | ▓▓  \\/       \\   ▓▓ \\  /      \\ /      \\|  \\  |  \\",
  " \\▓▓\\ /  ▓▓ ▓▓  ▓▓▓▓▓▓▓\\▓▓▓▓▓▓ |  ▓▓▓▓▓▓\\  ▓▓▓▓▓▓\\ ▓▓  | ▓▓",
  "  \\▓▓\\  ▓▓| ▓▓ ▓▓       | ▓▓ __| ▓▓  | ▓▓ ▓▓   \\▓▓ ▓▓  | ▓▓",
  "   \\▓▓ ▓▓ | ▓▓ ▓▓_____  | ▓▓|  \\ ▓▓__/ ▓▓ ▓▓     | ▓▓__/ ▓▓",
  "    \\▓▓▓  | ▓▓\\▓▓     \\  \\▓▓  ▓▓\\▓▓    ▓▓ ▓▓      \\▓▓    ▓▓",
  "     \\▓    \\▓▓ \\▓▓▓▓▓▓▓   \\▓▓▓▓  \\▓▓▓▓▓▓ \\▓▓      _\\▓▓▓▓▓▓▓",
  "                                                 |  \\__| ▓▓",
  "                                                  \\▓▓    ▓▓",
  "                                                   \\▓▓▓▓▓▓ ",
];
function victory() {
  winnerLines.forEach((ln) => console.log(ln));
}

module.exports = {
  displayCurrentVotes,
  displayResults,
  victory,
};
