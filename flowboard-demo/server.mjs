import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
const files={'/':'index.html','/index.html':'index.html','/app.js':'app.js','/board.js':'board.js','/style.css':'style.css'};
const mime={html:'text/html; charset=utf-8',js:'text/javascript; charset=utf-8',css:'text/css; charset=utf-8'};
createServer(async(req,res)=>{const file=files[new URL(req.url,'http://localhost').pathname];if(!file){res.writeHead(404);return res.end('Not found');}try{const body=await readFile(new URL(file,import.meta.url));res.writeHead(200,{'Content-Type':mime[file.split('.').pop()],'X-Content-Type-Options':'nosniff'});res.end(body);}catch{res.writeHead(500);res.end('Server error');}}).listen(Number(process.env.PORT??3000),'127.0.0.1',()=>console.log(`Flowboard: http://127.0.0.1:${process.env.PORT??3000}`));
