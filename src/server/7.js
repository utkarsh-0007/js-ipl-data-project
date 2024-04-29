const fs = require('fs');
const csv = require('csv-parser');

let matchesData = [];
let deliveriesData = [];

// Read matches.csv file
fs.createReadStream('../data/matches.csv')
  .pipe(csv())








  .on('data', (row) => {
    matchesData.push(row);
  })
  .on('end', () => {
    // Read deliveries.csv file
    fs.createReadStream('../data/deliveries.csv')
      .pipe(csv())
      .on('data', (row) => {
        deliveriesData.push(row);
      })
      .on('end', () => {
        let strikeRateBySeason = {};

        // Calculate strike rate for each season
        deliveriesData.forEach((delivery) => {
          let match = matchesData.find((match) => match.id === delivery.match_id);
          let batsman = delivery.batsman;
          let runs = parseInt(delivery.batsman_runs);
          let balls = runs > 0 ? 1 : 0;

          if (strikeRateBySeason[match.season]) {
            if (strikeRateBySeason[match.season][batsman]) {
              strikeRateBySeason[match.season][batsman].runs += runs;
              strikeRateBySeason[match.season][batsman].balls += balls;
            } else {
              strikeRateBySeason[match.season][batsman] = { runs, balls };
            }
          } else {
            strikeRateBySeason[match.season] = {
              [batsman]: { runs, balls }
            };
          }
        });

        console.log(strikeRateBySeason);
        fs.writeFile('../public/output/rate.json', JSON.stringify(strikeRateBySeason), (err) => {
            if (err) {
              console.error('Error writing JSON file', err);
              return;
            }
           console.log('JSON file has been saved in the output folder');
          });
      });
  });
