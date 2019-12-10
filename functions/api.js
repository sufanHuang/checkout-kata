const _ = require('lodash')
const products = require('../data/products')

let cart = []

module.exports = {

    setPrice: (itemId, newPrice) => {
        let currentItem = _.find(products, { itemId })
        if(currentItem){
            currentItem.price = newPrice
            return true
        }
        return false
    },

    addItemToCart: (itemId, quantity, limit) => {
        let currentItem = _.find(products, { itemId })

        if (limit !== 0 && quantity > limit) {
            return "You have exceeded limit!"
        }

        if (quantity <= 0) {
            return "Your selected quantity is invalid"
        }

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

    removeItemFromCart: (itemId) => {
        let currentItem = _.find(cart, { itemId })
        if(currentItem){
            _.remove(cart,currentItem)
            return true
        }
        return false
    },

    setMarkdown: (itemId, price) => {
        let currentItem = _.find(products,{ itemId })
        if(currentItem){
            currentItem.markdownPrice = price
            return true
        }
        return false
    },

    setSpecialNforX: (itemId, specialQuantity, totalPrice,limit)=>{
        let currentItem = _.find(products, { itemId })
        if(currentItem){
            currentItem.markdownPrice = totalPrice / specialQuantity
            currentItem.limit = limit
            return true
        }
        return false
    },

    setSpecialNitemsGetMfree:(itemId, quantity, quantityFree, limit)=>{
        let currentItem = _.find(products, { itemId })
        if(currentItem){
            currentItem.markdownPrice = currentItem.price * (quantity + quantityFree) / quantity
            currentItem.limit = limit
            return true
        }
        return false

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
