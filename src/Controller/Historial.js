
const { response } = require('express');
const { addHistorialClinicoToBlockchain, obtenerHistorialClinicoToBlockchain } = require('../Blockchain/invoke');
const pool   = require('../DataBase/Mysql');


const addHistorialClinico = async ( req, res = response ) => {

    const { fecha,motivo,ana,pa,pulso,temp,fc,fr,exfisico,diagnostico,tratamiento,prxcita, cita_id, dni_medico } = req.body;

    const query =  `CALL SP_ADD_HISTORIAL_CLINICO(?,?,?,?,?,?,?,?,?,?,?,?,?);`;

    const rows = await pool.query( query, [ cita_id, fecha, motivo, ana, pa, pulso, temp, fc, fr, exfisico, diagnostico, tratamiento, prxcita ] );

    if( rows.affectedRows ){

        const dbHistorial = await pool.query(`CALL SP_BLOCKCHAIN_HISTORAIL(?);`, [ cita_id ]);

        console.log(dni_medico);
        
        // Referencia a invoque para invocar el Smart Contract y se cree el bloque con el contenido
        await addHistorialClinicoToBlockchain(
            dni_medico.toString(),
            dbHistorial[0][0].id.toString(),
            dbHistorial[0][0].cita_id.toString(),
            dbHistorial[0][0].fecha.toString(),
            dbHistorial[0][0].paciente_nombre,
            dbHistorial[0][0].paciente_apellidos,
            dbHistorial[0][0].medico_nombre,
            dbHistorial[0][0].medico_apellidos,
            dbHistorial[0][0].motivo_consulta,
            dbHistorial[0][0].anamnesis,
            dbHistorial[0][0].pa,
            dbHistorial[0][0].pulso,
            dbHistorial[0][0].temperatura,
            dbHistorial[0][0].fc,
            dbHistorial[0][0].fr,
            dbHistorial[0][0].examen_clinico,
            dbHistorial[0][0].diagnostico,
            dbHistorial[0][0].tratamiento,
            dbHistorial[0][0].proxima_cita.toString(),
        );

        return res.json({
            resp: true,
            msj : 'Historial clinico Agregado con exito!'
        });

    } else {

        return res.status(400).json({
            resp: false,
            msj : 'Historial Clinico no agregado'
        });

    }

};


const obtenerHistorialClinico = async ( req, res = response ) => {


    const response = await obtenerHistorialClinicoToBlockchain('20');

    console.log(response);

    return res.json({
        resp: true,
        msj : response
    });
}

module.exports = {
    addHistorialClinico,
    obtenerHistorialClinico,
};