export type Dialog = {

    /**
     * Prompt a user to confirm an action
     * 
     * @param message message displayed to the user
     */
    confirm(message: string): Promise<boolean>;
}