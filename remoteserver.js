const express = require('express');
const stompit = require('stompit')
const date = require('date-and-time')
const {Pool,Client} = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://postgres:password@192.168.209.101:5432/myedgedb',
})
//const app = express();
const port = process.env.PORT || 8585;


//app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

// routes will go here
/*
app.get('/', function(req, res){
    res.send('Hello world Remote Server');
  });
*/

  count = 0;


stompit.connect({ host: '192.168.209.101', port: 61613 }, (err, rclient) => {
 
    rclient.subscribe({ destination: 'LocalToInternet' }, (err, msg) => {
       
    msg.readString('UTF-8', async(err, body) => {

        await  setTimeout( function() {
          var now  =  new Date();
          var timestampvalue = date.format(now,'YYYY-MM-DD HH:mm:ss');
            console.log('This printed after about 2 second '+timestampvalue);
             console.log(" [x] Received %s ", body);

             //var msgarray = [];
             var msgarray = body.split(",");

             console.log(msgarray);
             var myuser = msgarray[0];
             var myapp = msgarray[1];
             var datetime = msgarray[2];
             var duration = msgarray[3];
             console.log(myuser);
             console.log(myapp);
             console.log(datetime);
             console.log(duration);

                
                const insertText = 'INSERT INTO edgetable(username,myapp, datetime,duration) VALUES ($1,$2,$3,$4) RETURNING *';
                const values = [myuser,myapp,timestampvalue,duration];

                pool.query(insertText, values, async (err, result) => {
        
                        if (err) {
                            console.log(err.stack);
                            
                            res.send(err.stack);
                        }else {
                          console.log("row inserted to DB");
                            console.log(result.rows[0]);
                            
                        }
                }); // pool query end

                

          }, 2000); // await timeout function.
      //console.log(body)
 
      //rclient.disconnect()

    })// msg reading
 
  })//rclient subscribe
 
  rclient.subscribe({ destination: 'LocalToInternetAccess' }, async(err, msg) => {
    var mycurdate = new Date();
    var mycurdateonly = date.format(mycurdate,'YYYY-MM-DD');
    console.log("current date only : " + mycurdateonly)
    var mycurdateonlystr = mycurdateonly + ' 00:00:00.000';
    console.log("current date only str : " + mycurdateonlystr)

    mycurdate.setDate(mycurdate.getDate() + 1);
    var mynextdateonly = date.format(mycurdate,'YYYY-MM-DD');
    console.log("next date only : " + mynextdateonly);
    var mynextdateonlystr = mynextdateonly + ' 00:00:00.000';
    console.log("next date only str : " + mynextdateonlystr)
    var myappedu = "Education"   ;
    var finalAccess = "Allowed";
    msg.readString('UTF-8', async(err, body) => {

        await  setTimeout( function() {
                
          console.log(" [x] LocalToInternetAccess Received %s ", body)

          const selectText = "select sum(duration) from edgetable where myapp not in ($1) and datetime >= $2 and datetime < $3 ";
          const values = [myappedu,mycurdateonlystr,mynextdateonlystr];

                pool.query(selectText, values, async (err, result) => {
        
                        if (err) {
                            console.log(err.stack);                            
                           
                        }else {
                          console.log("Entertainment count recieved");
                            console.log(result.rows[0]);
                            console.log(result.rows[0].sum);
                            if (result.rows[0].sum > 120){
                              finalAccess = "Blocked";
                            }else{
                              finalAccess = "Allowed";
                            }

                            //reply to AMQ
                            stompit.connect({ host: '192.168.209.101', port: 61613 }, async (err, sclient) => {
                              frame = sclient.send({ destination: 'InternetToLocalAccess' })
                             
                              await frame.write(finalAccess);
                             
                              await frame.end()
                             
                              sclient.disconnect()
                            })
                        }
                }); // pool query end
                

          }, 2000); // await timeout function.
      //console.log(body)
 
      //rclient.disconnect()

    })// msg reading
 
  })

})//stompit connect

//app.listen(port);
//console.log('Server started at http://localhost:' + port);