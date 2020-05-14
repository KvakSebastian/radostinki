var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

app.use('/public', express.static('public'));
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});
app.get('/index', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});
app.get('/basket', function (req, res) {
  res.sendFile(__dirname + '/views/basket.html');
});
app.get('/goods', function (req, res) {
  res.sendFile(__dirname + '/views/goods.html');
});
app.get('/gallery', function (req, res) {
  res.sendFile(__dirname + '/views/gallery.html');
});


app.post('/basket', function (req, res) {
  // Sending Emails with SMTP, Configuring SMTP settings

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'fwd14fwd@gmail.com',
      pass: 'fwd-14fwd-14'
    }
  });


  console.log(req.body);
  if (req.body.town){
  var mailOptions = {
    from: 'fwd14fwd@gmail.com',
    to: 'fwd14fwd@gmail.com',
    subject: "Замовлення",
    html: `<p>ПІБ ${req.body['fullname']}</p><br>` +
      `Телефон : ${req.body.tel}<br>` +
      `Тип доставки: ${req.body.delivery}<br>` +
      `Область:${req.body.region}<br>` +
      `Місто:${req.body.town}<br>` +
      `Відділення:${req.body.vid}<br>` +
      `Замовлення:${req.body.comment}<br>`
};}
else {
  var mailOptions = {
    from: 'fwd14fwd@gmail.com',
    to: 'fwd14fwd@gmail.com',
    subject: "Звязок з нами",
    html: `<p>ПІБ ${req.body['fullname']}</p><br>` +
      `Телефон : ${req.body.tel}<br>` +
      `Пошта:${req.body.email}<br>`
};
}
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.end(false);
    } else {
      console.log('Email sent: ' + info.response);
      res.send(true);

    }
  });
}

);

app.listen(3002);