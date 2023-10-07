use clockwork_server::run;

async fn spawn_app() -> Result<(), std::io::Error> {
    run().await
}

#[tokio::test]
async fn health_check() {
    spawn_app().await.expect("Failed to spawn the app.");

    let client = reqwest::Client::new();

    let response = client.get("http://127.0.0.1:8080/health_check").send().await.expect("Request failed.");

    assert!(response.status().is_success());
    assert_eq!(Some(0), response.content_length());
}