const _ = require('lodash')
const products = require('../data/products')

const getPriceNforX = (item, quantity) => {
    let { limit, specialsPrice } = item
    let itemsOverLimit = (quantity - limit) > 0 ? quantity - limit : 0
    let specialsQuantity = itemsOverLimit > 0 ? limit: quantity

    return specialsQuantity * specialsPrice + getDefaultTotal(item, itemsOverLimit)
}

const getPriceNwithX = (item, quantity) => {
    let { limit, freeQuantity, requiredQuantity } = item
    let itemsOverLimit = (quantity - limit) > 0 ? quantity - limit : 0

    let specialsQuantity = itemsOverLimit > 0 ? limit : quantity
    let total = 0
    while(specialsQuantity > 0) {

        if(specialsQuantity >= requiredQuantity) {
            total = total + getDefaultTotal(item, requiredQuantity)

            specialsQuantity = specialsQuantity - requiredQuantity - freeQuantity
        } else {
            total = total + getDefaultTotal(item, specialsQuantity)
            specialsQuantity = 0
        }
    }

    return total + getDefaultTotal(item, itemsOverLimit)
}

const getPriceNwithPriceX = (item, quantity) => {
    let { limit, reducedPrice, reducedPriceQuantity, requiredQuantity } = item
    let itemsOverLimit = (quantity - limit) > 0 ? quantity - limit : 0

    let specialsQuantity = itemsOverLimit > 0 ? limit : quantity
    let total = 0

    while(specialsQuantity > 0) {
        if(specialsQuantity >= requiredQuantity) {
            total = total + getDefaultTotal(item, requiredQuantity)

            specialsQuantity = specialsQuantity - requiredQuantity - reducedPriceQuantity

            let quantityToCharge = specialsQuantity > 0 ? reducedPriceQuantity : specialsQuantity + reducedPriceQuantity

            total = total + (quantityToCharge * reducedPrice)
        } else {
            total = total + getDefaultTotal(item, specialsQuantity)
            specialsQuantity = 0
        }
    }

    return total + getDefaultTotal(item, itemsOverLimit)
}

const getDefaultTotal = (item, quantity) => {
    let { markdownPrice, price } = item
    let itemPrice = markdownPrice < price ? markdownPrice : price
    return itemPrice * quantity
}

module.exports = {
    getTotal: (total, item) => {
        let { itemId, quantity } = item
        let currentItem = module.exports.getProduct(itemId)
        let priceMethod = module.exports.getPriceMethod(currentItem.specialMode)

        return total + priceMethod(currentItem, quantity)
    },

    getMaximumTotal: (total, item) =>{
        let {itemId, quantity} = item
        let currentItem = module.exports.getProduct(itemId)

        let { price } = currentItem
        return total + price * quantity
    },

    getProduct: (itemId) => {
        return _.find(products, { itemId })
    },

    getPriceMethod: (activeSpecial) => {
        let currentModule = module.exports
        if (activeSpecial === 'N-for-X'){
            return currentModule.getPriceNforX
        }
        if (activeSpecial === 'N-with-X'){
            return currentModule.getPriceNwithX
        }
        if (activeSpecial === 'N-with-price-X'){
            return currentModule.getPriceNwithPriceX
        }
        return currentModule.getDefaultTotal
    },

    getPriceNforX,

    getPriceNwithPriceX,

    getPriceNwithX,

    getDefaultTotal
}
