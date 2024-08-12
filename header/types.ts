
/**
 * @internal
 * Action handler type declaration
 */
export type ActionHandler = {
    /**
     * Handler functional interface method
     */
    call: () => void | Promise<void>
};
