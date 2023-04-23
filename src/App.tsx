import './App.css';
import {
  PayloadAction,
  configureSlice,
  useSlice,
} from './react-reducer-toolkit';

const CounterSlice = configureSlice({
  defaultState: {
    value: 0,
  },
  reducers: {
    add: (state) => ({ ...state, value: state.value++ }),
    subtract: (state) => ({ ...state, value: state.value-- }),
    set: (state, { payload }: PayloadAction<number>) => ({
      ...state,
      value: payload,
    }),
  },
});

export function Root() {
  const [state, actions] = useSlice(CounterSlice, {
    value: 0,
  });
  return (
    <div>
      <button onClick={actions.add}>Increment</button>
      <button onClick={actions.subtract}>Decrement</button>
      <button onClick={() => actions.set(0)}>Set to 0</button>
      <div>Value: {state.value}</div>
    </div>
  );
}

export default Root;
