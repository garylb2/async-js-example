# Examples of using Async JS to Consume API data

## Example Usage
```
./cli.js -s                      starts the example REST API server
./cli.js -r salaryByTeamSync     consumes API data synchronously to generate report
./cli.js -r salaryByTeamSlower   consumes API data asynchronously slightly less efficiently to generate report
./cli.js -r salaryByTeamAsync    consumes API data asynchronously to generate report (typically fastest)
./cli.js -r salaryByTeamPromise  consumes API data asynchronously with Promises to generate report (equivalent to Async implementation)
./cli.js -r rateLimited          consumes API data asynchronously with error handling/retries
```

Once you are running the example REST API server, open a browser to the following to see the common endpoints.
http://localhost:3000/swagger-ui
