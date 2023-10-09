use std::net::TcpListener;

use clockwork_server::run;

#[tokio::main]
async fn main() -> std::result::Result<(), std::io::Error> {
    let listener = TcpListener::bind("0.0.0.0:8080").expect("Failed to bind port 8080");
    run(listener)?.await
}
