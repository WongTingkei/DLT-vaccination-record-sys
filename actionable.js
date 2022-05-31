const prompt = require('prompt-sync')();
const SHA256 = require('crypto-js/sha256');
const {BlockchainB,vaccRecord} = require('./vacc');
const {BlockchainA, supply} = require('./supply');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const {German} = require('./German');

const myKey = ec.keyFromPrivate('50171dda5c3e03f242f9242ccc41b560d02267e886a5924c79cdb2a6ad5cfd61');
const myVAddress = myKey.getPublic('hex');
const myPW = '123456'

let pfrizer = new BlockchainA();
let VacciNation = new BlockchainB();
let gtest = new German();
let countryList = ['German'];

const sp1 = new supply('pfrizer','1','04/05/2021')
const sp2 = new supply('pfrizer','2','04/05/2021')
const sp3 = new supply('pfrizer','3','04/05/2021')

pfrizer.addSupplies(sp1);
pfrizer.addSupplies(sp2);
pfrizer.addSupplies(sp3);
pfrizer.minePendingSupplies();
console.log(pfrizer.chain[1].supplies)

const vr1 = new vaccRecord(myVAddress,'Bill','3035880863','01/28/2021','pfrizer','1');
const vr2 = new vaccRecord(myVAddress,'Bill','3035880863','02/20/2021','pfrizer','2');
//const vr3 = new vaccRecord(myVAddress,'Bill','3035880863','03/30/2021','pfrizer','3');

vr1.signVaccRecord(myKey);
vr2.signVaccRecord(myKey);
//vr3.signVaccRecord(myKey);

VacciNation.addVaccRecord(vr1,pfrizer.chain);
VacciNation.addVaccRecord(vr2,pfrizer.chain);
//VacciNation.addVaccRecord(vr3,pfrizer.chain);

VacciNation.minePendingVaccRecords();

console.log('Is the supply chain data valid?');
if(pfrizer.isChainValid()){
    console.log('valid!')
}
else{
    throw new Error('supply chain not valid!');
}

console.log('Is the vaccRecord chain data valid?');
if(VacciNation.isChainValid()){
    console.log('valid!')
}
else{
    throw new Error('vaccRecord not valid!');
}

var action = '';
while(action !== 'q'){
    console.log('\n');
    console.log('What do you want to do? \n"av" for adding vacc record, \n"cv" for checking vacc record, \n"ca" for checking validity to access a country, \n"q" for quit:');
    action = prompt('');
    if(action === 'q'){
        console.log('quiting the system!');
        break;
    }
    
    //myVAddress,'Bill','3035880863','01/28/2021','pfrizer','2'
    if(action === 'av'){
    
        let name = prompt('name:');
        let id = prompt('id:');
        let date = prompt('date:');
        let manuf = prompt('manufacturer:');
        let vaccNo = prompt('vaccNo:');
        if(name === 'Bill'){
            var BillAdress = myVAddress;
        }
        let vr = new vaccRecord(BillAdress,name,id,date,manuf,vaccNo);
        let password = prompt('password:');
        if(password === myPW){
            var key = myKey;
        }
        else{
            console.log('incorrect password!');
        }
        vr.signVaccRecord(myKey);
        VacciNation.addVaccRecord(vr,pfrizer.chain);
        VacciNation.minePendingVaccRecords();
    }

    if(action === 'cv'){
        let name = prompt('Who to check?');
        if(name === 'Bill'){
            var address = myVAddress;
        }
        console.log(VacciNation.getInfo(address));
    }

    if(action === 'ca'){
        console.log('Partner countries:' + countryList);
        var country = prompt('which one to check?');
        if(country === 'German'){
            let name = prompt('Who to check?');
            if(name === 'Bill'){
            var address = myVAddress;
            }
            let info = VacciNation.getInfo(address);
            gtest.statusValid(info);
        }
        else{
            console.log('not our partner countries!');
        }
    }
    


}

console.log('Is the vaccRecord chain data valid?');
if(VacciNation.isChainValid()){
    console.log('valid!')
}
else{
    throw new Error('vaccRecord not valid!');
} 