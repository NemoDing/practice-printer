define([
	'intern!object',
	'intern/chai!assert',
	'intern/order!src/app/js/ProductPrivilegeSetting',
	'intern/order!src/app/js/Product',
	'intern/order!src/app/js/Printer'
], function (registerSuite, assert) {
	var privilegeSettings = [];

	registerSuite({
		name: 'Test Printer functions',

		setup: function () {
			
			var discount95 = new ProductPrivilegeSetting('95折');
			var threeForTwo = new ProductPrivilegeSetting('买二赠一');	
			privilegeSettings.push(discount95, threeForTwo);		
		},

		teardown: function () {
		},

		beforeEach: function () {
		},

		testFatteningInputJson: function() {
			var input = ['ITEM000001',
						 'ITEM000001',
						 'ITEM000001',
						 'ITEM000001',
						 'ITEM000001',
						 'ITEM000003-2',
						 'ITEM000005',
						 'ITEM000005',
						 'ITEM000005'];
						 
			var printer = new Printer();
			var flatteningInputJson = printer.flatteningInputJson(input);
			assert.strictEqual(flatteningInputJson.length, 10, 'Should return correct length of the new json');

			var count = 0;
			flatteningInputJson.forEach(function(item){
				if (item == 'ITEM000003') {
					count++;
				}
			});
			assert.strictEqual(count, 2, 'Should return correct number flattened item');
		},

		testGetCartProductCount: function() {
			var input = ['ITEM000001',
						 'ITEM000001',
						 'ITEM000001',
						 'ITEM000001',
						 'ITEM000001',
						 'ITEM000003',
						 'ITEM000003',
						 'ITEM000005',
						 'ITEM000005',
						 'ITEM000005'];

			var printer = new Printer();			 
			var cartProductCount = printer.getCartProductCount(input);

			assert.isDefined(cartProductCount.ITEM000001, 'Item should be defined');
			assert.strictEqual(cartProductCount.ITEM000001, 5, 'Should have correct value');

			assert.isDefined(cartProductCount.ITEM000003, 'Item should be defined');
			assert.strictEqual(cartProductCount.ITEM000003, 2, 'Should have correct value');

			assert.isDefined(cartProductCount.ITEM000005, 'Item should be defined');
			assert.strictEqual(cartProductCount.ITEM000005, 3, 'Should have correct value');
		},

		testConstructProduct: function() {
			var cartProductCount = {
				'ITEM000001': 5,
				'ITEM000003': 2,
				'ITEM000005': 3
			};

			var printer = new Printer();
			printer.privilegeSettings = privilegeSettings;
			var products = printer.constructProduct();
			assert.strictEqual(products.length, 0, 'Should have no product constructed');

			products = printer.constructProduct(cartProductCount);
			assert.strictEqual(products.length, 3, 'Should have 3 products constructed');

			products.forEach(function(product){
				if (product.barcode == 'ITEM000001') {
					assert.strictEqual(product.quantity, 5, 'Product should have 5 quantity');
				}
				if (product.barcode == 'ITEM000003') {
					assert.strictEqual(product.quantity, 2, 'Product should have 2 quantity');
				}
				if (product.barcode == 'ITEM000005') {
					assert.strictEqual(product.quantity, 3, 'Product should have 3 quantity');
				}
			});
		},

		testGetProductInfo: function() {

			var printer = new Printer();
			var product = printer.getProductInfo();
			assert.isNull(product, 'Should be null with no barcode provided');

			var product = printer.getProductInfo('ITEM0000013');
			assert.isNull(product, 'Should be null with no matching barcode');
			
			var product = printer.getProductInfo('ITEM000003');
			assert.strictEqual(product.name, '苹果', 'Should get correct product and name');
		},

		testSetProductPrivilegeTag: function() {
			var printer = new Printer();
			printer.privilegeSettings = privilegeSettings;

			privilegeSettings[0].products.push('ITEM000005');
			privilegeSettings[1].products.push('ITEM000003');

			var product = new Product('ITEM000005');
			printer.setProductPrivilegeTag(product);
			assert.strictEqual(product.privilegeTag, '95折', 'Should get correct privilegeTag');

			privilegeSettings[1].products.push('ITEM000005');

			printer.setProductPrivilegeTag(product);
			assert.strictEqual(product.privilegeTag, '买二赠一', 'Should get correct privilegeTag');
		}


	});
});