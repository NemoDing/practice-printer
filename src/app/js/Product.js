function Product(barcode, name, unit, category, price) {
    this.barcode = barcode;
	this.name = name;
	this.unit = unit;
	this.category = category;
	this.price = price || 0;
	this.quantity = 0;
	this.privilegePrice = 0;
}

Product.prototype.toString = function() {
	return "名称:" + this.name + ", " + 
    		"数量：" + this.quantity + this.unit + ", " + 
			"单价：" + this.price.toFixed(2) + "(元)" + ", " +
			(this.isShowPrivilege ? "节省：" + this.privilegePrice.toFixed(2) + "(元), " : "") + 
			"小计：" + this.getSubtotal().toFixed(2) + "(元)";
}

Product.prototype.isShowPrivilegeInfo = function(isShowPrivilege) {
	this.isShowPrivilege = isShowPrivilege;
}

Product.prototype.getSubtotal = function() {
	return this.price ? (this.quantity * this.price - this.privilegePrice) : 0;
}