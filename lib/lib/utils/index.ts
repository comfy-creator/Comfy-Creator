export const toHttpURL = (url: string): string => {
  return url.replace(/^ws:\/\//, 'http://').replace(/^wss:\/\//, 'https://');
};

export const toWsURL = (url: string): string => {
  return url.replace(/^http:\/\//, 'ws://').replace(/^https:\/\//, 'wss://');
};

export function isLegacySerializedGraph(json: any) {
  // Legacy serialized graph has a `links` key
  // while the new one has a `edges` key

  return 'links' in json;
}
