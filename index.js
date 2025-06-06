const express = require('express');  // node js frame work
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session'); 
const bcrypt = require('bcrypt');
const path = require('path');
const multer = require('multer');
const User = require('./models/User');
const Contribution = require('./models/Contribution'); // Import Contribution model

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files
app.use(session({
  secret: 'secretKey',
  resave: true,
  saveUninitialized: true
}));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Resolve path using path.join to ensure compatibility across platforms
    const uploadPath = path.join(__dirname, 'uploads');
    cb(null, uploadPath); // Directory to save uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Rename the file
  }
});

const upload = multer({ storage: storage });

// Routes
app.get('/', (req, res) => {
  res.render('index', { user: req.session.user });
});

const isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    res.redirect('/');
  } else {
    next();
  }
};

const isLoggedOut = (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/login'); 
  } else {
    next(); 
  }
};

app.get('/login', isLoggedIn, (req, res) => {
  res.render('login', { user: req.session.user });
});

app.get('/signup', (req, res) => {
  res.render('signup', { user: req.session.user });
});

app.get('/ipq', (req, res) => {
  res.render('ipq', { user: req.session.user });
});

app.get('/courses', (req, res) => {
  res.render('courses', { user: req.session.user });
});

app.get('/contribute', isLoggedOut, (req, res) => {
  res.render('contribute', { user: req.session.user });
});

app.get('/engineering', (req, res) => {
  res.render('engineering', { user: req.session.user });
});

app.get('/index', (req, res) => {
  res.render('index', { user: req.session.user });
});

app.get('/cse-branch', (req, res) => {
  res.render('cse', { user: req.session.user }); 
});

app.get('/first_year', (req, res) => {
  res.render('first_year', { user: req.session.user }); 
});

app.get('/second_year', (req, res) => {
  res.render('second_year', { user: req.session.user });
});

app.get('/third_year', (req, res) => {
  res.render('third_year', { user: req.session.user });
});

app.get('/fourth_year', (req, res) => {
  res.render('fourth_year', { user: req.session.user });
});

app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.send('<script>alert("Invalid username or password"); window.location.href = "/login";</script>');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.send('<script>alert("Invalid username or password"); window.location.href = "/login";</script>');
    }

    req.session.user = user;
    res.redirect('/profile');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.redirect('/login');
    }
  });
});

app.get('/profile', (req, res) => {
  if (req.session.user) {
    res.render('profile', { user: req.session.user });
  } else {
    res.redirect('/login');
  }
});

app.get('/edit-profile', (req, res) => {
  if (req.session.user) {
    res.render('edit-profile', { user: req.session.user });
  } else {
    res.redirect('/login');
  }
});

app.post('/edit-profile', async (req, res) => {
  if (req.session.user) {
    try {
      const { username, email } = req.body;
      await User.findByIdAndUpdate(req.session.user._id, { username, email });
      const updatedUser = await User.findById(req.session.user._id);
      req.session.user = updatedUser;
      res.redirect('/profile');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.redirect('/login');
  }
});

app.post('/contribute', upload.single('pdfFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const { subject, topic } = req.body;
    const pdfPath = req.file.path;

    const newContribution = new Contribution({
      user: req.session.user._id,
      subject,
      topic,
      pdfPath,
    });

    await newContribution.save();
    res.redirect('/contribute');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
