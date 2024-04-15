/**
 * ArrayBuffer转Base64（renderjs专用）
 */
export function transformArrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let len = bytes.byteLength, i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

/**
 * 复杂实例转基本对象（renderjs专用）
 */
export function transformInstanceToObject(instance) {
	const obj = {}
	for(const key in instance){
		obj[key] = instance[key]
	}
	return obj
}