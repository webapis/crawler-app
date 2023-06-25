import test from 'ava';
import mergeData from './typesense/github/mergeNewData.mjs'
debugger
test('foo', t => {
	t.pass();
});

test('bar', async t => {
	const bar = Promise.resolve('bar');
	t.is(await bar, 'bar');
});