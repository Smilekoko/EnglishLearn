package com.englishlearn.server.auth;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

/** 把一段文本渲染成 SVG 二维码，前端直接内嵌，不需要额外的 JS 依赖。 */
public final class QrSvg {

    private QrSvg() {
    }

    public static String render(String text) {
        try {
            BitMatrix matrix = new QRCodeWriter().encode(text, BarcodeFormat.QR_CODE, 240, 240);
            StringBuilder path = new StringBuilder();
            for (int y = 0; y < matrix.getHeight(); y++) {
                for (int x = 0; x < matrix.getWidth(); x++) {
                    if (matrix.get(x, y)) {
                        path.append('M').append(x).append(' ').append(y).append("h1v1h-1z");
                    }
                }
            }
            return "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 "
                    + matrix.getWidth() + " " + matrix.getHeight()
                    + "\" shape-rendering=\"crispEdges\" role=\"img\" aria-label=\"登录二维码\">"
                    + "<rect width=\"100%\" height=\"100%\" fill=\"#ffffff\"/>"
                    + "<path fill=\"#000000\" d=\"" + path + "\"/></svg>";
        } catch (WriterException e) {
            throw new IllegalStateException("生成二维码失败", e);
        }
    }
}
