const SHA256 = require('crypto-js/sha256');
//this is a very simple supply chain bc demo and we assume we only cooperate with a single manufacturer who only produces one vaccine
//Also, assume that new vaccine will only be used and registered through our system so no usage check is needed.
class supply{
    constructor(manufacturer,vaccNo, productiondt){
        this.manufacturer = manufacturer;
        this.vaccNo = vaccNo;
        this.productiondt = productiondt;
        
    }

    calculateHash(){
        return SHA256(this.manufacturer + this.vaccNo + this.productiondt ).toString();
    }

    

    
}

class Block{
    constructor(timestamp, supplies, previousHash = ''){
        
        this.timestamp = timestamp;
        this.supplies = supplies;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        

    }
    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)+this.nonce).toString();

    }

    mineBlock(){    
        this.hash = this.calculateHash();
        console.log('Block mined: ' +  this.hash);
    }

    
}

class BlockchainA{
    constructor(){
        this.chain = [this.createGenesisBlock()];     
        this.pendingSupplies = [];
        
    }

    
    createGenesisBlock(){
        return new Block('0000/00/00',[],'0');
    }
    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }
    minePendingSupplies(){    
        const block = new Block(Date.now(), this.pendingSupplies, this.getLatestBlock().hash);
        block.mineBlock();   
        this.chain.push(block);
        this.pendingSupplies = [];


    }
    addSupplies(supply){
        
        if(this.checkrep1(supply.vaccNo)===true){
            throw new Error('This vaccine has already been registered!');
        }
        if(this.checkrep2(supply.vaccNo)===true){
            throw new Error('This vaccine is already in the pending list!');
        }
        this.pendingSupplies.push(supply);
    }

    checkrep1(vaccNo){
        let rep = false;
    loop1:
        for(const block of this.chain){
            
    loop2:       
            for(const sp of block.supplies){
                if(vaccNo === sp.vaccNo){
                    rep = true;
                    break loop1;
                }
            }
        }
        
        return rep;
        
    }

    checkrep2(vaccNo){
        let rep = false;
    loop1:
        for(const sp of this.pendingSupplies){      
                if(vaccNo === sp.vaccNo){
                    rep = true;
                    break loop1;
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

module.exports.BlockchainA = BlockchainA;
module.exports.supply = supply;