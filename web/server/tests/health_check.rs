// use std::net::TcpListener;

// use clockwork_server::run;

// fn spawn_app() -> String {
//     let listener = TcpListener::bind("127.0.0.1:0").expect("Failed to bind random port.");
//     let port = listener.local_addr().unwrap().port();
//     let server = run(listener).expect("Failed creating a server");

//     let _ = tokio::spawn(server);
//     format!("http://127.0.0.1:{}", port)
// }

// #[tokio::test]
// async fn health_check() {
//     let address = spawn_app();
//     let client = reqwest::Client::new();

//     let response = client
//         .get(format!("{}/health_check", &address))
//         .send()
//         .await
//         .expect("Request failed.");

//     assert!(response.status().is_success());
//     assert_eq!(Some(0), response.content_length());
// }
