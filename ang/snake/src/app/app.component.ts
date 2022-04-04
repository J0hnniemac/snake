import { Component, ViewChild, ElementRef, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  baseURL: string = "http://172.17.0.2:5001/highscore";



  constructor(private httpClient: HttpClient) {
  }


  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(event.key == 'ArrowDown'){
      // Your row selection code
      //console.log("ARROW DOWN");
      this.MoveDown();
    }
    if(event.key == 'ArrowUp'){
      // Your row selection code
      //console.log("ARROW UP");
      this.MoveUp()
    }
    if(event.key == 'ArrowLeft'){
      // Your row selection code
      //console.log("ARROW Left");
      this.MoveLeft();
    }
    if(event.key == 'ArrowRight'){
      // Your row selection code
      //console.log("ARROW Right");
      this.MoveRight();
    }

  }



  title = 'Snake Game';
  score = 0;
  highscore = 1;
  //xxx = 0;
  grid = 16;
  count = 0;
  max = 0;

  scell: (number | number)[] = [];
  snake = {
    x: 160,
    y: 160,

    // snake velocity. moves one grid length every frame in either the x or y direction
    dx: this.grid,
    dy: 0,

    // keep track of all grids the snake body occupies
    cells: [],

    // length of the snake. grows when eating an apple
    maxCells: 4
  };
  apple = {
    x: 320,
    y: 320
  };

  width = 400;
  height = 400;

  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;

  ngOnInit(): void {

    const cav = this.canvas.nativeElement.getContext('2d');
    if (!cav || !(cav instanceof CanvasRenderingContext2D)) {
      throw new Error('Failed to get 2D context');
    }

    this.ctx = cav;


  }



  animate(){
    console.log("animate");
    //this.ctx.fillStyle = 'blue';
    //this.ctx.fillRect(0, 0, 40, 40);


      //this.loop()
    //  const id = requestAnimationFrame(() => (this.loop(this.ctx)));
//      const id = requestAnimationFrame(this.loop(this.ctx));
    this.loop(this.ctx)
  }

  MoveLeft()
  {
    this.snake.dx = -this.grid;
    this.snake.dy = 0;

  }

  MoveRight()
  {
    this.snake.dx = this.grid;
    this.snake.dy = 0;

  }

  MoveUp()
  {
    this.snake.dy = -this.grid;
    this.snake.dx = 0;

  }
  MoveDown()
  {

    this.snake.dy = this.grid;
    this.snake.dx = 0;
  }
  public getHighScoreFromAPI(): Observable<string> {

    return this.httpClient.get<string>(this.baseURL);
  }

  sendHighScore (score :number) {
    console.log("sendHighScore");
    var scoreurl: string = "http://172.17.0.2:5001/sethighscore/" + score;
    console.log(scoreurl);
    this.httpClient.get<any>(scoreurl).subscribe();
  }

  ResetGame() {

    //this.highscore = this.getHighScoreFromAPI()

   // this.getHighScoreFromAPI().subscribe(x=> this.highscore = +x)
    this.getHighScoreFromAPI().subscribe(x=> this.checkHighScore(x))

    this.snake.x = 160;
    this.snake.y = 160;
    this.snake.cells = [];
    this.snake.maxCells = 4;
    this.snake.dx = this.grid;
    this.snake.dy = 0;
    this.apple.x = this.getRandomInt(0, 25) * this.grid;
    this.apple.y = this.getRandomInt(0, 25) * this.grid;

    //this.document.getElementById('score').innerHTML = score;
    this.scell= [];

  }

  checkHighScore(hs: string)
  {
    console.log("checkHighScore");
    var numhs:number = +hs;
    console.log(numhs)
    console.log(this.highscore)
    console.log(this.score)


    if(numhs > this.highscore) {
      this.highscore = numhs;
    }

    if(this.score > numhs) {

      this.sendHighScore(this.score);
      this.getHighScoreFromAPI().subscribe(x=> this.checkHighScore(x))
    }
    this.score = 0;
  }

  GameOver() {


    this.ResetGame();
  }


  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  loop(ctx: CanvasRenderingContext2D) {
    const id = requestAnimationFrame(() => (this.loop(this.ctx)));

    // slow game loop to 15 fps instead of 60 (60/15 = 4)
        if (++this.count < 4) {
          return;
        }
    this.count = 0;
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    // move snake by it's velocity
    this.snake.x += this.snake.dx;
    this.snake.y += this.snake.dy;
    if (this.snake.x < 0) {
      this.GameOver();
    }
    else if (this.snake.x >= this.width) {
      this.GameOver();
    }

    if (this.snake.y < 0) {
      this.GameOver();
    }
    else if (this.snake.y >= this.height) {
      this.GameOver();
    }
    // keep track of where snake has been. front of the array is always the head

    this.scell.unshift(this.snake.x, this.snake.y);

    // remove cells as we move away from them
    if (this.scell.length > this.snake.maxCells) {
      this.scell.pop();
      this.scell.pop();
    }
    // draw apple
    ctx.fillStyle = '#acf04d';
    ctx.fillRect(this.apple.x, this.apple.y, this.grid - 1, this.grid - 1);
    // draw snake one cell at a time
    ctx.fillStyle = '#f04dac';

    for (let i = 0; i < this.scell.length - 2; i = i + 2) {
      //draw snake
      let x = this.scell[i];
      let y = this.scell[i + 1];

     ctx.fillRect(x, y, this.grid - 1, this.grid - 1);
      ctx.fillStyle = '#4dacf1';




      if (x === this.apple.x && y === this.apple.y) {
        this.snake.maxCells++;
        this.snake.maxCells++;
        this.score += 10;
        //max=score;
        //document.getElementById('score').innerHTML = score;

        // canvas is 400x400 which is 25x25 grids
        this.apple.x = this.getRandomInt(0, 25) * this.grid;
        this.apple.y = this.getRandomInt(0, 25) * this.grid;
      }



    }




  }



}


