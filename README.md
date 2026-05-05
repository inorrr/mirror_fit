# MirrorFit

MirrorFit is a Chrome extension that overlays a real-time, customizable stick-figure skeleton over any webpage using the user's webcam. The goal is to help people visually align their movement with workout, yoga, and dance videos without needing a physical mirror.

## MVP Summary

- Real-time pose tracking with MediaPipe Pose Landmarker
- Floating skeleton overlay rendered on top of video pages
- Adjustable styling, size, position, and mirror mode
- Lightweight encouragement messages triggered by movement
- Fully client-side experience with no backend required

## Planned Architecture

- `content script`: injects and manages the page overlay
- `webcam module`: handles webcam access and streaming
- `pose engine`: runs pose detection and outputs landmarks
- `renderer`: draws the skeleton and applies visual settings
- `movement detector`: measures motion and triggers events
- `message system`: shows timed encouragement messages
- `ui controller`: powers controls like drag, resize, and toggles

## Tech Direction

- Chrome Extension with Manifest V3
- JavaScript or TypeScript
- MediaPipe Pose Landmarker
- Canvas or WebGL rendering
- Optional React-based control panel

## MVP Milestones

1. Core prototype: webcam capture, pose detection, skeleton rendering
2. Overlay system: floating canvas, drag/resize, basic controls
3. Messaging feature: movement detection, message triggering, animation
4. Polish and launch: performance tuning, UI refinement, YouTube testing, packaging

## Repository Status

This repository is currently in planning/setup stage. The original product brief lives in [`prd.txt`](./prd.txt).

## Suggested Next Steps

1. Scaffold the Chrome extension structure
2. Choose `TypeScript` or `JavaScript` for the first implementation
3. Set up Manifest V3, content scripts, and permissions
4. Add the first webcam and pose-tracking prototype
