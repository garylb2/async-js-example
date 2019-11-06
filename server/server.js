let express = require('express'),
  app = express();

const port = process.env.PORT || 3000;
const controllers = require('./controllers');

app.use((req,res,next) => {setTimeout(next,100)});

app.route('/employees')
  .get(controllers.get_all_employees);

app.route('/employee/:id')
  .get(controllers.get_employee);

app.route('/locations')
  .get(controllers.get_all_locations);

app.route('/location/:id')
  .get(controllers.get_location);

app.route('/teams')
  .get(controllers.get_all_teams);

app.route('/team/:id')
  .get(controllers.get_team);

app.listen(port);



console.log('simple employee RESTful API server started on: ' + port);
