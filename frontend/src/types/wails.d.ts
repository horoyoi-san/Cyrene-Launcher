export {};

declare global {
  interface Window {
    runtime: {
      EventsOn: (event: string, cb: (...args: any[]) => void) => void;
      EventsOff: (event: string, cb: (...args: any[]) => void) => void;
    };
  }
}
