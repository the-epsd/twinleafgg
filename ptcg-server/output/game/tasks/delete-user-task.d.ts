export declare class DeleteUserTask {
    constructor();
    private deleteUserFromDb;
    deleteUser(userId: number): Promise<void>;
}
