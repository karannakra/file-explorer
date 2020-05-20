const {execSync} = require('child_process');

try{
    const result = execSync(`du -sh "C:\\Users\\karan\\Desktop\\js"`).toString();
    console.log(result);
}catch(err){
    console.log(`Error: ${err}`);
}