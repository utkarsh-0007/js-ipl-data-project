const csv = require('csv-parser');
const fs = require('fs');

let matchesData = [];
let deliveriesData = [];

// Read matches.csv file
fs.createReadStream('../data/matches.csv')
  .pipe(csv())
  .on('data', (data) => matchesData.push(data))
  .on('end', () => {



    
    // Filter matches played in 2016
    let matches2016 = matchesData.filter(match => match.season == '2016');
    
    // Read deliveries.csv file
    fs.createReadStream('../data/deliveries.csv')
      .pipe(csv())
      .on('data', (data) => deliveriesData.push(data))
      .on('end', () => {
        let extraRunsConceded = {};

        // Calculate extra runs conceded in each match
        deliveriesData.forEach(delivery => {
          let matchId = delivery.match_id;
          let bowlingTeam = delivery.bowling_team;
          let extraRuns = parseInt(delivery.extra_runs);

          let match = matches2016.find(match => match.id == matchId);
          if (match) {
            extraRunsConceded[bowlingTeam] = (extraRunsConceded[bowlingTeam] || 0) + extraRuns;
          }
        });

        console.log(extraRunsConceded);
        // Write the extraRunsConceded data to a JSON file in the output folder
fs.writeFile('../public/output/extraRunsConceded.json', JSON.stringify(extraRunsConceded), (err) => {
  if (err) {
    console.error('Error writing JSON file', err);
    return;
  }
 console.log('JSON file has been saved in the output folder');
});
      });
  });
