let fs = require("fs")
console.log(JSON.parse(fs.readFileSync("./metadata.json", "utf8")).version)