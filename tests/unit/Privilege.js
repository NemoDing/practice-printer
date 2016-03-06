define([
	'intern!object',
	'intern/chai!assert',
	'intern/order!src/app/js/Product',
	'intern/order!src/app/js/Privilege'
], function (registerSuite, assert) {
	var privilege;
	var product;

	registerSuite({
		name: 'Test privilege functions',

		setup: function () {
			product = new Product('ITEM000005', '可口可乐', '瓶', '饮料', 3.00);
			product.quantity = 5;
		},

		teardown: function () {
		},

		testMultiPurchasePrivilege: function () {
			privilege = new MultiPurchasePrivilege(3, 1);
			assert.strictEqual(privilege.getPrivilegePrice(product), 3, 
				'Should return correct value from MultiPurchasePrivilege with provided setting');

			privilege = new MultiPurchasePrivilege(5, 2);
			assert.strictEqual(privilege.getPrivilegePrice(product), 6, 
				'Should return correct value from MultiPurchasePrivilege with provided setting');
		},

		testDiscountPrivilege: function () {
			privilege = new DiscountPrivilege(0.95);
			assert.strictEqual(privilege.getPrivilegePrice(product), 0.75, 
				'Should return correct value from DiscountPrivilege with provided setting');

			privilege = new DiscountPrivilege(0.3);
			assert.strictEqual(privilege.getPrivilegePrice(product), 10.5, 
				'Should return correct value from DiscountPrivilege with provided setting');
		},

		testPrivilegeContext: function() {
			var privilegeContext = new PrivilegeContext();
			assert.isNull(privilegeContext.privilege, 'privilege is null when no product provided');

			product.privilegeTag = '95折';
			privilegeContext = new PrivilegeContext(product);
			assert.instanceOf(privilegeContext.privilege, DiscountPrivilege, 'should be instance of DiscountPrivilege');

			product.privilegeTag = '买二赠一';
			privilegeContext = new PrivilegeContext(product);
			assert.instanceOf(privilegeContext.privilege, MultiPurchasePrivilege, 'should be instance of MultiPurchasePrivilege');

			privilegeContext = new PrivilegeContext();
			assert.strictEqual(privilegeContext.getPrivilegePrice(), 0, 'Should return 0 when no privilege init');

			privilegeContext = new PrivilegeContext(product);
			assert.strictEqual(privilegeContext.getPrivilegePrice(), 3, 'Should return 3');
		}

	});
});