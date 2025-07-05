export function useNotification() {
    const toast = useToast()
    const timeout = 3000;
    const options = {
        timeout,
    }
    return {
        success(message: string, icon: string = '') {
            toast.success({
                message,
                icon,
                color: '#3b82f6',
                messageColor: '#ffffff',
                iconColor: '#bfdbfe',
                ...options,
            })
        },
        error(message: string, icon: string = '') {
            toast.error({
                message,
                icon,
                color: '#dc2626',
                messageColor: '#ffffff',
                iconColor: '#fee2e2',
                ...options,
            })
        },
        info(message: string, icon: string = '') {
            toast.info({
                message,
                icon,
                color: '#e0f2fe',
                messageColor: '#0369a1',
                iconColor: '#0ea5e9',
                ...options,
            })
        },
        custom(opts: IziToastSettings) {
            toast.show(opts)
        }
    }
}
