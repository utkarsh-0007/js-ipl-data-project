const fs = require('fs');
const csv = require('csv-parser');

let dismissalsCount = {};

// Parse matches.csv file
fs.createReadStream('../data/matches.csv')
    .pipe(csv())
    .on('data', (match) => {
        let winningTeam = match.winner;



        // Parse deliveries.csv file for each match
        fs.createReadStream('../data/deliveries.csv')
            .pipe(csv())
            .on('data', (delivery) => {
                if (delivery.match_id === match.id && delivery.dismissal_kind !== '0') {
                    let bowler = delivery.bowler;
                    let batsman = delivery.player_dismissed;

                    if (winningTeam) {
                        if (!dismissalsCount[bowler]) {
                            dismissalsCount[bowler] = {};
                        }
                        if (!dismissalsCount[bowler][batsman]) {
                            dismissalsCount[bowler][batsman] = 1;
                        } else {
                            dismissalsCount[bowler][batsman]++;
                        }
                    }
                }
            });
    })
    .on('end', () => {
        // Find the highest number of dismissals by one player to another
        let maxDismissals = 0;
        let highestDismissals = {};

        for (let bowler in dismissalsCount) {
            for (let batsman in dismissalsCount[bowler]) {
                if (dismissalsCount[bowler][batsman] > maxDismissals) {
                    maxDismissals = dismissalsCount[bowler][batsman];
                    highestDismissals = {
                        bowler: bowler,
                        batsman: batsman,
                        dismissals: maxDismissals
                    };
                }
            }
        }

        console.log(highestDismissals);
        fs.writeFile('../public/output/highest.json', JSON.stringify(highestDismissals), (err) => {
          if (err) {
            console.error('Error writing JSON file', err);
            return;
          }
         console.log('JSON file has been saved in the output folder');
        })
    });
