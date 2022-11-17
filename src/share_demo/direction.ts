/**
 * RxJS提供了一个fromEvent()操作符用来将事件转换为数据流，我们就用它来将玩家按键输入转为流数据，
 * 同时使用一些map()、filter()等操作符来处理，确保只输出上下左右按键的值：
 */
 import { Key, Scene } from '../types';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { map, filter, startWith, scan, distinctUntilChanged } from 'rxjs/operators';
interface Point2D {
  x: number;
  y: number;
}
interface Directions {
  [key: number]: Point2D;
}
const DIRECTIONS: Directions = {
  37: { x: -1, y: 0 },      // 方向左
  39: { x: 1, y: 0 },       // 方向右
  38: { x: 0, y: -1 },      // 方向下
  40: { x: 0, y: 1 }        // 方向上
};
const INITIAL_DIRECTION = DIRECTIONS[Key.RIGHT];
function nextDirection(previous, next) {
  let isOpposite = (previous: Point2D, next: Point2D) => {
    return next.x === previous.x * -1 || next.y === previous.y * -1;
  };
  return isOpposite(previous, next) ? previous : next;
}
let keydown$ = fromEvent(document, 'keydown');
let direction$ = keydown$.pipe(
  map((event: KeyboardEvent) => DIRECTIONS[event.keyCode]),
  filter(direction => !!direction),
  startWith(INITIAL_DIRECTION),    // 这里给direction$一个初始方向值
  scan(nextDirection),						 // 使用处理函数处理方向流
  distinctUntilChanged()					 // 当本次发出的数据跟前一个不同时，才会发出这个值
);
// 临时订阅一下direction$，简单在console里看下效果
direction$.subscribe(console.log);