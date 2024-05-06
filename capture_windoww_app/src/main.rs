use image::{DynamicImage, RgbaImage};
use win_screenshot::prelude::*;
use winapi::um::winuser::GetForegroundWindow;
use actix_web::{get, web, App, HttpServer, Responder};

#[get("/api/capture.png")]
async fn greet() -> impl Responder {
    let hwnd = unsafe { GetForegroundWindow() as isize };
    let buf = capture_window(hwnd).unwrap();
    let img = DynamicImage::ImageRgba8(
        RgbaImage::from_raw(buf.width, buf.height, buf.pixels).unwrap());
    // imgをgif形式で保存
    img.save("screenshot.png").unwrap();
    // 画像を返す。
    web::Bytes::from(std::fs::read("screenshot.png").unwrap())
}

#[actix_web::main] 
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new().service(greet)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
