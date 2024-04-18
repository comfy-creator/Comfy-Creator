import React, { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { createUseContextHook } from './hookCreator';
import { createChannel, createClient, FetchTransport, Metadata } from 'nice-grpc-web';
import {
  ComfyClient,
  ComfyDefinition,
  JobSnapshot,
  WorkflowStep
} from '../autogen_web_ts/comfy_request.v1';
import {
  ComfyHistoryItems,
  ComfyItemURLType,
  EmbeddingsResponse,
  HistoryResponse,
  IComfyApi,
  IGetOutputImagesResponse,
  IPagination,
  QueueResponse,
  SettingsResponse,
  storeUserDataOptions,
  SystemStatsResponse,
  UserConfigResponse
} from '../types/api';
import { ComfyObjectInfo } from '../types/comfy';
import { API_URL, DEFAULT_SERVER_PROTOCOL, DEFAULT_SERVER_URL } from '../lib/config/constants';
import { toWsURL } from '../lib/utils';
import { ComfyWsMessage, SerializedFlow, ViewFileArgs } from '../lib/types';
import { ApiEventEmitter } from '../lib/apiEvent';
import { ComfyLocalStorage } from '../lib/localStorage';

type ProtocolType = 'grpc' | 'ws';

interface IApiContext extends IComfyApi {
  sessionId?: string;
  connectionStatus: string;
  requestMetadata?: Metadata;
  comfyClient: ComfyClient | null;
  socket: ReconnectingWebSocket | null;
  runWorkflow: (
    serializedGraph: SerializedFlow,
    workflow?: Record<string, WorkflowStep>
  ) => Promise<JobSnapshot | Error>;
  makeServerURL: (route: string) => string;
  getOutputImages: (pagination: IPagination) => Promise<IGetOutputImagesResponse>;
}

enum ApiStatus {
  CONNECTING = 'connecting',
  OPEN = 'open',
  CLOSING = 'closing',
  CLOSED = 'closed'
}

const handleComfyMessage = (message: ComfyWsMessage) => {
  let event: CustomEvent;
  if ('type' in message) {
    // this is from the websocket
    event = new CustomEvent('comfyMessage', { detail: message });
  } else {
    // this is from the gRPC
    event = new CustomEvent('room', { detail: message });
  }

  ApiEventEmitter.dispatchEvent(event);
};

// Use polling as a backup strategy incase the websocket fails to connect
const pollingFallback = () => {
  const intervalId = setInterval(async () => {
    try {
      // const resp = await api.fetchApi('/prompt');
      // const status = await resp.json();
      const status = '';
      ApiEventEmitter.dispatchEvent(new CustomEvent('status', { detail: status }));
    } catch (error) {
      ApiEventEmitter.dispatchEvent(new CustomEvent('status', { detail: null }));
    }
  }, 1000);

  // Cleanup function
  return () => clearInterval(intervalId);
};

export const ApiContextProvider: React.FC<{ token?: string; children: ReactNode }> = ({
  token,
  children
}) => {
  // TO DO: add possible auth in here as well?

  // graph editor app config
  const appConfig = {
    API_KEY: token || '',
    SERVER_URL: DEFAULT_SERVER_URL,
    SERVER_PROTOCOL: DEFAULT_SERVER_PROTOCOL
  };

  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [socket, setSocket] = useState<ReconnectingWebSocket | null>(null);
  const [serverUrl, setServerUrl] = useState<string>(appConfig.SERVER_URL);
  const [connectionStatus, setConnectionStatus] = useState<string>(ApiStatus.CLOSED);
  const [serverProtocol, setServerProtocol] = useState<ProtocolType>(appConfig.SERVER_PROTOCOL);
  const [requestMetadata, setRequestMetadata] = useState<Metadata | undefined>(undefined);

  // Only used for when serverProtocol is grpc. Used to both send messages and stream results
  const [comfyClient, setComfyClient] = useState<ComfyClient>(
    createClient(ComfyDefinition, createChannel(serverUrl, FetchTransport()))
  );

  // Recreate ComfyClient as needed
  useEffect(() => {
    if (serverProtocol !== 'grpc') return;

    const channel = createChannel(serverUrl, FetchTransport());
    const newComfyClient = createClient(ComfyDefinition, channel);
    setComfyClient(newComfyClient);
    // No cleanup is explicitly required for gRPC client
  }, [serverUrl, serverProtocol]);

  // Generate session-id for websocket connections
  useEffect(() => {
    if (serverProtocol !== 'ws') return;
    setSessionId(crypto.randomUUID());
  }, []);

  // Establish a connection to local-server if we're using websockets
  useEffect(() => {
    if (serverProtocol !== 'ws') return;
    if (!sessionId) return;

    const url = `${toWsURL(serverUrl)}/ws?clientId=${sessionId}`;
    const socketOptions = { maxReconnectionDelay: 300 };
    const newSocket = new ReconnectingWebSocket(url, undefined, socketOptions);
    newSocket.binaryType = 'arraybuffer';

    let cleanupPolling = () => {};

    newSocket.addEventListener('open', () => {
      setConnectionStatus(ApiStatus.OPEN);
    });

    newSocket.addEventListener('error', () => {
      if (!(newSocket.readyState === newSocket.OPEN)) {
        // The websocket failed to open; use a fallback instead
        newSocket.close();
        cleanupPolling = pollingFallback();
      }
      setConnectionStatus(ApiStatus.CLOSED);
    });

    newSocket.addEventListener('close', () => {
      setConnectionStatus(ApiStatus.CONNECTING);
    });

    newSocket.addEventListener('message', (event) => {
      const message = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      handleComfyMessage(message);
    });

    setConnectionStatus(ApiStatus.CONNECTING);

    setSocket(newSocket);

    return () => {
      socket?.close();
      cleanupPolling();
    };
  }, [serverUrl, sessionId, serverProtocol]);

  // Once we have a session-id, subscribe to the stream of results using grpc
  useEffect(() => {
    if (sessionId === undefined) return;
    if (serverProtocol !== 'grpc') return;

    const abortController = new AbortController();

    // const stream = comfyClient.streamRoom(
    //   { session_id: sessionId },
    //   { signal: abortController.signal }
    // );

    setConnectionStatus(ApiStatus.CONNECTING);

    // (async () => {
    //   let first = true;
    //   for await (const message of stream) {
    //     if (first) {
    //       first = false;
    //       setConnectionStatus(ApiStatus.OPEN);
    //     }
    //     handleComfyMessage(message);
    //   }
    // })()
    //   .then(() => {
    //     setConnectionStatus(ApiStatus.CLOSED);
    //   })
    //   .catch((error) => {
    //     setConnectionStatus(ApiStatus.CLOSED);
    //     console.error(error);
    //   });

    // Cleanup stream
    return () => {
      abortController.abort();
    };
  }, [comfyClient, sessionId, serverProtocol]);

  // Update metadata based on api-key / login status
  useEffect(() => {
    const metadata = new Metadata();
    if (appConfig.API_KEY) metadata.set('api-key', appConfig.API_KEY);
    setRequestMetadata(metadata);
  }, []);

  // This is the function used to submit jobs to the server
  // ComfyUI terminology: 'queuePrompt'
  const runWorkflow = useCallback(
    async (
      flow: SerializedFlow,
      workflow?: Record<string, WorkflowStep>
    ): Promise<JobSnapshot | Error> => {
      if (serverProtocol === 'grpc' && comfyClient) {
        // Use gRPC server
        const request = {
          workflow: flow,
          serializedGraph: flow,
          inputFiles: [],
          worker_wait_duration: undefined,
          request_id: crypto.randomUUID(),
          output_config: {
            write_to_graph_id: ComfyLocalStorage.getItem('graphId') ?? undefined
          }
        };

        try {
          console.log({ request });
          const res = await comfyClient.run(request, {
            metadata: requestMetadata
          });

          console.log(res.job_id);

          // Update the assigned sessionId
          if (res.request_id !== sessionId) {
            setSessionId(res.request_id);
          }

          // Stream the job results

          // wait for some time
          await new Promise((resolve) => setTimeout(resolve, 5000));

          for await (const response of comfyClient.streamJob({ job_id: res.job_id })) {
            console.log(response);
          }

          return res;
        } catch (e) {
          console.log(e);
          return e as Error;
        }
      } else {
        // Use REST server
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        };

        // Convert Metadata to headers
        if (requestMetadata) {
          for (const [key, values] of requestMetadata) {
            // Since values is an array, join them with a comma.
            headers[key] = values.join(', ');
          }
        }

        const res = await fetchApi('/prompt', {
          method: 'POST',
          // headers,
          body: JSON.stringify({
            prompt: flow,
            extra_info: {},
            client_id: sessionId
          })
        });

        if (res.status !== 200) {
          throw {
            response: await res.json()
          };
        }

        return (await res.json()) as JobSnapshot;
      }
    },
    [requestMetadata, serverUrl, serverProtocol, comfyClient, sessionId]
  );

  // putting these functions here for now cos we might want to find a way to go with the gRPC and the fetch requests
  const makeServerURL = (route: string): string => {
    return 'http://localhost:8188' + route;
  };

  const fetchApi = (route: string, options?: RequestInit) => {
    if (!options) {
      options = {};
    }
    if (!options.headers) {
      options.headers = {};
    }

    console.log('fetching', makeServerURL(route), options);
    return fetch(makeServerURL(route), options);
  };

  /**
   * Gets a list of extension urls
   * @returns An array of script urls to import
   */
  const getExtensions = async (): Promise<string[]> => {
    const resp = await fetchApi('/extensions', { cache: 'no-store' });
    return (await resp.json()).map((route: string) => makeServerURL(route));
  };

  /**
   * Gets a list of embedding names
   * @returns An array of script urls to import
   */
  const getEmbeddings = async (): Promise<EmbeddingsResponse> => {
    const resp = await fetchApi(API_URL.GET_EMBEDDINGS, { cache: 'no-store' });
    return await resp.json();
  };

  /**
   * Loads output image(s) from output folder (for local server)
   * @returns The output image(s)
   */
  const getOutputImages = async (pagination: IPagination): Promise<IGetOutputImagesResponse> => {
    const resp = await fetchApi(API_URL.GET_OUTPUT_IMAGE(pagination));
    return await resp.json();
  };

  /**
   * Loads node object definitions for the graph
   * @returns The node definitions
   */
  const getNodeDefs = async (): Promise<Record<string, ComfyObjectInfo>> => {
    const resp = await fetchApi(API_URL.GET_NODE_DEFS, { cache: 'no-store' });
    return await resp.json();
  };

  /**
   * Loads a list of items (queue or history)
   * @param {string} type The type of items to load, queue or history
   * @returns The items of the specified type grouped by their status
   */
  const getItems = async (type: string) => {
    if (type === 'queue') {
      return getQueue();
    }
    return getHistory();
  };

  /**
   * Gets the current state of the queue
   * @returns The currently running and queued items
   */
  const getQueue = async () => {
    try {
      const res = await fetchApi('/queue');
      const data = (await res.json()) as QueueResponse;
      return {
        // Running action uses a different endpoint for cancelling
        Running: data.queue_running.map((prompt: any) => ({
          prompt,
          remove: { name: 'Cancel', cb: () => interrupt() }
        })),
        Pending: data.queue_pending.map((prompt: any) => ({ prompt }))
      };
    } catch (error) {
      console.error(error);
      return { Running: [], Pending: [] };
    }
  };

  /**
   * Gets the prompt execution history
   * @returns Prompt history including node outputs
   */
  const getHistory = async (max_items: number = 200): Promise<ComfyHistoryItems> => {
    try {
      const res = await fetchApi(API_URL.GET_HISTORY(max_items));
      if (!res.ok) {
        throw new Error(`Error fetching history: ${res.status} ${res.statusText}`);
      }

      const history = (await res.json()) as HistoryResponse;
      return { History: Object.values(history) };
    } catch (error) {
      console.error(error);
      return { History: [] };
    }
  };

  /**
   * Gets system & device stats
   * @returns System stats such as python version, OS, per device info
   */
  const getSystemStats = async (): Promise<SystemStatsResponse> => {
    const res = await fetchApi(API_URL.GET_SYSTEM_STATS);
    if (!res.ok) {
      throw new Error(`Error fetching system stats: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  };

  /**
   * Sends a POST request to the API
   * @param {*} type The endpoint to post to: queue or history
   * @param {*} body Optional POST data
   */
  const postItem = async (type: ComfyItemURLType, body?: object): Promise<void> => {
    try {
      await fetchApi('/' + type, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : undefined
      });
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Deletes an item from the specified list
   * @param {string} type The type of item to delete, queue or history
   * @param {number} id The id of the item to delete
   */
  const deleteItem = async (type: ComfyItemURLType, id: number) => {
    await postItem(type, { delete: [id] });
  };

  /**
   * Clears the specified list
   * @param {string} type The type of list to clear, queue or history
   */
  const clearItems = async (type: ComfyItemURLType) => {
    await postItem(type, { clear: true });
  };

  /**
   * Interrupts the execution of the running prompt
   */
  const interrupt = async (): Promise<void> => {
    await postItem('interrupt');
  };

  /**
   * Gets user configuration data and where data should be stored
   * @returns { Promise<{ storage: 'server' | 'browser', users?: Promise<string, unknown>, migrated?: boolean }> }
   */
  const getUserConfig = async (): Promise<UserConfigResponse> => {
    const response = await fetchApi(API_URL.GET_USER_CONFIG);
    return await response.json();
  };

  /**
   * Creates a new user
   * @param { string } username
   * @returns The fetch response
   */
  const createUser = (username: string) => {
    return fetchApi(API_URL.CREATE_USER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username })
    });
  };

  /**
   * Gets all setting values for the current user
   * @returns { Promise<string, unknown> } A dictionary of id -> value
   */
  const getSettings = async (): Promise<SettingsResponse> => {
    const response = await fetchApi(API_URL.GET_SETTINGS);
    return await response.json();
  };

  /**
   * Gets a setting for the current user
   * @param { string } id The id of the setting to fetch
   * @returns { Promise<unknown> } The setting value
   */
  const getSetting = async (id: string) => {
    const response = await fetchApi(API_URL.GET_SETTING_BY_ID(id));
    return await response.json();
  };

  /**
   * Stores a dictionary of settings for the current user
   * @param { Record<string, unknown> } settings Dictionary of setting id -> value to save
   * @returns { Promise<void> }
   */
  const storeSettings = (settings: Record<string, unknown>) => {
    return fetchApi(API_URL.STORE_SETTINGS, {
      method: 'POST',
      body: JSON.stringify(settings)
    });
  };

  /**
   * Stores a setting for the current user
   * @param { string } id The id of the setting to update
   * @param { unknown } value The value of the setting
   * @returns { Promise<void> }
   */
  const storeSetting = (id: string, value: Record<string, any>) => {
    return fetchApi(`/settings/${encodeURIComponent(id)}`, {
      method: 'POST',
      body: JSON.stringify(value)
    });
  };

  /**
   * Gets a user data file for the current user
   * @param { string } file The name of the userData file to load
   * @param { RequestInit } [options]
   * @returns { Promise<unknown> } The fetch response object
   */
  const getUserData = async (file: string, options: RequestInit) => {
    return await fetchApi(API_URL.GET_USER_DATA_FILE(file), options);
  };

  /**
   * Stores a user data file for the current user
   * @param { string } file The name of the userData file to save
   * @param { unknown } data The data to save to the file
   * @param { RequestInit & { stringify?: boolean, throwOnError?: boolean } } [options]
   * @returns { Promise<void> }
   */
  const storeUserData = async (
    file: string,
    data: BodyInit,
    options: storeUserDataOptions = { stringify: true, throwOnError: true }
  ) => {
    const resp = await fetchApi(API_URL.STORE_USER_DATA_FILE(file), {
      method: 'POST',
      body: options?.stringify ? JSON.stringify(data) : data,
      ...options
    });
    if (resp.status !== 200) {
      throw new Error(`Error storing user data file '${file}': ${resp.status} ${resp.statusText}`);
    }
  };

  const viewFile = async (arg: ViewFileArgs) => {
    const resp = await fetchApi(API_URL.VIEW_FILE(arg), { method: 'GET' });
    if (resp.ok) {
      return resp.blob();
    }

    throw new Error('');
  };

  return (
    <Api.Provider
      value={{
        socket,
        sessionId,
        connectionStatus,
        comfyClient,
        requestMetadata,
        runWorkflow,

        // API functions
        makeServerURL,
        fetchApi,
        getExtensions,
        getEmbeddings,
        getNodeDefs,
        getItems,
        getHistory,
        getSystemStats,
        getQueue,
        deleteItem,
        clearItems,
        interrupt,
        getUserConfig,
        createUser,
        getSettings,
        getSetting,
        storeSettings,
        storeSetting,
        getUserData,
        storeUserData,
        viewFile,
        getOutputImages
      }}
    >
      {children}
    </Api.Provider>
  );
};

const Api = createContext<IApiContext | undefined>(undefined);

export const useApiContext = createUseContextHook(
  Api,
  'useApiContext must be used within a ApiContextProvider'
);
