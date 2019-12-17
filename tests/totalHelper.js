const expect  = require('chai').expect
const decache = require('decache')

const modulePath = '../functions/totalHelper'

describe('totalHelper functionality', () => {
    let helper

    beforeEach(() => {
        decache(modulePath)
        helper = require(modulePath)
    })

    describe('getPriceNforX functionality', () => {
        it('should compute proper price when quantity is bigger than limit', () => {
            let item = {
                price: 10,
                limit: 5,
                specialsPrice: 7
            }

            let total = helper.getPriceNforX(item, 6)

            expect(total).to.equal(45)
        });
        it('should compute proper price when quantity is smaller than limit', () => {
            let item = {
                price: 10,
                limit: 5,
                specialsPrice: 7
            }

            let total = helper.getPriceNforX(item, 4)

            expect(total).to.equal(28)
        });
        it('should compute proper price when quantity is equal to limit', () => {
            let item = {
                price: 10,
                limit: 5,
                specialsPrice: 7
            }

            let total = helper.getPriceNforX(item, 5)

            expect(total).to.equal(35)
        });
    })

    describe('getPriceNwithX functionality', () => {
        it('should compute proper price when quantity is bigger than limit', () => {
            let item = {
                price: 10,
                limit: 6,
                freeQuantity: 1,
                requiredQuantity: 2
            }

            let total = helper.getPriceNwithX(item, 7)
            expect(total).to.equal(50)
        })
        it('should compute proper price when quantity is equal to limit', () => {
            let item = {
                price: 10,
                limit: 6,
                freeQuantity: 2,
                requiredQuantity: 3
            }

            let total = helper.getPriceNwithX(item, 6)
            expect(total).to.equal(40)
        })
        it('should compute proper price when quantity is smaller than limit', () => {
            let item = {
                price: 10,
                limit: 6,
                freeQuantity: 1,
                requiredQuantity: 2
            }

            let total = helper.getPriceNwithX(item, 4)
            expect(total).to.equal(30)
        })
    })

    describe('getPriceNwithPriceX functionality', () => {
        it('should compute proper price when quantity is bigger than limit', () => {
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

        it('should should compute proper price when quantity is smaller than limit', () => {
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
        it('should compute proper price with higher reduced price quantity', () => {
            let item = {
                price: 10,
                limit: 6,
                reducedPrice: 7,
                requiredQuantity: 3,
                reducedPriceQuantity: 2
            }

            let total = helper.getPriceNwithPriceX(item, 7)
            expect(total).to.equal(64)
        });
    });

    describe('getPriceMethod functionality', () => {
        it('should return method getPriceNforX', () => {
            let activeSpecial = "N-for-X"
            let result = helper.getPriceMethod(activeSpecial)

            expect(result).to.equal(helper.getPriceNforX)
        });

        it('should return method getPriceNwithX', () => {
            let activeSpecial = "N-with-X"
            let result = helper.getPriceMethod(activeSpecial)

            expect(result).to.equal(helper.getPriceNwithX)
        });
        it('should return method getPriceNwithPriceX', () => {
            let activeSpecial = "N-with-price-X"
            let result = helper.getPriceMethod(activeSpecial)

            expect(result).to.equal(helper.getPriceNwithPriceX)
        });
        it('should return method getDefaultTotal', () => {
            let activeSpecial = ""
            let result = helper.getPriceMethod(activeSpecial)

            expect(result).to.equal(helper.getDefaultTotal)
        });
    });
});
