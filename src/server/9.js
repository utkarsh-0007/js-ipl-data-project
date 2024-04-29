const fs = require('fs');
const csv = require('csv-parser');

let superOverRuns = {};
let superOverBalls = {};

// Read deliveries.csv file
fs.createReadStream('../data/deliveries.csv')
  .pipe(csv())
  .on('data', (row) => {
    if (row.is_super_over === '1') {
      if (!superOverRuns[row.bowler]) {
        superOverRuns[row.bowler] = parseInt(row.total_runs);
        superOverBalls[row.bowler] = 1;
      } else {
        superOverRuns[row.bowler] += parseInt(row.total_runs);
        superOverBalls[row.bowler]++;
      }
    }
  })
  .on('end', () => {
    let playerEconomy = {};

    Object.keys(superOverRuns).forEach(bowler => {
        let oversBowled = superOverBalls[bowler] / 6;
        let economy = superOverRuns[bowler] / oversBowled;
        playerEconomy[bowler] = economy;
    });

    let sortedPlayers = Object.keys(playerEconomy).sort((a, b) => playerEconomy[a] - playerEconomy[b]);

    const output = {
      player: sortedPlayers[0],
      economy: playerEconomy[sortedPlayers[0]]
    };

    console.log(output);
    fs.writeFile('../public/output/superover.json', JSON.stringify(output), (err) => {
        if (err) {
          console.error('Error writing JSON file', err);
          return;
        }
       console.log('JSON file has been saved in the output folder');
      });
  });
