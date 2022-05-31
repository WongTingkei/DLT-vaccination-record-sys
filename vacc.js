const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const {BlockchainA, supply} = require('./supply');

class vaccRecord{
    constructor(fromAddress, name, id, dateOfVacc, manufacturer,vaccNo){
        this.fromAddress = fromAddress;    
        this.name = name;
        this.id = id;
        this.dateOfVacc = dateOfVacc;
        this.manufacturer = manufacturer;
        this.vaccNo = vaccNo;
    }

    calculateHash(){
        return SHA256(this.fromAddress + this.name + this.id + this.dateOfVacc + this.manufacturer + this.vaccNo).toString();
    }

    signVaccRecord(signingKey){
          
        if (signingKey.getPublic('hex') !== this.fromAddress) {
            throw new Error('You cannot sign transactions for others!');
          }
        const hashTx = this.calculateHash();
        
        const sig = signingKey.sign(hashTx,'base64');
        this.signature = sig.toDER('hex');
        
    }

    isValid(){
        
        if(!this.signature || this.signature.length === 0){
            throw new Error('No sig!');
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}

class Block{
    constructor(timestamp, vaccRecords, previousHash = ''){
        
        this.timestamp = timestamp;
        this.vaccRecords = vaccRecords;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        

    }
    calculateHash(){
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.vaccRecords)).toString();

    }

    mineBlock(){
        
        this.hash = this.calculateHash();
        console.log('Block mined: ' +  this.hash);
    }

    hasValidVaccRecords(){
        for(const vr of this.vaccRecords){
            if(!vr.isValid()){
                return false;
            }

        }
        return true;
    }
}

class BlockchainB{
    constructor(){
        this.chain = [this.createGenesisBlock()];        
        this.pendingVaccRecords = [];    
    }

    
    createGenesisBlock(){
        return new Block('00/00/0000','Genesis block','0')
    }
    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    getInfo(address){
        let info = [];
        for (const block of this.chain){
            for(const vr of block.vaccRecords){
                if(address === vr.fromAddress){
                    info.push(vr);
                }
            }
        }
        if(info.length === 0){
            throw new Error('Not vaccinated');
        }
        return info;
    }

    
    minePendingVaccRecords(){
        
        const block = new Block(Date.now(), this.pendingVaccRecords, this.getLatestBlock().hash);
        block.mineBlock();

       
        this.chain.push(block);

        this.pendingVaccRecords = [];


    }
    addVaccRecord(vr,supplyChain){
        
        if(this.checkrep(vr.vaccNo)===true){
            throw new Error('Used vaccine!');
        }
        if(this.checkrep2(vr.vaccNo)===true){
            throw new Error('Used vaccine!');
        }

        let exist = false;
      
    loop1:   
        for(const block of supplyChain){
                if(block.supplies.length === 0){continue;}
    loop2:
                for(const sp of block.supplies){
                    
                    if(vr.vaccNo === sp.vaccNo){  
                        exist = true;  
                        break loop1;
                    }
                }
        }
        if(exist === false){
            throw new Error('Do not exist in supply!');
        }  
        

        if(!vr.isValid()){
            throw new Error('cannot add invalid sp to chain!');
        }

        this.pendingVaccRecords.push((({ fromAddress, name, id, dateOfVacc, manufacturer,vaccNo }) => ({ fromAddress, name, id, dateOfVacc, manufacturer,vaccNo }))(vr));
    }

    checkrep(vaccNo){
        var rep = false;
        for(const block of this.chain){
            if(rep===true){break;}
            for(const vr of block.vaccRecords){
                if(vaccNo === vr.vaccNo){
                    rep = true;
                    break;
                }
                
            }
        }
        
        return rep;
    }

    checkrep2(vaccNo){
        let rep = false;
    
        for(const vr of this.pendingVaccRecords){      
                if(vaccNo === vr.vaccNo){
                    rep = true;
                    break;
                }
            
        }
        
        return rep;
        
    }
   


    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            
            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }
            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }

}

module.exports.BlockchainB = BlockchainB;
module.exports.vaccRecord = vaccRecord;