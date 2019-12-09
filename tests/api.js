const expect  = require('chai').expect
const Chance = require('chance')
const _ = require('lodash')

const chance = new Chance()
const defaultProducts = require('../data/products')
const modulePath = '../functions/api'

describe('API functionality', () => {

    describe('addItemToCart functionality', () => {

        it('should add existing product item', () => {
            let api = require(modulePath)
            let quantity = chance.d10()
            let itemId = chance.pickone(_.map(defaultProducts, 'itemId'))

            let result = api.addItemToCart(itemId, quantity)

            let cart = api.getCart()
            let cartItem = {
                itemId,
                quantity
            }

            expect(result).to.be.true
            expect(cart).to.deep.equal([ cartItem ])
        })

        it('should not allow adding non-existing item', () => {
            let api = require(modulePath)
            let quantity = chance.d10()
            let itemId = chance.pickone(_.map(defaultProducts, 'itemId')) + chance.word()

            let result = api.addItemToCart(itemId, quantity)

            let cart = api.getCart()

            expect(result).to.be.false
            expect(cart).to.deep.equal([])
        });
    })

    describe('setPrice functionality', () => {

        it('should set new price for existing product item', () =>{
            let api = require(modulePath)
            let newPrice = chance.d10()
            let itemId = chance.pickone(_.map(defaultProducts, 'itemId' ))

            api.setPrice(itemId, newPrice)
            let currentItem = _.find(defaultProducts, { itemId })
            let result = (currentItem.price === newPrice)

            expect(result).to.be.true
        })

        it('should not set price if item not exist', () =>{
            let api = require(modulePath)
            let newPrice = chance.d10()
            let itemId = chance.pickone(_.map(defaultProducts, 'itemId' )) + chance.word()

            let result = api.setPrice(itemId, newPrice)

            expect(result).to.be.false
        })
    });

    describe('emptyCart functionality', () => {

        it('should empty cart', ()=>{
            let api = require(modulePath)
            api.emptyCart()
            let cart = api.getCart()

            expect(cart).to.deep.equal([])
        })
    });

    describe('removeItemFromCart functionality', () => {

        it('should remove an item from cart', ()=>{
            let api = require(modulePath)
            let itemId = chance.pickone(_.map(defaultProducts, "itemId"))

            api.removeItemFromCart(itemId)
            let cart = api.getCart()
            let result = _.includes(cart,"itemId")

            expect(result).to.be.false
        })
    });

    describe('setMarkdown functionality', () => {

        it('should set markdown price', ()=>{
            let api = require(modulePath)
            let price = chance.d10()
            let itemId = chance.pickone(_.map(defaultProducts,"itemId"))

            api.setMarkdown(itemId, price)
            let currentItem = _.find(defaultProducts, { itemId })
            let result = currentItem.markdownPrice === price

            expect(result).to.be.true
        })
    });

    describe('getCartTotals functionality', () => {

        it('should sum total amount of items in cart, with and without markdown', ()=>{
            let api= require(modulePath)
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
            let api = require(modulePath)
            api.emptyCart()

            let { total, withoutMarkdown, savings } = api.getCartTotals()
            let resultOne = (total === 0)
            let resultTwo = (withoutMarkdown === 0)
            let resultThree = (savings === 0)

            expect(resultOne).to.be.true
            expect(resultTwo).to.be.true
            expect(resultThree).to.be.true
        })


    });


})
