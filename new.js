function clac( name, number, arrnames){
    arrnames.push(name)
    arrnames.sort()
    let myindex=0
    for (var j = 0; j < arrnames.length; j++) {
      if (arrnames[j].match(name)) myindex=j+1;
    }

    let tm=Math.floor(myindex/number)+1;
    return 20 * tm;
}
var output = new Array(
  "Adam",
  "Caroline",
  "Rebecca",
  "Frank",
);
let answer = clac("Eric", 2, output);

// var str="masekir"
// var output = new Array(str,"mele");
// output.push("mee")

// output.sort()
console.log(answer)
// for (var j = 0; j < output.length; j++) {
//   if (output[j].match(str)) console.log( j);
// }