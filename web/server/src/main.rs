use std::net::TcpListener;

use clockwork_server::run;
use clockwork_server::configuration::get_configuration;


#[tokio::main]
async fn main() -> anyhow::Result<()> {

    let configuration = get_configuration().expect("Failed to read configuration.");

    let addr = if std::env::var("ENV").unwrap() == "production" {
        "127.0.0.1:8080"
    } else {
        "0.0.0.0:8080"
    };

    let listener = TcpListener::bind(addr).expect("Failed to bind port 8080");
    Ok(run(listener)?.await?)
}
