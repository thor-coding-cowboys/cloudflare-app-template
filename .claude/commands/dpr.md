# /dpr - Draft Pull Request

Create a draft pull request with a clean, single-commit history.

## Steps

1. **Check current branch**
   ```bash
   git branch --show-current
   ```
   If on `main`, stop and ask user to create a feature branch first.

2. **Ensure clean working tree**
   ```bash
   git status --porcelain
   ```
   If uncommitted changes exist, stop and ask user to commit or stash them.

3. **Check for existing PR**
   ```bash
   gh pr list --head $(git branch --show-current) --state all --json number,state
   ```
   If a PR exists, report its status and stop.

4. **Sync with main**
   ```bash
   git fetch origin main
   git rebase origin/main
   ```
   If conflicts occur, stop and ask user to resolve them.

5. **Enforce single commit**
   ```bash
   git rev-list --count origin/main..HEAD
   ```
   If count > 1, squash commits:
   ```bash
   git reset --soft origin/main
   git commit -m "<generated message>"
   ```

6. **Analyze changes**
   - Read `git diff origin/main..HEAD` to understand the full change
   - Read all modified files to understand context
   - Generate a comprehensive commit message capturing the entire change

7. **Update commit message**
   ```bash
   git commit --amend -m "<generated message>"
   ```

8. **Push branch**
   ```bash
   git push --force-with-lease origin $(git branch --show-current)
   ```

9. **Create draft PR**
   ```bash
   gh pr create --draft --title "<commit message title>" --body "<generated description>"
   ```

## Commit Message Guidelines

- First line: Concise summary (50 chars max)
- Body (if needed): Explain what and why, not how
- Reference issues if applicable

## PR Description Guidelines

Include:
- Summary of changes (1-3 bullet points)
- Motivation/context
- Testing performed
- Related issues (if any)

## Error Handling

- Stop on any command failure
- Ask user before destructive operations (force push, squash)
- Report specific errors with context
