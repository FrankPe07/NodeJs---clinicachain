const { response } = require('express');
const bcrypt = require('bcrypt');
const { enrollUserBlockchain } = require('../Blockchain/enrollUser');
const pool = require('../DataBase/Mysql');

const addMedicoblockchainAuthorization = async ( req, res = response ) => {

    const { nombre, apellido, dni, cpm, rne, descripcion, consulta, correo, contrasena, slug } = req.body;

    const salt = bcrypt.genSaltSync();
    const pass = bcrypt.hashSync( contrasena, salt );

    const rows = await pool.query(`CALL SP_ADD_MEDICO_BLOCKCHAIN_AUTHORIZATION(?,?,?,?,?,?,?,?,?,?);`, [nombre, apellido, dni, cpm, rne, descripcion, consulta, correo, pass, slug]);

    if( rows.affectedRows ){

        await enrollUserBlockchain(dni);

        return res.json({
            resp: true,
            msj : 'Medico Agregado a la wallet'
        });

    } else {
        return res.status(400).json({
            resp: false,
            msj : 'Error al agregar Wallet al medico'
        });
    }
}


const addServicioPrecioMedico = async ( req, res = response ) => {



}

module.exports = {
    addMedicoblockchainAuthorization,
    addServicioPrecioMedico
}