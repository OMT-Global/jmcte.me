# Manifest-first bootstrap control plane

A public OMT-Global TypeScript control plane for repo scaffolding, GitHub governance, and portable agent profiles.

- Treats `project.bootstrap.yaml` as the source of truth for setup.
- Supports plan-first governance and home-profile generation workflows.
- Keeps portable project assets separate from auth state, caches, sessions, and machine-local secrets.
