/**
 * @author Mallik Galib Shahriar
 * @link https://www.linkedin.com/in/mallikgalibshahriar/
 */

export const testData = {
    validUser: {
        username: 'standard_user',
        password: 'secret_sauce'
    },
    lockedUser: {
        username: 'locked_out_user',
        password: 'secret_sauce'
    },
    problemUser: {
        username: 'problem_user',
        password: 'secret_sauce'
    },
    checkoutInfo: {
        firstName: 'John',
        lastName: 'Doe',
        postalCode: '12345'
    },
    products: {
        backpack: 'Sauce Labs Backpack',
        bikeLight: 'Sauce Labs Bike Light',
        boltTShirt: 'Sauce Labs Bolt T-Shirt',
        jacket: 'Sauce Labs Fleece Jacket',
        onesie: 'Sauce Labs Onesie',
        tShirtRed: 'Test.allTheThings() T-Shirt (Red)'
    },
    errorMessages: {
        lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
        wrongCredentials: 'Epic sadface: Username and password do not match any user in this service',
        firstNameRequired: 'Error: First Name is required',
        lastNameRequired: 'Error: Last Name is required',
        postalCodeRequired: 'Error: Postal Code is required',
        usernameRequired: 'Epic sadface: Username is required',
        passwordRequired: 'Epic sadface: Password is required'
    }
};
