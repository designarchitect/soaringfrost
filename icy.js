//★ CHANGE OF SOMETHIN... ★//
var delta = 2.3;
var master_heartbeat = 1;
var deltaY = delta;
var deltaX = 0;
var direction = 0;

//★ DIRECTION KEYS ★//
var NORTH = 38, SOUTH = 40, EAST = 39, WEST = 37;

var dragon_pos = {top:0,left:0}

var treasure = {top:0, left:0}

var game = $("#game");
///////////////////////////////////////////////////////////////////////////////////////////////////////
//★ DRAGON OBJECT ★//
///////////////////////////////////////////////////////////////////////////////////////////////////////
function dragonObject(initial_speed){
    console.log("dragonObject called");
    this.delta = initial_speed;
    this.direction = 0;
    this.deltaX = 0;
    this.deltaY = this.delta * -1;
    this.sprite = null;
    this.heartbeat_time = master_heartbeat;  //15 miliseconds
    this.heartbeat = null;
    this.stop = false;
    this.gameArena = $('#game');
    this.gameHeight =  this.gameArena.height();
    this.gameWidth = this.gameArena.width();
    this.treasure = null;
////////////////////
    this.init = function(){
        console.log('initializing');
        this.createSprite();
        this.bind_movement_keys();
        this.start_heartbeat();
        this.fly();
        // this.createTreasure();
    }
////////////////////
    this.createSprite = function(){
        console.log('create sprite called');
        var game_area_midx= ($("#game").width())/2;
        var game_area_midy= ($("#game").height())/2;
        this.sprite = $('<img>',{
            src:'images/px.png',
            class:'dragon',
            id:'icedragon'
        }).css({
            left: game_area_midx+'px',
            top: game_area_midy+'px'
        });

        this.width = this.sprite.width();
        this.height = this.sprite.height();

        $("#game").append(this.sprite);
    }
////////////////////
    this.fly = function(){
        // console.log("deltaX "+this.deltaX+ "deltaY "+this.deltaY)
        this.sprite.css({
            'transform': 'rotateZ('+this.direction+'deg)'
        });

        var newLeft = this.sprite.position().left+this.deltaX;
        var newTop = this.sprite.position().top+this.deltaY;

        if(this.collisionCheck(newLeft,newTop)){
            console.log('collision');
            return;
        }


        // console.log('position.top: '+this.sprite.position().top);
        // console.log('deltaY: '+this.deltaY+'px');
        // console.log('new deltaY = ',newTop);
        var _this = this;
        // console.log('this.heartbeat_time', this.heartbeat_time);
        this.sprite.animate(
            {
                'left': newLeft,
                'top': newTop,
            },this.heartbeat_time, function(){
// Coin Collision //
                var collision_coin = _this.collisionCheckCoin();
                if(collision_coin!==false){
                    console.log('collision coin');
                    _this.coinCollect(collision_coin);
                }
// Special Coin Collision //
                var collision_coin_sp = _this.collisionCheckSpCoin();
                if(collision_coin_sp!==false){
                    console.log('collision special coin');
                    _this.coinSpCollect(collision_coin_sp);
                }
// Mega Coin Collision //
                var collision_coin_mega = _this.collisionCheckMegaCoin();
                if(collision_coin_mega!==false){
                    console.log('collision mega coin');
                    _this.coinMegaCollect(collision_coin_mega);
                }
// FIRE Collision //
                var collision_fire = _this.collisionCheckFire();
                if(collision_fire!==false){
                    console.log('fire collision');
                }

                _this.fly();
                // console.log('done with animation', this);

            }
        );
    }
////////////////////

////////////////////
    this.start_heartbeat = function(){
        var _this = this;
        //console.log('outside setInterval, this is ',this);
        this.heartbeat = setInterval(
            function(){
                //console.log('inside setInterval, this is ',this);
                //console.log('lub dub should be called');
                _this.lubdub();
            },this.heartbeat_time);
    }
////////////////////
    this.stop_heartbeat = function(){
        clearInterval(this.heartbeat);
    }
////////////////////
    this.lubdub = function(){
        //console.log('lubdub');

        //this.stop_heartbeat();
    }

//////////////////// COLLISION CHECK = WALL
    this.collisionCheck = function(x,y){

        var leftEdge = 0;
        var topEdge = 0;
        var rightEdge = this.gameWidth - this.sprite.width();
        var bottomEdge = this.gameHeight - this.sprite.height();
        var wallSmashSound;
        wallSmashSound = document.getElementById("wallSmashSound");


        // console.log("x: ", x);
        // console.log("y: ", y);
        // console.log("left edge", leftEdge);
        // console.log("right edge", rightEdge);

        // console.log(x+"<="+leftEdge+' = '+(x <= leftEdge));
        // console.log(x+">="+rightEdge+' = '+(x >= rightEdge));
        // console.log(y+"<="+topEdge+' = '+(y <= topEdge));
        // console.log(y+">="+bottomEdge+' = '+(y >= bottomEdge));

        if(x <= leftEdge || x >= rightEdge)
        {
            console.log("rightEdge or leftEdge");
            wallSmashSound.play();
            $('#plusScore').css({'display': 'none'});
            $('#plusTealScore').css({'display': 'none'});
            $('#plusLilacScore').css({'display': 'none'});

             //3 MOODS
            $('#norm').css({'visibility': 'hidden'});
            $('#happy').css({'visibility':'hidden'});
            $('#defeated').css({'visibility':'visible'});
            // document.getElementById("norm").style.visibility = "hidden";
            // document.getElementById("happy").style.visibility = "hidden";
            // document.getElementById("defeated").style.visibility = "visible";
            $('.modal-title').html('game over').css('position', 'static');
            $('#overModal').modal('show');
            return true;

        } else if(y <= topEdge || y >= bottomEdge){
            console.log("topEdge or bottomEdge");
            wallSmashSound.play();
            $('#plusScore').css({'display': 'none'});
            $('#plusTealScore').css({'display': 'none'});
            $('#plusLilacScore').css({'display': 'none'});
            //3 MOODS
            $('#norm').css({'visibility': 'hidden'});
            $('#happy').css({'visibility':'hidden'});
            $('#defeated').css({'visibility':'visible'});
            // document.getElementById("norm").style.visibility = "hidden";
            // document.getElementById("happy").style.visibility = "hidden";
            // document.getElementById("defeated").style.visibility = "visible";
            $('.modal-title').html('game over').css('position', 'static');
            $('#overModal').modal('show');
            return true;
        }
        return false;
    }
//////////////////// COLLISION CHECK = COINS
    this.collisionCheckCoin = function(){

        var dragon_position = this.sprite.position();
        // console.log('dragon position: '+dragon_position.top+ ","+dragon_position.left);
        var DL = dragon_position.left;
        var DT = dragon_position.top;
        var DR = DL + this.sprite.width();
        var DB = DT + this.sprite.height();
        coinSound = document.getElementById("coinSoundN");


        //console.log((coinX + coin.width())+"<="+this.sprite.width()+' = '+((coinY+coin.height) <= this.sprite.height()));
        // console.log("####### COIN CHECK PASS");

        for(var i = 0; i < gameArena.treasureArray.length;i++){

            var coin_position = gameArena.treasureArray[i].position();
            var CL =  coin_position.left;
            var CR = CL + gameArena.treasureArray[i].width();
            var CT = coin_position.top;
            var CB = CT + gameArena.treasureArray[i].height();


            // console.log("dragon hits coin")
            // console.log('coinright ' + coinRightEdge+"<= dragonleft "+dragonLeftEdge+' = '+(coinRightEdge <= dragonLeftEdge));
            // console.log('coin left ' + coinLeftEdge+">= dragonright "+dragonRightEdge+' = '+(coinLeftEdge >= dragonRightEdge));
            // console.log('coin bottom ' + coinBottomEdge+"<= dragontop "+dragonTopEdge+' = '+(coinBottomEdge <= dragonTopEdge));
            // console.log('coin top ' + coinTopEdge+">= dragonbottom "+dragonBottomEdge+' = '+(coinTopEdge >= dragonBottomEdge));
            // if(coinLeftEdge <= dragonLeftEdge
            //     && coinRightEdge >= dragonLeftEdge && coinTopEdge <= dragonBottomEdge && coinBottomEdge >= dragonBottomEdge){
            //     console.log("left side coin collision");
            //      $(".treasure").hide();
            //     return true;
            // }
            // if(coinLeftEdge <= dragonRightEdge && coinRightEdge >= dragonRightEdge && coinTopEdge <= dragonBottomEdge && coinBottomEdge >= dragonBottomEdge){
            //     console.log("right side coin collision");
            //     $(".treasure").hide();
            //     return true;
            // }
            // if(coinLeftEdge <= dragonRightEdge && coinRightEdge >= dragonLeftEdge && coinTopEdge <= dragonBottomEdge && coinBottomEdge >= dragonTopEdge && coinLeftEdge <= dragonLeftEdge && coinRightEdge <= dragonRightEdge && coinTopEdge >= dragonTopEdge && coinBottomEdge <= dragonBottomEdge){
            //     console.log("coin collision new");
            //     $(".treasure").hide();
            //     return true;
            // }
            if(DL > CR || DR < CL || DB < CT || DT > CB ){

                        // console.log("(DL("+DL+") > CR("+CR+") || DR("+DR+") < CL("+CL+")("+(DL > CR || DR < CL)+")) || (DB("+DB+") < CT("+CT+") || DT("+DT+") > CB("+CB+")("+(DB < CT || DT > CB )+") )");
                //don't do shit
                // console.log("DL("+DL+") > CR("+CR+"):"+(DL > CR));
                // console.log("DR("+DR+") < CL("+CL+"):"+(DR < CL));
                // console.log("DB("+DB+") < CT("+CT+"):"+(DB < CT));
                // console.log("DT("+DT+") > CB("+CB+"):"+(DT > CB));
            }else{
                // console.log("collision");
                // console.log("DL("+DL+") > CR("+CR+"):"+(DL > CR));
                // console.log("DR("+DR+") < CL("+CL+"):"+(DR < CL));
                // console.log("DB("+DB+") < CT("+CT+"):"+(DB < CT));
                // console.log("DT("+DT+") > CB("+CB+"):"+(DT > CB));
                // console.log('collision');
                return gameArena.treasureArray[i];

            }
            // if(){
            //     console.log("bottom coin collision");
            //     return true;
            // }
            // if(coinTopEdge <= dragonTopEdge && coinBottomEdge >= dragonTopEdge){
            //     console.log("head on coin collision");
            //     return true;
            // }

        }
        return false;

    }
//////////////////// COLLISION CHECK = SPECIAL COIN!!
    this.collisionCheckSpCoin = function(){
        var dragon_position = this.sprite.position();// console.log('dragon position: '+dragon_position.top+ ","+dragon_position.left);
        var DL = dragon_position.left;
        var DT = dragon_position.top;
        var DR = DL + this.sprite.width();
        var DB = DT + this.sprite.height();
        coinSound = document.getElementById("coinSound");

        for(var i = 0; i < gameArena.treasureSpArray.length;i++){

            var coin_positionSp = gameArena.treasureSpArray[i].position();
            var CL =  coin_positionSp.left;
            var CR = CL + gameArena.treasureSpArray[i].width();
            var CT = coin_positionSp.top;
            var CB = CT + gameArena.treasureSpArray[i].height();

            if(DL > CR || DR < CL || DB < CT || DT > CB ){

            }else{
                return gameArena.treasureSpArray[i];
            }
        }
        return false;

    }

//////////////////// COLLISION CHECK = MEGA COIN!!
    this.collisionCheckMegaCoin = function(){
        var dragon_position = this.sprite.position();// console.log('dragon position: '+dragon_position.top+ ","+dragon_position.left);
        var DL = dragon_position.left;
        var DT = dragon_position.top;
        var DR = DL + this.sprite.width();
        var DB = DT + this.sprite.height();
        //coinSound = document.getElementById("coinSound");

        for(var i = 0; i < gameArena.treasureMegaArray.length;i++){

            var coin_positionMega = gameArena.treasureMegaArray[i].position();
            var CL =  coin_positionMega.left;
            var CR = CL + gameArena.treasureMegaArray[i].width();
            var CT = coin_positionMega.top;
            var CB = CT + gameArena.treasureMegaArray[i].height();

            if(DL > CR || DR < CL || DB < CT || DT > CB ){

            }else{
                return gameArena.treasureMegaArray[i];
            }
        }
        return false;

    }
//////////////////// COLLISION CHECK = FIRE
    this.collisionCheckFire = function(){
        var dragon_position = this.sprite.position();
        var DL = dragon_position.left;
        var DT = dragon_position.top;
        var DR = DL + this.sprite.width();
        var DB = DT + this.sprite.height();

        for(var i = 0; i < gameArena.fireArray.length;i++){

        var fire_position = gameArena.fireArray[i].position();
        var FL =  fire_position.left;
        var FR = FL + gameArena.fireArray[i].width();
        var FT = fire_position.top;
        var FB = FT + gameArena.fireArray[i].height();
        burnedSound = document.getElementById("burnedSound");

        if(DL > FR || DR < FL || DB < FT || DT > FB){

                }else{
                    $('.modal-title').html('game over').css('position', 'static');
                    $('#overModal').modal('show');
                    burnedSound.play();
                    $('#plusScore').css({'display': 'none'});
                    $('#plusTealScore').css({'display': 'none'});
                    $('#plusLilacScore').css({'display': 'none'});

                    //3 MOODS
                    $('#norm').css({'visibility': 'hidden'});
                    $('#happy').css({'visibility':'hidden'});
                    $('#defeated').css({'visibility':'visible'});

                    // document.getElementById("norm").style.visibility = "hidden";
                    // document.getElementById("happy").style.visibility = "hidden";
                    // document.getElementById("defeated").style.visibility = "visible";
                    this.fly.stop();

                    return true;
                }
            }
            return false;
        }


////////////////////
    this.coinCollect = function(target_coin){
        coinSound.play();
        var offset = target_coin.offset();

        gameArena.add_score('coin');
        $("#score").html(gameArena.score);

        var plusCoin50 = $('<div>',{
            class:'animated infinite fadeOutUp',
            id:'plusScore',
            height: '50px',
            width: '150px',
            text: '+50',
        });

        plusCoin50.css({ 'left': offset.left - plusCoin50.width()/2, 'top':offset.top - plusCoin50.height()/2, 'display': 'block', 'position': 'absolute', });


        // $('#plusScore').css({ 'left': offset.left, 'top':offset.top, 'display': 'block', 'position': 'absolute', });
        $('#plusTealScore').css({'display': 'none'});
        $('#plusLilacScore').css({'display': 'none'});

        $('#norm').css({'visibility': 'visible'});
        $('#happy').css({'visibility': 'hidden'});
        $('#defeated').css({'visibility': 'hidden'});
        // document.getElementById("norm").style.visibility = "visible";
        // document.getElementById("happy").style.visibility = "hidden";
        // document.getElementById("defeated").style.visibility = "hidden";
        target_coin.remove();
        $("#game").append(plusCoin50);

        (function(item){
            setTimeout(function(){
                console.log("item", item);
                item.remove();
            }, 1300);
        })(plusCoin50);

    }
////////////////////
    this.coinSpCollect = function(target_coinSp){
        coinSound.play();
        var offset = target_coinSp.offset();

        gameArena.add_score('tealCoin');
        $("#score").html(gameArena.score);

        var plusCoinIce = $('<div>',{
            class:'animated infinite fadeOutUp',
            id:'plusTealScore',
            height: '50px',
            width: '150px',
            text: '+300',
        });
        plusCoinIce.css({ 'left': offset.left - plusCoinIce.width()/2, 'top':offset.top - plusCoinIce.height()/2, 'display': 'block', 'position': 'absolute', });
        console.log("plusCoinIce width", plusCoinIce.width());
        console.log("plusCoinIce height", plusCoinIce.height());

        $('#plusScore').css({'display': 'none'});
        //$('#plusTealScore').css({'left': offset.left, 'top':offset.top, 'display': 'block', 'position': 'absolute', });
        $('#plusLilacScore').css({'display': 'none'});

        //3 MOODS
        $('#norm').css({'visibility': 'hidden'});
        $('#happy').css({'visibility': 'visible'});
        $('#defeated').css({'visibility': 'hidden'});

        target_coinSp.remove();
        $("#game").append(plusCoinIce);

        (function(item){
            setTimeout(function(){
                console.log("item", item);
                item.remove();
            }, 1300);
        })(plusCoinIce);
    }
////////////////////
    this.coinMegaCollect = function(target_coinMega){
        coinSound.play();
        var offset = target_coinMega.offset();

        var plusCoinLilac = $('<div>',{
            class:'animated infinite fadeOutUp',
            id:'plusLilacScore',
            height: '50px',
            width: '150px',
            text: '+2000',
        });
        plusCoinLilac.css({ 'left': offset.left - plusCoinLilac.width()/2, 'top':offset.top - plusCoinLilac.height()/2, 'display': 'block', 'position': 'absolute', });

        gameArena.add_score('megaCoin');
        $("#score").html(gameArena.score);
        $('#plusScore').css({'display': 'none'});
        $('#plusTealScore').css({'display': 'none'});

        //3 MOODS
        $('#norm').css({'visibility': 'hidden'});
        $('#happy').css({'visibility':'visible'});
        $('#defeated').css({'visibility':'hidden'});

        target_coinMega.remove();
        $("#game").append(plusCoinLilac);

        (function(item){
            setTimeout(function(){
                console.log("item", item);
                item.remove();
            }, 1300);
        })(plusCoinLilac);
    }


////////////////////
    this.die = function(){
        console.log("death");
        // this.stop();
    }

////////////////////

////////////////////
    this.bind_movement_keys = function()
    {
        //bind the movement keys for this dragon
        var _this = this;
        $(document).keydown(function()
        {
            console.log('event: ',event);
            console.log('event which: ',event.which);
            //dragon_pos = $('#icedragon').position();
            console.log("dragon_pos ", dragon_pos);
            console.log("this is ",this);

            switch(event.which)
            {
                case EAST://right
                    console.log("changing to east");
                    _this.deltaX = delta;
                    _this.deltaY = 0;
                    _this.direction = 90;
                    break;
                case WEST://left
                console.log("changing to west");
                    _this.deltaX = -1 * delta;
                    _this.deltaY = 0;
                    _this.direction = 270;
                    console.log("new deltaX "+this.deltaX);
                    break;
                 case NORTH://up
                    console.log("changing to north");
                    _this.deltaX = 0;
                    _this.deltaY = -1 * delta;
                    _this.direction = 0;
                    break;
                case SOUTH://down
                    console.log("changing to south");
                    _this.deltaX = 0;
                    _this.deltaY = delta;
                    _this.direction = 180;
                    break;
                case 67:
                    $('#icedragon').css('backgroundColor',bgcolor);
                    break;
                case 32://space
                restart();
                    break;
            }


        });

    }

    this.init();
}
///////////////////////////////////////////////////////////////////////////////////////////////////////
//★ GAME OBJECT ★//
///////////////////////////////////////////////////////////////////////////////////////////////////////
function gameObject(){
    console.log("gameObject called");
    self = this;
    this.gameArena = $('#game');
    this.width = this.gameArena.width();
    this.height = this.gameArena.height();
    this.treasureArray = [];
    this.treasureSpArray = [];
    this.treasureMegaArray = [];
    this.fireArray = [];
    this.score = 0;
    this.coin_score_delta= 50;
    this.coin_score_delta_sp = 300;
    this.coin_score_delta_mega = 2000;

    this.init = function(){
        console.log('initializing');
        this.generateTreasureAmount (50);
        this.generateSpTreasureAmount(15);
        this.generateMegaTreasureAmount(5);
        this.generateFireAmount(5);
    }
//////////////////// MEGA BONUS

// this.megaTimer = setInterval(function(){
//     var megaTimer;
//     var megaCoin = 0;
//     megaCoin++;
//     if(megaCoin === 10){
//         this.generateMegaTreasure();
//         clearTimeout(megaTimer);
//     }
// },1000);

//////////////////// GENERATE TREASURE
    this.generateTreasure = function(){
        var x = Math.round(Math.random() * this.width/1.1);
        var y = Math.round(Math.random() * this.height/1.1);

        var treasure = $('<img>',{
            src:'images/coin.png',
            class:'treasure',
            id:'treasureid'

        }).css({
            left: x+'px',
            top: y+'px',
        });
        this.treasureArray.push(treasure);
        this.gameArena.append(treasure);
    }
    this.generateTreasureAmount = function(treasureAmount){
        for(var i=0; i < treasureAmount;i++){
            this.generateTreasure();
        }
    }

//////////////////// GENERATE SPECIAL TREASURE (TEAL)
    this.generateSpTreasure = function(){
        var x = Math.round(Math.random() * this.width/1.1);
        var y = Math.round(Math.random() * this.height/1.1);

        var treasureSp = $('<img>',{
            src:'images/coin_teal.png',
            class:'treasure_teal',
            id:'treasureid_teal'

        }).css({
            left: x+'px',
            top: y+'px',
        });
        this.treasureSpArray.push(treasureSp);
        this.gameArena.append(treasureSp);
    }
    this.generateSpTreasureAmount = function(treasureSpAmount){
        for(var i=0; i < treasureSpAmount;i++){
            this.generateSpTreasure();
        }
    }

//////////////////// GENERATE MEGA TREASURE (PURPLE)
    this.generateMegaTreasure = function(){
        var x = Math.round(Math.random() * this.width/1.1);
        var y = Math.round(Math.random() * this.height/1.1);

        var treasureMega = $('<img>',{
            src:'images/mega_coin.png',
            class:'treasure_mega',
            id:'treasureid_mega'

        }).css({
            left: x+'px',
            top: y+'px',
        });
        this.treasureMegaArray.push(treasureMega);
        this.gameArena.append(treasureMega);
    }
    this.generateMegaTreasureAmount = function(treasureMegaAmount){
        for(var i=0; i < treasureMegaAmount;i++){
            this.generateMegaTreasure();
        }
    }
//////////////////// FIRE TO COIN
        //loop through treasure array
        //check fire vs each treasure item collision
        //return true if can append false if can't
    this.fireToCoin = function(){
        //console.log("Fire coin check");

        var coin_width = this.treasureArray[0].width();
        var coin_height = this.treasureArray[0].height();

        var treasureCoinsArray = this.treasureArray.concat(this.treasureSpArray, this.treasureMegaArray);

        for(var i = 0; i < this.fireArray.length; i++){
            var fire_position = this.fireArray[i].position();
            var FL =  fire_position.left;
            var FR = FL + this.fireArray[i].width();
            var FT = fire_position.top;
            var FB = FT + this.fireArray[i].height();

            for(var j = 0; j < treasureCoinsArray.length; j++){

                var coin_position = treasureCoinsArray[j].position();
                var CL = coin_position.left;
                var CR = CL + coin_width;
                var CT = coin_position.top;
                var CB = CT + coin_height;

                if(CL > FR || CR < FL || CB < FT || CT > FB){
                }else{
                    var newPosL = CL + 30;
                    var newPosT = CT + 30;
                    var newPosR = CR + 30;
                    var newPosB = CB + 30;

                    //console.log("treasureCoinsArray", treasureCoinsArray[j].position().left);
                    treasureCoinsArray[j].css({right: newPosR, left: newPosL, top: newPosT, bottom: newPosB,});
                    //console.log("treasureCoinsArray", treasureCoinsArray[j].position().left);
                }
            }
        }
        //return false;
    }
//////////////////// GENERATE FIRE
    this.generateFire = function(){
        var fireX = Math.round(Math.random() * this.width/1.3);
        var fireY = Math.round(Math.random() * this.height/1.3);

        var fire = $('<img>',{
            src:'images/fire.gif',
            class: 'fire',
        }).css({
            left: fireX+'px',
            top: fireY+'px',
        });
        this.fireArray.push(fire);

        //fireToCoin();
        this.gameArena.append(fire);

        }
    this.generateFireAmount = function(fireAmount){
       for(var i=0; i < fireAmount; i++){
            this.generateFire();
       }
       this.fireToCoin();
    }

//////////////////// ADD SCORE
    this.add_score = function(score_type){
        switch(score_type){
            case 'coin':
                var delta_score = this.coin_score_delta;//50pts
                break;
            case 'tealCoin':
                 var delta_score1 = this.coin_score_delta_sp;//200pts
                 console.log("tealCoin", delta_score1);
            case 'megaCoin':
                 var delta_score2 = this.coin_score_delta_mega;//200pts
                 console.log("megaCoin", delta_score2);
            default:
                var delta_score = 0;
                break;
        }
        this.score += delta_score || delta_score1 || delta_score2;

        if(this.score === 17000){
        $('.modal-title').html('you win!').css('position', 'static');
        $('modal-body').text('sweet!').css('position', 'static');
        $('#overModal').modal('show');
        this.fly.stop();
        }
    }


    this.init();
}//END OF GAME OBJECT

///////////////////////////////////////////////////////////////////////////////////////////////////////
//★ RESET ★//
///////////////////////////////////////////////////////////////////////////////////////////////////////
function restart(){

        document.location.href = "";

}

///////////////////////////////////////////////////////////////////////////////////////////////////////
//★ GAME BOARD ★//
var updateScore = function(){
    var $currentScore = Number($('#score').html());
    $('#score').html($currentScore);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////
var ice_dragon = null;
$(document).ready(function(){

    gameArena = new gameObject();
    ice_dragon = new dragonObject(delta);
    $('.resetButton').click(function(){
    gameArena.reset();

    });

});
