let express = require('express'),
  app = express();

const port = process.env.PORT || 3000;
const controllers = require('./controllers');

app.route('/employees')
  .get(controllers.get_all_employees);

app.route('/employee/:employeeId')
  .get(controllers.get_employee);

app.route('/locations')
  .get(controllers.get_all_locations);

app.route('/location/:locationId')
  .get(controllers.get_location);

app.route('/teams')
  .get(controllers.get_all_teams);

app.route('/team/:teamId')
  .get(controllers.get_team);

app.listen(port);



console.log('simple employee RESTful API server started on: ' + port);
