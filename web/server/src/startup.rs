use std::net::TcpListener;

use crate::configuration::{ DatabaseSettings, Settings };

use actix_session::SessionMiddleware;
use actix_session::storage::RedisSessionStore;
use actix_web::dev::Server;
use actix_web::{HttpRequest, web};
use actix_web::{middleware::Logger, App, HttpResponse, HttpServer, Responder};
use actix_web::web::Data;
use actix_web::cookie::Key;
use env_logger;
use anyhow::{Error};
use secrecy::{Secret, ExposeSecret};
use sqlx::PgPool;
use sqlx::postgres::PgPoolOptions;


pub struct Application {
    port: u16,
    server: Server
}

impl Application {
    pub async fn build(config: Settings) -> Result<Self, anyhow::Error> {
        let connection_pool = get_connection_pool(&config.database);
        let address = format!("{}:{}", config.application.host, config.application.port);
        let listener = TcpListener::bind(address)?;
        let port = listener.local_addr().unwrap().port();

        let server = run(
            listener,
            connection_pool,
            config.application.base_url,
            config.application.hmac_secret,
            config.redis_uri
        )
        .await?;

        Ok(Self { port, server })
    }

    pub async fn run_until_stopped(self) -> Result<(), std::io::Error> {
        self.server.await
    }
}


pub fn get_connection_pool(config: &DatabaseSettings) -> PgPool {
    PgPoolOptions::new().connect_lazy_with(config.with_db())
}

// old below

async fn hello(req: HttpRequest) -> impl Responder {
    let name = req.match_info().get("name").unwrap_or("World");
    format!("Hello {}", &name)
}

async fn health_check(req: HttpRequest) -> impl Responder {
    HttpResponse::Ok().finish()
}

pub struct ApplicationBaseUrl(pub String);

async fn run(
    listener: TcpListener,
    db_pool: PgPool,
    base_url: String,
    hmac_secret: Secret<String>,
    redis_uri: Secret<String>
) -> Result<Server, anyhow::Error> {
    let db_pool = Data::new(db_pool);
    let base_url = Data::new(ApplicationBaseUrl(base_url));
    let secret_key = Key::from(hmac_secret.expose_secret().as_bytes());
    let redis_store = RedisSessionStore::new(redis_uri.expose_secret()).await.unwrap();
    let server = HttpServer::new(move || {
        App::new()
            .wrap(SessionMiddleware::new(redis_store.clone(), secret_key.clone()))
            .wrap(Logger::new("%a %{User-Agent}i"))
            .route("/health_check", web::get().to(health_check))
            .route("/{name}", web::get().to(hello))
            .app_data(db_pool.clone())
            .app_data(base_url.clone())
            .app_data(Data::new(HmacSecret(hmac_secret.clone())))
    })
    .listen(listener)?
    .run();
    Ok(server)
}

#[derive(Clone)]
pub struct HmacSecret(pub Secret<String>);

// pub fn run(listener: TcpListener) -> std::result::Result<Server, std::io::Error> {
//     env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

//     let server = HttpServer::new(|| {
//         App::new()
//             .wrap(Logger::new("%a %{User-Agent}i"))
//             .route("/health_check", web::get().to(health_check))
//             .route("/{name}", web::get().to(hello))
//     })
//     .listen(listener)?
//     .run();
//     Ok(server)
// }
