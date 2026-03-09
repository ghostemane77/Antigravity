const store = new Map<string, { count: number; expiresAt: number }>()

export function checkRateLimit(ip: string, limit: number, windowMs: number): boolean {
    const now = Date.now()
    const record = store.get(ip)

    if (!record) {
        store.set(ip, { count: 1, expiresAt: now + windowMs })
        return true
    }

    if (now > record.expiresAt) {
        store.set(ip, { count: 1, expiresAt: now + windowMs })
        return true
    }

    if (record.count < limit) {
        record.count += 1
        return true
    }

    return false
}
