import { Observable, fromEvent } from "rxjs";
import { filter, tap, map } from "rxjs/operators";

interface GenericObject {
  [key: string]: any;
}

type Payload<T> = T;

interface BridgeModel<T> {
  post: (payload: Payload<T>) => void;
  observable: () => Observable<Payload<T>>;
}

interface CreateBridgeOption {
  scope?: string;
}

const createBridge = <T = GenericObject>(
  type: string,
  option: CreateBridgeOption = {
    scope: "@scope"
  }
): BridgeModel<T> => {
  const { scope } = option;
  return {
    post: payload => {
      window.postMessage(
        {
          scope: scope,
          type: type,
          payload: payload
        },
        "*"
      );
    },
    observable: () => {
      return fromEvent(window, "message").pipe(
        filter<MessageEvent>(event => {
          if (!event || event.source !== window) {
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
        tap<MessageEvent>(event => console.log("Message Received", event.data)),
        map<MessageEvent, Payload<T>>(event => event.data.payload)
      );
    }
  };
};

export const ytBridge = {
  fetchLastSeenVideoId: createBridge<{ lastSeenVideoId: string }>(
    "FETCH_LAST_SEEN_VIDEO_ID_SUCCESS",
    {
      scope: "@youtube-pickup"
    }
  ),
  saveLastSeenVideoId: createBridge<{ lastSeenVideoId: string }>(
    "SAVE_LAST_SEEN_VIDEO_ID",
    {
      scope: "@youtube-pickup"
    }
  )
};

/**
 * const ytBridge = {
 *  fetchLastSeenVideoId: createBridge("FETCH_LAST_SEEN_VIDEO_ID_SUCCESS", {
 *    scope: "@youtube-pickup/content"
 *  })
 * }
 *
 * // Usage
 * ytBridge.fetchLastSeenVideoId.observable().subscribe((payload) => {
 *  console.log(`lastSeenVideoId is ${payload.lastSeenVideoId}`)
 * })
 *
 * ytBridge.fetchLastSeenVideoId.post({
 *  lastSeenVideoId: "xxxxx"
 * })
 *
 */
