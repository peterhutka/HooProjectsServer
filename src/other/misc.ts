import express from 'express';
const app = express();
export const http = require('http').createServer(app);

export function httpListenCallback(http:any) {
  return()=>{
    var host = http.address().address
    var port = http.address().port
    console.info('App listening at http://%s:%s', host, port)
  }
  
}

export function setHttp(http: any){
  require('http').createServer(app);
}