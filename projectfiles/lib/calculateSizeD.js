const {execSync} = require('child_process');

const calculateSize=itemFullStaticPath=>{
    //escape spaces,tabs,etc
    // const fileSizeUnit=fileSize.replace(/k/g)
    const itemfullStaticPathCleaned=
        itemFullStaticPath.replace(/\s/g,'\ ');
        const commandOutput = execSync(`du -sh "${itemfullStaticPathCleaned}"`).toString();
        let fileSize=commandOutput.replace(/\s/g,'');
        fileSize=fileSize.replace(/C:/g,'');
        fileSize=fileSize.split('\\');
        fileSize=fileSize[0];
        const fileSizeUnit=fileSize.replace(/\d|\./g,'');
        //size number
        const fileSizeNumber=parseFloat(fileSize.replace(/[a-z]/i,''))

        const units="BKMGT";
        //B->10 bytes
        //M->10*1024bytes
        //K->10*1024*1024 bytes
        //M->10*1024*1024 *1024 bytes
        const  fileSizeBytes=fileSizeNumber*Math.pow(1024,units.indexOf(fileSizeUnit));

    return [fileSize,fileSizeBytes];


}






module.exports=calculateSize;