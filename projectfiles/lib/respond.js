//require node modules
const url=require('url')
const path=require('path')
const  fs=require('fs')
//file imports
const buildBreadCrumbs=require('./breadcrumb')
const buildMainContent=require('./Content')
const getMimeType=require('./mime')
//static base  path: location of your  static folder
let staticBasePath=path.join(__dirname,'..','..','..','static');

//respond to request
//following is function passed to createServer used to create the server
const  respond=(request,response)=>{

    let pathname=url.parse(request.url,true).pathname;
    //before working with pathname,you need to decode it
    if (pathname==='/favicon.ico'){
        return false
    }
    pathname=decodeURIComponent(pathname)
    //get  the corresponding full static path located in the static folder
    const fullStaticPath=path.join(staticBasePath,pathname);
    //can we find something in fullstackpath?
    if(!fs.existsSync(fullStaticPath)){
        response.write(`404:content not available in your country  b `);
        response.end();
        return false
    }

    let stats;
    try{
        stats=fs.lstatSync(fullStaticPath)
    }
    catch (err) {
        console.log(`Error:${err} found`)
    }

    //it is directory
    if(stats.isDirectory()){
        // get content from template index.html
        let data = fs.readFileSync(path.join(staticBasePath, 'projectfiles/index.html'), 'utf-8');
        //build the page title
        let pathElements=pathname.split('/').reverse();

        pathElements=pathElements.filter(element=> element!=='');
        let folderName=pathElements[0];
        //build the bread crumb
        const breadCrumbs=buildBreadCrumbs(pathname);
        //build table rows(main_content)
        const mainContent=buildMainContent(fullStaticPath,pathname);
        if (pathname==='/'){
            folderName='Home'
        }
        //fill the template with the required data and the content
        data=data.replace('File-explorer',folderName);
        data=data.replace('pathname',breadCrumbs);
        data=data.replace('mainContent',mainContent);

        response.statusCode=200;
        response.write(data);
        return response.end();

    }
    if(!stats.isFile()){
        response.statusCode=401;
        response.write('401:Access denied!');
        return response.end();
    }
    //it is a file
    //lets get the file extension
    let fileDetails={}
        fileDetails.extname=path.extname(fullStaticPath);

    //get the file mime type and add it to the response folder
    getMimeType(fileDetails.extname)
        .then(mime=>{
            //store the headers
            let head={};
            let options={};
            //response status code
            let statusCode=200;
            head['Content-Type']=mime;
            //
            if(fileDetails.extname==='.pdf'){
                head['Content-Disposition']=
                    'inline';
                // head['Content-Disposition']='attachment;filename=file.pdf';
            }
            //audio-video files
            if(RegExp('audio').test(mime)||RegExp('video').test(mime)){
                head['Accept-Ranges']='bytes';
                const range=request.headers.range;
                console.log(`range:${range}`)
            }
            //streaming method;
            const fileStream=fs.createReadStream(fullStaticPath,options);
            //stream chunks to your response object
            response.writeHead(statusCode,head);
            fileStream.pipe(response);
            //events
            fileStream.on('close',()=>{
                return response.end();
            });
            fileStream.on('error',()=>{
                        console.log(error);
                        response.statusCode=404;
                        response.write(`404:file stream error`);
                            return response.end();
            });
        })
        .catch(err=>{
            response.statusCode=500
            response.write(`500:internal server error${err}`);
            return response.end();
        })
}
module.exports=respond;