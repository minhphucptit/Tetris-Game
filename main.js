class Game{
    constructor(){
        this.boardWidth=10;
        this.boardHeight=23;
        this.score=0;
        this.currenboard=new Array(this.boardHeight).fill(0).map(()=> new Array(this.boardWidth).fill(0))
        this.landboard=new Array(this.boardHeight).fill(0).map(()=> new Array(this.boardWidth).fill(0))
        this.canvas=document.getElementById('mycanvas');
        this.ctx=this.canvas.getContext('2d');
        this.nowForm=this.randDomShape();
        this.netForm=this.randDomShape();
    }
    draw(blockSize=22,padding=2){ 
        this.ctx.fillStyle='rgb(252, 250, 250)';
      this.ctx.clearRect(0,0,padding*2+this.boardWidth*(blockSize+padding),this.boardHeight*(blockSize+padding)+padding*2)
      
      this.ctx.font="35px Arial";
      this.ctx.fillText(this.score,23,50);
      this.ctx.rect(0,3*(blockSize+padding),padding*(this.boardWidth+2)+blockSize*this.boardWidth,padding*(this.boardHeight+1)+blockSize*this.boardHeight);
      this.ctx.rect(padding,3*(blockSize+padding),padding*(this.boardWidth+1)+blockSize*this.boardWidth,padding*(this.boardHeight-2)+blockSize*(this.boardHeight-3))
      this.ctx.stroke();
      for(let i=3;i<this.boardHeight;i++){
          for(let j=0;j<this.boardWidth;j++){
              if(this.currenboard[i][j]>0){
                  if(this.currenboard[i][j]==1)
                   this.ctx.fillStyle='rgb(128, 255, 151)'
                  else if(this.currenboard[i][j]==7)
                   this.ctx.fillStyle='rgb(245, 103, 202)'
                  else if(this.currenboard[i][j]==3)
                   this.ctx.fillStyle='rgb(18, 208, 222)'
                  else if(this.currenboard[i][j]==4)
                   this.ctx.fillStyle='rgb(255, 250, 94)'
                  else if(this.currenboard[i][j]==5)
                   this.ctx.fillStyle='rgb(250,0,0)'
              }
              else{
                  this.ctx.fillStyle='rgb(41, 38, 38)'
              }
              this.ctx.fillRect(padding*2+j*(blockSize+padding),padding+i*(blockSize+padding),blockSize,blockSize)
          }
      }
    }
    randDomShape(){
        let rand=Math.floor(Math.random()*5)+1
        switch(rand){
            case 1:{
                if(this.landboard[2][4]>0)
                 return 0;
                return new Lshape(0,4);
            }
            case 2:{
                if(this.landboard[2][4]>0)
                 return 0;
                return new Tshape(0,4);
            }
            case 3:{
                if(this.landboard[2][4]>0)
                 return 0;
                return new Zshape(2,4);
            }
            case 4:{
                if(this.landboard[2][4]>0)
                 return 0;
                return new Oshape(0,4);
            }
            case 5:{
                if(this.landboard[2][4]>0)
                 return 0;
                return new Ishape(0,4);
            }
        }
    }
    setDown(earnPoint,begin){
          while(earnPoint>0){
              let x=this.landboard[begin];
              for(let i=begin;i>3;i--){
                  this.landboard[i]=this.landboard[i-1];
              }
              this.landboard[3]=x;
              earnPoint--;
          }
    }
    checkPoint(){
        var begin=0;
        var earnPoint=0;
        for(let i=this.boardHeight-1;i>=0;i--){
            if(this.landboard[i].every((index)=>index>0)==1){
                if(begin<i){
                    begin=i;
                }
                this.landboard[i].fill(0);
                earnPoint++;
                this.score=this.score+100*earnPoint;
            }
        }
        console.log(earnPoint,begin);
        this.setDown(earnPoint,begin);
    }
    
    checkPossion(){   // check điều kiện dừng
        for(let i=0;i<this.nowForm.getHeight();i++){
            for(let j=0;j<this.nowForm.getWidth();j++){
                if(this.nowForm.shapes[this.nowForm.angel][i][j]>0&&this.landboard[this.nowForm.row+i+1][this.nowForm.col+j]>0)
                  return 1
            }
        }
    }
    letPossion(){     // thực hiện dừng shape
        let possion=23-this.nowForm.getHeight();
        if(this.nowForm.autofall()===possion||this.checkPossion()===1){
            for(let i=0;i<this.nowForm.getHeight();i++){
                for(let j=0;j<this.nowForm.getWidth();j++){
                    if(this.nowForm.shapes[this.nowForm.angel][i][j]>0)
                      this.landboard[this.nowForm.row+i][this.nowForm.col+j]=this.nowForm.shapes[this.nowForm.angel][i][j]
                }
            }
            this.nowForm=this.randDomShape()
        }
    }
    uppdateCurrenBoard(){
        for(let i=3;i<this.boardHeight;i++){  // Tạo giá trị cho curentboard để tô màu 
            for(let j=0;j<this.boardWidth;j++){
                this.currenboard[i][j]=this.landboard[i][j];
            }
        }
        for(let i=0;i<this.nowForm.getHeight();i++){
            for(let j=0;j<this.nowForm.getWidth();j++){
                if(this.nowForm.shapes[this.nowForm.angel][i][j]>0)
                  this.currenboard[this.nowForm.row+i][this.nowForm.col+j]=this.nowForm.shapes[this.nowForm.angel][i][j]
            }
        }
    }
    keyMove(){
        document.addEventListener('keyup',(e)=>{
            switch(e.which){
                case 65:{
                   this.nowForm.row--
                   this.nowForm.moveLeft();
                   return 0;
                }
                case 68:{
                    this.nowForm.row--
                    this.nowForm.moveRight();
                    return 0;
                }
                case 87:{
                    this.nowForm.rotate()
                    return 0;
                }
                case 83:{
                    this.nowForm.autofall()
                    return 0;
                }
            }
        })
    }
    play(){
         this.keyMove()
        setInterval(()=>{
         this.letPossion();
         this.uppdateCurrenBoard();
         this.checkPoint();
         this.draw();
        },380);
    }
}
class Form{
    constructor(row,col,angel=0){
        this.color='rgb(0,0,0)';
        this.row=row;
        this.col=col;
        this.angel=angel;
        this.shapes=[[[]]]
    }
    rotate(){
        if(this.angel<3)
        this.angel++;
        else
        this.angel=0;
    }
    getHeight(){
       
        return this.shapes[this.angel].length ;
    }
    getWidth(){
        
        return this.shapes[this.angel][0].length;
    }
    
