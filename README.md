# Checkout Order Total Kata

An API that provides various product checkout functionalities. Each API function has corresponding unit tests.

## Tools

* Nodejs, Lodash, Mocha, Chai, Chance

## Installation
````javascript
npm install
npm test
````

## API
Data are stored in local Json file, functions would happen 
in memory only.

*setPrice(String, Number)*
* Sets price for a certain item. 
* Example 
````javascript
setPrice("banana", 1.09)
// => true or false. If true, item with itemId of "banana" has price of 1.09
````

*addItemToCart(String,Number)*
* Add an item with certain quantity to cart.
* Example
`````javascript
addItemToCart('apple', 2)
// => true or false. If true, 2 pounds of item with itemId of "apple" would be added to cart.
`````

*clearCart()*
* Clear the cart into an empty array.
* Example
`````javascript
clearCart()
// => cart = []
`````

*removeItemFromCart(String)*
* Remove a certain item from cart.
* Example
`````javascript
removeItemFromCart("coconut")
// => true or false. If true, item with itemId of "coconut would be removed from cart.
`````

*setMarkdown(String, Number)*
* Set markdown price for a certain item.
* Example
````javascript
setMarkdown('apple', 1.29)
// => true or false. If true, item with itemId of "apple" has markdown price of 1.29
````

*setSpecial(String, Number, Number, Number)*
* Set a special for a certain item:  N for $X, with a limit(can be 0).
* Example
````javascript
setSpecial('coconut', 2, 4.00, 6)
// => true or false. If true, item with itemId of "coconut" has a special of 2 for $4, limit is 6.
````

*setFreeSpecial(String, Number, Number, Number)*
* Set a special for a certain item: buy N get M free, with a limit(can be 0). 
* Example
````javascript
setFreeSpecial('melon', 2, 1, 6)
// => true or false. If true, item with itemId of "melon" has a special of buy 2 get 1 free, limit is 6
````
*setCombinationSpecial(String, Number, Number, Number)
* Set a special for a certain item: buy N get M for $X.
* Example
````javascript
setCombinationSpecial('melon', 2, 1.50, 1)
// => true or false. If true, item with itemId of "melon" has a special of buy 2 get 1 for $1.50.
````

*getCartTotals()*
* Get the order total, total without markdown and total savings.
* Example
````javascript
getCartTotals()
// => order total, withoutMarkdown, savings
````

*getCart()*
* List items in cart.
* Example
````javascript
getCart()
// =>  items Objects in cart with their respective itemId and quantity. 
````

*getProduct(String)*
* get a certain item from local Json data.
* Example
````javascript
getProduct('apple')
// => { itemId: 'apple', price: 2.15, markdownPrice: 2.15}
````

## TotalHelper Functions
These functions help API method getCartTotals().

*getPriceNforX(Object, Number)*
* Get total price for item which has a special mode of "N for $X"
* Example ( 2 for $4, limit 6)
````javascript
getPriceNforX(coconutOject,7)
// =>  2 (specialPrice) * 6 (limit) + 2.15(price) * 1 (itemsOverLimit) = 14.15
````

*getPriceNwithX(Object, quantity)*
* Get total price for item which has a special mode of  "Buy N get X free"
* Example (Buy 2 get 1 free, limit 6)
````javascript
getPriceNwithX(melonObject, 7)
// => 2 (requiredQuantity) * 2.15 + 2 (requiredQuantity) * 2.15 + 1(itemsOverLimit) * 2.15 = 10.75
````

*getPriceNwithPriceX(Object, Number)*
* Get total price for item which has a special mode of "Buy N get M price for X"
* Example ( Buy 2 get 1 for $1.50, limit 6)
````javascript
getPriceNwithPriceX(melonObject, 7)
// =>  2 (requiredQuantity) * 2.15 + 1(reducePriceQuantity) * 1.50(reducePrice) + 
//     2 (requiredQuantity) * 2.15 + 1(reducePriceQuantity) * 1.50(reducePrice) +
//     1 (itemsOverLimit) * 2.15 ) = 13.75
````

*getDefaultTotal(Object, Number)*
* Get total price for item which does not have any special.
* Example
````javascript
getDefaultTotal(appleObject, 3)
// => 2.15(price) * 3 = 6.45
````

*getTotal(Number, Object)*
* Get each item total based on get price method, which depends on special mode.
* Example (coconut has a special mode of "2 for $4";customer has put 7 coconut in cart)
````javascript
getTotal(coconutObject)
// => 14.15. 
````

*getMaximumTotal(Number, Object)*
* Get maximum total of an item without taking account special or markdown.
* Example(get the maximum total of 7 coconut, which has "2 for $4" special mode)
````javascript
getMaximumTotal(mcoconutObject)
// => 15.05
````

*getProduct(String)*
* Get the item object based on the itemId.
* Example
````javascript
getProduct('apple')
// => { itemId: 'apple', price: 2.15, markdownPrice: 2.15}
````

*getPriceMethod(String)*
* Get the corresponding get price total method based on special mode.
* Example
````javascript
getPriceMethod('N-for-X')
// => getPriceNforX()
````
