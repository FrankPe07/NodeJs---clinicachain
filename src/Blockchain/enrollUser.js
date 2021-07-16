'use strict';

const FabricCAService = require('fabric-ca-client');
const { FileSystemWallet, X509WalletMixin  } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const ccpPath = path.resolve(__dirname, 'connection.json');
const ccpJson = fs.readFileSync( ccpPath, 'utf8' );
const ccp = JSON.parse( ccpJson );


// async function main() {

const enrollUserBlockchain = async ( user ) => {

    try{

        //Crear un nuevo cliente de CA para interactuar con el CA
        const caUrl = ccp.certificateAuthorities['169.51.204.47:30940'].url;
        const ca = new FabricCAService(caUrl);

        // Crear un nuevo sistema de archivos basados en la cartera para gestionar identidades.
        const walletPath = path.join( 'F:/SIPAN/TESIS/APK/NODEJS/src/Blockchain', 'wallet');
        const wallet = new FileSystemWallet( walletPath );
        console.log(`Wallet path : ${ walletPath }`);

        // Comprobar si ya se a inscrito el usuario administrador
        const userExists = await wallet.exists(user);
        if( userExists ) {
            console.log(`An identity for ${user} already exists in the wallet`);
            return;
        }

        // Inscribir el usuario administrador e importar la nueva identidad a la cartera.
        const enrollment = await ca.enroll({ enrollmentID: 'app-admin', enrollmentSecret: 'app-adminpw' });
        const identity   = X509WalletMixin.createIdentity('org1msp', enrollment.certificate, enrollment.key.toBytes());

        await wallet.import( user, identity );
        console.log(`Successfully enrolled client ${user} and imported it into the wallet`);


    }catch(e){

        console.log(`Failed to enroll ${user}: ${ e }`);
        process.exit(1);
    }

} 

module.exports = {
    enrollUserBlockchain,
}