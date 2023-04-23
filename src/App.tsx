import './App.css';
import { defineReactSlice, useReactSlice } from './react-reducer-toolkit';

const CounterSlice = defineReactSlice({
  defaultState: {
    value: 0,
  },
  reducers: {
    add: (state) => ({ ...state, value: state.value + 1 }),
    subtract: (state) => ({ ...state, value: state.value - 1 }),
    set: (state, { payload }: { payload: number }) => ({
      ...state,
      value: payload,
    }),
  },
});

function Content({
  value,
  add,
  subtract,
  set,
}: {
  value: number;
  add: () => void;
  subtract: () => void;
  set: (value: number) => void;
}) {
  return (
    <div>
      <button onClick={add}>Add</button>
      <button onClick={subtract}>Subtract</button>
      <button onClick={() => set(0)}>Reset</button>
      <div>value: {value}</div>
    </div>
  );
}
function Basic() {
  const [state, { add, subtract, set }] = useReactSlice(CounterSlice);
  return (
    <Content value={state.value} add={add} subtract={subtract} set={set} />
  );
}

function Logger() {
  const [state, { add, subtract, set }] = useReactSlice(CounterSlice);
  return (
    <Content value={state.value} add={add} subtract={subtract} set={set} />
  );
}

function Local() {
  const [state, { add, subtract, set }] = useReactSlice(CounterSlice);
  return (
    <Content value={state.value} add={add} subtract={subtract} set={set} />
  );
}
function Errors() {
  const [state, { add, subtract, set }] = useReactSlice(CounterSlice);
  return (
    <Content value={state.value} add={add} subtract={subtract} set={set} />
  );
}

export function Root() {
  return (
    <div>
      <Basic />
      <Logger />
      <Local />
      <Errors />
    </div>
  );
}

export default Root;
