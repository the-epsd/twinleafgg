export class Base64 {
  public encode(s: string): string {
    const utf8Bytes = new TextEncoder().encode(s);
    const binary = Array.from(utf8Bytes, byte => String.fromCodePoint(byte)).join('');
    return btoa(binary);
  }

  public decode(s: string): string {
    const base64Pattern = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    if (!base64Pattern.test(s)) {
      throw new Error('Cannot decode base64');
    }

    try {
      const binary = atob(s);
      const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
      return new TextDecoder().decode(bytes);
    } catch (error) {
      throw new Error('Cannot decode base64');
    }
  }
}
