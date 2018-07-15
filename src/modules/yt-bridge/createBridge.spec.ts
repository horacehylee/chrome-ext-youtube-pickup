import { createBridge } from "./createBridge";
import { Observable } from "rxjs";

describe("createBridge", () => {
  it("should create a bridge", () => {
    const bridge = createBridge("SOME_TYPE");
    expect(bridge).toBeDefined();
    expect(bridge.post).toBeDefined();
    expect(bridge.observable).toBeDefined();
    expect(bridge.observable()).toBeInstanceOf(Observable);
  });

  describe("bridge", () => {
    interface SomeTypePayload {
      someField: string;
      someNumber: number;
    }

    const bridge = createBridge<SomeTypePayload>("SOME_TYPE");

    describe("post", () => {
      let originalPostMessage: Function;
      const mockPostMessage = jest.fn();

      beforeAll(() => {
        originalPostMessage = global.postMessage;
        global.postMessage = mockPostMessage;
      });

      afterAll(() => {
        global.postMessage = originalPostMessage;
      });

      it("should post using window.postMessage", () => {
        bridge.post({
          someField: "xxxxx",
          someNumber: 33.22456
        });
        expect(mockPostMessage).toBeCalled();
        expect(mockPostMessage).toBeCalledWith(
          {
            type: "SOME_TYPE",
            payload: {
              someField: "xxxxx",
              someNumber: 33.22456
            }
          },
          "*"
        );
      });

      it("should be able to post empty object", () => {
        bridge.post({} as any);
        expect(mockPostMessage).toBeCalled();
        expect(mockPostMessage).toBeCalledWith(
          {
            type: "SOME_TYPE",
            payload: {}
          },
          "*"
        );
      });

      it("should throw error if post null payload", () => {
        expect(() => bridge.post(null)).toThrowError(
          /payload should not be null/
        );
        expect(() => bridge.post(undefined)).toThrowError(
          /payload should not be undefined/
        );
      });
    });

    describe("observable", () => {
      it("should have observable listen to window's message event", done => {
        const payload: SomeTypePayload = {
          someField: "xxxxx",
          someNumber: 33.2456
        };

        bridge.observable().subscribe(_payload => {
          expect(_payload).toEqual(payload);
          done();
        });

        bridge.post(payload);
      });

      it("should filter out window's message without data", done => {
        const bridgeOnMessage = jest.fn();

        bridge.observable().subscribe(bridgeOnMessage);

        window.postMessage(undefined, "*");
        window.postMessage(null, "*");
        setTimeout(() => {
          expect(bridgeOnMessage).not.toBeCalled();
          done();
        }, 0);
      });
    });
  });

  describe("multiple bridges", () => {
    it("should only subscribe to specific type", done => {
      const fooBridge = createBridge("FOO");
      const barBridge = createBridge("BAR");

      const fooOnMessage = jest.fn();
      const barOnMessage = jest.fn();
      fooBridge.observable().subscribe(fooOnMessage);
      barBridge.observable().subscribe(barOnMessage);

      const payload = {
        someThing: "xxxx"
      };

      fooBridge.post(payload);

      setTimeout(() => {
        expect(fooOnMessage).toBeCalled();
        expect(fooOnMessage).toBeCalledWith(payload);
        expect(barOnMessage).not.toBeCalled();
        done();
      }, 0);
    });

    it("should only subscribe to specific scope", done => {
      const fooBridge = createBridge("FOO", {
        scope: "@foo"
      });
      const barBridge = createBridge("FOO");

      const fooOnMessage = jest.fn();
      const barOnMessage = jest.fn();
      fooBridge.observable().subscribe(fooOnMessage);
      barBridge.observable().subscribe(barOnMessage);

      const payload = {
        someThing: "xxxx"
      };

      fooBridge.post(payload);

      setTimeout(() => {
        expect(fooOnMessage).toBeCalled();
        expect(fooOnMessage).toBeCalledWith(payload);
        expect(barOnMessage).not.toBeCalled();
        done();
      }, 0);
    });
  });
});
