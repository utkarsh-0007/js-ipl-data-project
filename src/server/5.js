const fs=require('fs') 
const csv=require('csv-parser')
let years={};
fs.createReadStream('../data/matches.csv').pipe(csv()).on('data',(row)=>{
if(row.toss_winner==row.winner){

    
    if(!years[row.winner]){years[row.winner]=1}else years[row.winner]++}}
)
.on('end',()=>{console.log(years)




fs.writeFile('../public/output/tossandMatch.json', JSON.stringify(years), (err) => {
    if (err) {
      console.error('Error writing JSON file', err);
      return;
    }
   console.log('JSON file has been saved in the output folder');
  })});