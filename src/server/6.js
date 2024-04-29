// Find a player who has won the highest number of Player of the Match awards for each season
const fs=require('fs') 
const csv=require('csv-parser')
let output={};
fs.createReadStream('../data/matches.csv').pipe(csv()).on('data',(row)=>{const year=row.season;const player=row.player_of_match ;
    if(!output[year]){output[year]={}};if(!output[year][player]){output[year][player]=1}else output[year][player]++; 
})
.on('end',()=>{
    const maxValues = {};

    for (const year in output) { let maxKey = ''; let maxValue = -Infinity;
    


    for (const key in output[year]) { if (output[year][key] > maxValue) { maxKey = key; maxValue = output[year][key]; } }
    
    maxValues[year] = {[maxKey]: maxValue} }
    
    console.log(maxValues); 
fs.writeFile('../public/output/playerofMatch.json', JSON.stringify(maxValues), (err) => {
    if (err) {
      console.error('Error writing JSON file', err);
      return;
    }
   console.log('JSON file has been saved in the output folder');
  });
})