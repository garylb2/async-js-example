let express = require('express');
let app = express();
let api = express();

const rateLimit = require("express-rate-limit");
const port = process.env.PORT || 3000;
const routes = require('./routes');
const swaggerUi = require('./swaggerUi');

// setup the SwaggerUi Interface
swaggerUi.setup(app);

// add an artificial delay
api.use((req,res,next) => {setTimeout(next,100)});

// setup base routes
routes.setup(api);

// add root lvl routes
app.use('', api);

const limiter = rateLimit({
  windowMs: 1000, // 1 sec
  max: 4 // limit each IP to max requests per windowMs
});
const limitRoute = '/limited/';
// only apply to requests that begin with /limited/
api.use(limitRoute, limiter);
app.use(limitRoute, api);

app.listen(port);


console.log('simple employee RESTful API server started on: ' + port);
