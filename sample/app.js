var express = require('express'),
		azure = require('azure');

var app = express();

app.configure(function(){
	app.use("/static", express.static(__dirname + '/static'));
	
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
});

app.get("/", function(req, res) {
	res.sendfile(__dirname + '/static/index.html');
});

app.post('/messages', function(req, res){
	var queueName = 'clouddevconf';
	var retryOperations = new azure.ExponentialRetryPolicyFilter();
	var queueService = azure.createQueueService(STORAGE_ACCOUNT, STORAGE_KEY)
													.withFilter(retryOperations);
	
	queueService.createQueueIfNotExists(queueName, function (error) {
		if(error) return next(err);
	
		var content = JSON.stringify(req.body);
		queueService.createMessage(queueName, content, function(error) {
			if(error) return next(err);
			
			console.log("Enqueuing message: %s", content);
			res.send(200);
		});
	});
});

app.listen(process.env.PORT || 3000);