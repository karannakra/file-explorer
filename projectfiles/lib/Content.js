const fs=require('fs')
const path=require('path')
//import files
const calculateSizeD=require('./calculateSizeD')
const calculateSizeF=require('./calculateSizeF')

const buildmaincontent=(fullStaticPath,pathname)=>{
    let mainContent='';

    let itemDetails={};
    let items;
    //loop through the elements of the folder
    try{
        items=fs.readdirSync(fullStaticPath);
        
    }catch (err) {
        console.log(`readSync error${err}`)
        return `<div class="alert alert-danger">internal server error</div>`
    }
    items.forEach(item=>{
        itemDetails.name=item;
        //link
        const link=path.join(pathname,item);
        //icon
        const itemFullStaticPath=path.join(fullStaticPath,item);
        try{
            itemDetails.stats=fs.statSync(itemFullStaticPath)
            if(itemDetails.stats.isDirectory()){
                itemDetails.icon='<ion-icon name="folder"></ion-icon>';
                [itemDetails.size,itemDetails.sizeBytes]=calculateSizeD(itemFullStaticPath);

            }
            else if (itemDetails.stats.isFile()){
                itemDetails.icon='<ion-icon name="document"></ion-icon>';
                [itemDetails.size,itemDetails.sizeBytes]=calculateSizeF(itemDetails.stats)
            }
        }
        catch (err) {
            console.log(`staticSync error:${err}`);
            mainContent+=`<div class="alert alert-danger">Internal server error</div>`
            return false
        }
        //when was the file last change
        itemDetails.timeStamp=parseInt(itemDetails.stats.mtimeMs);
        itemDetails.date= new Date(itemDetails.timeStamp);

        mainContent+= `
    <tr data-name="${itemDetails.name}" data-size="${itemDetails.sizeBytes}" data-time="${itemDetails.timeStamp}">
        <th scope="row">${itemDetails.icon}<a href="${link}">${itemDetails.name}</a></th>
        <td>${itemDetails.size}</td>
        <td>${itemDetails.date.toLocaleString()}</td>
    </tr>`;
    });
   return mainContent;
};
module.exports=buildmaincontent;