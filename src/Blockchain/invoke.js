'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const addHistorialClinicoToBlockchain =  async (usuario, idHistorialClinico, idCita, fecha, paciente_nombre, paciente_apellido, medico_nombre, medico_apellido, motivo_consulta, anamnesia, pa, pulso, temperatura, fc, fr, examen_clinico, diagnostico, tratamiento, proximacita) => {

    try {

        // Analizar el archivo de conexion. Sera via de acceso al archivo descargado
        // desde la consola operativa de IBM Blockchain
        const ccpPath = path.join( __dirname, './connection.json');
        const ccp = JSON.parse( fs.readFileSync( ccpPath, 'utf8' ));

        // Configurar una cartera. Esta cartera debe estar preparada con una identidad que la 
        // aplicacion pueda utilizar para itenractuar con el nodo igual.
        const walletPath = path.join( __dirname, './wallet' );
        const wallet = new FileSystemWallet( walletPath );
        
        // Crea una nueva pasarela y conecta con los nodos iguales de la pasarela. La identidad 
        // Especifica de existir en la cartera especificada.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: usuario , discovery: { enabled: true, asLocalhost: false }});

        // Obtener el canal de la red en el que se a despleagado el contrato inteligente
        const network = await gateway.getNetwork('mychannel');
        
        // Obtener el contrato inteligente del canal de la red.
        const contract = network.getContract('Smart-Contract');

        // Enviar la trasaccion "AddHistorialClinico" al contrato inteligente y esperar a que se confirme en el libro mayor
        await contract.submitTransaction('crearHistorialClinico', idHistorialClinico, idCita, fecha, paciente_nombre, paciente_apellido, medico_nombre, medico_apellido, motivo_consulta, anamnesia, pa, pulso, temperatura, fc, fr, examen_clinico, diagnostico, tratamiento, proximacita);
        // await contract.submitTransaction('crearHistorialClinico', '1' ,'8', '08/10/2021', 'name-paciente', 'lastname-paciente', 'name-medico', 'lastname-medico', 'motivoprueba', 'anaprueba', 'paprueba', 'pulsoprueba', 'temperaturaprueba', 'fcprueba', 'frprueba', 'examenclinicoPrueba', 'diagnosticoPrueba', 'tratamientoPrueba', 'proximaCitaPrueba');

        console.log('Transaction has been submitted');

        await gateway.disconnect();


    } catch( e ){

        console.log(`Failed to submit trasaction: ${ e }`);
        process.exit(1);
    }
}


const smartContractObtenerHistoriaClinica = async (idHistorialClinico, usuario) => {

    try {

        const ccpPath = path.join( __dirname, './connection.json');
        const ccp = JSON.parse( fs.readFileSync( ccpPath, 'utf8' ));
    
        const walletPath = path.join( __dirname, './wallet' );
        const wallet = new FileSystemWallet( walletPath );
    
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: usuario , discovery: { enabled: true, asLocalhost: false }});
    
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('Smart-Contract');
    
        const response = await contract.submitTransaction('obtenerHistorialClinico', idHistorialClinico);

        const historia = JSON.parse( response.toString() );

        await gateway.disconnect();
        
        return historia;

        
    } catch (e) {
        console.log(`Failed to submit trasaction: ${ e }`);
        process.exit(1);
    }


}

module.exports = {
    addHistorialClinicoToBlockchain,
    smartContractObtenerHistoriaClinica,
}