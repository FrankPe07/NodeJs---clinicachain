const express = require('express');
const { check } = require('express-validator');
const { addHistorialClinico, obtenerHistorialClinico } = require('../Controller/Historial');
const { addMedicoblockchainAuthorization, addServicioPrecioMedico } = require('../Controller/MedicoController');
const { agregarNuevoPacienteBlockchain, listadoHistoriaClinicaPaciente, obtenerHistoriaClinicaBlockchain, obtenerHistoriaClinicaBlockchainPaciente } = require('../Controller/PacienteController');

const router = express.Router();



router.post('/api/add-historial-clinico', [
    check('fecha','Fecha es requerido').notEmpty(),
    check('motivo','Motivo es requerido').not().isEmpty(),
    check('ana','Ana es requerido').not().isEmpty(),
    check('pa','Pa es requerido').not().isEmpty(),
    check('pulso','Pulso es requerido').not().isEmpty(),
    check('temp','temperatura es requerido').not().isEmpty(),
    check('fc','Fc es requerido').not().isEmpty(),
    check('fr','Fr es requerido').not().isEmpty(),
    check('exfisico','Examen fisico es requerido').not().isEmpty(),
    check('diagnostico','Diagnostico es requerido').not().isEmpty(),
    check('tratamiento','Tratamiento es requerido').not().isEmpty(),
    check('prxcita','Proxima cita es requerido').not().isEmpty(),
    check('cita_id','Id Cita es requerido').not().isEmpty(),
], addHistorialClinico);


router.get('/api/obtenerHistorialClinico', obtenerHistorialClinico );

router.post('/api/add-medico-blockchain-authorization', addMedicoblockchainAuthorization);
router.post('/api/add-servicios-precios-medico', addServicioPrecioMedico );


// Pacientes
router.post('/api/create-paciente-to-blockchain', agregarNuevoPacienteBlockchain);
router.get('/api/listado-historia-clinica-paciente/:id', listadoHistoriaClinicaPaciente );
router.get('/api/obtener-historia-blockchain-paciente/:id/:dni', obtenerHistoriaClinicaBlockchainPaciente );





module.exports = router;

