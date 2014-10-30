'use strict';

var request = require('request');
var base = 'https://www.parsehub.com';

/**
 * Constructor - takes your ParseHub API key
 */
function ParseHub(apiKey)
{
	if (!apiKey)
		throw Error('Please specify a ParseHub API key');

	this._apiKey = apiKey;
}

/**
 * Return a list of all jobs belonging to you
 *
 * Parameters:
 *
 * include_last_run (Optional) - If set to anything other than '0', each job object in the result includes a last_run property containing the run object for the last run that was initiated for this job. If no runs have been initiated for the job, the last_run property is not included. Defaults to '0'.
 *
 * On success, returns an object with:
 *
 * scrapejobs - A list of all your job objects. Each job object may have an additional last_run property, depending on the include_last_run parameter.
 */
ParseHub.prototype.getAllJobs = function(params, callback)
{
	var callback = callback || params || function(){};
	params = (typeof params === 'object') ? params : {};

	params.api_key = this._apiKey;

	request({
		url: base + '/api/scrapejob',
		qs: params
	},
	function(err, resp, body)
	{
		if (resp.statusCode !== 200)
			return callback(new Error(body));

		try
		{
			var json = JSON.parse(body);
			callback(err, json.scrapejobs || []);
		}
		catch (e)
		{
			callback(new Error('Could not parse response body'));
		}
	});
};

/**
 * Delete an existing job
 *
 * Parameters:
 *
 * token - The token of the job you'd like to delete
 *
 * On success, returns an object with:
 *
 * token - The token of the job that was deleted
 */
ParseHub.prototype.deleteJob = function(params, callback)
{
	var callback = callback || function(){};

	if (!params || !params.token)
		throw new Error('Please specify a job token');

	params.api_key = this._apiKey;

	request.post({
		url: base + '/api/scrapejob/delete',
		formData: params
	},
	function(err, resp, body)
	{
		if (resp.statusCode !== 200)
			return callback(new Error(body));

		try
		{
			var json = JSON.parse(body);
			callback(err, json.token);
		}
		catch (e)
		{
			callback(new Error('Could not parse response body'));
		}
	});
}

/**
 * Run an instance of a job that was previously created
 *
 * Parameters:
 *
 * token - The token of the job you'd like to run
 * start_url (Optional) - Run the job starting at this url rather than on the default starting url for the job
 * start_value_override (Optional) - Override the starting JSON value of the global scope. This can be used to pass parameters to your run. For example, you may pass {'query': 'San Francisco'} in order to use the query in an expression somewhere in your job.
 *
 * On success, returns an object with:
 *
 * run_token - The unique identifier of the run that was created
 */
ParseHub.prototype.runJob = function(params, callback)
{
	var callback = callback || function(){};

	if (!params || !params.token)
		throw new Error('Please specify a job token');

	params.api_key = this._apiKey;

	request.post({
		url: base + '/api/scrapejob/run',
		formData: params
	},
	function(err, resp, body)
	{
		if (resp.statusCode !== 200)
			return callback(new Error(body));

		try
		{
			var json = JSON.parse(body);
			callback(err, json.run_token);
		}
		catch (e)
		{
			callback(new Error('Could not parse response body'));
		}
	});
};

/**
 * Return the status of a single run of one of your jobs
 *
 * Parameters:
 *
 * run_token - The unique identifier of the run that you'd like to get the status of
 *
 * On success, returns an object with:
 *
 * run - The run object corresponding to the run_token provided
 */
ParseHub.prototype.getRunStatus = function(params, callback)
{
	var callback = callback || function(){};

	if (!params || !params.run_token)
		throw new Error('Please specify a run token');

	params.api_key = this._apiKey;

	request({
		url: base + '/api/scrapejob/run_status',
		qs: params
	},
	function(err, resp, body)
	{
		if (resp.statusCode !== 200)
			return callback(new Error(body));

		try
		{
			var json = JSON.parse(body);
			callback(err, json || {});
		}
		catch (e)
		{
			callback(new Error('Could not parse response body'));
		}
	});
};

/**
 * Return a list of all runs of one of your jobs
 *
 * Parameters:
 *
 * token - The unique identifier of the job that you'd like to get the status of
 *
 * On success, returns an object with:
 *
 * runList - A list of all run objects corresponding to this job.
 */
ParseHub.prototype.getStatus = function(params, callback)
{
	var callback = callback || function(){};

	if (!params || !params.token)
		throw new Error('Please specify a job token');

	params.api_key = this._apiKey;

	request({
		url: base + '/api/scrapejob/status',
		qs: params
	},
	function(err, resp, body)
	{
		if (resp.statusCode !== 200)
			return callback(new Error(body));

		try
		{
			var json = JSON.parse(body);
			callback(err, json.runList);
		}
		catch (e)
		{
			callback(new Error('Could not parse response body'));
		}
	});
};

/**
 * Cancel a single run
 *
 * Parameters:
 *
 * run_token	The unique identifier of the run you'd like to cancel
 *
 * On success, returns an object with:
 *
 * run_token	The unique identifier of the run that was cancelled
 */
ParseHub.prototype.cancelRun = function(params, callback)
{
	var callback = callback || function(){};

	if (!params || !params.run_token)
		throw new Error('Please specify a run token');

	params.api_key = this._apiKey;

	request.post({
		url: base + '/api/scrapejob/cancel',
		formData: params
	},
	function(err, resp, body)
	{
		if (resp.statusCode !== 200)
			return callback(new Error(body));

		try
		{
			var json = JSON.parse(body);
			callback(err, json.run_token);
		}
		catch (e)
		{
			callback(new Error('Could not parse response body'));
		}
	});
};

 /**
 * Get the result of a single run
 *
 * Parameters:
 *
 * run_token - The unique identifier of the run for which you'd like to download the data
 * format (Optional) - If set to 'csv', results will be in a CSV format. Otherwise, they will be in a JSON format. Note that results will be zipped in either case unless the 'raw' parameter is set.
 * raw (Optional) - If set to anything other than '0', returns a raw json response instead of a zip file containing a json file. Defaults to '0', and cannot be changed for responses which have an uncompressed size > 3 MB.
 *
 * On success, if raw is '0':
 *
 * Returns a zip file with a single json file inside it. The json file has the same name as the run_token.
 *
 * On success, if raw is not '0':
 *
 * Returns a json response which is the global scope of the run.
 */
ParseHub.prototype.getResults = function(params, callback)
{
	var callback = callback || function(){};

	if (!params || !params.run_token)
		throw new Error('Please specify a run token');

	params.api_key = this._apiKey;
	params.raw = 1; // @todo - zip files are not supported

	request({
		url: base + '/api/scrapejob/dl',
		qs: params
	},
	function(err, resp, body)
	{
		if (resp.statusCode !== 200)
			return callback(new Error(body));

		try
		{
			if (params.raw && params.raw !== 0)
			{
				var json = JSON.parse(body);
				callback(err, json);
			}
			else
				callback(err, body);
		}
		catch (e)
		{
			callback(new Error('Could not parse response body'));
		}
	});
};
module.exports = ParseHub;