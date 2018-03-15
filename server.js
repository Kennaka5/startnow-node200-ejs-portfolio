const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').load()
// dotenv.config();

var client = require('twilio')(process.env.DB_TWID, process.env.DB_APIKEY);
const app = express();

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use("/css", express.static(__dirname + "/css"));
app.use("/js", express.static(__dirname + "/js"));
app.use("/Pictures", express.static(__dirname + "/Pictures"));

app.set('port', (process.env.PORT || 8080));
app.set('views', './views');

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    const data = {
        person: {
            firstName: 'Ken',
            lastName: 'Nakayama',
        }
    }
    res.render('index', data);
});
app.get('/contact', (req, res) => {
    res.render('contact');
  });
  
  app.post('/thanks', (req, res) => {
      var contactReq ={
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        email: req.body.eMail,
        comment: req.body.notes,
      }

      client.messages.create({ 
        to: "+15592602826", 
        from: "+18583338698", 
        body: contactReq.firstName + ' ' + contactReq.lastName + ' ' + 'said' + ' ' + contactReq.comment + '.' + 'Email:' + contactReq.email, 
    }, function(err, message) { 
        console.log(message.sid); 
    });
    res.render('thanks', { contactReq: req.body })
  });

  app.listen(app.get('port'), () => {
    console.log('listening at http://localhost:' + app.get('port'));
  });