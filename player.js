let ifclick = 0;

class Player_data {
  constructor(x, y, turn, num) {
    this.x = x;
    this.y = y;
    this.turn = turn;
    this.num = num;
    this.wall_cnt = 10;
    this.crossarr = [];// 갈림길 저장
    this.foularr = [];// -1 좌표 저장
  }

  canmove_player(){
    if(total_turn % 2 !== this.turn) return;
    if(ifclick === 0){//1
      ifclick++;
      if(map_data[this.y][this.x-1] === 0 ){
        if( (map_data[this.y][this.x-2] === player1.num || map_data[this.y][this.x-2] === player2.num) && map_data[this.y][this.x-3] === 0 ){
          map_data[this.y][this.x-4]=5;
        }
        else map_data[this.y][this.x-2] = 5;
      }

      if(map_data[this.y][this.x+1] === 0 ){
        if( (map_data[this.y][this.x+2] === player1.num || map_data[this.y][this.x+2] === player2.num) && map_data[this.y][this.x+3] === 0 ){
          map_data[this.y][this.x+4]=5;
        }
        else map_data[this.y][this.x+2] = 5;
      }

      if(map_data[this.y-1][this.x] === 0 ){
        if( (map_data[this.y-2][this.x] === player1.num || map_data[this.y-2][this.x] === player2.num) && map_data[this.y-3][this.x] === 0 ){
          map_data[this.y-4][this.x]=5;
        }
        else map_data[this.y-2][this.x] = 5;
      }

      if(map_data[this.y+1][this.x] === 0 ){
        if( (map_data[this.y+2][this.x] === player1.num || map_data[this.y+2][this.x] === player2.num) && map_data[this.y+3][this.x] === 0 ){
          map_data[this.y+4][this.x]=5;
        }
        else map_data[this.y+2][this.x] = 5;
      }
      draw_map();
    }//1
    else if(ifclick === 1){
      ifclick = 0;
      for(var i = 1; i < 18; i++){
        for(var j = 1; j < 18; j++){
          if(map_data[i][j] === 5)map_data[i][j] = 0;
        }
      }
      draw_map();
    }
  }//canmove_player

  move(y, x){
    if(total_turn % 2 !== this.turn)return;
    if(map_data[y][x] === 5){
      inputstack();
      map_data[this.y][this.x] = 0;
      map_data[y][x] = this.num;
      this.x = x;
      this.y = y;
      total_turn++;
      draw_map();
      ifclick = 0;
    }
  }//move_player

  wall(y, x){
    if(cross === 1){
      if(map_data[y][x] !== 2 || map_data[y][x-1] !== 0 || map_data[y][x+1] !== 0 || this.wall_cnt <= 0)return;
      else{
        inputstack();
        this.wall_cnt--;
        map_data[y][x] = 1;
        map_data[y][x-1] = 1;
        map_data[y][x+1] = 1;
        //console.log('width DONE!!');
        total_turn++;
        if(this.foulcheck(y, x) == 0){
          alert('cheat!!')
          remove3();
          undo();
        }
        else {
          remove3();
          draw_map();
        }
      }
    }
    else if(cross === -1){
      if(map_data[y][x] !== 2 || map_data[y-1][x] !== 0 || map_data[y+1][x] !== 0 || this.wall_cnt <= 0)return;
      else{
        inputstack();
        this.wall_cnt--;
        map_data[y][x] = 1;
        map_data[y-1][x] = 1;
        map_data[y+1][x] = 1;
        //console.log('width DONE!!');
        total_turn++;
        if(this.foulcheck(y, x) == 0){
          alert('cheat!!')
          remove3();
          undo();
        }
        else {
          remove3();
          draw_map();
        }
      }
    }
  }//wall

  crosscheck(y, x){
    let tmp = 0;

          if(map_data[y-1][x] == 1 || map_data[y-1][x] == 2)tmp++;
          if(map_data[y][x-1] == 1 || map_data[y][x-1] == 2)tmp++;
          if(map_data[y][x+1] == 1 || map_data[y][x+1] == 2)tmp++;
          if(map_data[y+1][x] == 1 || map_data[y+1][x] == 2)tmp++;
    if(tmp > 1){
      this.crossarr.push([y,x]);
      console.log('crosscheck push');
    }
    console.log('tmp = ' + tmp +', crossarr.length = '+this.crossarr.length)
    return;
  }



