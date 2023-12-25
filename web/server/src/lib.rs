pub mod configuration;

use std::net::TcpListener;

use actix_web::dev::Server;
use actix_web::HttpRequest;
use actix_web::{middleware::Logger, web, App, HttpResponse, HttpServer, Responder};
use env_logger;

async fn hello(req: HttpRequest) -> impl Responder {
    let name = req.match_info().get("name").unwrap_or("World");
    format!("Hello {}", &name)
}

async fn health_check(req: HttpRequest) -> impl Responder {
    HttpResponse::Ok().finish()
}

pub fn run(listener: TcpListener) -> std::result::Result<Server, std::io::Error> {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    let server = HttpServer::new(|| {
        App::new()
            .wrap(Logger::new("%a %{User-Agent}i"))
            .route("/health_check", web::get().to(health_check))
            .route("/{name}", web::get().to(hello))
    })
    .listen(listener)?
    .run();
    Ok(server)
}
