#Async concurrency

When consuming data from an API with follow-up requests, you can often end up making a large number of requests at the same time.  If you make too many requests at once to any given endpoint or API, you can either overwhelm the API or result in error code 429 (Too Many Requests).

To minimize both, you can specify a concurrency limit for any collection of requests.

![Concurrency Diagram](Concurrency.png)
