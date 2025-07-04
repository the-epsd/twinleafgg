export class Base64 {
  public encode(s: string): string {
    // Encode string as UTF-8 bytes, then base64 encode
    const utf8Bytes = new TextEncoder().encode(s);
    let binary = '';
    utf8Bytes.forEach(byte => binary += String.fromCharCode(byte));
    return btoa(binary);
  }

  public decode(s: string): string {
    // Decode base64 to bytes, then interpret as UTF-8 string
    const binary = atob(s);
    const bytes = new Uint8Array([...binary].map(char => char.charCodeAt(0)));
    return new TextDecoder().decode(bytes);
  }
}
