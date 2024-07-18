use std::fmt::{ Debug, Display };
use clockwork_server::startup::Application;
use clockwork_server::configuration::get_configuration;
// use sqlx::postgres::PgPoolOptions;
use tokio::task::JoinError;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
// #[async_std::main] 
// async fn main() -> Result<(), sqlx::Error> {
    let configuration = get_configuration().expect("Failed to read configuration.");
    let application = Application::build(configuration.clone()).await?;
    let application_task = tokio::spawn(application.run_until_stopped());

    tokio::select! {
        o = application_task => report_exit("API", o)
    }
    // Ok(())
    // let pool = PgPoolOptions::new()
    //     .max_connections(5)
    //     .connect("postgres://postgres:password@localhost:5432/postgres").await?;

    // let _: (i64,) = sqlx::query_as("SELECT email from user;")
    //     .bind(150_i64)
    //     .fetch_one(&pool).await?;
    Ok(())
}

fn report_exit(task_name: &str, outcome: Result<Result<(), impl Debug + Display>, JoinError>) {
    match outcome {
        Ok(Ok(())) => {
            tracing::info!("{} has exited", task_name)
        }
        Ok(Err(e)) => {
            tracing::error!(
                error.cause_chain = ?e,
                error.message = %e,
                "{} failed",
                task_name
            )
        }
        Err(e) => {
            tracing::error!(
                error.cause_chain = ?e,
                error.message = %e,
                "{}' task failed to complete",
                task_name
            )
        }
    }
}
