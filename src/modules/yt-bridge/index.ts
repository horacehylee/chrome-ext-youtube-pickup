import { Observable, fromEvent } from "rxjs";
import { filter, tap, map } from "rxjs/operators";

// const _temp = () => {
//   window.postMessage(
//     {
//       source: "@youtube-pickup/content",
//       type: "FETCH_LAST_SEEN_VIDEO_ID_SUCCESS",
//       payload: {
//         // ...
//       }
//     },
//     "*"
//   );

//   window.addEventListener("message", event => {
//     if (!event || event.source !== window) {
//       return;
//     }
//     const message = event.data;
//     if (!message || message.source !== "@youtube-pickup/content") {
//       return;
//     }
//     console.log("[dom] Message Received", message);
//     switch (message.type) {
//       case "FETCH_LAST_SEEN_VIDEO_ID_SUCCESS":
//         const { lastSeenVideoId } = message.payload;
//         // start(lastSeenVideoId);
//         return;
//     }
//   });
// };

interface ObjectPayload {
  [key: string]: any;
}

type Payload = ObjectPayload | {};

interface Message {
  scope?: string;
  type: string;
  payload: Payload;
}

interface BridgeModel {
  post: (payload: Payload) => void;
  observable: () => Observable<Payload>;
}

interface CreateBridgeOption {
  scope?: string;
}

const createBridge = (
  type: string,
  option: CreateBridgeOption = {
    scope: "@scope"
  }
): BridgeModel => {
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
        map<MessageEvent, Payload>(event => event.data.payload)
      );
    }
  };
};

export const ytBridge = {
  fetchLastSeenVideoId: createBridge("FETCH_LAST_SEEN_VIDEO_ID_SUCCESS", {
    scope: "@youtube-pickup/content"
  }),
  saveLastSeenVideoId: createBridge("SAVE_LAST_SEEN_VIDEO_ID", {
    scope: "@youtube-pickup/content"
  })
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
