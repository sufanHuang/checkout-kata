const _ = require('lodash')
const totalHelper = require('./totalHelper')

let cart = []

module.exports = {

    setPrice: (itemId, newPrice) => {
        let currentItem = totalHelper.getProduct(itemId)
        if(currentItem){
            currentItem.price = newPrice
            return true
        }
        return false
    },

    addItemToCart: (itemId, quantity) => {
        let currentItem = totalHelper.getProduct(itemId)

        if (!_.isNumber(quantity) || quantity < 1) {
            return false
        }

        if(currentItem) {
            let cartItem = {
                itemId,
                quantity
            }

            cart.push(cartItem)

            return true
        }

        return false
    },

    clearCart: () => {
        cart = []
    },

    removeItemFromCart: (itemId) => {
        let currentItem = totalHelper.getProduct(itemId)
        if(currentItem){
            _.remove(cart, { itemId })
            return true
        }
        return false
    },

    setMarkdown: (itemId, price) => {
        let currentItem = totalHelper.getProduct(itemId)
        if(currentItem){
            currentItem.markdownPrice = price
            return true
        }
        return false
    },

    setSpecial: (itemId, specialQuantity, totalPrice,limit)=>{
        let currentItem = totalHelper.getProduct(itemId)
        if(currentItem){
            currentItem.specialsPrice = totalPrice / specialQuantity
            currentItem.limit = limit
            currentItem.specialMode = 'N-for-X'
            return true
        }
        return false
    },

    setFreeSpecial:(itemId, quantity, quantityFree, limit)=>{
        let currentItem = totalHelper.getProduct(itemId)
        if(currentItem){
            currentItem.freeQuantity = quantityFree
            currentItem.requiredQuantity = quantity
            currentItem.limit = limit
            currentItem.specialMode = 'N-with-X'
            return true
        }
        return false
    },

    setCombinationSpecial: (itemId, quantity, reducedPrice, reducedPriceQuantity) => {
        let currentItem = totalHelper.getProduct(itemId)
        if(currentItem) {
            currentItem.requiredQuantity = quantity
            currentItem.reducedPrice = reducedPrice
            currentItem.reducedPriceQuantity = reducedPriceQuantity
            currentItem.specialMode = 'N-with-price-X'

            return true
        }

        return false
    },

    getCartTotals: () => {
        let total = _.reduce(cart, totalHelper.getTotal, 0)
        let withoutMarkdown = _.reduce(cart, totalHelper.getMaximumTotal, 0)

        return {
            total,
            withoutMarkdown,
            savings: withoutMarkdown - total
        }
    },

    getCart: () => {
        return cart
    },

    getProduct: (itemId) => {
        return totalHelper.getProduct(itemId)
    }
}
