use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder, middleware::Logger};
use env_logger;

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello world")
}

#[post("/echo")]
async fn echo(req_body: String) -> impl Responder {
    HttpResponse::Ok().body(req_body)
}

async fn manual_hello() -> impl Responder {
    HttpResponse::Ok().body("Hello from server!")
}


#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    HttpServer::new(|| { 
        App::new().wrap(Logger::new("%a %{User-Agent}i")).service(hello).service(echo).route("/hey", web::get().to(manual_hello))
    }).bind(("0.0.0.0", 8080))?.run().await
}

