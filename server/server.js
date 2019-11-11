let express = require('express');
let app = express();
let api = express();

const rateLimit = require("express-rate-limit");
const port = process.env.PORT || 3000;
const controllers = require('./controllers');

api.use((req,res,next) => {setTimeout(next,100)});

api.route('/employees')
  .get(controllers.get_all_employees);

api.route('/employee/:id')
  .get(controllers.get_employee);

api.route('/locations')
  .get(controllers.get_all_locations);

api.route('/location/:id')
  .get(controllers.get_location);

api.route('/teams')
  .get(controllers.get_all_teams);

api.route('/team/:id')
  .get(controllers.get_team);

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
