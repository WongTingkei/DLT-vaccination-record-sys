

class German{
    constructor(){
        this.Manuf = ['pfrizer'];
        this.DoseNo = 3;
        this.dayItv = 100;
    }
    statusValid(info){
        
        var today = new Date();
        var trustedVTaken = 0;
        var latestVD = 1000;
        for(const vr of info){
            if(this.Manuf.includes(vr.manufacturer) === true){
                trustedVTaken += 1;
                var dateV = new Date(vr.dateOfVacc);
                const diff = today.getTime() - dateV.getTime();
                if(Math.ceil(diff/ (1000 * 3600 * 24))<latestVD){
                    latestVD = Math.ceil(diff/ (1000 * 3600 * 24));
                    
                }
            }
        }
        console.log(latestVD);
        console.log(trustedVTaken);

        if(trustedVTaken < this.DoseNo){
            console.log('Vacc requirement not met - less than required doses of authorized vaccines taken!');
        }
        else if(latestVD < this.dayItv){
            console.log('Vacc requirement not met - latest dose is too recent!');
        } 
        else{
            console.log('Vacc requirement met!')
        }
        
    }

    addManu(Manulist){
        this.Manuf.push(...Manulist);
    }

    removeMmanu(Manulist){
        this.Manuf = this.Manuf.filter((i) => !Manulist.includes(i));
    }

    chgdayInt(days){
        this.dayItv += days;
    }

    chgDoseNo(num){
        this.DoseNo += num;
    }
}

module.exports.German = German;