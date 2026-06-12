use std::{sync::{Arc, Mutex}, thread, time::{Duration, Instant}};

use tauri::{ menu::{Menu, MenuItem}, tray::TrayIconBuilder, tray::TrayIcon};


#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

struct TimerState {
    elapsed_before: u64,
    start_time: Instant,
    is_running: bool,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let state = Arc::new(Mutex::new(TimerState {
                elapsed_before: 0,
                is_running: true,
                start_time: Instant::now()
            }));
            let s_clone = Arc::clone(&state);

            let quit_item = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let stop_item = MenuItem::with_id(app, "stop", "Stop", true, None::<&str>)?;
            let start_item = MenuItem::with_id(app, "start", "Start", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&start_item, &stop_item, &quit_item])?;
            let tray = TrayIconBuilder::new()
                .menu(&menu)
                .on_menu_event(move |app, event| {
                    let mut s = s_clone.lock().unwrap();
                    match event.id.as_ref() {
                        "stop" => {
                            s.elapsed_before += s.start_time.elapsed().as_secs();
                            s.is_running = false;
                        },
                        "start" => {
                            s.is_running = true;
                            s.start_time = Instant::now();
                        },
                        "quit" => {
                            println!("exiting...");
                            app.exit(0);
                        },
                        _ => {
                            println!("menu id {:?} not handled", event.id)
                        }
                    }
                })
                .icon(app.default_window_icon().unwrap().clone())
                .build(app)?;

            thread::spawn(move || {
                loop {
                    let state = state.lock().unwrap();
                    if !state.is_running {
                        drop(state);
                        thread::sleep(Duration::from_secs(1));
                        continue
                    }
                    let time_string = {
                        let elapsed = state.start_time.elapsed().as_secs() + state.elapsed_before;
                        let hours = elapsed / 3600;
                        let minutes = (elapsed % 3600) / 60;
                        let seconds = elapsed % 60;
                        let _time_string =  format!("{:02}:{:02}:{:02}", hours, minutes, seconds);
                        _time_string
                    };
                    let _ = tray.set_title(Some(time_string));
                    thread::sleep(Duration::from_secs(1))
                }
            });
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
