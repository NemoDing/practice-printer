define([
	'intern!object',
	'intern/chai!assert',
	'intern/order!src/app/js/Product'
], function (registerSuite, assert) {
	var product;

	registerSuite({
		name: 'Test Product functions',

		setup: function () {
		},

		teardown: function () {
		},

		beforeEach: function () {
			product = new Product('ITEM000001', '羽毛球', '个', '体育用品', 1.00);
		},

		testInit: function () {
			assert.strictEqual(product.quantity, 0, 'after init the quantity should be 0 by default.');
			assert.strictEqual(product.privilegePrice, 0, 'After init the privilegePrice should be 0 by default.');
		},

		testIsShowPrivilegeInfo: function() {

			assert.isUndefined(product.isShowPrivilege, 'property isShowPrivilege should be undefined by default');

			product.isShowPrivilegeInfo(true);
			assert.isTrue(product.isShowPrivilege, 'property isShowPrivilege should be true after call isShowPrivilegeInfo with param true');
		},

		testGetSubtotal: function() {
			product.quantity = 3;
			assert.strictEqual(product.getSubtotal(), 3.00, 'getSubtotal function should return correct subtotal value.');

			product.privilegePrice = 0.5;
			assert.strictEqual(product.getSubtotal(), 2.5, 'getSubtotal function should return correct subtotal value.');

			product.price = undefined;
			assert.strictEqual(product.getSubtotal(), 0, 'getSubtotal function should return correct subtotal value.');
		},

		testToString: function() {
			assert.strictEqual(product.toString(), '名称:羽毛球, 数量：0个, 单价：1.00(元), 小计：0.00(元)', 
				'should output the correct string with default value');

			product.quantity = 2;
			assert.strictEqual(product.toString(), '名称:羽毛球, 数量：2个, 单价：1.00(元), 小计：2.00(元)', 
				'should output the correct string with quantity property');

			product.privilegePrice = 0.3;
			assert.strictEqual(product.toString(), '名称:羽毛球, 数量：2个, 单价：1.00(元), 小计：1.70(元)', 
				'should output the correct string with quantity and privilegePrice property');

			product.isShowPrivilegeInfo(true);
			assert.strictEqual(product.toString(), '名称:羽毛球, 数量：2个, 单价：1.00(元), 节省：0.30(元), 小计：1.70(元)', 					
				'should output the correct string with quantity, privilegePrice and isShowPrivilege property');
		}

	});
});