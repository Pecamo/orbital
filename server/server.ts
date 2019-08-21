import express from 'express';
import expressWsWrapper from 'express-ws';

const app = express();
const expressWs = expressWsWrapper(app);

app.use(function (req, res, next) {
  console.log('middleware');
  req.testing = 'testing';
  return next();
});

app.use('/static', express.static('public'));

app.get('/', function(req, res, next){
  console.log('get route', req.testing);
  res.end();
});

// @ts-ignore
app.ws('/', function(ws, req) {
  ws.on('message', function(msg) {
    console.log(msg);
  });
  console.log('socket', req.testing);
});

app.listen(3000);
