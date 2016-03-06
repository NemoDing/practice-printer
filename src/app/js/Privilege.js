function MultiPurchasePrivilege(purchaseQuantity, freeQuantity) {
    this.purchaseQuantity = purchaseQuantity;
    this.freeQuantity = freeQuantity;
};
MultiPurchasePrivilege.prototype.getPrivilegePrice = function(product) {
    return Math.floor(product.quantity/this.purchaseQuantity) * product.price * this.freeQuantity;
}


function DiscountPrivilege(discountRate) {
    this.discountRate = discountRate;
};
DiscountPrivilege.prototype.getPrivilegePrice = function(product) {
    return (product.price * product.quantity) - (product.price * product.quantity * this.discountRate);
}




function PrivilegeContext(product) {

	this.product = product;
	this.privilege = null;
	if (product) {
		switch (product.privilegeTag) {
			case '95折': 
				this.privilege = new DiscountPrivilege(0.95);
				break;
			case '买二赠一':
				this.privilege = new MultiPurchasePrivilege(3, 1);
				break;
			default:
				break;
		}
	}
}

PrivilegeContext.prototype.getPrivilegePrice = function() {
	return this.privilege ? this.privilege.getPrivilegePrice(this.product) : 0;
}