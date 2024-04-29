const fs = require('fs');
const csv = require('csv-parser');

let matchesData = [];
let deliveriesData = [];

fs.createReadStream('../data/matches.csv')
  .pipe(csv())
  .on('data', (data) => matchesData.push(data))
  .on('end', () => {
    fs.createReadStream('../data/deliveries.csv')
      .pipe(csv())
      .on('data', (data) => deliveriesData.push(data))
      .on('end', () => {
        // Filtering matches happened in the year 2015
        const matches2015 = matchesData.filter(match => match.season === '2015');

        const economyRates = {};

        // Calculating economy rate for each bowler in 2015
        deliveriesData.forEach(delivery => {
          const match = matches2015.find(match => match.id === delivery.match_id);
          if (match) {
            const bowler = delivery.bowler;
            const runs = parseInt(delivery.total_runs);
            const overs = parseFloat(delivery.over);
            if (runs) {
              economyRates[bowler] = economyRates[bowler] || { runs: 0, overs: 0 };
              economyRates[bowler].runs += runs;
              economyRates[bowler].overs += overs;
            }
          }
        });

        // Sorting bowlers based on their economy rate
        const sortedBowlers = Object.keys(economyRates).map(bowler => ({
            name: bowler,
            economy: economyRates[bowler].runs / (Math.floor(economyRates[bowler].overs) + ((economyRates[bowler].overs % 1) / 6))
          }))
          .sort((a, b) => a.economy - b.economy)

        // Getting top 10 economical bowlers
        const top10Bowlers = sortedBowlers.slice(0, 10);
        console.log(top10Bowlers);
        fs.writeFile('../public/output/topEconomical.json', JSON.stringify(top10Bowlers), (err) => {
            if (err) {
              console.error('Error writing JSON file', err);
              return;
            }
           console.log('JSON file has been saved in the output folder');
          });
      });
  });
