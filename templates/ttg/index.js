const http = require('http'),
      url = require('url'),
      fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

const fileName = 'DeviceInfoPanel';

const server = http.createServer((req, res) => {

  var myPath = url.parse(req.url).pathname;
  console.log(myPath)

  if(myPath.indexOf(fileName + ".css") != -1){
    var templateCss = fs.readFileSync('./' + fileName + '/' + fileName + '.css', 'utf8');
    res.writeHead(200, {'Content-Type': 'text/css', 'Content-Length':templateCss.length});
    res.write(templateCss);
    res.end();
  } else if(myPath.indexOf("page.css") != -1){
    var pageCss = fs.readFileSync('page.css', 'utf8');
    res.writeHead(200, {'Content-Type': 'text/css', 'Content-Length':pageCss.length});
    res.write(pageCss);
    res.end();
  } else if(myPath.indexOf("switch.css") != -1){
    var switchCss = fs.readFileSync('switch.css', 'utf8');
    res.writeHead(200, {'Content-Type': 'text/css', 'Content-Length':switchCss.length});
    res.write(switchCss);
    res.end();
  }  
  else {

    var index = fs.readFileSync('index.html', 'utf8');

    var templateHtml = fs.readFileSync('./' + fileName + '/' + fileName + '.html');
    
    var cssPos = index.indexOf('<link rel="stylesheet" href="') + '<link rel="stylesheet" href="'.length;
    var tempHtlm = [index.slice(0, cssPos), './' + fileName + '/' + fileName + '.css', index.slice(cssPos)].join('');
    
    var bodyPos = tempHtlm.indexOf('<body>') + "<body>".length;
    var retHtlm = [tempHtlm.slice(0, bodyPos), '\n' + templateHtml, tempHtlm.slice(bodyPos)].join('');

    res.statusCode = 200;
    res.writeHead(200, {'Content-Type': 'text/html','Content-Length':retHtlm.length});
    res.write(retHtlm)
    res.end();
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
