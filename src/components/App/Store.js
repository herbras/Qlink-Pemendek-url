import { writable } from 'svelte/store';

function createPersistedStore(key, startValue) {
    let initial = startValue;

    if (typeof window !== "undefined") {
        const storedValue = localStorage.getItem(key);
        initial = storedValue ? JSON.parse(storedValue) : startValue;
    }

    const store = writable(initial);

    if (typeof window !== "undefined") {
        store.subscribe(value => {
            localStorage.setItem(key, JSON.stringify(value));
        });
    }

    return store;
}


export const toastStore = writable([]);

export const historyStore = createPersistedStore('histories', []);
