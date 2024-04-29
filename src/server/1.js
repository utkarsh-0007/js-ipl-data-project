const fs=require('fs');
const csv=require('csv-parser');
let abc={};
fs.createReadStream('../data/matches.csv').pipe(csv()).on('data',(row)=>{
const year=row.season;
if(!abc[year]){abc[year]=1} else abc[year]++;
})
.on('end',()=>{console.log(abc)






fs.writeFile('../public/output/allmatches.json', JSON.stringify(abc), (err) => {
    if (err) {
      console.error('Error writing JSON file', err);
      return;
    }
   console.log('JSON file has been saved in the output folder');
  })});