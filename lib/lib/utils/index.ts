export const toHttpURL = (url: string): string => {
  return url.replace(/^ws:\/\//, 'http://').replace(/^wss:\/\//, 'https://');
};

export const toWsURL = (url: string): string => {
  return url.replace(/^http:\/\//, 'ws://').replace(/^https:\/\//, 'wss://');
};
