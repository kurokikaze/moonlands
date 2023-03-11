module.exports = {
	preset: 'ts-jest/presets/js-with-ts',
	testEnvironment: 'node',
	transform: {
		'\\.[jt]sx?$': 'babel-jest',
	}
};
