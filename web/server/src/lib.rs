use actix_web::HttpRequest;
use actix_web::{middleware::Logger, web, App, HttpResponse, HttpServer, Responder};
use env_logger;

async fn hello(req: HttpRequest) -> impl Responder {
    let name = req.match_info().get("name").unwrap_or("World");
    format!("Hello {} !", &name)
}

async fn health_check(req: HttpRequest) -> impl Responder {
    HttpResponse::Ok()
}

pub async fn run() -> std::io::Result<()> {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    HttpServer::new(|| {
        App::new()
            .wrap(Logger::new("%a %{User-Agent}i"))
            .route("/{name}", web::get().to(hello))
            .route("/health_check", web::get().to(health_check))
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}