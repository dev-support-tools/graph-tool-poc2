use image::{DynamicImage, RgbaImage};
use win_screenshot::prelude::*;
use winapi::um::winuser::GetForegroundWindow;
use actix_web::{post, web, App, HttpServer, Responder};

#[post("/api/capture.png")]
async fn capture() -> impl Responder {
    println!("capture");
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
        App::new().service(capture)
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
