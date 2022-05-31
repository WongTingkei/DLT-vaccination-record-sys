const SHA256 = require('crypto-js/sha256');
const {BlockchainB,vaccRecord} = require('./vacc');
const {BlockchainA, supply} = require('./supply');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const {German} = require('./German');

const myKey = ec.keyFromPrivate('50171dda5c3e03f242f9242ccc41b560d02267e886a5924c79cdb2a6ad5cfd61');
const myVAddress = myKey.getPublic('hex');

let pfrizer = new BlockchainA();
const sp1 = new supply('pfrizer','1','04/05/2022')
const sp2 = new supply('pfrizer','2','04/05/2022')
const sp3 = new supply('pfrizer','3','04/05/2022')

pfrizer.addSupplies(sp1);
pfrizer.addSupplies(sp2);
pfrizer.addSupplies(sp3);
pfrizer.minePendingSupplies();
console.log(pfrizer.chain[1].supplies)

let VacciNation = new BlockchainB();
const vr1 = new vaccRecord(myVAddress,'Bill','3035880863','01/28/2021','pfrizer','1');
const vr2 = new vaccRecord(myVAddress,'Bill','3035880863','01/29/2021','pfrizer','2');
const vr3 = new vaccRecord(myVAddress,'Bill','3035880863','09/30/2021','pfrizer','3');

vr1.signVaccRecord(myKey);
vr2.signVaccRecord(myKey);
vr3.signVaccRecord(myKey);

VacciNation.addVaccRecord(vr1,pfrizer.chain);
VacciNation.addVaccRecord(vr2,pfrizer.chain);
VacciNation.addVaccRecord(vr3,pfrizer.chain);

VacciNation.minePendingVaccRecords();
let Bill = VacciNation.getInfo(myVAddress);
console.log(Bill);

let Germantest = new German();
Germantest.statusValid(Bill);
Germantest.chgDoseNo(1);
Germantest.statusValid(Bill);




















