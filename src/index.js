const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const path = require('path');


const app = express();


// Settings
app.set('views', path.join(__dirname, 'Views' ));
app.engine('.hbs', exphbs({
    defaultLayout: 'app',
    layoutsDir: path.join( app.get('views'), 'layouts' ),
    partialsDir: path.join( app.get('views'), 'Partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');



// Middleware
app.use( express.json() );
app.use( express.urlencoded( {extended : false } ));
app.use( session({
    secret: 'clinicachainKey',
    resave: false,
    saveUninitialized: false,
}));

// Routes
app.use( require('./Routes/route') );
app.use( require('./Routes/web.routes') );


// Static Files
app.use( express.static( path.join( __dirname, 'Public')));



// Puerto
app.listen( '7000', () => console.log('Run port 7000') );