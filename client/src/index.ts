import {run} from '@cycle/run';
import {makeDOMDriver, svg, div, h, h2, p, input, textarea, button} from '@cycle/dom';
import xs from 'xstream';

import {timeDriver} from '@cycle/time';
import {mouseDriver} from './drivers/mouse-driver';
const stuff = require('../response');

interface Vector {
  x: number;
  y: number;
}

function add(a: Vector, b: Vector): Vector {
  return {
    x: a.x + b.x,
    y: a.y + b.y
  };
}

function subtract(a: Vector, b: Vector): Vector {
  return {
    x: a.x - b.x,
    y: a.y - b.y
  };
}

function divideBy(a: Vector, n: number): Vector {
  return vmap(a, x => x / n);
}

function multiplyBy(a: Vector, n: number): Vector {
  return vmap(a, x => x * n);
}

function vmap(a: Vector, f: (n: number) => number): Vector {
  return {
    x: f(a.x),
    y: f(a.y)
  };
}

function length(a: Vector): number {
  return Math.abs(Math.sqrt(Math.pow(a.x, 2) + Math.pow(a.y, 2)));
}

function normalize(a: Vector): Vector {
  const vectorLength = length(a);

  return {
    x: a.x / vectorLength,
    y: a.y / vectorLength
  }
}


const center = {x: innerWidth / 4, y: innerHeight / 2};

function mapNodes (nodes, f) {
  return Object.keys(nodes).map(key => f(nodes[key]));
}

function renderLinkBeingCreated (state, mousePosition) {
  if (!state.addingLinkFrom) { return [] };

  const originNodePosition = state.nodes[state.addingLinkFrom].position;

  return [
    h('line', {
      attrs: {
        x1: originNodePosition.x.toFixed(1),
        y1: originNodePosition.y.toFixed(1),
        x2: mousePosition.x.toFixed(1),
        y2: mousePosition.y.toFixed(1),

        stroke: 'rebeccapurple',
        'stroke-width': '3'
      }
    })
  ];
}

function view ([state, mousePosition, hoverNode]) {
  return (
    div('.lodestar', [
    svg({attrs: {width: innerWidth, height: innerHeight}}, [
      h('defs', [
        h('marker#triangle', {
          attrs: {
            id: 'triangle',
            viewBox: '0 0 10 10',
            refX: '26',
            refY: '5',
            markerWidth: '6',
            markerHeight: '4',
            markerUnits: 'strokeWidth',
            orient: 'auto'
          }
        }, [h('path', {attrs: {fill: 'white', stroke: 'white', d: 'M 0 0 L 10 5 L 0 10 z'}})])
      ]),

      h('text', {attrs: {
        x: innerWidth - 20,
        y: 30,
        'text-anchor': 'end',
        style: 'font-size: 18; font-family: sans-serif; fill: white;'
      }}, 'Double click empty space to add a node'),

      h('text', {attrs: {
        x: innerWidth - 20,
        y: 53,
        'text-anchor': 'end',
        style: 'font-size: 18; font-family: sans-serif; fill: white;'
      }}, 'Double click on a node to start adding a link'),

      h('text', {attrs: {
        x: innerWidth - 20,
        y: 76,
        'text-anchor': 'end',
        style: 'font-size: 18; font-family: sans-serif; fill: white;'
      }}, 'Click and drag on a node to move it'),

      ...state.links.map(link =>
        h('line', {
          key: 'link' + link.to + link.from,

          attrs: {
            x1: state.nodes[link.from].position.x.toFixed(1),
            y1: state.nodes[link.from].position.y.toFixed(1),
            x2: state.nodes[link.to].position.x.toFixed(1),
            y2: state.nodes[link.to].position.y.toFixed(1),

            'marker-end': 'url(#triangle)',

            stroke: 'white',
            'stroke-width': '3'
          }
        })
      ),

      ...renderLinkBeingCreated(state, mousePosition),

      ...mapNodes(state.nodes, node => {
        let fill = '#dddecf';


        if (node.data.dependency_count === 0) {
          fill = 'yellow';
        }

        if (node.data.completed) {
          fill = 'lightgreen';
        }

        return h('g', [
          h('rect', {
            key: node.label,
            attrs: {
              key: node.label,
              x: node.position.x - 100,
              y: node.position.y - 30,
              width: 200,
              height: 60,
              fill
            }
          }),
          h('text', {
            attrs: {
              x: node.position.x - 90,
              y: node.position.y,
              fill: 'black',
              stroke: 'black'
            }
          }, node.data.name)
        ])
      })
    ]),

      focusView(state.nodes, hoverNode),

    ])
  );
}

function focusView(nodes, hoverNode) {
  return div('.focus', hoverNode ? [
    h2(nodes[hoverNode].data.name),

    p(nodes[hoverNode].data.description),

    div([
      input()
    ]),

    div([
      textarea()
    ])
  ] : [])
}

function applyReducer (state, reducer) {
  return reducer(state);
}

