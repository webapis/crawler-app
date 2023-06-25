import test from 'ava';

import mergeData from '../index.mjs'
debugger

test('new price changed', t => {
	const timestamp = Date.now()
	const prevData = {
		"title": "avva beyaz yüksek bilekli ayakkabı _erkek",
		"priceNew": "499,99",
		"imageUrl": "4183/Uploads/UrunResimleri/thumb/beyaz-spor-ayakkabi--45ff-.jpg",
		"link": "beyaz-spor-ayakkabi-33107",
		"marka": "avva",
		"gender": "_erkek",
		"timestamp": timestamp,

	}
	const newData = {
		"title": "avva beyaz yüksek bilekli ayakkabı _erkek",
		"priceNew": "499,98",
		"imageUrl": "4183/Uploads/UrunResimleri/thumb/beyaz-spor-ayakkabi--45ff-.jpg",
		"link": "beyaz-spor-ayakkabi-33107",
		"marka": "avva",
		"gender": "_erkek",
		"timestamp": timestamp

	}
	t.deepEqual(mergeData(newData, prevData), {
		"title": "avva beyaz yüksek bilekli ayakkabı _erkek",
		"priceNew": "499,98",
		"imageUrl": "4183/Uploads/UrunResimleri/thumb/beyaz-spor-ayakkabi--45ff-.jpg",
		"link": "beyaz-spor-ayakkabi-33107",
		"marka": "avva",
		"gender": "_erkek",
		"timestamp": timestamp,
		"price_change": [{ timestamp, priceNew: '499,98' }],
	})
});

test('price did not change', t => {
	const timestamp = Date.now()
	const prevData = {
		"title": "avva beyaz yüksek bilekli ayakkabı _erkek",
		"priceNew": "499,99",
		"imageUrl": "4183/Uploads/UrunResimleri/thumb/beyaz-spor-ayakkabi--45ff-.jpg",
		"link": "beyaz-spor-ayakkabi-33107",
		"marka": "avva",
		"gender": "_erkek",
		"timestamp": timestamp,

	}
	const newData = {
		"title": "avva beyaz yüksek bilekli ayakkabı _erkek",
		"priceNew": "499,99",
		"imageUrl": "4183/Uploads/UrunResimleri/thumb/beyaz-spor-ayakkabi--45ff-.jpg",
		"link": "beyaz-spor-ayakkabi-33107",
		"marka": "avva",
		"gender": "_erkek",
		"timestamp": timestamp

	}
	t.deepEqual(mergeData(newData, prevData), {
		"title": "avva beyaz yüksek bilekli ayakkabı _erkek",
		"priceNew": "499,99",
		"imageUrl": "4183/Uploads/UrunResimleri/thumb/beyaz-spor-ayakkabi--45ff-.jpg",
		"link": "beyaz-spor-ayakkabi-33107",
		"marka": "avva",
		"gender": "_erkek",
		"timestamp": timestamp,
		"price_change": [{ timestamp, priceNew: '499,99' }],
	})
});

test('new price changed n time', t => {
	const timestamp = Date.now()

	const prevData = {
		"title": "avva beyaz yüksek bilekli ayakkabı _erkek",
		"priceNew": "499,99",
		"imageUrl": "4183/Uploads/UrunResimleri/thumb/beyaz-spor-ayakkabi--45ff-.jpg",
		"link": "beyaz-spor-ayakkabi-33107",
		"marka": "avva",
		"gender": "_erkek",
		"timestamp": timestamp,
		"price_change": [{ timestamp, priceNew: '499,98' }]

	}
	const newData = {
		"title": "avva beyaz yüksek bilekli ayakkabı _erkek",
		"priceNew": "599,98",
		"imageUrl": "4183/Uploads/UrunResimleri/thumb/beyaz-spor-ayakkabi--45ff-.jpg",
		"link": "beyaz-spor-ayakkabi-33107",
		"marka": "avva",
		"gender": "_erkek",
		"timestamp": timestamp

	}
	t.deepEqual(mergeData(newData, prevData), {
		"title": "avva beyaz yüksek bilekli ayakkabı _erkek",
		"priceNew": "599,98",
		"imageUrl": "4183/Uploads/UrunResimleri/thumb/beyaz-spor-ayakkabi--45ff-.jpg",
		"link": "beyaz-spor-ayakkabi-33107",
		"marka": "avva",
		"gender": "_erkek",
		"timestamp": timestamp,
		"price_change": [{ timestamp, priceNew: '499,98' },{ timestamp, priceNew: '599,98' }],
	})
});