var express = require('express');
var app = express();
var mysql = require('mysql');
var http = require('http');
var cors = require('cors');
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var mysqlConfig = require('./mysqlConfig.js');

var port = process.env.port || 3000;
app.use(cors());
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: false
}));
app.get('/', function (req, res) {
    res.send('Dashboard Rest apis');
});
//app.options('*', cors());

var pool = mysql.createPool(mysqlConfig);

app.get('/checkuser', function (req, res) {
    var username = req.query.username;
    var password = req.query.password;
    if (username === 'siva' && password === 'siva') {
        var results = [{ "userId": "1", "username": "siva", "status": "active" }];
        res.json(results);
    } else {
        pool.getConnection(function (err, connection) {
            if (err)
                res.send('Error occured while connecting to MySql');
            else {
                connection.query('select userId,username,status from users WHERE username = ? and password = ?', [username, password],
                    function (err, results) {
                        if (!err)
                            res.json(results);
                        connection.release();
                    });
            }
        });
    }
});

app.get('/getFriendsList', function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) {
            var results = [{ "userId": "1", "username": "Glazed", "status": "Active" },
            { "userId": "2", "username": "Sugar", "status": "Busy" },
            { "userId": "3", "username": "Chocolate", "status": "Inactive" },
            { "userId": "4", "username": "Maple", "status": "Offline" }];
            res.json(results);
        }
        else {
            connection.query('select userId,username,status from users',
                function (err, results) {
                    if (!err)
                        res.json(results);
                    connection.release();
                });
        }
    });
});

var is_friend = function (userId, friendId) {
    pool.getConnection(function (err, connection) {
        if (err)
            return true;
        else {
            connection.query('select friendslist from users WHERE userId = ?', [userId],
                function (err, result) {
                    if (result) {
                        if (result.includes(friendId))
                            return true;
                        else
                            return false;
                    }
                    connection.release();
                });
        }
    });
}

app.get('/getConversations', function (req, res) {
    var userId = req.query.userId;
    var friendId = req.query.friendId;
    var isFriend = is_friend(userId, friendId);

    if (isFriend) {
        pool.getConnection(function (err, connection) {
            if (err) {
                //send static data if unable to connect to mysql
                var results = [{ "username": "Siva", "message": "Nullam id dolor id nibh ultricies vehicula ut id elit.", "type": "self" },
                { "username": "Chocolate", "message": "Duis mollis, est non commodo luctus, nisi erat porttitor ligula.", "type": "other" },
                { "username": "Chocolate", "message": "simple message", "type": "other" },
                { "username": "Siva", "message": "Etiam porta sem malesuada magna mollis euismod.", "type": "self" }];
                res.json(results);
            }
            else {
                connection.query('select username,message,type from comversations_thread WHERE username = ? and friendname = ?', [username, friendname],
                    function (err, results) {
                        if (!err)
                            res.json(results);
                        connection.release();
                    });
            }
        });
    } else {
        var results = [{ "notafriend": "true" }];
        res.json(results);
    }
});

io.on('connection', function (socket) {
    console.log("A user is connected");
    socket.on('refresh friendslist', function (status) {
        get_list(status, function (res) {
            if (res) {
                io.emit('refresh friends list', status);
            } else {
                io.emit('error');
            }
        });
    });
});

var get_list = function (status, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            //send static data if unable to connect to mysql
            var results = [{ "userId": "1", "username": "Glazed", "status": "Active" },
            { "userId": "2", "username": "Sugar", "status": "Busy" },
            { "userId": "3", "username": "Chocolate", "status": "Inactive" },
            { "userId": "4", "username": "Maple", "status": "Offline" }];
            res.json(results);
        }
        else {
            connection.query('select userId,username,status from users',
                function (err, results) {
                    if (!err)
                        res.json(results);
                    connection.release();
                });
        }
    });
}

http.createServer(app).listen(port, function (req, res) {
    console.log('Server running at port no ' + port);
});