function update (delta, state) {
  // Given a set of nodes
  // And a set of links between nodes
  //
  // Each frame
  //  For each link
  //    Attract each linked node to the other
  //
  //  For each node
  //    Apply resisting force to each other node
  //

  state.links.forEach(link => {
    const fromNode = state.nodes[link.from];
    const toNode = state.nodes[link.to];

    /*
    const difference = subtract(fromNode.position, toNode.position);
    const distance = length(difference);

    const compressionMultiplier = Math.max(1, distance / 100);

    const attractionForce = multiplyBy(normalize(difference), compressionMultiplier * delta);

    if (state.dragging !== fromNode.label) {
      fromNode.position = subtract(fromNode.position, attractionForce);
    }

    if (state.dragging !== toNode.label) {
      toNode.position = add(toNode.position, attractionForce);
    }
    */

    const idealPosition = add(fromNode.position, {x: 300, y: 0});
    const dissonance = subtract(toNode.position, idealPosition);
    const multiplier = Math.max(0, length(dissonance) / 100);
    const impulse = multiplyBy(normalize(dissonance), multiplier);

    fromNode.position = add(fromNode.position, impulse);
    toNode.position = subtract(toNode.position, impulse);
  });

  mapNodes(state.nodes, node => {
    mapNodes(state.nodes, otherNode => {
      if (node === otherNode) {
        return;
      }

      const difference = subtract(node.position, otherNode.position);
      const distance = length(difference);

      const resistanceMultiplier = Math.max(0, (400 - distance) / 50);

      const resistanceForce = multiplyBy(normalize(difference), resistanceMultiplier * delta)

      if (state.dragging !== otherNode.label) {
        otherNode.position = subtract(otherNode.position, resistanceForce);
      }
    });
  });

  return state;
}

function startDragging (nodeElement, state) {
  // TODO - break this into two separate reducers
  const nodeKey = nodeElement.attributes.key.value;

  if (state.addingLinkFrom) {
    if (state.addingLinkFrom !== nodeKey) {
      state.links.push({from: state.addingLinkFrom, to: nodeKey});
    }

    state.addingLinkFrom = null;
  }

  state.dragging = nodeKey;

  return state;
}

function stopDragging (state) {
  state.dragging = null;

  return state;
}

function drag (position, state) {
  if (!state.dragging) {
    return state;
  }

  state.nodes[state.dragging].position = position;

  return state;
}

function placeNode (position, state) {
  return {
    ...state,

    nodes: makeNode(position, state.nodes)
  };
}

function startAddingLink (nodeElement, state) {
  state.addingLinkFrom = nodeElement.attributes.key.value;

  return state;
}

function Node (label, position, data) {
  return {
    label,
    position,
    data
  };
}

let nodeKey = 0;

function makeNode(position, nodes, key=null, data={}) {
  if (!key) {
    key = (nodeKey++).toString();
  }

  const newNode = Node(key, position, data);

  return {
    ...nodes,

    [key]: newNode
  }
}


//const nodes = ['a', 'b']
const nodes = stuff.nodes.filter(data => !data.completed)
  .reduce((nodes, data) => makeNode(add(center, {x: Math.random(), y: Math.random()}), nodes, data.id, data), {});
/*
const links = [
  {from: 'a', to: 'b'}
];*/
const validIds = new Set(stuff.nodes.filter(data => !data.completed).map(n => n.id));
const links = stuff.edges.filter(edge => validIds.has(edge.from) && validIds.has(edge.to));

function main ({Time, DOM, Mouse}) {
  const initialState = {
    nodes,
    links,
    dragging: null,
    addingLinkFrom: null
  };

  const mousePosition$ = Mouse.positions();

  const dblClick$ = DOM
    .select('svg')
    .events('dblclick');

  const backgroundDblClick$ = dblClick$
    .filter(ev => ev.target.tagName === 'svg');

  const nodeDblClick$ = dblClick$
    .filter(ev => ev.target.tagName === 'rect');

  const placeNode$ =  mousePosition$
    .map(position => backgroundDblClick$.mapTo((state) => placeNode(position, state)))
    .flatten();

  const startAddingLink$ = nodeDblClick$
    .map(ev => (state) => startAddingLink(ev.target, state));

  const startDragging$ = DOM
    .select('rect')
    .events('mousedown')
    .map(ev => (state) => startDragging(ev.target, state));

  const stopDragging$ = Mouse
    .ups()
    .map(ev => stopDragging);

  const drag$ = mousePosition$
    .map(position => (state) => drag(position, state));

  const update$ = Time
    .animationFrames()
    .map(({delta}) => delta / (1000 / 60))
    .filter(delta => delta > 0 && delta < 10) // if you switch tab, you get huge deltas
    .map(delta => (state) => update(delta, state));

  const reducer$ = xs.merge(
    update$,

    startDragging$,
    stopDragging$,
    drag$,

    placeNode$,

    startAddingLink$
  );

  const state$ = reducer$.fold(applyReducer, initialState);

  const hoverNode$ = DOM
    .select('rect')
    .events('mouseover')
    .map(ev => ev.target.attributes.key.value)
    .startWith('');

  return {
    DOM: xs.combine(state$, mousePosition$, hoverNode$).map(view)
  };
}

const drivers = {
  DOM: makeDOMDriver(document.body),
  Time: timeDriver,
  Mouse: mouseDriver
};

run(main, drivers);
