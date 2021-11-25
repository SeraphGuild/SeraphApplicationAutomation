export type StringKeyMap<T> = { 
    [key: string]: T
};

export type OptionalCollection<T> = T | T[];