export interface Notification {
    id: number;
    type: string;
    actor: {
        id?: number;
        name: string;
    };
    actorId?: number;
    applicationId?: number;
    jobId?: number;
    message: string;
    userId?: number;
    isRead?: boolean;
    createdAt: string;
    [key: string]: any;
}
