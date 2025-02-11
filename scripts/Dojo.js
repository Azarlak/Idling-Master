function printDojo(){
    var string = '<h1 style="text-align: center">Dojo</h1><hr/>';
    string += '<button class="w3-button w3-red" onclick="previousZone();" '
    if(values.zone==0)string+="disabled"
    string +='>&lt</button><button style="float:right"class="w3-button w3-red" onclick="nextZone()"'
    if(!canGoToNextZone())string +="disabled"
    string += '>&gt</button><h2 style="text-align:center">'+dojoZones[values.zone].name+'</h2><p>'+dojoZones[values.zone].desc+'</p><hr/><div id="Fight"></div>';
    string += '<hr/><div><p><b>'+getNextZoneInfo()+'</b></p></div>'
    document.getElementById('Screen').innerHTML=string;   
    printDojoFight();
}
function printDojoHelp(){
    var string = '<h1 style="text-align: center">Dojo</h1><hr/>';
    string += '<p>On Dojo you can get money and bonuses to Strength and Defense for bosses.</p><p>You start out on the Zone "Shady Guy", the Red Arrowns on the Zone name are to change Dojo Zones, different Zones have different Enemies which drops different amounts of money.</p><p>The Fight Screen is where everything happens, your info and the enemie\'s info are shown there. The enemy always attacks first</p>'
    string +="<img style=\"display: block;margin-left: auto;margin-right: auto;height:40%\" src=\""+getImgPath("DojoScreenHelp")+"\"></img>"
    document.getElementById('Screen').innerHTML=string;  
}

function getNextZoneInfo(){
    var string = "Reach Boss #"
    if(values.boss<5) string+= "5"
    else if(values.boss<8) string+= "8"
    else if(values.boss<10) string+= "10"
    else if(values.boss<13) string+= "13"
    else if(values.boss<16) string+= "16"
    else if(values.boss<20) string+= "20"
    else if(values.boss<22) string+= "22"
    else if(values.boss<25) string+= "25"
    else return "You have unlocked all zones, congratz?!?"
    return string+= " so you can unlock the next zone!";
}

function getDojoAttackStatRaw(){
    return Math.floor(dojoStats.attack
        *farmStats.dojoMult
        *getArenaDojoAttackMultiplier());
}

function getDojoDefenseStatRaw(){
    return Math.floor(dojoStats.defense
        *farmStats.dojoMult
        *getArenaDojoDefenseMultiplier());
}

function getDojoAttack(){
    return getDojoAttackStatRaw()*crit();
}

function dojoFight(){
    if(dojoEnemy.curhp<=0) generateEnemy();
    else{
        if(dojoEnemy.attack>getDojoDefenseStatRaw())dojoStats.curhp-=(dojoEnemy.attack-getDojoDefenseStatRaw());
        if(dojoStats.curhp<=0) dojoDeath();
        else {
            var att = getDojoAttack();
            if(att>dojoEnemy.defense) dojoEnemy.curhp-= (att-dojoEnemy.defense);
        }
        if(dojoEnemy.curhp<=0) killDojoEnemy();
    }
    dojoStats.curhp+=Math.ceil(dojoStats.hp/60);
    if(dojoStats.curhp>=dojoStats.hp)dojoStats.curhp=dojoStats.hp;
}

function killDojoEnemy(){
    stats.totalDojoEnemies++;
    lifeStats.totalDojoEnemies++;
    addMoney(dojoEnemy.prize);
    generateEnemy();
}

function dojoDeath(){
    values.zone=0;
    dojoStats.curhp=0;
    generateEnemy();

}

function previousZone(){
    if(values.zone!=0) values.zone--;
    generateEnemy();
}

function nextZone(){
    values.zone++;
    printDojo();
    generateEnemy();
}

function canGoToNextZone(){
    if(values.zone==0) return true;
    else if(values.zone==1 && values.boss>=5) return true;
    else if(values.zone==2 && values.boss>=8) return true;
    else if(values.zone==3 && values.boss>=10) return true;
    else if(values.zone==4 && values.boss>=13) return true;
    else if(values.zone==5 && values.boss>=16) return true;
    else if(values.zone==6 && values.boss>=20) return true;
    else if(values.zone==7 && values.boss>=22) return true;
    else if(values.zone==8 && values.boss>=25) return true;
    return false;
}

function generateEnemy(){
    var num = Math.floor(Math.random()*dojoZones[values.zone].enemies.length);
    var enemy = enemies[dojoZones[values.zone].enemies[num]];
    dojoEnemy.hp=dojoEnemy.curhp = enemy.hp;
    dojoEnemy.name = enemy.name;
    dojoEnemy.attack = enemy.attack;
    dojoEnemy.defense = enemy.defense;
    dojoEnemy.prize = enemy.prize;
    loadScreen();
}

function printDojoFight(){
    var string = '<div class="w3-col m6 l6">';
    string += '<h1><b>You</b></h1>';
    string += '<h2><b>HP</b>: '+printNumber(dojoStats.curhp)+'/'+printNumber(dojoStats.hp)+'</h2>';
    string += '<h2><b>Attack</b>: '+printNumber(getDojoAttackStatRaw())+'</h2>';
    string += '<h2><b>Defense</b>: '+printNumber(getDojoDefenseStatRaw())+'</h2>';
    if(stats.totalDojoEnemies>=10) string += '<button style="width: 100%" class="w3-button w3-green" onclick="goToShop()">Secret Shop</button>';
    string += '</div><div class="w3-col m6 l6">';
    string += '<h1><b>'+dojoEnemy.name+'</b></h>';
    string += '<h2><b>HP</b>: '+printNumber(dojoEnemy.curhp)+'/'+printNumber(dojoEnemy.hp)+'</h2>';
    string += '<h2><b>Attack</b>: '+printNumber(dojoEnemy.attack)+'</h2>';
    string += '<h2><b>Defense</b>: '+printNumber(dojoEnemy.defense)+'</h2>';
    string += '</div>';
    document.getElementById('Fight').innerHTML=string; 
}
