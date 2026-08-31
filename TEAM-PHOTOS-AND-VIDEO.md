# Add your team photos and tech video

## Team photos
Create this folder:

public/assets/team/

Add these exact filenames:

- hafiz-abdullah-ather.jpg
- alman-ahmad.jpg
- umair-gondal.jpg

The team cards in `src/main.jsx` already point to those paths. If you want different filenames,
change the `photo` value in the `team` array.

## Tech video
Create:

public/videos/tech-showreel.mp4

The website automatically uses it as a muted, looping video in the Technology in Motion section.
If the file is absent, the animated purple technology fallback still appears.

Recommended video: 8–15 seconds, 16:9, MP4/H.264, compressed for web, no audio required.

## Contact information
At the top of `src/main.jsx`, update only these fields:

- `phone`
- `email`
- `linkedin`
- `website`

The current values are placeholders because the previous portfolio code did not contain the actual
phone number/email in the project source.

## Feedback
The feedback cards are intentionally marked as sample placeholders in the source. Replace them with
real, verified client testimonials before publishing them as genuine client feedback.
