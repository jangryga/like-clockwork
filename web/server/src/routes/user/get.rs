use actix_web::{HttpRequest, Responder, HttpResponse, web};
use sqlx::PgPool;

pub async fn user_info(req: HttpRequest, pool: web::Data<PgPool>) -> impl Responder {
    match req.match_info().get("id") {
        Some(id) => {
            let row = sqlx::query!(
                r#"
                SELECT email 
                FROM user
                WHERE id = $1
                "#, id)
            .fetch_one(pool)
            .await
            .context("Failed to perform query");
        }
        Err(e) => HttpResponse::NotFound()
    }

    match name {
        Some(n) => HttpResponse::Ok().body(n),
        None => HttpResponse::NotFound().body("user not found")
    }
}