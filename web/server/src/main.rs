use actix_web::HttpRequest;
use actix_web::{get, middleware::Logger, post, web, App, HttpResponse, HttpServer, Responder};
use env_logger;
mod db;

use db::user;
use db::PrismaClient;
use prisma_client_rust::NewClientError;


async fn hello(req: HttpRequest) -> impl Responder {
    let name = req.match_info().get("name").unwrap_or("World");
    format!("Hello {}", &name)
}

async fn health_check(req: HttpRequest) -> impl Responder {
    HttpResponse::Ok()
}


#[tokio::main]
async fn main() -> std::io::Result<()> {
    let client: Result<PrismaClient, NewClientError> = PrismaClient::_builder().build().await;
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    HttpServer::new(|| {
        App::new()
            .wrap(Logger::new("%a %{User-Agent}i"))
            .route("/", web::get().to(hello))
            .route("/health_check", web::get().to(health_check))
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
