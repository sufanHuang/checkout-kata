const _ = require('lodash')
const products = require('../data/products')

let cart = []

module.exports = {

    setPrice: (itemId, newPrice) => {
        let currentItem = _.find(products, { itemId })
        currentItem.price = newPrice
    },

    addItemToCart: (itemId, quantity) => {
        let currentItem = _.find(products, { itemId })

        if(currentItem) {
            let cartItem = {
                itemId,
                quantity
            }

            cart = cart.concat([cartItem])

            return true
        }

        return false
    },

    emptyCart: () => {
        cart = []
    },

    //remove items from cart
    removeItemFromCart: (itemId) => {
        let currentItem = _.find(cart, {itemId})
        _.remove(cart,currentItem)
    },

    setMarkdown: (itemId, price) => {
        let currentItem = _.find(products,{itemId})
        currentItem.markdownPrice = price
    },

    getCartTotals: () => {
        let total = _.reduce(cart, (total, item) => {
            let { itemId, quantity } = item
            let currentItem = _.find(products, { itemId })

            if(currentItem) {
                let { markdownPrice, price } = currentItem
                let itemPrice = markdownPrice < price ? markdownPrice : price

                return total + itemPrice * quantity
            }

            return total
        }, 0)

        let withoutMarkdown = _.reduce(cart,(total, item) =>{
            let {itemId, quantity} = item
            let currentItem =_.find(products,{itemId})

            if(currentItem) {
                let {price} = currentItem
                return total + price * quantity
            }

            return total
        }, 0)

        return {
            total,
            withoutMarkdown,
            savings: withoutMarkdown - total
        }
    },

    getCart: () => {
        return cart
    }
}
