# ParseHub Node.js Client

![ParseHub icon](https://www.parsehub.com/static/images/parsehub_logo2.svg)

## Overview

This is the **unofficial** Node.js client for [ParseHub](https://www.parsehub.com/), a platform for scraping websites and creating APIs out of the extracted data.

### Install

    npm install parsehub --save

### Usage

Require the module and initialize an instance using your ParseHub API key.

    var ParseHub = require('parsehub'),
    var api = new ParseHub(yourApiKey);

**Return a list of all jobs belonging to you**

```
api.getAllJobs(function(err, jobs)
{
	console.log(jobs);
});

api.getAllJobs({ include_last_run: true }, function(err, jobs)
{
	console.log(jobs);
});
```

*Parameters*

* include_last_run (Optional) - If set to anything other than '0', each job object in the result includes a last_run property containing the run object for the last run that was initiated for this job. If no runs have been initiated for the job, the last_run property is not included. Defaults to '0'.

*On success, returns an object with*

* scrapejobs - A list of all your job objects. Each job object may have an additional last_run property, depending on the include_last_run parameter.

**Delete an existing job**

```
api.deleteJob({ token: 'your_token' }, function(err, deletedJobToken)
{
	console.log(deletedJobToken);
});
```
*Parameters*

* token - The token of the job you'd like to delete

*On success, returns an object with*

* token - The token of the job that was deleted

**Run an instance of a job that was previously created**

```
api.runJob({ token: 'your_token' }, function(err, runToken)
{
	console.log(runToken);
});
```
*Parameters*

* token - The token of the job you'd like to run
* start_url (Optional) - Run the job starting at this url rather than on the default starting url for the job
* start_value_override (Optional) - Override the starting JSON value of the global scope. This can be used to pass parameters to your run. For example, you may pass {'query': 'San Francisco'} in order to use the query in an expression somewhere in your job.

*On success, returns an object with*

* run_token - The unique identifier of the run that was created

**Return the status of a single run of one of your jobs**

```
api.getRunStatus({ run_token: 'your_token' }, function(err, run)
{
	console.log(run);
});
```
*Parameters*

* run_token - The unique identifier of the run that you'd like to get the status of

*On success, returns an object with*

* run - The run object corresponding to the run_token provided

**Return a list of all runs of one of your jobs**

```
api.getStatus({ token: 'your_token' }, function(err, runList)
{
	console.log(runList);
});
```
*Parameters*

* token - The unique identifier of the job that you'd like to get the status of

*On success, returns an object with*

* runList - A list of all run objects corresponding to this job.

**Cancel a single run**

```
api.cancelRun({ run_token: 'your_token' }, function(err, cancelledRunToken)
{
	console.log(cancelledRunToken);
});
```
*Parameters*

* run_token	The unique identifier of the run you'd like to cancel

*On success, returns an object with*

* run_token	The unique identifier of the run that was cancelled

**Get the result of a single run**

```
api.getResults({ run_token: 'your_token' }, function(err, results)
{
	console.log(results);
});
```
*Parameters*

* run_token - The unique identifier of the run for which you'd like to download the data
* format (Optional) - If set to 'csv', results will be in a CSV format. Otherwise, they will be in a JSON format. Note that results will be zipped in either case unless the 'raw' parameter is set.
* raw (Optional) - If set to anything other than '0', returns a raw json response instead of a zip file containing a json file. Defaults to '0', and cannot be changed for responses which have an uncompressed size > 3 MB. **This parameter has not been implemented.**

*On success, if raw is '0'*

* Returns a zip file with a single json file inside it. The json file has the same name as the run_token. **Not implemented**

*On success, if raw is not '0'*

* Returns a json response which is the global scope of the run.

