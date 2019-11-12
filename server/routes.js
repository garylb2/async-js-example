const controllers = require('./controllers');

const setup = (root) => {
  /**
   * @swagger
   *
   * definitions:
   *   Employee:
   *     type: object
   *     properties:
   *       id:
   *         type: number
   *         format: int64
   *       name:
   *         type: string
   *       salary:
   *         type: number
   *         format: int64
   *       title:
   *         type: string
   *       locationId:
   *         type: number
   *         format: int64
   *       teamId:
   *         type: number
   *         format: int64
   *       required:
   *         - id
   *   Location:
   *     properties:
   *       id:
   *         type: number
   *         format: int64
   *       city:
   *         type: string
   *       state:
   *         type: string
   *       address:
   *         type: string
   *   Team:
   *     properties:
   *       id:
   *         type: number
   *         format: int64
   *       name:
   *         type: string
   *   Object:
   *     properties:
   *       id:
   *         type: integer
   *         format: int64
   */

   /**
    * @swagger
    * /employees:
    *   get:
    *     description: Returns Employee Ids
    *     produces:
    *      - application/json
    *     responses:
    *       200:
    *         description: Employee Ids
    *         schema:
    *           type: array
    *           items:
    *             $ref: '#/definitions/Object'
    */
  root.route('/employees')
    .get(controllers.get_all_employees);

    /**
     * @swagger
     * /employee/{id}:
     *   get:
     *     description: Returns specific employee
     *     produces:
     *      - application/json
     *     parameters:
     *       - name: id
     *         type: integer
     *         format: int64
     *         required: true
     *         in: path
     *         description: Employee Id
     *     responses:
     *       200:
     *         description: Employee data
     *         schema:
     *           $ref: '#/definitions/Employee'
     */
  root.route('/employee/:id')
    .get(controllers.get_employee);

    /**
     * @swagger
     * /locations:
     *   get:
     *     description: Returns Location Ids
     *     produces:
     *      - application/json
     *     responses:
     *       200:
     *         description: Location Ids
     *         schema:
     *           type: array
     *           items:
     *             $ref: '#/definitions/Object'
     */
  root.route('/locations')
    .get(controllers.get_all_locations);

    /**
     * @swagger
     * /location/{id}:
     *   get:
     *     description: Returns specific location
     *     produces:
     *      - application/json
     *     parameters:
     *       - name: id
     *         type: integer
     *         format: int64
     *         required: true
     *         in: path
     *         description: Location Id
     *     responses:
     *       200:
     *         description: Location data
     *         schema:
     *           $ref: '#/definitions/Location'
     */
  root.route('/location/:id')
    .get(controllers.get_location);

    /**
     * @swagger
     * /teams:
     *   get:
     *     description: Returns Team Ids
     *     produces:
     *      - application/json
     *     responses:
     *       200:
     *         description: Team Ids
     *         schema:
     *           type: array
     *           items:
     *             $ref: '#/definitions/Object'
     */
  root.route('/teams')
    .get(controllers.get_all_teams);

    /**
     * @swagger
     * /team/{id}:
     *   get:
     *     description: Returns specific team
     *     produces:
     *      - application/json
     *     parameters:
     *       - name: id
     *         type: integer
     *         format: int64
     *         required: true
     *         in: path
     *         description: Team Id
     *     responses:
     *       200:
     *         description: Team data
     *         schema:
     *           $ref: '#/definitions/Team'
     */
  root.route('/team/:id')
    .get(controllers.get_team);
};

exports.setup = setup;
