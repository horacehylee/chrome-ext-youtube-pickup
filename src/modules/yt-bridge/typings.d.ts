declare namespace NodeJS {
  export interface Global {
    window: Window;
    postMessage: Function;
  }
}
