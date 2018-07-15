import { Observable, fromEvent } from "rxjs";
import { filter, tap, map } from "rxjs/operators";
import { isTesting } from "../is-testing";
import * as log from "loglevel";

type GenericObject = {
  [key: string]: any;
};

type Payload<T> = T;

interface Message<T> {
  type: string;
  payload: Payload<T>;
  scope?: string;
}

interface BridgeModel<T> {
  post: (payload: Payload<T>) => void;
  observable: () => Observable<Payload<T>>;
}

interface CreateBridgeOption {
  scope?: string;
}

export const createBridge = <T = GenericObject>(
  type: string,
  option: CreateBridgeOption = {
    scope: undefined
  }
): BridgeModel<T> => {
  const { scope } = option;
  return {
    post: payload => {
      if (!payload) {
        throw new Error(`payload should not be ${payload}`);
      }
      const message: Message<T> = {
        type,
        payload
      };
      if (scope) {
        message.scope = scope;
      }
      window.postMessage(message, "*");
    },
    observable: () => {
      return fromEvent(window, "message").pipe(
        filter<MessageEvent>(event => {
          if (!event || (event.source !== window && !isTesting())) {
            return false;
          }
          const message = event.data;
          if (!message || message.scope !== scope) {
            return false;
          }
          if (message.type !== type) {
            return false;
          }
          return true;
        }),
        tap<MessageEvent>(event => log.debug("Message Received", event.data)),
        map<MessageEvent, Payload<T>>(event => event.data.payload)
      );
    }
  };
};
