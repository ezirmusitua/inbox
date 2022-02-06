// Copyright 2019-2021 Tauri Programme within The Commons Conservancy
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::{
  api::process::{Command},
};

fn main() {
  tauri::Builder::default()
    .setup(|app| {
      tauri::async_runtime::spawn(async move {
        Command::new_sidecar("app")
          .expect("failed to setup `app` sidecar")
          .spawn()
          .expect("Failed to spawn packaged node");
      });
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}