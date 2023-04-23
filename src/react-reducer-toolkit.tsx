/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useMemo, useReducer, useState } from 'react';

export const useIdentityLogger = (tag: string, variable: any) => {
  useEffect(() => {
    console.debug(tag, variable);
  }, [tag, variable]);
};

interface Action<TType extends string = string> {
  type: TType;
}

export interface PayloadAction<P, Type extends string = string>
  extends Action<Type> {
  payload: P;
}
interface BaseActionCreator<P, T extends string, M = never, E = never> {
  type: T;
}
export interface ActionCreatorWithoutPayload<T extends string = string>
  extends BaseActionCreator<undefined, T> {
  (): PayloadAction<undefined, T>;
}
export interface ActionCreatorWithPayload<P, T extends string = string>
  extends BaseActionCreator<P, T> {
  (payload: P): PayloadAction<P, T>;
}
export interface ActionCreatorWithNonInferrablePayload<
  T extends string = string
> extends BaseActionCreator<unknown, T> {
  <PT extends unknown>(payload: PT): PayloadAction<PT, T>;
}
type ActionCreator<P = any> =
  | ActionCreatorWithNonInferrablePayload
  | ActionCreatorWithoutPayload
  | ActionCreatorWithPayload<P>;

type Handler<TState, TAction = any> = (
  state: TState,
  action: TAction
) => TState;

type SliceConfiguration<
  TState,
  TReducers extends Record<string, Handler<TState>>
> = {
  defaultState: TState;
  reducers: TReducers;
};

type Slice<TState, TActions extends Record<string, any>> = {
  reducer: (state: TState, action: any) => TState;
  defaultInitialState: TState;
  actions: {
    [K in keyof TActions]: Readonly<TActions[K]>;
  };
};

type InferActionCreatorType<H, ActionName extends string> = H extends (
  state: any,
  action: PayloadAction<infer P>
) => any
  ? P extends {}
    ? ActionCreatorWithPayload<P, ActionName>
    : ActionCreatorWithoutPayload<ActionName>
  : ActionCreatorWithNonInferrablePayload;

function configureSlice<
  TState,
  TReducers extends {
    [actionName: string]: Handler<TState>;
  }
>(
  config: SliceConfiguration<TState, TReducers>
): Slice<
  TState,
  {
    [K in keyof TReducers]: K extends string
      ? InferActionCreatorType<TReducers[K], K>
      : never;
  }
> {
  const handlers: Record<string, any> = {};
  const actions: Record<string, any> = {};

  for (const [actionName, reducer] of Object.entries(config.reducers)) {
    const actionCreator = (payload?: any) => ({ type: actionName, payload });
    actions[actionName] = actionCreator;
    handlers[actionName] = reducer;
  }

  return {
    reducer: (state: TState, action: { type: string }) => {
      const handler = handlers[action.type];

      if (!handler) {
        return state;
      }

      return handler(state, action);
    },
    defaultInitialState: config.defaultState,
    actions: actions as any,
  };
}

function useSlice<TState, TActions extends Record<string, any>>(
  { actions, reducer, defaultInitialState }: Slice<TState, TActions>,
  initialState?: TState
) {
  const [state, dispatch] = useReducer(
    reducer,
    initialState || defaultInitialState
  );

  const boundActions = useMemo(() => {
    return Object.keys(actions).reduce((acc, actionName) => {
      acc[actionName] = (...args: any[]) =>
        dispatch((actions[actionName] as any)(...args));
      return acc;
    }, {} as any);
  }, [dispatch, actions]);
  return [state, boundActions as TActions] as const;
}

export { configureSlice, useSlice };
