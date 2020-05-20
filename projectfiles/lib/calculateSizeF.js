const calculateSize=(stats)=>{
    const fileSizeBytes=stats.size;
    let fileSize;
    const units="BKMGT"
    const index=Math.floor(Math.log10(fileSizeBytes)/3);
    const fileSizeHuman=(fileSizeBytes/Math.pow(1000,index)).toFixed(1);
    const unit=units[index];
    fileSize=`${fileSizeHuman}${unit}`;
    if (fileSizeBytes===0){
        fileSize=`${0}B`
    }
    return [fileSize,fileSizeBytes]
}

module.exports=calculateSize;