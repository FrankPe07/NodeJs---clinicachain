const pool = require("../DataBase/Mysql");
const bcrypt = require('bcrypt');

const loginFormWeb = ( req, res ) => {

    res.render('Login/Login');

}

const loginWeb = async ( req, res ) => {

   
    const { email, password } = req.body;

    const user = await pool.query('SELECT * FROM users WHERE email = ?', [ email ]);

    if( user.lenght != 0 ){

        const match = await bcrypt.compareSync( password, user[0].password );

        if( match ){

            req.session.persona_id = user[0].persona_id;
            res.redirect('/user/paciente');
        }
    
    } else {
        res.redirect('Login/Login');
    }

}

const logoutWeb = ( req, res ) => {


}

module.exports = {
    loginFormWeb,
    loginWeb,
    logoutWeb
}