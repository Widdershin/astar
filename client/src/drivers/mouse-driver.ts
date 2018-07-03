import xs from 'xstream';
const fromEvent = require('xstream/extra/fromEvent').default;

export function mouseDriver () {
  return {
    positions () {
      return fromEvent(document, 'mousemove')
        .map(ev => {
          return {x: ev.clientX, y: ev.clientY};
        }).startWith({x: window.innerWidth / 2, y: window.innerHeight / 2});
    },

    ups () {
      return fromEvent(document, 'mouseup');
    }
  };
}
