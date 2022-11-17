import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {share, scan,withLatestFrom } from 'rxjs/operators';
import { interval } from 'rxjs/observable/interval';
import {
  move,
  generateSnake,
} from '../utils';
let direction$ 


// snakeLength$流  使用BehaviorSubject()来实现
const SNAKE_LENGTH = 5;
let length$ = new BehaviorSubject<number>(SNAKE_LENGTH);  // SNAKE_LENGTH为蛇长的初始值
let snakeLength$ = length$.pipe(
  scan((snakeLength, step) => {
    return snakeLength + step
  }),
  share()
);
//这里使用share()来允许多次订阅Observable，否则每次订阅都会重新创建源Observable。我们的snakeLength$同时被snake$流和score$流订阅，需要确保这两个流的获取的数据是同步的。
// snakeLength$流


// ticks$流
const SPEED = 120;
let ticks$ = interval(SPEED);     // 每隔120ms依次发出...0...1...2...
// ticks$流


// snake$流
let snake$ = ticks$.pipe(
	withLatestFrom(direction$, snakeLength$, (_, direction, snakeLength) => [direction,snakeLength]),
  scan(move, generateSnake()),   // 根据方向流和蛇身长流来产生蛇流，最终发出[{x: 1, y: 2}, 长度]数组对象形式的蛇流
  share()  // snake$被scene$和apples$使用，需要保持一致性，使用Subject()多播
);
// withLatestFrom()组合多个Observables，并且具有主从关系