    moveLeft(){
        this.col--
    }
    moveRight(){
        this.col++
    }
    autofall(){
        
        this.row++
        return this.row;
    }
}
class Lshape extends Form {
    constructor(row,col,angel=0){
        super(row,col,angel)
        this.color='rgb(230, 216, 23)';
        this.shapes=
         [[[1, 0],
           [1, 0],
           [1, 1]],

   [[1, 1, 1],
    [1, 0, 0]],

   [[1, 1],
    [0, 1],
    [0, 1]],

   [[0, 0, 1],
    [1, 1, 1]]]
    }
} 

class Tshape extends Form{//
    constructor(row,col,angel){
        super(row,col,angel)
        this.color='rgb(245, 103, 202)';
        this.shapes=[[[0, 4, 0],
        [4, 4, 4]],
    
       [[4, 0],
        [4, 4],
        [4, 0]],
    
       [[4, 4, 4],
        [0, 4, 0]],
    
       [[0, 4],
        [4, 4],
        [0, 4]]]
    }
}

class Oshape extends Form{
    constructor(row,col,angel){
        super(row,col,angel)
        this.color='rgb(18, 208, 222)';
        this.shapes=[[[3, 3],
        [3, 3]],
    
       [[3, 3],
        [3, 3]],
    
       [[3, 3],
        [3, 3]],
    
       [[3, 3],
        [3, 3]]]
    }
}

class Ishape extends Form{
    constructor(row,col,angel){
        super(row,col,angel)
        this.color='rgb(0, 63, 212)';
        this.shapes=[[[7],
        [7],
        [7],
        [7]],
    
       [[7, 7, 7, 7]],
    
       [[7],
        [7],
        [7],
        [7]],
    
       [[7, 7, 7, 7]]]
    }
}

class Zshape extends Form{
    constructor(row,col,angel){
        super(row,col,angel)
        this.color='rgb(250,0,0)';
        this.shapes=[[[0, 5, 5],
                      [5, 5, 0]],
    
       [[5, 0],
        [5, 5],
        [0, 5]],
    
       [[5, 5, 0],
        [0, 5, 5]],
    
       [[0, 5],
        [5, 5],
        [5, 0]]]
    }
}
       const game=new Game();
       game.play();



 