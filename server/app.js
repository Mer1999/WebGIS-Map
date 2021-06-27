const express = require('express');   //引入express模块
const mysql = require('mysql');     //引入mysql模块
const app = express();        //创建express的实例
var nowuser="nobody";


app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Orign', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.get('/',function(req,res,next){
    res.send('helloworld');
})

//注册请求
app.get('/register',(req, res) => {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'mer',
        password: '123456',
        database: 'Map',
    });
    connection.connect( (err) => {
        if(err) {
            console.log('connect error');
            return;
        }
        console.log('connection as id:', connection.threadId);
    });
    function doreg(){
        var useraddsql='INSERT INTO user(Username,Password) VALUES(?,md5(?))';
        var useraddsql_params=[req.query.usrname,req.query.pwd];
        connection.query(useraddsql,useraddsql_params, (err, fields) => {
        if(err)
            throw err;
        console.log('insert fields:', fields);
        nowuser=req.query.usrname;
        const cb=req.query.cb;
        const data=cb+"({result:'注册成功'})";
        res.send(data);
        });
    }
    var checkusersql='SELECT Username FROM user WHERE Username=?';
    var checkusersql_params=[req.query.usrname];
    connection.query(checkusersql,checkusersql_params,(err,fields)=>{
        if(fields==''){
            doreg();
        }
        else{
            const cb2=req.query.cb;
            const data2=cb2+"({result:'用户名重复'})"
            res.send(data2);
        }
    });
});

//登录请求
app.get('/login',(req, res) => {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'mer',
        password: '123456',
        database: 'Map',
    });
    connection.connect( (err) => {
        if(err) {
            console.log('connect error');
            return;
        }
        console.log('connection as id:', connection.threadId);
    });

    //可恶啊是异步，用嵌套来实现同步
    function dolog(){
        var userlogsql='SELECT Username FROM user WHERE Username=? AND Password=md5(?)';
        var userlogsql_params=[req.query.usrname,req.query.pwd];
        connection.query(userlogsql,userlogsql_params, (err, fields) => {
            if(fields==''){//密码错误
                const cb4=req.query.cbl;
                const data4=cb4+"({result:'密码错误'})"
                res.send(data4);
            }
            else{
                nowuser=req.query.usrname;
                const cb5=req.query.cbl;
                const data5=cb5+"({result:'登录成功'})"
                res.send(data5);
            }
        });
    }
    var checkusersql='SELECT Username FROM user WHERE Username=?';
    var checkusersql_params=[req.query.usrname];
    connection.query(checkusersql,checkusersql_params,(err,fields)=>{
        if(fields==''){//用户名不存在
            const cb3=req.query.cbl;
            const data3=cb3+"({result:'用户名不存在'})"
            res.send(data3);
        }
        else{//用户存在，执行dolog
            dolog();
        }
    });
});

//获取当前登录用户
app.get('/getnowuser',(req,res)=>{
    const cb6=req.query.cbg;
    const data6=cb6+"({result:'"+nowuser+"'})";
    //console.log("data6:",data6);
    res.send(data6);
});

//登出请求
app.get('/logout',(req,res)=>{
    console.log("logout:",nowuser);
    nowuser='nobody';//将nowuser置为nobody
    const cb7=req.query.cbo;
    const data7=cb7+"({result:'登出成功'})";
    //console.log("data6:",data6);
    res.send(data7);
});

//收藏请求
app.get('/star',(req, res) => {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'mer',
        password: '123456',
        database: 'Map',
    });
    connection.connect( (err) => {
        if(err) {
            console.log('connect error');
            return;
        }
        console.log('connection as id:', connection.threadId);
    });
    var placeaddsql='INSERT INTO place(Username,Placename,Placeinfo,Placelng,Placelat) VALUES(?,?,?,?,?)';
    var placeaddsql_params=[req.query.Username,req.query.Placename,req.query.Placeinfo,req.query.Placelng,req.query.Placelat];
    connection.query(placeaddsql,placeaddsql_params, (err, fields) => {
    if(err)
        throw err;
    console.log('star fields:', fields);
    const cb8=req.query.cbstar;
    const data8=cb8+"({result:'收藏成功'})";
    res.send(data8);
    connection.end();
    });
});

//取消收藏请求
app.get('/unstar',(req, res) => {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'mer',
        password: '123456',
        database: 'Map',
    });
    connection.connect( (err) => {
        if(err) {
            console.log('connect error');
            return;
        }
        console.log('connection as id:', connection.threadId);
    });

    var placeaddsql='DELETE FROM place WHERE Username=? AND Placename=? AND Placeinfo=?';
    var placeaddsql_params=[req.query.Username,req.query.Placename,req.query.Placeinfo];
    connection.query(placeaddsql,placeaddsql_params, (err, fields) => {
    if(err)
        throw err;
    console.log('unstar fields:', fields);
    const cb9=req.query.cbunstar;
    const data9=cb9+"({result:'取消收藏'})";
    res.send(data9);
    connection.end();
    });
});

//查询是否收藏请求
app.get('/isstar1',(req, res) => {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'mer',
        password: '123456',
        database: 'Map',
    });
    connection.connect( (err) => {
        if(err) {
            console.log('connect error');
            return;
        }
        console.log('connection as id:', connection.threadId);
    });

    var placechecksql='SELECT Placeid FROM place WHERE Username=? AND Placename=? AND Placeinfo=?';
    //console.log("checksql",req.query.Username+req.query.Placename+req.query.Placeinfo);
    var placechecksql_params=[req.query.Username,req.query.Placename,req.query.Placeinfo];
    connection.query(placechecksql,placechecksql_params, (err, fields) => {
    if(err)
        throw err;
    console.log('isstar fields:', fields);
    if(fields==''){//没有收藏
        const cb101=req.query.cbis;
        const data101=cb101+"({result:'no'})";
        res.send(data101);
        connection.end();
    }
    else{
        const cb111=req.query.cbis;
        const data111=cb111+"({result:'yes'})";
        res.send(data111);
        connection.end();
    }
    });
});

