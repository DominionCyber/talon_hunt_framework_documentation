## Overview
Talon Manager is a cross-platform terminal user interface (TUI) application written in Go. It uses the [Bubble Tea](https://github.com/charmbracelet/bubbletea) framework to deliver an interactive, keyboard-driven front end that runs natively on Windows, macOS, and Linux without the need for a graphical desktop environment or web browser.

Under the hood, Talon Manager communicates directly with the CrowdStrike Falcon API to manage saved searches and lookup files within NGSIEM (Next-Gen SIEM). All authentication is handled through the CrowdStrike OAuth2 flow, and every API interaction occurs over HTTPS against the CrowdStrike cloud you specify. There is no middleware, no external service dependency, and no data leaves your terminal other than what goes directly to CrowdStrike.

The result is a single, self-contained binary that gives security teams a fast and repeatable way to manage their NGSIEM content library from the command line.

## Purpose

Talon Manager was built to address two distinct needs in the CrowdStrike ecosystem:

**Streamlined content management for practitioners.** Installing and maintaining saved searches across a Falcon tenant by hand is tedious and error-prone, especially when dealing with frameworks that contain dozens or hundreds of interrelated queries. Talon Manager gives analysts and detection engineers a single tool to install the Talon Hunt Framework, import any other valid YAML-based saved search (whether hosted on GitHub or stored locally), and manage the full lifecycle of that content: creation, inspection, updates, and deletion. The same applies to lookup files used by those queries.

**A working reference for CI/CD pipeline design.** Organizations building mature hunt and detection programs need repeatable, automated workflows for pushing content into production. Talon Manager demonstrates, in working code, how to authenticate against the CrowdStrike API, enumerate existing content, diff local templates against what is deployed, and apply changes programmatically. Teams can study the patterns in this codebase and adapt them into their own CI/CD pipelines using whatever orchestration tooling they prefer.
