var express = require('express');
var app = express();

app.set('port', process.env.PORT || 3002);
app.use(express.static(__dirname + '/app'));

app.listen(app.get('port'), function() {
});