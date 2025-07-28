import request from '@/utils/request'

export function getEvent(current, size, city, categoryId, fromDate, toDate) {
    return request({
        url: '/event/event/page',
        method: 'post',
        data: {
            "current": current,
            "size": size,
            "city": city,
            "categoryId": categoryId,
            "fromDate": fromDate,
            "toDate": toDate
        }
    })
}

export function getCategory() {
    return request({
        url: '/event/category/list',
        method: 'post'
    })
}

export function getSession(eventId) {
    return request({
        url: '/event/event-session/getSession',
        method: 'post',
        data: {
            "eventId": eventId
        }
    })
}

export function getTicket(eventId) {
    return request({
        url: '/event/ticket-tier/getTicket',
        method: 'post',
        data: {
            "eventId": eventId
        }
    })
}

export function getEventInfo(id) {
    return request({
        url: '/event/event/info',
        method: 'post',
        data: {
            "id": id
        }
    })
}