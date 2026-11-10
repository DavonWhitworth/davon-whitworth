---
title: Studio Vault
description: Studio Vault is a collaborative project-management and file-transfer platform for music producers and audio teams.
updated: "2026-11-09"
---

Studio Vault is a collaborative project-management and file-transfer platform for music producers and audio teams. It gives users a central place to organize DAW projects, manage project versions, share work with collaborators, review files, and track project activity. The frontend provides the web and desktop user experience, including project dashboards, boards, file management, audio previews, authentication, and desktop-specific workflows such as local project syncing and file transfers.

The API acts as the application’s central coordination layer. It exposes a GraphQL interface used by the frontend to authenticate users, manage projects and collaborators, record versions and metadata, support comments and boards, and handle sharing and subscription information. Project files are stored in cloud object storage, while the API stores and retrieves the related metadata and generates secure upload and download links. Together, the frontend and API let users work with the same projects across the browser and Electron desktop application while keeping collaboration and file history synchronized.
