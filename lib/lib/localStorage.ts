
const iMap = new Map();

const getItem = (key: string) => {
    return iMap.get(key);
}

const setItem = (key: string, value: string) => {
    iMap.set(key, value);
}

const Cache = {
    getItem,
    setItem
}

export const ComfyLocalStorage = typeof window === 'undefined' ? Cache : window?.localStorage;