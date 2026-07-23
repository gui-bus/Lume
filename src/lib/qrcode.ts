import QRCode from "qrcode";

export async function generateShareQrCode(url: string): Promise<string> {
  return QRCode.toDataURL(url);
}
