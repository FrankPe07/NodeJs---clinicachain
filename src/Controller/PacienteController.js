const { response } = require('express');
const pool = require('../DataBase/Mysql');
const  bcrypt = require('bcrypt');
const { enrollUserBlockchain } = require('../Blockchain/enrollUser');
const { smartContractObtenerHistoriaClinica } = require('../Blockchain/invoke');


const agregarNuevoPacienteBlockchain = async ( req, res = response) => {

    const { nombre, apellidos, dni, domicilio, nacimiento, sanguineo, correo , contrasena} = req.body;

    const salt = bcrypt.genSaltSync();
    const pass = bcrypt.hashSync( contrasena, salt );

    const dbnumHistorial = await pool.query('SELECT COUNT(*) as num FROM paciente');

    const numeroHistorial = numeroHistoriasClinicas(dbnumHistorial[0].num);

    const rows = await pool.query(`CALL SP_ADD_PACIENTE_BLOCKCHAIN_AUTHORIZATION(?,?,?,?,?,?,?,?,?);`, [ nombre, apellidos, dni, domicilio, nacimiento, sanguineo, correo , pass, numeroHistorial ]);

    if( rows.affectedRows ){

        await enrollUserBlockchain(dni);

        return res.json({
            resp: true,
            msj : 'Paciente creado con exito'
        });
    
    } else {

        return res.status(400).json({
            resp: false,
            msj : 'Error al crear Paciente'
        });
    }
}


const listadoHistoriaClinicaPaciente = async ( req, res = response ) => {

    const listado = await pool.query(`CALL SP_LISTA_HISTORIA_CLINICA_PACIENTE(?);`, [ req.params.id ]);


    res.json({
        resp: true,
        msj : 'Listado de historia clinica',
        historias: listado[0]
    });

}


const obtenerHistoriaClinicaBlockchainPaciente = async ( req, res = response ) => {


    const historiaClinica = await smartContractObtenerHistoriaClinica(req.params.id,  req.params.dni );

    return res.json({
        resp: true,
        msj : 'Historia clinica electronica - Blockchain',
        historia: historiaClinica
    });

}


const numeroHistoriasClinicas = (numero) => {

    if(numero < 10){
        return 'HCE00' + (numero + 1);
    } else if( numero < 100 ){
        return 'HCE0' + (numero + 1);
    } else if ( numero < 1000 ){
        return 'HCE' + (numero + 1);
    }
}


// ------------------ WEB ----------------------

const obtenerlistaPacienteWeb = async ( req, res ) => {

    const persona_id = req.session.persona_id;
    req.session.persona_id = persona_id;
    // delete req.session.persona_id;

    const historias = await pool.query(`CALL SP_LISTA_HISTORIA_CLINICA_PACIENTE(?);`, [ persona_id ]);
    
    const listHistorias = historias[0];

    res.render('Paciente/paciente', { listHistorias });

} 

const obtenerHistoriaClinicaWebBlockchain = async ( req, res ) => {

    

    const historia_id = req.params.id;
    const persona_id = req.session.persona_id;
    
    const persona = await pool.query('SELECT dni FROM persona WHERE id = ?', [ persona_id ]);
    const dni = persona[0].dni;

    const historiaClinica = await smartContractObtenerHistoriaClinica(historia_id, dni );

    console.log(historiaClinica);


    res.render('Paciente/HistoriaClinica', { historiaClinica });
}


module.exports = {
    agregarNuevoPacienteBlockchain,
    listadoHistoriaClinicaPaciente,
    obtenerHistoriaClinicaBlockchainPaciente,
    obtenerlistaPacienteWeb,
    obtenerHistoriaClinicaWebBlockchain,
}