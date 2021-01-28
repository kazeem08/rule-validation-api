require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const config = require('./config');
const { handler, errorHandler } = require('./validation-handler')
const { schema } = require('./schema');

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

app.post('/validate-rule', async (req, res) => {

  try{
    await schema.validateAsync(req.body);

    const result = handler(req.body);

    const response  = {
      message: result.message,
      status: result.status,
      data: result.data,
  }

    return res.send(response)

  }catch(e){
    // format error message
    const message = errorHandler(e);

    const errorResponse = {
        message,
        status: "error",
        data: null,
    }
    return res.status(400).send(errorResponse)
  }
});

const port = process.env.PORT || 3800;

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})