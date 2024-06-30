export interface OrderData {
    paymentMethodId: number
    paymentStatusId: number
    statusid: number
    userId: number
    description?: string
    date: Date
    value: number
    orderItems: OrderItemData[]
}

export interface OrderItemData {
    productId: number
    quantity: number
}

export interface Product {
    id: number
    price: number
    stock: number
    name: string
    description: string | null
    value: number
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
}

export interface PaymentMethod {
    id: number
    name: string
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    order?: OrderData[]
}