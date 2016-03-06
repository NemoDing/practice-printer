function Printer() {
}

Printer.prototype.flatteningInputJson = function(inputJson) {

	var flatteningInputJson = [];
	inputJson.forEach(function(barcodeString) { 
		if (barcodeString.indexOf('-') > -1) {
			var barcode = barcodeString.split('-')[0];
			var quantity = barcodeString.split('-')[1];
			flatteningInputJson = flatteningInputJson.concat(Array(parseInt(quantity)).fill(barcode));
		} else {
			flatteningInputJson.push(barcodeString);
		}
	});
	return flatteningInputJson;
}

Printer.prototype.getCartProductCount = function(inputJson) {

	var cartProductCount = {};
	inputJson.forEach(function(barcode) { 
		cartProductCount[barcode] = (cartProductCount[barcode] || 0)+1; 
	});
	return cartProductCount;
}

Printer.prototype.constructProduct = function(cartProductCount) {

	var products = [];
	for (var key in cartProductCount) {
		var product = this.getProductInfo(key)
		product.quantity = cartProductCount[key];

		this.setProductPrivilegeTag(product);
		this.setProductPrivilegePrice(product);

		products.push(product);
	}
	return products;
}


Printer.prototype.setProductPrivilegeTag = function(product) {
	if (this.privilegeSettings) {
		this.privilegeSettings.forEach(function(privilegeSetting){
			if (privilegeSetting.products.indexOf(product.barcode) > -1) {
				product.privilegeTag = product.privilegeTag ? ";" + privilegeSetting.type : privilegeSetting.type;
			}

			if (product.privilegeTag && 
				product.privilegeTag.indexOf(';') > -1 && product.privilegeTag.indexOf('买二赠一') > -1) {
				product.privilegeTag = '买二赠一';
			}
		});
	}
}

Printer.prototype.setProductPrivilegePrice = function(product) {
	product.privilegePrice = new PrivilegeContext(product).getPrivilegePrice();
}

Printer.prototype.getProductInfo = function(barcode) {
	
	switch (barcode) {
		case 'ITEM000001':
			return new Product('ITEM000001', '羽毛球', '个', '体育用品', 1.00);
		case 'ITEM000003':	
			return new Product('ITEM000003', '苹果', '斤', '水果', 5.50);
		case 'ITEM000005':	
			return new Product('ITEM000005', '可口可乐', '瓶', '饮料', 3.00);
		default:
			console.log("商品库中不存在输入的条码");
			return null; 	
	}
}

Printer.prototype.printReceipt = function(products) {

	var total = 0;
	var totalPrivilegePrice = 0;

	var isPrintMultiPurchasePrivilege = false;
	var addtionalPrivilegeInfo = "";

	if (products.length > 0) {
		console.log("***<没钱赚商店>购物清单***");

		// show product info
		products.forEach(function(product){
			if (product.privilegeTag == '95折') {
				product.isShowPrivilegeInfo(true);
			}
			//???
			if (product.privilegeTag == '买二赠一') { 
				isPrintMultiPurchasePrivilege = true;
				addtionalPrivilegeInfo += "名称:" + product.name + ", 数量：" + Math.floor(product.quantity/3) + "\n";
			}
			console.log(product.toString() + "\n");

			total += product.getSubtotal();
			totalPrivilegePrice += product.privilegePrice;
		});
		
		// show 买二赠一商品 info ???
		if (isPrintMultiPurchasePrivilege) {
			console.log("-----------------------");
			console.log("买二赠一商品：");
			console.log(addtionalPrivilegeInfo);
		}

		// show total info
		console.log("-----------------------");
		console.log("总计:" + total.toFixed(2) + "(元)" + "\n");
		if (totalPrivilegePrice != 0) {
			console.log("节省:" + totalPrivilegePrice.toFixed(2) + "(元)" + "\n");
		}
		console.log("***********************");
		console.log("\n");

	} else {
		console.log('No product in the cart');
	}	
}

Printer.prototype.print = function(inputJson) {

	if (inputJson && inputJson.length > 0) {
		var flatteningJson = this.flatteningInputJson(inputJson);
		var cartProductCount = this.getCartProductCount(flatteningJson);
		var products = this.constructProduct(cartProductCount);

		this.printReceipt(products);
	} else {
		console.log("输入不正确");
	}
}