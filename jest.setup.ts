import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';

if (!global.TextEncoder) {
	global.TextEncoder = TextEncoder as typeof global.TextEncoder;
}

if (!global.TextDecoder) {
	global.TextDecoder = TextDecoder as typeof global.TextDecoder;
}

// Test setup file. If you add client-side i18n later, add any mocks or providers here.
// ...other test setup as needed...