app.get('/isstar2',(req, res) => {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'mer',
        password: '123456',
        database: 'Map',
    });
    connection.connect( (err) => {
        if(err) {
            console.log('connect error');
            return;
        }
        console.log('connection as id:', connection.threadId);
    });

    var placechecksql='SELECT Placeid FROM place WHERE Username=? AND Placename=? AND Placeinfo=?';
    //console.log("checksql",req.query.Username+req.query.Placename+req.query.Placeinfo);
    var placechecksql_params=[req.query.Username,req.query.Placename,req.query.Placeinfo];
    connection.query(placechecksql,placechecksql_params, (err, fields) => {
    if(err)
        throw err;
    console.log('isstar fields:', fields);
    if(fields==''){//没有收藏
        const cb102=req.query.cbis;
        const data102=cb102+"({result:'no'})";
        res.send(data102);
        connection.end();
    }
    else{
        const cb112=req.query.cbis;
        const data112=cb112+"({result:'yes'})";
        res.send(data112);
        connection.end();
    }
    });
});

app.get('/isstar3',(req, res) => {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'mer',
        password: '123456',
        database: 'Map',
    });
    connection.connect( (err) => {
        if(err) {
            console.log('connect error');
            return;
        }
        console.log('connection as id:', connection.threadId);
    });

    var placechecksql='SELECT Placeid FROM place WHERE Username=? AND Placename=? AND Placeinfo=?';
    //console.log("checksql",req.query.Username+req.query.Placename+req.query.Placeinfo);
    var placechecksql_params=[req.query.Username,req.query.Placename,req.query.Placeinfo];
    connection.query(placechecksql,placechecksql_params, (err, fields) => {
    if(err)
        throw err;
    console.log('isstar fields:', fields);
    if(fields==''){//没有收藏
        const cb103=req.query.cbis;
        const data103=cb103+"({result:'no'})";
        res.send(data103);
    }
    else{
        const cb113=req.query.cbis;
        const data113=cb113+"({result:'yes'})";
        res.send(data113);
    }
    });
});

app.get('/isstar4',(req, res) => {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'mer',
        password: '123456',
        database: 'Map',
    });
    connection.connect( (err) => {
        if(err) {
            console.log('connect error');
            return;
        }
        console.log('connection as id:', connection.threadId);
    });

    var placechecksql='SELECT Placeid FROM place WHERE Username=? AND Placename=? AND Placeinfo=?';
    //console.log("checksql",req.query.Username+req.query.Placename+req.query.Placeinfo);
    var placechecksql_params=[req.query.Username,req.query.Placename,req.query.Placeinfo];
    connection.query(placechecksql,placechecksql_params, (err, fields) => {
    if(err)
        throw err;
    console.log('isstar fields:', fields);
    if(fields==''){//没有收藏
        const cb104=req.query.cbis;
        const data104=cb104+"({result:'no'})";
        res.send(data104);
    }
    else{
        const cb114=req.query.cbis;
        const data114=cb114+"({result:'yes'})";
        res.send(data114);
    }
    });
});

app.get('/isstar5',(req, res) => {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'mer',
        password: '123456',
        database: 'Map',
    });
    connection.connect( (err) => {
        if(err) {
            console.log('connect error');
            return;
        }
        console.log('connection as id:', connection.threadId);
    });

    var placechecksql='SELECT Placeid FROM place WHERE Username=? AND Placename=? AND Placeinfo=?';
    //console.log("checksql",req.query.Username+req.query.Placename+req.query.Placeinfo);
    var placechecksql_params=[req.query.Username,req.query.Placename,req.query.Placeinfo];
    connection.query(placechecksql,placechecksql_params, (err, fields) => {
    if(err)
        throw err;
    console.log('isstar fields:', fields);
    if(fields==''){//没有收藏
        const cb105=req.query.cbis;
        const data105=cb105+"({result:'no'})";
        res.send(data105);
    }
    else{
        const cb115=req.query.cbis;
        const data115=cb115+"({result:'yes'})";
        res.send(data115);
    }
    });
});

//获取用户收藏列表
app.get('/userplace',(req, res) => {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'mer',
        password: '123456',
        database: 'Map',
    });
    connection.connect( (err) => {
        if(err) {
            console.log('connect error');
            return;
        }
        console.log('connection as id:', connection.threadId);
    });

    var placegetsql='SELECT Placename,Placeinfo,Placelng,Placelat FROM place WHERE Username=?';
    //console.log("checksql",req.query.Username+req.query.Placename+req.query.Placeinfo);
    var placegetsql_params=[req.query.usrname];
    //var data={};//保存数据
    connection.query(placegetsql,placegetsql_params, (err,rows, fields) => {
    if(err)
        throw err;
    console.log('getplace fields:', fields,rows,req.query.usrname);
    if(fields==''){//当前用户无收藏
        const cb12=req.query.cblt;
        const data12=cb12+"({result:'no'})";
        res.send(data12);
    }
    else{
        var data=JSON.stringify(rows);
        var json=JSON.parse(data);
        var result={
            "status":200,
            "message":"success",
            "results":json
        }
        var cb13=req.query.cblt;
        var data13=cb13+'('+JSON.stringify(result)+')';
        console.log('data:',data13,json,result);
        res.send(data13);
    }
    });
});

app.listen(8000,function () {    //监听8000端口
    console.log('Server running at 8000 port');
});