  search(y, x){
    let tmp = 0;
    this.what(y, x);
    for(let i=0; i<4; i++){
      switch(i){
        case 0:
          if(map_data[y-1][x] == -1){
            this.foularr.push([y,x]);
            return this.crossarr.pop();
          }
          if(map_data[y-1][x] == 1 || map_data[y-1][x] == 2){
            //this.what(y, x);
            return [y-1, x];
          }
          break;

        case 1:
          if(map_data[y][x-1] == -1){
            this.foularr.push([y,x]);
            return this.crossarr.pop();
          }
          if(map_data[y][x-1] == 1 || map_data[y][x-1] == 2){
            //this.what(y, x);
            return [y, x-1];
          }
          break;

        case 2:
          if(map_data[y][x+1] == -1){
            this.foularr.push([y,x]);
            return this.crossarr.pop();
          }
          if(map_data[y][x+1] == 1 || map_data[y][x+1] == 2){
            //this.what(y, x);
            return [y, x+1];
          }
          break;

        case 3:
          if(map_data[y+1][x] == -1){
            this.foularr.push([y,x]);
            return this.crossarr.pop();
          }
          if(map_data[y+1][x] == 1 || map_data[y+1][x] == 2){
            //this.what(y, x);
            return [y+1, x];
          }
          break;
      }
    }
    if(this.crossarr.length > 0)return this.crossarr.pop();
    else return 0;
  }

  foulcheck(y,x){
    let tmp;
    let high = [];
    let low = [];
    this.foularr = [];
    //this.crossarr.push([y,x]);
      while(tmp !== 0){
        this.crosscheck(y,x);
        tmp = this.search(y,x);
        console.log('tmp = ' + tmp);


        if(high.length == 0){
          high[0] = tmp[0];
          high[1] = tmp[1];
        }
        if(low.length == 0){
          low[0] = tmp[0];
          low[1] = tmp[1];
        }

        if(tmp != undefined){
          if(tmp[0] > high[0]) high[0] = tmp[0];
          if(tmp[1] > high[1]) high[1] = tmp[1];
          if(tmp[0] < low[0]) low[0] = tmp[0];
          if(tmp[1] < low[1]) low[1] = tmp[1];
        }

        if(tmp !== 0 && tmp != undefined) {
          y = tmp[0];
          x = tmp[1];
          console.log(x + ' , ' + y)
          console.log('high = ' + high + ' low = ' + low)
        }
        else {
          console.log('break')
          break;
        }
      }

        if(this.foularr.length > 1){
          if(this.foularr[0][0] == 1 && this.foularr[1][1] == 1) {if(this.cheat(high, low)) return 0;}
          if(this.foularr[0][1] == 1 && this.foularr[1][0] == 17) {if(this.cheat(high, low)) return 0;}
          if(this.foularr[0][0] == 1 && this.foularr[1][1] == 17) {if(this.cheat(high, low)) return 0;}
          if(this.foularr[0][1] == 17 && this.foularr[1][0] == 17) {if(this.cheat(high, low)) return 0;}

          if(this.foularr[0][1] == 1 && this.foularr[1][1] == 17) return 0;
          if(this.foularr[0][1] == 17 && this.foularr[1][1] == 1)  return 0;
        }
      else return 1;

  }

  what(y, x){
    if(map_data[y][x] == 1)map_data[y][x] = 3;
    if(map_data[y][x] == 2)map_data[y][x] = 4;
  }

  cheat(high, low){
    return ( (low[1] <= player1.x && player1.x <= high[1]) && (low[0] <= player1.y && player1.y <= high[0]) )||( (low[1] <= player2.x && player2.x <= high[1]) && (low[0] <= player2.y && player2.y <= high[0]) )
  }


}//class
