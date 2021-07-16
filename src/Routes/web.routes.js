const { Router } = require('express');
const { loginFormWeb, loginWeb, logoutWeb } = require('../Controller/LoginController');
const { obtenerlistaPacienteWeb, obtenerHistoriaClinicaWebBlockchain } = require('../Controller/PacienteController');

const router = Router();




router.get('/user/login', loginFormWeb );

router.post('/user/login', loginWeb );

router.get('/user/logout', logoutWeb );

router.get('/user/paciente', obtenerlistaPacienteWeb );
router.get('/user/paciente/:id', obtenerHistoriaClinicaWebBlockchain );













module.exports = router;