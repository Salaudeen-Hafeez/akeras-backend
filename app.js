import express from 'express';
import postRouter from './routes/postroutes';
import getRouter from './routes/getroutes';
import updateRouter from './routes/updateroutes';
import deleteRouter from './routes/deleteroutes';

const app = express();
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use(express.static('public'));
app.set('view engine', 'ejs');

// The middleware for the home page
app.get('/', (req, res) => {
  res.render('home');
});

// The middleware that uses the router module
app.use('/api/v1/users', getRouter);
app.use('/api/v1/users', postRouter);
app.use('/api/v1/users', updateRouter);
app.use('/api/v1/users', deleteRouter);

// The middleware for a bad url request
app.use((req, res) => {
  res.status(404).send('page not found');
});

app.use((err, req, res, next) => {
  res.status(400).json(err.message);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);
