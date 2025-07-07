export class Base64 {
  public encode(s: string): string {
    // Encode string as UTF-8 bytes, then base64 encode
    const utf8Bytes = new TextEncoder().encode(s);
    const binary = Array.from(utf8Bytes, (byte) => String.fromCodePoint(byte)).join("");
    return btoa(binary);
  }

  public decode(s: string): string {
    // Decode base64 to bytes, then interpret as UTF-8 string
    const binary = atob(s);
    const bytes = Uint8Array.from(binary, (b) => b.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }
}
