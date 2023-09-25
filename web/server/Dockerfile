FROM rust:1.72.0 AS builder

WORKDIR /app

RUN apt update && apt install lld clang -y

COPY . .

RUN cargo build --release

FROM ubuntu:22.04 AS runtime

WORKDIR /app

RUN apt-get update -y \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/target/release/server server

ENTRYPOINT [ "./server" ]