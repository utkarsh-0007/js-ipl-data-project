// Number of matches won per team per year in IPL
const fs=require('fs') 
const csv=require('csv-parser')
let output={};
fs.createReadStream('../data/matches.csv').pipe(csv()).on('data',(row)=>{
if(!output[row.winner]){
    output[row.winner]={}}
if(!output[row.winner][row.season]){
    output[row.winner][row.season]=1;}else output[row.winner][row.season]++;
}).on('end',()=>{console.log(output)





    fs.writeFile('../public/output/wonmatchteam.json', JSON.stringify(output), (err) => {
    if (err) {
      console.error('Error writing JSON file', err);
      return;
    }
   console.log('JSON file has been saved in the output folder');
  })});