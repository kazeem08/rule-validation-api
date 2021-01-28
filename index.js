require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const config = require('./config');


const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())
app.use(bodyParser.json());

app.use((err, req, res, next) => {
  // This check makes sure this is a JSON parsing issue

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      return res.status(400).send({
        "message": "Invalid JSON payload passed.",
        "status": "error",
        "data": null
      });
  }

  next();
});

app.get('/', async (req, res) => {
  return res.send(config.details);
});

const port = process.env.PORT || 3800;

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})