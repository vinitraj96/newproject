var forever = require('forever-monitor');

var today;

var child = new (forever.Monitor)('and_server.js', {
   max: 3,
   silent: true,
   options: []
});

child.on('exit', function () {
   console.log('server.js has exited after 3 restarts');
});

child.start();


child.on('watch:restart', function(info) {
	 today=new Date();
    console.error('Restaring script because ' + info.file + ' changed  on '+today);
});

child.on('restart', function() {
	 today=new Date();
    console.error('Forever restarting script for ' + child.times + ' time on '+today);
});

child.on('exit:code', function(code) {
	 today=new Date();
    console.error('Forever detected script exited with code ' + code+' on '+today);
});
