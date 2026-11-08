# Contributing

## Add a skill

1. Create `plugins/<pack>/skills/<name>/SKILL.md`:

   ```markdown
   ---
   name: <name>
   description: What it does and when to use it, in one or two sentences. Triggers go here.
   ---

   Body: the procedure the agent should follow.
   ```

2. Run `plugins/forge/bin/skl hide`. It adds the on-demand marker and quotes the YAML.
3. Check it appears: `plugins/forge/bin/skl search <word>`.
4. Add a row to the pack guide in `docs/` with a realistic example prompt.

## Writing good skills

- The description decides whether the skill is found. Lead with the job, then the trigger.
- Keep the body to the procedure. Move long reference material into files next to `SKILL.md`.
- No scripts or installers from third parties without a license entry in the pack's `NOTICE.md`.

## Attribution

If a skill derives from another project, add its URL, commit and license to `plugins/<pack>/NOTICE.md`. Only MIT, Apache-2.0 and similarly permissive sources belong here.
