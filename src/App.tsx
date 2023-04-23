import './App.css';
import { configureSlice, useSlice } from './react-reducer-toolkit';

const RootSlice = configureSlice({
  defaultState: {
    value: 0,
  },
  reducers: {
    add: (state) => ({ ...state, value: state.value++ }),
    subtract: (state) => ({ ...state, value: state.value-- }),
  },
});

export function Root() {
  const [state, actions] = useSlice(RootSlice, {
    value: 0,
  });
  return (
    <div>
      <button onClick={actions.add}>Increment</button>
      <button onClick={actions.subtract}>Decrement</button>
      <div>Value: {state.value}</div>
    </div>
  );
}

export default Root;
