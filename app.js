// 模块导入
const fs=require('fs');
const path=require('path');
const http=require('http');
const mime=require('mime');
// 记录网站根目录
let rootPath=path.join(__dirname,'www');
console.log(rootPath);
// 创建服务器
let server=http.createServer((request,response)=>{
    // 生成地址
    let targetPath=path.join(rootPath,request.url);
    console.log(targetPath);
    // 判断路径是否存在，如果存在，就判断其是文件还是文件夹
    if(fs.existsSync(targetPath)){
        // fs.stat()提供了一个文件的信息
        fs.stat(targetPath,(error,data)=>{
            // 是文件直接读取
            if(data.isFile()){
                response.setHeader('content-type',mime.getType(targetPath)+';charset="utf-8"');
                fs.readFile(targetPath,(error,data)=>{
                    response.end(data);
                })
            }
            else if(data.isDirectory()){
                fs.readdir(targetPath,(error,files)=>{
                    let tem="";
                    console.log(request.url);
                    for(let i=0;i<files.length;i++){
                        tem+=
                        `
                        <li><a href="${request.url}${request.url=='/'?'':'/'}${files[i]}">${files[i]}</a></li>
                          
                         `
                    }
                       // 读取完毕之后再返回
                response.end(
                    `
                    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
                        <html>
                        
                        <head>
                            <title>Index of/ </title>
                        </head>
                        
                        <body>
                            <h1>Index of ${request.url}</h1>
                            <ul>
                                ${tem}
                            </ul>
                        </body>
                        
                        </html>
                    `
                )
                })
               
            }
        })
    }
    // 如果路径不存在
    else {
        response.statusCode=404;
        response.setHeader("content-type","text/html;charset=utf-8");
        response.end(
            ` <!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
            <html><head>
            <title>404 Not Found</title>
            </head><body>
            <h1>Not Found</h1>
            <p>你请求的${request.url} 不在服务器上哦,检查一下呗</p>
            </body></html>
            `
        )
      
    }
})
// 监听
server.listen(8848,'127.0.0.1',()=>{
    console.log("开启成功");
})