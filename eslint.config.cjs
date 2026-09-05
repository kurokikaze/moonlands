const {
	defineConfig,
	globalIgnores,
} = require('eslint/config');

const globals = require('globals');
const js = require('@eslint/js');

const {
	FlatCompat,
} = require('@eslint/eslintrc');

const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all
});

module.exports = defineConfig([{
	languageOptions: {
		globals: {
			...globals.node,
		},

		'sourceType': 'module',
		'ecmaVersion': 2018,
		parserOptions: {
			'ecmaVersion': 2020
		},
	},

	extends: compat.extends('eslint:recommended'),

	'rules': {
		'indent': ['error', 'tab', {
			'SwitchCase': 1,
		}],

		'linebreak-style': ['error', 'windows'],
		'quotes': ['error', 'single'],
		'no-extra-semi': ['warn'],
		'no-unused-vars': ['warn'],
	},
}, globalIgnores(['dist/*'])]);