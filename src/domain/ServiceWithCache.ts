export interface ServiceWithCache <T> {
    getState: () => T
    setState: (state: T) => void
}