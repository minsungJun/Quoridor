//-1 외벽, 0 빈공간, 1 벽,  2 벽 설치 가능, 3 탐색한 길   6,7 플레이어, 5 이동가능 위

let map_data_Stack = [];
let map_data = [
  [-1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1],
  [-1,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,-1],
  [-1,0,2,0,2, 0,2,0,2,0, 2,0,2,0,2, 0,2,0,-1],
  [-1,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,-1],
  [-1,0,2,0,2, 0,2,0,2,0, 2,0,2,0,2, 0,2,0,-1],
  [-1,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,-1],
  [-1,0,2,0,2, 0,2,0,2,0, 2,0,2,0,2, 0,2,0,-1],
  [-1,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,-1],
  [-1,0,2,0,2, 0,2,0,2,0, 2,0,2,0,2, 0,2,0,-1],
  [-1,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,-1],
  [-1,0,2,0,2, 0,2,0,2,0, 2,0,2,0,2, 0,2,0,-1],
  [-1,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,-1],
  [-1,0,2,0,2, 0,2,0,2,0, 2,0,2,0,2, 0,2,0,-1],
  [-1,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,-1],
  [-1,0,2,0,2, 0,2,0,2,0, 2,0,2,0,2, 0,2,0,-1],
  [-1,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,-1],
  [-1,0,2,0,2, 0,2,0,2,0, 2,0,2,0,2, 0,2,0,-1],
  [-1,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,-1],
  [-1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1,-1, -1,-1,-1,-1]
];
let stack_copy = [];
let save_data_1 = [];
let save_data_2 = [];
let temp = [];
let cross = 1;
let total_turn = 0;

function draw_map(){
  let str = '<table>';
  for(var i=1; i<18; i++){
    str += '<tr>';
    for(var j=1; j<18; j++){
      if( (i === 1 && map_data[i][j] === 7) || (i === 17 && map_data[i][j] === 6) ) alert('!!!GAME OVER!!!');
      if(i % 2 == 0 && j % 2 == 0){
        if(map_data[i][j] == 2){
          str += setwall();
          str += i + ',' + j + ')\'>';
        }
        else str += '<td id = \'wall\'>';
      }
      else if(i % 2 == 1 && j % 2 == 1){
        if(i === player1.y && j === player1.x){
          map_data[i][j] = player1.num;
          str += '<td id=\'move_zone\'><div id=\'player1\' onclick=\'player1.canmove_player()\'></div>';
        }
        else if(i === player2.y && j === player2.x){
          map_data[i][j] = player2.num;
          str += '<td id=\'move_zone\'><div id=\'player2\' onclick=\'player2.canmove_player()\'></div>';
        }
        else if(map_data[i][j] === 5){
          str += setmove();
          str += i + ',' + j + ')\'>';
        }
        else str += '<td id=\'move_zone\'>';
      }
      else {
        if(map_data[i][j] == 1)str += '<td id=\'wall\'>';
        else str += '<td id=\'wall_zone\'>';
      }
    }
    str += '</tr>';
  }
  document.getElementById('map').innerHTML = str;
  document.getElementById('p1').innerHTML = '남은 벽 개수 = ' + player1.wall_cnt;
  document.getElementById('p2').innerHTML = '남은 벽 개수 = ' + player2.wall_cnt;
  if(total_turn % 2 == 0){
    document.getElementById('player1_div').style.background = 'rgb(51,255,51)';
    document.getElementById('player2_div').style.background = 'rgb(255,255,255)';
  }
  else {
    document.getElementById('player1_div').style.background = 'rgb(255,255,255)';
    document.getElementById('player2_div').style.background = 'rgb(51,255,51)';
  }
}


function setmove(){
  return total_turn % 2 === 0 ? '<td id=\'canmove\' onclick=\'player1.move(' : '<td id=\'canmove\' onclick=\'player2.move('
}

function setwall(){
  return total_turn % 2 === 0 ? '<td id=\'set_zone\' onclick=\'player1.wall(' : '<td id=\'set_zone\' onclick=\'player2.wall('
}

function change(){
  cross = -cross;
  console.log('change = ' + cross);
  if(cross < 0)document.getElementById('change_div').innerHTML = '방향전환(세로)';
  else document.getElementById('change_div').innerHTML = '방향전환(가로)';
}

function undo(){
  if(map_data_Stack.length === 0)return;
  map_data = map_data_Stack.pop();
  total_turn--;
  if(total_turn % 2 === 0){
    temp = save_data_1.pop();
    player1.x = temp[0];
    player1.y = temp[1];
    player1.wall_cnt = temp[2];
  }
  else {
    temp = save_data_2.pop();
    player2.x = temp[0];
    player2.y = temp[1];
    player2.wall_cnt = temp[2];
  }
  draw_map();
}

function inputstack(){
  remove5();
  stack_copy = [...map_data];
  total_turn % 2 === 0 ? save_data_1.push([player1.x, player1.y, player1.wall_cnt]) : save_data_2.push([player2.x, player2.y, player2.wall_cnt]);

  for(let i = 0; i< map_data.length; i++){
    stack_copy[i] = [...map_data[i]];
  }
  map_data_Stack.push(stack_copy);
}

function remove5(){
  for(let i = 0; i < map_data.length; i++){
    for(let j = 0; j < map_data.length; j++){
      if(map_data[i][j] === 5)map_data[i][j] = 0;
    }
  }
}
function remove3(){
  for(let i = 0; i < map_data.length; i++){
    for(let j = 0; j < map_data.length; j++){

      if(map_data[i][j] === 3)map_data[i][j] = 1;
      if(map_data[i][j] === 4)map_data[i][j] = 2;
    }
  }
}
