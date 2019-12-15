const expect  = require('chai').expect
const Chance = require('chance')
const _ = require('lodash')
const decache = require('decache')

const chance = new Chance()
const defaultProducts = require('../data/products')
const modulePath = '../functions/api'

describe('API functionality', () => {

    let api

    beforeEach(() => {
        decache(modulePath)
        api = require(modulePath)
    })

    describe('addItemToCart functionality', () => {

        it('should add existing product item', () => {
            let quantity = chance.d10()
            let itemId = chance.pickone(_.map(defaultProducts, 'itemId'))

            let result = api.addItemToCart(itemId, quantity)
            let cart = api.getCart()

            expect(result).to.be.true
            expect(cart.length).to.equal(1)
            expect(cart[0].itemId).to.equal(itemId)
        })

        it('should not allow adding non-existing item', () => {
            let quantity = chance.d10()
            let existingProductIds = _.map(defaultProducts, 'itemId')
            let itemId = chance.pickone(existingProductIds) + chance.word()

            let result = api.addItemToCart(itemId, quantity)

            let cart = api.getCart()

            expect(result).to.be.false
            expect(cart).to.deep.equal([])
        });

        it('should not add item if quantity is less than one',()=>{
            let values = [ 0, chance.bool(), -1000, chance.word()]
            let itemId = chance.pickone(_.map(defaultProducts, 'itemId'))

            _.each(values, (quantity) => {
                let result = api.addItemToCart(itemId, quantity)
                expect(result).to.be.false
            })
        })
    })

    describe('setPrice functionality', () => {

        it('should set new price for existing product item', () =>{
            let newPrice = chance.d10()
            let itemId = chance.pickone(_.map(defaultProducts, 'itemId' ))

            let result = api.setPrice(itemId, newPrice)
            let product = api.getProduct(itemId)

            expect(result).to.be.true
            expect(product.price).to.equal(newPrice)
        })

        it('should not set price if item not exist', () =>{
            let newPrice = chance.d10()
            let itemId = chance.pickone(_.map(defaultProducts, 'itemId' )) + chance.word()

            let result = api.setPrice(itemId, newPrice)

            expect(result).to.be.false
        })
    });

    describe('clearCart functionality', () => {

        it('should empty cart', ()=>{
            api.clearCart()
            let cart = api.getCart()

            expect(cart).to.deep.equal([])
        })
    });

    describe('removeItemFromCart functionality', () => {
        it('should remove an item from cart', ()=>{
            let itemId = chance.pickone(_.map(defaultProducts, "itemId"))

            api.addItemToCart(itemId, 1)
            let result = api.removeItemFromCart(itemId)
            let cart = api.getCart()

            expect(result).to.be.true
            expect(cart).to.deep.equal([])
        })

        it('should not remove non-existing item from cart', () => {
            let itemId = chance.pickone(_.map(defaultProducts, "itemId"))

            api.addItemToCart(itemId, 1)

            let result = api.removeItemFromCart(itemId + chance.word())
            let cart = api.getCart()

            expect(result).to.be.false
            expect(cart.length).to.equal(1)
        });
    });

    describe('setMarkdown functionality', () => {

        it('should set markdown price', ()=>{
            let price = chance.d10()
            let itemId = chance.pickone(_.map(defaultProducts,"itemId"))

            let result = api.setMarkdown(itemId, price)
            let product = api.getProduct(itemId)

            expect(result).to.be.true
            expect(product.markdownPrice).to.equal(price)
        })

        it('should not set markdownPrice if item not exist', () =>{
            let price = chance.d10()
            let itemId = chance.pickone(_.map(defaultProducts, 'itemId' )) + chance.word()

            let result = api.setMarkdown(itemId, price)

            expect(result).to.be.false
        })
    });

    describe('getCartTotals functionality', () => {

        it('should sum total amount of items in cart, with and without markdown', ()=>{
            let quantityOne = chance.d10()
            let itemOne = _.find(defaultProducts, { itemId: 'banana'} )
            let itemOneTotal = itemOne.markdownPrice * quantityOne
            let itemOneWithoutMarkdown = itemOne.price * quantityOne

            let quantityTwo = chance.d10()
            let itemTwo = _.find(defaultProducts, { itemId: 'apple'} )
            let itemTwoTotal = itemTwo.price* quantityTwo

            api.addItemToCart("banana", quantityOne)
            api.addItemToCart("apple", quantityTwo)
            let { total, withoutMarkdown, savings } = api.getCartTotals()

            let resultOne = (total === itemOneTotal + itemTwoTotal)
            let resultTwo = (withoutMarkdown === itemOneWithoutMarkdown + itemTwoTotal)
            let resultThree = (savings === withoutMarkdown - total)

            expect(resultOne).to.be.true
            expect(resultTwo).to.be.true
            expect(resultThree).to.be.true
        })

        it('should return zero if there is no item in cart', ()=>{
            let { total, withoutMarkdown, savings } = api.getCartTotals()
            let resultOne = (total === 0)
            let resultTwo = (withoutMarkdown === 0)
            let resultThree = (savings === 0)

            expect(resultOne).to.be.true
            expect(resultTwo).to.be.true
            expect(resultThree).to.be.true
        })

    });

    describe('setSpecial functionality', () => {

        it('should set basic spacial for particular product', ()=>{
            let productId = chance.pickone(_.map(defaultProducts, 'itemId'))
            let result = api.setSpecial(productId, 2,4.00,4)

            expect(result).to.be.true
            let product = api.getProduct(productId)
            expect(product).to.have.all.keys(['itemId', 'price', 'markdownPrice', 'specialsPrice', 'specialMode', 'limit'])
        })

        it('should not set basic special if item id is not valid', () => {
            let productId = chance.pickone(_.map(defaultProducts, 'itemId')) + chance.word()
            let result = api.setSpecial(productId, 2,4.00,4)

            expect(result).to.be.false
        })
    });

    describe('setFreeSpecial functionality', () => {

        it('should set special for particular item', ()=>{
            let productId = chance.pickone(_.map(defaultProducts, 'itemId'))
            let result = api.setFreeSpecial(productId, 2,4.00,4)

            expect(result).to.be.true
            let product = api.getProduct(productId)
            expect(product).to.have.all.keys(['itemId', 'price', 'markdownPrice', 'freeQuantity', 'requiredQuantity', 'specialMode', 'limit'])
        })

        it('should not set basic special if item id is not valid', () => {
            let productId = chance.pickone(_.map(defaultProducts, 'itemId')) + chance.word()
            let result = api.setFreeSpecial(productId, 2, 4, 4)

            expect(result).to.be.false
        })
    })


    describe('setCombinationSpecial functionality', () => {
        it('should set special for particular item', () => {
            let productId = chance.pickone(_.map(defaultProducts, 'itemId'))
            let result = api.setCombinationSpecial(productId, 2,4.00,4)

            expect(result).to.be.true
            let product = api.getProduct(productId)
            expect(product).to.have.all.keys(['itemId', 'price', 'markdownPrice', 'reducedPrice', 'requiredQuantity', 'specialMode', 'reducedPriceQuantity'])
        })

        it('should not set basic special if item id is not valid', () => {
            let productId = chance.pickone(_.map(defaultProducts, 'itemId')) + chance.word()
            let result = api.setCombinationSpecial(productId, 2, 4, 4)

            expect(result).to.be.false
        })
    })
})
