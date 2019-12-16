const expect  = require('chai').expect
const _ = require('lodash')
const decache = require('decache')

const defaultProducts = require('../data/products')
const modulePath = '../functions/totalHelper'

describe('totalHelper functionality', () => {
    let helper

    beforeEach(() => {
        decache(modulePath)
        helper = require(modulePath)
    })

    describe('getPriceNforX functionality', () => {
        it('should compute proper price', () => {
            let item = {
                price: 10,
                limit: 5,
                specialsPrice: 7
            }

            let total = helper.getPriceNforX(item, 6)

            expect(total).to.equal(45)
        });
    })

    describe('getPriceNwithX functionality', () => {
        it('should compute proper price', () => {
            let item = {
                price: 10,
                limit: 6,
                freeQuantity: 1,
                requiredQuantity: 2
            }

            let total = helper.getPriceNwithX(item, 7)
            expect(total).to.equal(50)
        })
    })

    describe('getPriceNwithPriceX functionality', () => {
        it('should compute proper price', () => {
            let item = {
                price: 10,
                limit: 6,
                reducedPrice: 7,
                requiredQuantity: 1,
                reducedPriceQuantity: 2
            }

            let total = helper.getPriceNwithPriceX(item, 7)
            expect(total).to.equal(58)
        })

        it('should should compute proper price under limit', () => {
            let item = {
                price: 10,
                limit: 6,
                reducedPrice: 7,
                requiredQuantity: 1,
                reducedPriceQuantity: 2
            }

            let total = helper.getPriceNwithPriceX(item, 5)
            expect(total).to.equal(41)
        })

        it('should compute proper price with high required quantity', () => {
            let item = {
                price: 10,
                limit: 6,
                reducedPrice: 7,
                requiredQuantity: 4,
                reducedPriceQuantity: 1
            }

            let total = helper.getPriceNwithPriceX(item, 5)
            expect(total).to.equal(47)
        });
    });

    describe('getPriceMethod functionality', () => {
        it('should return proper method', () => {

        });
    });
});
