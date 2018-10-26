import { Observable } from 'rxjs'

export namespace Async {
  export const enum Type {
    Load = 1,
    Create,
    Update,
    Delete
  }

  export const enum Progress {
    Normal = 1,
    Progressing,
    Done,
    Error
  }

  export namespace Model {
    export type Full<P extends object, G extends object> = { [K in keyof (P & G)]: (P & G)[K] }

    export type Incomplete<T> = T extends Full<infer P, infer __> ? P : never
  }

  export interface State {
    progress: Progress
    type: Type
  }

  export type Data<T> = { data: T; state: State }

  export type Operation<E, T extends Type> = T extends Type.Load
    ? () => Observable<E>
    : T extends Type.Delete
      ? (id: string) => Observable<number>
      : (data: T extends Type.Create ? Model.Incomplete<E> : E) => Observable<E>

  export type ObservableOperation<E> = Observable<E>

  export function create<T>(data: T, type: Type, initialProgress = Progress.Normal): Data<T> {
    return {
      data,
      state: {
        type,
        progress: initialProgress
      }
    }
  }

  export function set<T>(value: Data<T>, data: T, progress?: Progress, type?: Type): Data<T> {
    return {
      data: data,
      state: {
        type: type || value.state.type,
        progress: progress || value.state.progress
      }
    }
  }

  export function setProgress<T>(value: Data<T>, progress: Progress): Data<T> {
    return {
      data: value.data,
      state: {
        ...value.state,
        progress: progress
      }
    }
  }
}