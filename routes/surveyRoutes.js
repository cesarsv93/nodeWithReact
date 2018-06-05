const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

//We dont import surveys with require since it cause some problems when testing
const Survey = mongoose.model('surveys');

module.exports = app => {

  app.get('/api/surveys', requireLogin, async (req, res) => {
    const surveys = await Survey
      .find({ _user: req.user.id })
      .select({ recipients: false });

    res.send(surveys);
  });

  app.get('/api/surveys/thanks', (req, res) => {
    res.send('Thanks for voting!');
  })

  app.post('/api/surveys/webhooks', (req, res) => {
    console.log(req.body);
    res.send({});
  });

  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
    const {title, subject, body, recipients } = req.body;

    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients.split(',').map( email => ({ email: email.trim() })), // Will return an array of objects [{email: "cesar@correo.com"}, {email: "cesar@correo.com"}]
      _user: req.user.id,
      dateSent: Date.now()
    });

    //Send email

    const mailer = new Mailer(survey, surveyTemplate(survey));

    try {
      await mailer.send();
      await survey.save();
      req.user.credits -= 1;
      const user = await req.user.save();

      res.send(user);

    } catch (err) {
      res.status(422).send(err);
    }
  });

};