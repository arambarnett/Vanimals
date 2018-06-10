class BaseModel {
	static get objectName() {
		throw new Error('you must implement `objectName`');
	}
}

module.exports = BaseModel;
